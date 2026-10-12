/**
 * Analytics & Evaluation Engine
 * Handles score computation, section metrics, sectional cutoff verification,
 * and diagnostic topic analysis
 */

export function evaluateAssessment({ test, userResponses, timeSpentSeconds, config }) {
  let totalQuestions = 0;
  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let visitedCount = 0;
  let unvisitedCount = 0;
  let markedForReviewCount = 0;

  const defaultCorrectMarks = (config && config.marksPerCorrect !== undefined) ? Number(config.marksPerCorrect) : (test.markingScheme?.correct ?? 1);
  const penaltyMarks = (config && config.negativeMarks !== undefined) ? Number(config.negativeMarks) : (test.markingScheme?.incorrect ?? 0);

  let totalMaxMarks = 0;
  let userScore = 0;

  const sectionMetrics = [];
  const topicStatsMap = {};
  const cutoffResults = [];

  test.sections.forEach((section) => {
    const secMarksPerQ = section.marksPerQuestion || defaultCorrectMarks;
    const isSubjective = section.type === "subjective" || (section.questions.length === 1 && section.questions[0].type === "subjective");
    let secTotalQuestions = section.questions.length;
    let secAttempted = 0;
    let secCorrect = 0;
    let secIncorrect = 0;
    let secMarks = 0;
    let secMaxMarks = isSubjective ? (section.totalMarks || 10) : (secTotalQuestions * secMarksPerQ);

    section.questions.forEach((q) => {
      totalQuestions++;
      const qMarks = q.type === "subjective" ? 0 : secMarksPerQ; // Subjective not auto-scored
      totalMaxMarks += q.type === "subjective" ? 0 : qMarks;

      const resp = userResponses[q.id] || { selectedOption: null, visited: false, markedForReview: false, essayText: "" };

      if (resp.visited) {
        visitedCount++;
      } else {
        unvisitedCount++;
      }

      if (resp.markedForReview) {
        markedForReviewCount++;
      }

      // Topic tracking (skip subjective from accuracy computation)
      if (q.type !== "subjective") {
        const topicName = (q.topic || "General").trim();
        if (!topicStatsMap[topicName]) {
          topicStatsMap[topicName] = {
            topic: topicName,
            sectionName: section.name,
            total: 0,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            unattempted: 0,
            scoreObtained: 0,
            maxScore: 0
          };
        }
        topicStatsMap[topicName].total++;
        topicStatsMap[topicName].maxScore += qMarks;

        const hasAnswered = resp.selectedOption !== null && resp.selectedOption !== undefined && resp.selectedOption !== "";

        if (hasAnswered) {
          attemptedCount++;
          secAttempted++;
          topicStatsMap[topicName].attempted++;

          const isCorrect = String(resp.selectedOption).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();

          if (isCorrect) {
            correctCount++;
            secCorrect++;
            topicStatsMap[topicName].correct++;
            userScore += qMarks;
            secMarks += qMarks;
            topicStatsMap[topicName].scoreObtained += qMarks;
          } else {
            incorrectCount++;
            secIncorrect++;
            topicStatsMap[topicName].incorrect++;
            const deduction = Math.abs(penaltyMarks);
            userScore -= deduction;
            secMarks -= deduction;
            topicStatsMap[topicName].scoreObtained -= deduction;
          }
        } else {
          unattemptedCount++;
          topicStatsMap[topicName].unattempted++;
        }
      } else {
        // Subjective question — check if attempted (text written)
        const hasText = (resp.essayText && resp.essayText.trim().length > 0) ||
                        (resp.selectedOption && typeof resp.selectedOption === "string" && resp.selectedOption.trim().length > 0);
        if (hasText) {
          attemptedCount++;
          secAttempted++;
        } else {
          unattemptedCount++;
        }
      }
    });

    const secAccuracy = secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 100) : 0;
    const secCompletionRate = secTotalQuestions > 0 ? Math.round((secAttempted / secTotalQuestions) * 100) : 0;
    const secScorePercent = secMaxMarks > 0 ? Math.round((Math.max(0, secMarks) / secMaxMarks) * 100) : 0;

    const secMetric = {
      sectionId: section.id,
      sectionName: section.name,
      totalQuestions: secTotalQuestions,
      attempted: secAttempted,
      correct: secCorrect,
      incorrect: secIncorrect,
      unattempted: secTotalQuestions - secAttempted,
      marksObtained: Math.round(secMarks * 100) / 100,
      maxMarks: secMaxMarks,
      accuracy: secAccuracy,
      completionRate: secCompletionRate,
      scorePercent: secScorePercent,
      isSubjective: isSubjective
    };

    sectionMetrics.push(secMetric);

    // Sectional cutoff evaluation
    const cutoffPercent = (config && config.cutoffPercents && config.cutoffPercents[section.id] !== undefined)
      ? Number(config.cutoffPercents[section.id])
      : (section.cutoffPercent || test.defaultCutoffPercent || 50);

    const cutoffPassed = isSubjective ? true : (secScorePercent >= cutoffPercent);

    cutoffResults.push({
      sectionId: section.id,
      sectionName: section.name,
      scorePercent: secScorePercent,
      cutoffPercent: cutoffPercent,
      passed: cutoffPassed,
      isSubjective: isSubjective,
      marksObtained: Math.round(secMarks * 100) / 100,
      maxMarks: secMaxMarks
    });
  });

  // Overall metrics
  const accuracyPercent = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const scorePercent = totalMaxMarks > 0 ? Math.round((Math.max(0, userScore) / totalMaxMarks) * 100) : 0;
  const passingScore = test.passingScorePercent || 50;
  const passedOverallScore = scorePercent >= passingScore;

  // Check all sectional cutoffs
  const allCutoffsPassed = cutoffResults.every(c => c.passed);
  const failedCutoffs = cutoffResults.filter(c => !c.passed);

  // Overall pass requires both score threshold AND all sectional cutoffs
  const useSectionalCutoffs = config?.sectionalCutoffs ?? test.sectionalCutoffs ?? false;
  const isPassed = useSectionalCutoffs ? (passedOverallScore && allCutoffsPassed) : passedOverallScore;

  // Topic diagnostic analysis
  const topicList = Object.values(topicStatsMap).map((t) => {
    const accuracy = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0;
    const masteryPercent = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;

    let status = "Proficient";
    let statusClass = "badge-success";
    if (masteryPercent < 50 || t.correct === 0) {
      status = "Critical Weakness";
      statusClass = "badge-danger";
    } else if (masteryPercent < 75) {
      status = "Needs Improvement";
      statusClass = "badge-warning";
    }

    return {
      ...t,
      accuracy,
      masteryPercent,
      status,
      statusClass
    };
  });

  topicList.sort((a, b) => {
    if (a.masteryPercent !== b.masteryPercent) {
      return a.masteryPercent - b.masteryPercent;
    }
    return a.accuracy - b.accuracy;
  });

  const weakTopics = topicList.filter(t => t.masteryPercent < 75);
  const strongTopics = topicList.filter(t => t.masteryPercent >= 75);

  return {
    testId: test.id,
    testTitle: test.title,
    submittedAt: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    totalQuestions,
    attemptedCount,
    unattemptedCount,
    correctCount,
    incorrectCount,
    visitedCount,
    unvisitedCount,
    markedForReviewCount,
    totalMaxMarks,
    userScore: Math.round(userScore * 100) / 100,
    scorePercent,
    accuracyPercent,
    passingScore,
    isPassed,
    passedOverallScore,
    allCutoffsPassed,
    failedCutoffs,
    cutoffResults,
    useSectionalCutoffs,
    timeSpentSeconds,
    sectionMetrics,
    topicList,
    weakTopics,
    strongTopics,
    userResponses
  };
}

