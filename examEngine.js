/**
 * Live Exam Engine
 * Handles timers, section navigation, palette state, and response recording
 * Supports both MCQ (Sections 1-6) and Subjective/Essay (Section 7) question types
 */

export class ExamEngine {
  constructor({ test, config, onTick, onSectionChange, onAutoSubmit }) {
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

    this.activeSectionIndex = 0;
    this.activeQuestionIndex = 0;
    this.responses = {};
    this.timerInterval = null;
    this.totalTimeSpentSeconds = 0;
    this.sectionTimeSpent = {};

    // Setup timers
    if (this.config.timerMode === "section") {
      this.currentSectionSecondsRemaining = (this.getActiveSection().durationMinutes || 15) * 60;
      this.config.allowSectionSwitching = false; // strict mode disables free switching
    } else {
      this.totalSecondsRemaining = (Number(this.config.customDurationMinutes) || this.test.defaultDurationMinutes || 120) * 60;
    }

    // Init per-section time tracking
    this.test.sections.forEach(sec => {
      this.sectionTimeSpent[sec.id] = 0;
    });

    // Initialize all responses
    this.test.sections.forEach(sec => {
      sec.questions.forEach(q => {
        this.responses[q.id] = {
          selectedOption: null,
          visited: false,
          markedForReview: false,
          timeSpentSeconds: 0
        };
        // For subjective questions, store text instead of option
        if (q.type === "subjective") {
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
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
    this.tick();
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  tick() {
    this.totalTimeSpentSeconds++;

    // Track time per section
    const activeSec = this.getActiveSection();
    if (activeSec) {
      this.sectionTimeSpent[activeSec.id] = (this.sectionTimeSpent[activeSec.id] || 0) + 1;
    }

    // Track time per question
    const currentQ = this.getCurrentQuestion();
    if (currentQ && this.responses[currentQ.id]) {
      this.responses[currentQ.id].timeSpentSeconds = (this.responses[currentQ.id].timeSpentSeconds || 0) + 1;
    }

    if (this.config.timerMode === "section") {
      this.currentSectionSecondsRemaining--;
      this.onTick({
        mode: "section",
        remainingSeconds: Math.max(0, this.currentSectionSecondsRemaining),
        totalTimeSpent: this.totalTimeSpentSeconds,
        sectionName: this.getActiveSection().name,
        sectionIndex: this.activeSectionIndex
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
        totalTimeSpent: this.totalTimeSpentSeconds
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

  saveAndNext() {
    const sec = this.getActiveSection();
    if (this.activeQuestionIndex < sec.questions.length - 1) {
      this.navigateToQuestion(this.activeQuestionIndex + 1);
    } else if (this.config.timerMode === "section") {
      // In strict section mode, stay on last question — timer will advance
    } else if (this.activeSectionIndex < this.test.sections.length - 1 && this.config.allowSectionSwitching) {
      this.switchSection(this.activeSectionIndex + 1);
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
