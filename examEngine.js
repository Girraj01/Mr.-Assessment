/**
 * Live Exam Engine
 * Handles timers, section navigation, palette state, and response recording
 * Supports both MCQ (Sections 1-6) and Subjective/Essay (Section 7) question types
 */

export class ExamEngine {
  static _activeTimerInterval = null;

  static stopAllTimers() {
    if (ExamEngine._activeTimerInterval) {
      clearInterval(ExamEngine._activeTimerInterval);
      ExamEngine._activeTimerInterval = null;
    }
  }

  constructor({ test, config, onTick, onSectionChange, onAutoSubmit }) {
    // Clean up any lingering background timers across all instances
    ExamEngine.stopAllTimers();

    this.test = JSON.parse(JSON.stringify(test)); // deep clone
    this.config = config || {
      timerMode: "overall",
      customDurationMinutes: test.defaultDurationMinutes || 120,
      allowSectionSwitching: true,
      marksPerCorrect: test.markingScheme?.correct ?? 1,
      negativeMarks: test.markingScheme?.incorrect ?? 0,
      sectionalCutoffs: test.sectionalCutoffs || false,
      cutoffPercents: {}
    };
    this.onTick = onTick || (() => {});
    this.onSectionChange = onSectionChange || (() => {});
    this.onAutoSubmit = onAutoSubmit || (() => {});

    // Starting section index
    const startIdx = Number(this.config.startingSectionIndex) || 0;
    this.activeSectionIndex = (startIdx >= 0 && startIdx < this.test.sections.length) ? startIdx : 0;
    this.activeQuestionIndex = 0;
    this.responses = {};
    this.timerInterval = null;
    this.totalTimeSpentSeconds = 0;
    this.sectionTimeSpent = {};

    // Per-question countdown timer configuration
    this.enableQuestionTimer = Boolean(this.config.enableQuestionTimer);
    this.questionTimerSeconds = Number(this.config.questionTimerSeconds) || 60;

    // Setup timers & apply customDurationMinutes accurately
    const customMinutes = Number(this.config.customDurationMinutes);
    const hasCustomDuration = customMinutes > 0 && !isNaN(customMinutes);

    if (this.config.timerMode === "section") {
      // If single section, the section's allocated duration MUST match the configured custom duration
      if (this.test.sections.length === 1 && hasCustomDuration) {
        this.test.sections[0].durationMinutes = customMinutes;
        this.currentSectionSecondsRemaining = customMinutes * 60;
      } else if (hasCustomDuration) {
        // Multi-section test: calculate current sum of section durations
        const currentTotal = this.test.sections.reduce((sum, s) => sum + (Number(s.durationMinutes) || 15), 0) || 60;
        if (Math.abs(customMinutes - currentTotal) > 0.1) {
          // Proportionally scale each section's duration to sum up to customMinutes
          const scale = customMinutes / currentTotal;
          let allocated = 0;
          this.test.sections.forEach((sec, idx) => {
            if (idx === this.test.sections.length - 1) {
              sec.durationMinutes = Math.max(1, customMinutes - allocated);
            } else {
              const scaled = Math.max(1, Math.round((Number(sec.durationMinutes) || 15) * scale));
              sec.durationMinutes = scaled;
              allocated += scaled;
            }
          });
        }
        this.currentSectionSecondsRemaining = (Number(this.getActiveSection()?.durationMinutes) || 15) * 60;
      } else {
        this.currentSectionSecondsRemaining = (Number(this.getActiveSection()?.durationMinutes) || 15) * 60;
      }

      if (typeof this.config.allowSectionSwitching !== "boolean") {
        this.config.allowSectionSwitching = false; // default for strict mode if not specified
      }
    } else {
      // Overall exam countdown timer
      const totalMins = hasCustomDuration ? customMinutes : (Number(this.test.defaultDurationMinutes) || 60);
      this.totalSecondsRemaining = totalMins * 60;
    }

    // Init per-section time tracking
    this.test.sections.forEach(sec => {
      this.sectionTimeSpent[sec.id] = 0;
    });

    // Initialize all responses & normalize question texts
    this.test.sections.forEach(sec => {
      sec.questions.forEach(q => {
        // Auto-normalize subjective questions and prompt -> text
        const isSub = q.type === "subjective" || sec.type === "subjective";
        if (isSub) {
          q.type = "subjective";
        }
        if (!q.text && q.prompt) q.text = q.prompt;
        if (!q.text && q.question) q.text = q.question;

        this.responses[q.id] = {
          selectedOption: null,
          visited: false,
          markedForReview: false,
          timeSpentSeconds: 0,
          timerRemaining: this.questionTimerSeconds,
          timerExpired: false,
          solutionRevealed: false
        };
        // For subjective questions, store text instead of option
        if (isSub) {
          this.responses[q.id].essayText = "";
        }
      });
    });

    // Mark first question as visited
    const firstQ = this.getCurrentQuestion();
    if (firstQ) {
      this.responses[firstQ.id].visited = true;
    }
  }