/**
 * Generates an SVG bar comparison chart for sections
 */
export function renderSectionBarChart(sectionMetrics) {
  if (!sectionMetrics || sectionMetrics.length === 0) return "";

  const chartHeight = 260;
  const barGroupWidth = 90;
  const startX = 60;
  const paddingBottom = 60;
  const paddingTop = 30;
  const plotHeight = chartHeight - paddingBottom - paddingTop;
  const totalWidth = Math.max(500, startX + sectionMetrics.length * 110 + 40);

  const maxVal = Math.max(...sectionMetrics.map(s => s.totalQuestions), 5);
  const barWidth = 22;

  const yTicks = [0, Math.ceil(maxVal * 0.25), Math.ceil(maxVal * 0.5), Math.ceil(maxVal * 0.75), maxVal];

  let gridLinesSvg = "";
  yTicks.forEach(tick => {
    const y = paddingTop + plotHeight - (tick / maxVal) * plotHeight;
    gridLinesSvg += `
      <line x1="${startX - 10}" y1="${y}" x2="${totalWidth - 20}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="3 3" />
      <text x="${startX - 16}" y="${y + 4}" font-size="11" fill="#64748B" text-anchor="end">${tick}</text>
    `;
  });

  let barsSvg = "";
  sectionMetrics.forEach((sec, idx) => {
    const groupX = startX + idx * 110 + 15;

    // Total Questions bar
    const hTotal = (sec.totalQuestions / maxVal) * plotHeight;
    const yTotal = paddingTop + plotHeight - hTotal;

    // Attempted bar
    const hAttempted = (sec.attempted / maxVal) * plotHeight;
    const yAttempted = paddingTop + plotHeight - hAttempted;

    // Correct bar
    const hCorrect = (sec.correct / maxVal) * plotHeight;
    const yCorrect = paddingTop + plotHeight - hCorrect;

    // Abbreviated section name — take first word(s)
    const shortName = sec.sectionName.length > 12 ? sec.sectionName.substring(0, 10) + "…" : sec.sectionName;
    const labelLines = sec.sectionName.split(/\s+/);
    const line1 = labelLines.slice(0, 2).join(" ");
    const line2 = labelLines.length > 2 ? labelLines.slice(2).join(" ").substring(0, 10) : "";

    barsSvg += `
      <g class="chart-group">
        <rect x="${groupX}" y="${yTotal}" width="${barWidth}" height="${Math.max(1, hTotal)}" rx="3" fill="#CBD5E1" opacity="0.8">
          <title>${sec.sectionName} - Total: ${sec.totalQuestions}</title>
        </rect>
        <text x="${groupX + barWidth/2}" y="${yTotal - 4}" font-size="10" fill="#475569" text-anchor="middle" font-weight="600">${sec.totalQuestions}</text>

        <rect x="${groupX + barWidth + 3}" y="${yAttempted}" width="${barWidth}" height="${Math.max(1, hAttempted)}" rx="3" fill="#2563EB">
          <title>${sec.sectionName} - Attempted: ${sec.attempted}</title>
        </rect>
        <text x="${groupX + barWidth + 3 + barWidth/2}" y="${yAttempted - 4}" font-size="10" fill="#2563EB" text-anchor="middle" font-weight="600">${sec.attempted}</text>

        <rect x="${groupX + (barWidth + 3)*2}" y="${yCorrect}" width="${barWidth}" height="${Math.max(1, hCorrect)}" rx="3" fill="#16A34A">
          <title>${sec.sectionName} - Correct: ${sec.correct}</title>
        </rect>
        <text x="${groupX + (barWidth + 3)*2 + barWidth/2}" y="${yCorrect - 4}" font-size="10" fill="#16A34A" text-anchor="middle" font-weight="600">${sec.correct}</text>

        <text x="${groupX + barWidth * 1.5 + 3}" y="${chartHeight - 30}" font-size="10" fill="#334155" text-anchor="middle" font-weight="500">${line1}</text>
        ${line2 ? `<text x="${groupX + barWidth * 1.5 + 3}" y="${chartHeight - 17}" font-size="9" fill="#64748B" text-anchor="middle">${line2}</text>` : ""}
      </g>
    `;
  });

  return `
    <svg viewBox="0 0 ${totalWidth} ${chartHeight}" class="analytics-chart-svg" style="width: 100%; height: auto; min-width: 450px;">
      ${gridLinesSvg}
      ${barsSvg}
      <line x1="${startX - 10}" y1="${paddingTop + plotHeight}" x2="${totalWidth - 20}" y2="${paddingTop + plotHeight}" stroke="#94A3B8" stroke-width="1.5" />
    </svg>
  `;
}