  start() {
    this.isPaused = false;
    ExamEngine.stopAllTimers();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
    ExamEngine._activeTimerInterval = this.timerInterval;
    this.tick();
  }

  stop() {
    this.isPaused = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    ExamEngine.stopAllTimers();
  }

  pause() {
    this.isPaused = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    ExamEngine.stopAllTimers();
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    ExamEngine.stopAllTimers();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
    ExamEngine._activeTimerInterval = this.timerInterval;
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
      return false;
    } else {
      this.pause();
      return true;
    }
  }

  revealSolution(questionId) {
    const qId = questionId || (this.getCurrentQuestion()?.id);
    if (qId && this.responses[qId]) {
      this.responses[qId].solutionRevealed = true;
    }
  }

  tick() {
    this.totalTimeSpentSeconds++;

    // Track time per section
    const activeSec = this.getActiveSection();
    if (activeSec) {
      this.sectionTimeSpent[activeSec.id] = (this.sectionTimeSpent[activeSec.id] || 0) + 1;
    }

    // Track time per question & decrement per-question countdown
    const currentQ = this.getCurrentQuestion();
    let qTimerInfo = null;
    if (currentQ && this.responses[currentQ.id]) {
      const resp = this.responses[currentQ.id];
      resp.timeSpentSeconds = (resp.timeSpentSeconds || 0) + 1;

      if (this.enableQuestionTimer && !resp.timerExpired) {
        resp.timerRemaining = Math.max(0, (resp.timerRemaining ?? this.questionTimerSeconds) - 1);
        if (resp.timerRemaining <= 0) {
          resp.timerExpired = true;
        }
      }

      if (this.enableQuestionTimer) {
        qTimerInfo = {
          remainingSeconds: resp.timerRemaining ?? 0,
          expired: Boolean(resp.timerExpired),
          solutionRevealed: Boolean(resp.solutionRevealed),
          questionId: currentQ.id
        };
      }
    }

    if (this.config.timerMode === "section") {
      this.currentSectionSecondsRemaining--;
      this.onTick({
        mode: "section",
        remainingSeconds: Math.max(0, this.currentSectionSecondsRemaining),
        totalTimeSpent: this.totalTimeSpentSeconds,
        sectionName: this.getActiveSection().name,
        sectionIndex: this.activeSectionIndex,
        questionTimer: qTimerInfo
      });

      if (this.currentSectionSecondsRemaining <= 0) {
        if (this.activeSectionIndex < this.test.sections.length - 1) {
          this.switchSection(this.activeSectionIndex + 1, true);
        } else {
          this.stop();
          this.onAutoSubmit("Time is up! Your assessment has been automatically submitted.");
        }
      }
    } else {
      this.totalSecondsRemaining--;
      this.onTick({
        mode: "overall",
        remainingSeconds: Math.max(0, this.totalSecondsRemaining),
        totalTimeSpent: this.totalTimeSpentSeconds,
        questionTimer: qTimerInfo
      });

      if (this.totalSecondsRemaining <= 0) {
        this.stop();
        this.onAutoSubmit("Overall assessment time has expired! Your responses have been submitted.");
      }
    }
  }

  getActiveSection() {
    return this.test.sections[this.activeSectionIndex];
  }

  getCurrentQuestion() {
    const sec = this.getActiveSection();
    return sec ? sec.questions[this.activeQuestionIndex] : null;
  }

  getCurrentResponse() {
    const q = this.getCurrentQuestion();
    return q ? this.responses[q.id] : null;
  }

  selectOption(optionId) {
    const q = this.getCurrentQuestion();
    if (!q) return;
    this.responses[q.id].selectedOption = optionId;
    this.responses[q.id].visited = true;
  }

  // Save essay text for subjective questions
  saveEssayText(text) {
    const q = this.getCurrentQuestion();
    if (!q || q.type !== "subjective") return;
    this.responses[q.id].essayText = text;
    this.responses[q.id].selectedOption = text; // also store in selectedOption for consistency
    this.responses[q.id].visited = true;
  }

  clearResponse() {
    const q = this.getCurrentQuestion();
    if (!q) return;
    if (q.type === "subjective") {
      this.responses[q.id].essayText = "";
      this.responses[q.id].selectedOption = "";
    } else {
      this.responses[q.id].selectedOption = null;
    }
  }

  toggleMarkForReview() {
    const q = this.getCurrentQuestion();
    if (!q) return;
    this.responses[q.id].markedForReview = !this.responses[q.id].markedForReview;
    this.responses[q.id].visited = true;
  }

  advanceToNextSection(force = true) {
    if (this.activeSectionIndex < this.test.sections.length - 1) {
      return this.switchSection(this.activeSectionIndex + 1, force);
    }
    return false;
  }

  saveAndNext() {
    const sec = this.getActiveSection();
    if (this.activeQuestionIndex < sec.questions.length - 1) {
      this.navigateToQuestion(this.activeQuestionIndex + 1);
      return { status: "nextQuestion" };
    } else if (this.activeSectionIndex < this.test.sections.length - 1) {
      // Completed the section early! Advance to next section
      this.advanceToNextSection(true);
      return { status: "nextSection" };
    } else {
      return { status: "examEnd" };
    }
  }

  markForReviewAndNext() {
    const q = this.getCurrentQuestion();
    if (q) {
      this.responses[q.id].markedForReview = true;
      this.responses[q.id].visited = true;
    }
    this.saveAndNext();
  }

  previousQuestion() {
    if (this.activeQuestionIndex > 0) {
      this.navigateToQuestion(this.activeQuestionIndex - 1);
    } else if (this.activeSectionIndex > 0 && this.config.allowSectionSwitching) {
      this.switchSection(this.activeSectionIndex - 1);
      const prevSec = this.getActiveSection();
      this.navigateToQuestion(prevSec.questions.length - 1);
    }
  }

  navigateToQuestion(qIndex) {
    const sec = this.getActiveSection();
    if (qIndex >= 0 && qIndex < sec.questions.length) {
      this.activeQuestionIndex = qIndex;
      const q = this.getCurrentQuestion();
      if (q) {
        this.responses[q.id].visited = true;
      }
    }
  }

  switchSection(sectionIndex, forceByTimer = false) {
    if (!forceByTimer && !this.config.allowSectionSwitching) {
      return false;
    }

    if (sectionIndex >= 0 && sectionIndex < this.test.sections.length) {
      this.activeSectionIndex = sectionIndex;
      this.activeQuestionIndex = 0;

      if (this.config.timerMode === "section") {
        this.currentSectionSecondsRemaining = (this.getActiveSection().durationMinutes || 15) * 60;
      }

      const q = this.getCurrentQuestion();
      if (q) {
        this.responses[q.id].visited = true;
      }

      this.onSectionChange(this.activeSectionIndex);
      return true;
    }
    return false;
  }

  /**
   * Question Status for Palette:
   * - "answered": Chosen option, not marked for review (Green)
   * - "answered-marked": Chosen option, marked for review (Purple with green check)
   * - "marked": No option, marked for review (Purple)
   * - "not-answered": Visited, but no option chosen (Red)
   * - "not-visited": Never visited (Gray)
   */
  getQuestionStatus(questionId) {
    const resp = this.responses[questionId];
    if (!resp || !resp.visited) return "not-visited";

    let hasOption = false;
    // Find the question to check its type
    for (const sec of this.test.sections) {
      for (const q of sec.questions) {
        if (q.id === questionId) {
          if (q.type === "subjective") {
            hasOption = resp.essayText && resp.essayText.trim().length > 0;
          } else {
            hasOption = resp.selectedOption !== null && resp.selectedOption !== undefined && resp.selectedOption !== "";
          }
          break;
        }
      }
    }

    if (hasOption && resp.markedForReview) return "answered-marked";
    if (resp.markedForReview) return "marked";
    if (hasOption) return "answered";
    return "not-answered";
  }

  getPaletteSummary() {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let markedAnswered = 0;
    let notVisited = 0;

    Object.keys(this.responses).forEach(qId => {
      const status = this.getQuestionStatus(qId);
      if (status === "answered") answered++;
      else if (status === "not-answered") notAnswered++;
      else if (status === "marked") marked++;
      else if (status === "answered-marked") markedAnswered++;
      else notVisited++;
    });

    return {
      answered,
      notAnswered,
      marked,
      markedAnswered,
      notVisited,
      total: Object.keys(this.responses).length
    };
  }

  getSectionPaletteSummary(sectionIndex) {
    const sec = this.test.sections[sectionIndex];
    if (!sec) return { answered: 0, notAnswered: 0, marked: 0, markedAnswered: 0, notVisited: 0, total: 0 };

    let answered = 0, notAnswered = 0, marked = 0, markedAnswered = 0, notVisited = 0;

    sec.questions.forEach(q => {
      const status = this.getQuestionStatus(q.id);
      if (status === "answered") answered++;
      else if (status === "not-answered") notAnswered++;
      else if (status === "marked") marked++;
      else if (status === "answered-marked") markedAnswered++;
      else notVisited++;
    });

    return { answered, notAnswered, marked, markedAnswered, notVisited, total: sec.questions.length };
  }

  getUserResponses() {
    return this.responses;
  }

  getTotalTimeSpent() {
    return this.totalTimeSpentSeconds;
  }

  getSectionTimeSpent() {
    return this.sectionTimeSpent;
  }
}
