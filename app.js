/**
 * app.js — Main Orchestration Module
 * Wires up Dashboard, Pre-Exam Config, Live Exam, and Evaluation views
 */

import {
  ASSESSMENT_SCHEMA_EXAMPLE,
  PROMPT_TEMPLATE,
  SAMPLE_ITM_TEST,
  BUILTIN_TESTS,
  TOPIC_CATALOG,
  generateCustomTopicPrompt,
  AI_SAMPLE_TOPIC_TEST,
  renderQuestionVisual
} from './schema.js';
import { ExamEngine } from './examEngine.js';
import { evaluateAssessment, renderSectionBarChart } from './analytics.js';

/* ==========================================================================
   State
   ========================================================================== */

const LS_TESTS_KEY = 'examprep_tests';
const LS_RESULTS_KEY = 'examprep_results';

const state = {
  tests: [],
  results: [],
  currentTestId: null,
  engine: null,
  currentResultId: null,
  examConfig: null,        // config chosen on pre-exam screen
  activeFilter: 'all',
};

/* ==========================================================================
   LocalStorage & Multi-Device Sync Helpers
   ========================================================================== */

function loadState() {
  try {
    const rawTests = localStorage.getItem(LS_TESTS_KEY);
    state.tests = rawTests ? JSON.parse(rawTests) : [];
  } catch { state.tests = []; }

  try {
    const rawResults = localStorage.getItem(LS_RESULTS_KEY);
    state.results = rawResults ? JSON.parse(rawResults) : [];
  } catch { state.results = []; }

  // Sync BUILTIN_TESTS:
  // If a built-in test does not exist in state.tests, add it.
  // If it already exists, update its questions so repo updates are immediately available on any device!
  const testsToSync = (BUILTIN_TESTS && BUILTIN_TESTS.length > 0) ? BUILTIN_TESTS : [SAMPLE_ITM_TEST];
  testsToSync.forEach(builtin => {
    if (!builtin || !builtin.id) return;
    const existingIndex = state.tests.findIndex(t => t.id === builtin.id);
    if (existingIndex === -1) {
      state.tests.push(JSON.parse(JSON.stringify(builtin)));
    } else {
      // Update with latest version from repository
      state.tests[existingIndex] = JSON.parse(JSON.stringify(builtin));
    }
  });

  // Normalize questions across all loaded tests (ensures prompt/question -> text for subjective/writing)
  state.tests.forEach(test => {
    (test.sections || []).forEach(sec => {
      (sec.questions || []).forEach(q => {
        if (!q.text && q.prompt) q.text = q.prompt;
        if (!q.text && q.question) q.text = q.question;
        if (!q.text && q.statement) q.text = q.statement;
        if (!q.type && (sec.type === 'subjective' || q.prompt || q.wordLimit)) q.type = 'subjective';
      });
    });
  });

  saveState();
}

function saveState() {
  localStorage.setItem(LS_TESTS_KEY, JSON.stringify(state.tests));
  localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(state.results));
}

/* ==========================================================================
   DOM References
   ========================================================================== */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ==========================================================================
   Question Text Parser & Helpers
   ========================================================================== */

/**
 * Returns the best question text, resolving text, prompt, question, statement, or title.
 */
function getQuestionText(q) {
  if (!q) return '';
  return q.text || q.prompt || q.question || q.statement || q.title || '';
}

/**
 * Converts a question text string into safe HTML.
 * - Converts markdown pipe tables (|  A  |  B  |) to styled <table> elements.
 * - Converts newlines to <br> for non-table lines.
 */
function parseQuestionText(text) {
  if (!text) return '';

  const lines = text.split('\n');
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Detect a markdown pipe table row: starts and/or ends with |
    if (/^\s*\|/.test(line)) {
      // Collect all consecutive pipe-table rows
      const tableLines = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      // Filter out separator rows like |---|---|
      const dataRows = tableLines.filter(l => !/^\s*\|[\s|:-]+\|\s*$/.test(l));
      if (dataRows.length > 0) {
        let tableHtml = '<div class="matrix-table-wrapper"><table class="matrix-table">';
        dataRows.forEach((row, rowIdx) => {
          const cells = row.split('|').map(c => c.trim()).filter((c, ci, arr) => ci > 0 && ci < arr.length);
          const tag = rowIdx === 0 ? 'th' : 'td';
          tableHtml += '<tr>' + cells.map(c => `<${tag}>${escapeHtml(c)}</${tag}>`).join('') + '</tr>';
        });
        tableHtml += '</table></div>';
        output.push(tableHtml);
      }
    } else {
      // Regular text line — escape and convert to paragraph/br
      const escaped = escapeHtml(line);
      output.push(escaped ? `<span>${escaped}</span><br>` : '<br>');
      i++;
    }
  }

  // Clean up trailing <br>
  let result = output.join('');
  result = result.replace(/(<br>)+$/, '');
  return result;
}

/* ==========================================================================
   View Switching
   ========================================================================== */

/* ==========================================================================
   View Navigation System (SPA Single-Page Architecture with History Support)
   ========================================================================== */

const navigationHistory = ['view-dashboard'];
let isHandlingPopState = false;

function updateHeaderBackButton(viewId) {
  const backBtn = $('#btn-header-back');
  if (!backBtn) return;
  if (viewId === 'view-dashboard') {
    backBtn.style.display = 'none';
  } else {
    backBtn.style.display = 'inline-flex';
  }
}

function switchView(viewId) {
  $$('.view-section').forEach(v => v.classList.remove('active'));
  const target = $(`#${viewId}`);
  if (target) target.classList.add('active');

  // Exam view is outside .main-container
  const examView = $('#view-exam');
  if (viewId === 'view-exam') {
    examView.classList.add('active');
    $('#app-header').style.display = 'none';
    $('.main-container').style.display = 'none';
  } else {
    examView.classList.remove('active');
    $('#app-header').style.display = '';
    $('.main-container').style.display = '';
  }

  updateHeaderBackButton(viewId);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function navigateTo(viewId, pushHistory = true, metadata = {}) {
  switchView(viewId);

  if (pushHistory && !isHandlingPopState) {
    if (navigationHistory[navigationHistory.length - 1] !== viewId) {
      navigationHistory.push(viewId);
    }
    const stateObj = { viewId, ...metadata };
    try {
      window.history.pushState(stateObj, '', '');
    } catch (e) {}
  }
}

function goBack() {
  if (state.engine) {
    const confirmExit = confirm('Are you sure you want to exit the current assessment? Your progress will not be submitted.');
    if (!confirmExit) return;
    if (state.engine.overallInterval) clearInterval(state.engine.overallInterval);
    if (state.engine.questionTimerInterval) clearInterval(state.engine.questionTimerInterval);
    state.engine = null;
  }

  if (window.history.length > 1 && navigationHistory.length > 1) {
    navigationHistory.pop();
    window.history.back();
  } else {
    showDashboard(true);
  }
}

function showDashboard(pushHistory = true) {
  state.currentTestId = null;
  navigateTo('view-dashboard', pushHistory);
  renderDashboard();
}

function showAIGenerateView(pushHistory = true) {
  navigateTo('view-ai-generate', pushHistory);
  updateAIPromptPreview();
  populateAppendTargetDropdown();
}

/* ==========================================================================
   Multi-Device Data Backup Export & Import
   ========================================================================== */

function exportBackup() {
  const backupData = {
    appName: "PrepTech ITM Assessment",
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    tests: state.tests,
    results: state.results
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `preptech_tests_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      const incomingTests = Array.isArray(data) ? data : (data.tests || []);
      const incomingResults = data.results || [];

      if (!Array.isArray(incomingTests) || incomingTests.length === 0) {
        alert('Invalid backup: No assessments found in this file.');
        return;
      }

      // Merge tests
      incomingTests.forEach(incoming => {
        const idx = state.tests.findIndex(t => t.id === incoming.id);
        if (idx >= 0) {
          state.tests[idx] = incoming;
        } else {
          state.tests.push(incoming);
        }
      });

      // Merge results
      incomingResults.forEach(r => {
        if (!state.results.some(existing => existing.submittedAt === r.submittedAt && existing.testId === r.testId)) {
          state.results.push(r);
        }
      });

      saveState();
      renderDashboard();
      alert(`✓ Backup imported successfully! ${incomingTests.length} tests and ${incomingResults.length} attempt records synced.`);
    } catch (err) {
      alert(`Error reading backup JSON file: ${err.message}`);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ==========================================================================
   Modal Helpers
   ========================================================================== */

function openModal(id) {
  const m = $(`#${id}`);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = $(`#${id}`);
  if (m) m.classList.remove('active');
}

/* ==========================================================================
   Utility Helpers
   ========================================================================== */

function formatSeconds(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatHumanTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}h ${rm}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

function getTotalQuestions(test) {
  return (test.sections || []).reduce((sum, s) => sum + (s.questions ? s.questions.length : 0), 0);
}

function getTotalMarks(test) {
  if (test.totalMarks) return test.totalMarks;
  let marks = 0;
  (test.sections || []).forEach(s => {
    const mPerQ = s.marksPerQuestion || test.markingScheme?.correct || 1;
    marks += (s.questions ? s.questions.length : 0) * mPerQ;
  });
  return marks;
}

function getTotalDuration(test) {
  return test.defaultDurationMinutes || (test.sections || []).reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || 60;
}

function getResultsForTest(testId) {
  return state.results.filter(r => r.testId === testId);
}

function getLatestResult(testId) {
  const all = getResultsForTest(testId);
  return all.length > 0 ? all[all.length - 1] : null;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/* ==========================================================================
   Dashboard
   ========================================================================== */

function renderDashboard() {
  renderHeroStats();
  renderTestCards();
}

function renderHeroStats() {
  const totalTests = state.tests.length;
  const attemptedIds = new Set(state.results.map(r => r.testId));
  const attemptedCount = state.tests.filter(t => attemptedIds.has(t.id)).length;

  let avgScore = 0;
  if (state.results.length > 0) {
    avgScore = Math.round(state.results.reduce((s, r) => s + (r.scorePercent || 0), 0) / state.results.length);
  }

  $('#stat-total-tests').textContent = totalTests;
  $('#stat-attempted-tests').textContent = attemptedCount;
  $('#stat-avg-score').textContent = `${avgScore}%`;
}

function isFullLengthTest(test) {
  if (!test) return false;
  if (test.id === 'itm-placement-mock-1') return true;
  if (test.sections && test.sections.length >= 3) return true;
  if (getTotalQuestions(test) >= 40) return true;
  if (/full.?length|placement mock/i.test(test.title || '')) return true;
  return false;
}

function renderSingleCard(test, attemptedIds) {
  const isAttempted = attemptedIds.has(test.id);
  const latestResult = getLatestResult(test.id);
  const totalQ = getTotalQuestions(test);
  const totalM = getTotalMarks(test);
  const duration = getTotalDuration(test);
  const sectionCount = (test.sections || []).length;

  let resultBlock = '';
  if (isAttempted && latestResult) {
    const scoreClass = latestResult.isPassed ? 'passed' : 'failed';
    const cutoffStatus = latestResult.cutoffResults
      ? (latestResult.cutoffResults.allPassed ? 'Passed All Cutoffs ✓' : 'Failed Sectional Cutoff ✗')
      : '';
    resultBlock = `
      <div class="card-last-result">
        <div>
          <div class="last-result-score ${scoreClass}">${latestResult.scorePercent}%</div>
          <div style="font-size:11px; color: var(--text-muted);">${latestResult.isPassed ? 'PASSED' : 'FAILED'}</div>
        </div>
        <div class="last-result-meta">
          <div>${latestResult.formattedDate || ''}</div>
          ${cutoffStatus ? `<div style="margin-top:2px; font-weight:600; color: ${latestResult.cutoffResults?.allPassed ? 'var(--status-answered)' : 'var(--status-unanswered)'};">${cutoffStatus}</div>` : ''}
        </div>
      </div>`;
  }

  const isAiTest = test.companyOrType === 'AI Generated Test' || (test.id && test.id.startsWith('ai-test'));
  const isMathPuzzle = test.id === 'test-math-puzzle-geometric-logic';

  let badgeExtra = '';
  if (isAiTest) {
    badgeExtra = '<span class="card-badge" style="background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE; font-weight:700;">⚡ AI TOPIC TEST</span>';
  } else if (isMathPuzzle) {
    badgeExtra = '<span class="card-badge" style="background:#FEF3C7; color:#B45309; border:1px solid #FDE68A; font-weight:700;">🧩 VISUAL PUZZLES</span>';
  }

  return `
    <div class="assessment-card" data-test-id="${test.id}">
      <div class="card-header-row">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="card-badge ${isAttempted ? 'badge-attempted' : 'badge-unattempted'}">
            ${isAttempted ? 'ATTEMPTED' : 'UNATTEMPTED'}
          </span>
          ${badgeExtra}
        </div>
        <button class="btn btn-outline btn-sm btn-delete-test" data-test-id="${test.id}" title="Delete test" style="padding:4px 8px; font-size:11px; color:var(--status-unanswered);">✕</button>
      </div>
      <div class="card-title">${escapeHtml(test.title)}</div>
      <div class="card-org">${escapeHtml(test.companyOrType || '')}</div>
      <div class="card-meta-list">
        <span class="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5"/><path d="M15 11h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5"/><rect x="9" y="3" width="6" height="18" rx="1"/></svg>
          ${totalQ} Questions
        </span>
        <span class="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${duration} mins
        </span>
        <span class="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          ${sectionCount} Section${sectionCount > 1 ? 's' : ''}
        </span>
        <span class="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          ${totalM} Marks
        </span>
      </div>
      ${resultBlock}
      <div class="card-actions">
        <button class="btn ${isAttempted ? 'btn-outline' : 'btn-primary'} btn-sm btn-start-test" data-test-id="${test.id}">
          ${isAttempted ? 'Re-Attempt' : 'Start Assessment'}
        </button>
        ${isAttempted ? `<button class="btn btn-secondary btn-sm btn-view-results" data-test-id="${test.id}">View Results</button>` : ''}
      </div>
    </div>`;
}

function renderTestCards() {
  const containerFull = $('#cards-full-length');
  const containerTopic = $('#cards-topic-tests');
  if (!containerFull || !containerTopic) return;

  const attemptedIds = new Set(state.results.map(r => r.testId));
  let testsToShow = [...state.tests];

  if (state.activeFilter === 'attempted') {
    testsToShow = testsToShow.filter(t => attemptedIds.has(t.id));
  } else if (state.activeFilter === 'unattempted') {
    testsToShow = testsToShow.filter(t => !attemptedIds.has(t.id));
  }

  const fullLengthTests = testsToShow.filter(isFullLengthTest);
  const topicTests = testsToShow.filter(t => !isFullLengthTest(t));

  const badgeFull = $('#count-full-length');
  if (badgeFull) badgeFull.textContent = `${fullLengthTests.length} Test${fullLengthTests.length === 1 ? '' : 's'}`;

  const badgeTopic = $('#count-topic-tests');
  if (badgeTopic) badgeTopic.textContent = `${topicTests.length} Test${topicTests.length === 1 ? '' : 's'}`;

  if (fullLengthTests.length === 0) {
    containerFull.innerHTML = `<div class="column-empty-state">No full-length mock tests found matching this filter.</div>`;
  } else {
    containerFull.innerHTML = fullLengthTests.map(t => renderSingleCard(t, attemptedIds)).join('');
  }

  if (topicTests.length === 0) {
    containerTopic.innerHTML = `<div class="column-empty-state">No topic practice or AI tests found matching this filter.</div>`;
  } else {
    containerTopic.innerHTML = topicTests.map(t => renderSingleCard(t, attemptedIds)).join('');
  }

  // Wire card buttons across both columns
  const wireCardsIn = (root) => {
    root.querySelectorAll('.btn-start-test').forEach(btn => {
      btn.addEventListener('click', () => showPreExam(btn.dataset.testId));
    });
    root.querySelectorAll('.btn-view-results').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = getLatestResult(btn.dataset.testId);
        if (r) showEvaluation(r);
      });
    });
    root.querySelectorAll('.btn-delete-test').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this test and all its results? This cannot be undone.')) {
          const tid = btn.dataset.testId;
          state.tests = state.tests.filter(t => t.id !== tid);
          state.results = state.results.filter(r => r.testId !== tid);
          saveState();
          renderDashboard();
        }
      });
    });
  };

  wireCardsIn(containerFull);
  wireCardsIn(containerTopic);
}

/* ==========================================================================
   Pre-Exam Configuration
   ========================================================================== */

function showPreExam(testId, pushHistory = true) {
  const test = state.tests.find(t => t.id === testId);
  if (!test) return;
  state.currentTestId = testId;

  navigateTo('view-pre-exam', pushHistory, { testId });

  $('#pre-exam-title').textContent = test.title;
  $('#pre-exam-desc').textContent = test.description || 'Configure your assessment settings before starting.';
  $('#input-custom-duration').value = getTotalDuration(test);
  $('#input-marks-correct').value = test.markingScheme?.correct ?? 1;
  $('#input-marks-penalty').value = Math.abs(test.markingScheme?.incorrect ?? 0);

  // Timer mode: default to section-strict if test has sectionalCutoffs
  const timerOverall = $('input[name="timerMode"][value="overall"]');
  const timerSection = $('input[name="timerMode"][value="section"]');
  if (test.sectionalCutoffs) {
    timerSection.checked = true;
    timerOverall.checked = false;
  } else {
    timerOverall.checked = true;
    timerSection.checked = false;
  }
  updateRadioCardVisuals();

  // Populate starting section dropdown
  const startingSecSelect = $('#select-starting-section');
  if (startingSecSelect) {
    startingSecSelect.innerHTML = (test.sections || []).map((sec, idx) => `
      <option value="${idx}">Section ${idx + 1}: ${escapeHtml(sec.name)} (${(sec.questions || []).length} Qs)</option>
    `).join('');
    startingSecSelect.value = "0";
  }

  // Section switching — default to ON so candidate has freedom to switch
  const switchCheck = $('#input-allow-section-switching');
  if (switchCheck) {
    switchCheck.checked = true;
  }

  // Speed / Question Timer: default ON for single-topic & AI tests, OFF for full-length mocks
  const isTopic = !isFullLengthTest(test);
  const qTimerCheck = $('#input-enable-question-timer');
  const qTimerWrapper = $('#wrapper-question-timer-sec');
  const qTimerSelect = $('#select-question-timer-sec');
  const qTimerCustom = $('#input-custom-question-sec');

  if (qTimerCheck && qTimerWrapper) {
    qTimerCheck.checked = isTopic;
    qTimerWrapper.style.display = isTopic ? '' : 'none';
  }
  if (qTimerSelect) {
    qTimerSelect.value = '60';
  }
  if (qTimerCustom) {
    qTimerCustom.style.display = 'none';
    qTimerCustom.value = '45';
  }

  // Render sectional cutoff config
  renderCutoffConfig(test);
}

function renderCutoffConfig(test) {
  // Find or create the cutoff config container
  let cutoffContainer = $('#cutoff-config-container');
  if (!cutoffContainer) {
    // Insert before the footer area (before the flex div at the bottom)
    const preExamBox = $('.pre-exam-box');
    const footerDiv = preExamBox.querySelector('div[style*="justify-content: space-between"][style*="margin-top: 32px"]');
    cutoffContainer = document.createElement('div');
    cutoffContainer.id = 'cutoff-config-container';
    cutoffContainer.className = 'config-form-group';
    if (footerDiv) {
      preExamBox.insertBefore(cutoffContainer, footerDiv);
    } else {
      preExamBox.appendChild(cutoffContainer);
    }
  }

  const hasCutoffs = test.sectionalCutoffs;
  const defaultPct = test.defaultCutoffPercent || 50;

  cutoffContainer.innerHTML = `
    <label class="config-label">5. Sectional Cutoff Requirements</label>
    <div class="config-desc">Enable mandatory minimum score per section. Failing any section's cutoff means the overall assessment is marked as failed.</div>
    <div class="toggle-switch-row" style="margin-bottom: 14px;">
      <div>
        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Enable Sectional Cutoffs</div>
        <div style="font-size: 12px; color: var(--text-muted);">Each section must meet a minimum score percentage.</div>
      </div>
      <input type="checkbox" id="input-enable-cutoffs" ${hasCutoffs ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
    </div>
    <div id="cutoff-sections-list" style="${hasCutoffs ? '' : 'display:none;'}">
      ${(test.sections || []).map((sec, i) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 4px; margin-bottom: 6px;">
          <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">${escapeHtml(sec.name)}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <input type="number" class="input-text cutoff-input" data-section-index="${i}" min="0" max="100" value="${sec.cutoffPercent || defaultPct}" style="max-width: 70px; padding: 4px 8px; font-size: 13px;">
            <span style="font-size: 12px; color: var(--text-muted);">%</span>
          </div>
        </div>
      `).join('')}
    </div>`;

  // Toggle visibility
  const enableCheck = $('#input-enable-cutoffs');
  const listDiv = $('#cutoff-sections-list');
  enableCheck.addEventListener('change', () => {
    listDiv.style.display = enableCheck.checked ? '' : 'none';
  });
}

function updateRadioCardVisuals() {
  $$('.radio-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    card.classList.toggle('selected', radio && radio.checked);
  });
}

/* ==========================================================================
   Start Exam
   ========================================================================== */

function startExam() {
  const test = state.tests.find(t => t.id === state.currentTestId);
  if (!test) return;

  const timerMode = $('input[name="timerMode"]:checked')?.value || 'overall';
  const customDuration = parseInt($('#input-custom-duration').value) || getTotalDuration(test);
  const startingSectionIndex = parseInt($('#select-starting-section')?.value) || 0;
  const allowSectionSwitching = $('#input-allow-section-switching')?.checked ?? true;
  const marksPerCorrect = parseFloat($('#input-marks-correct').value) || 1;
  const negativeMarks = parseFloat($('#input-marks-penalty').value) || 0;

  // Collect cutoff config
  const enableCutoffs = $('#input-enable-cutoffs')?.checked || false;
  const sectionCutoffs = {};
  if (enableCutoffs) {
    $$('.cutoff-input').forEach(inp => {
      const idx = parseInt(inp.dataset.sectionIndex);
      sectionCutoffs[idx] = parseInt(inp.value) || 50;
    });
  }

  // Collect question speed timer config
  const enableQuestionTimer = $('#input-enable-question-timer')?.checked || false;
  let questionTimerSeconds = 60;
  const selectTimerVal = $('#select-question-timer-sec')?.value;
  if (selectTimerVal === 'custom') {
    questionTimerSeconds = parseInt($('#input-custom-question-sec')?.value) || 60;
  } else {
    questionTimerSeconds = parseInt(selectTimerVal) || 60;
  }

  const config = {
    timerMode,
    customDurationMinutes: customDuration,
    startingSectionIndex,
    allowSectionSwitching,
    marksPerCorrect,
    negativeMarks,
    enableCutoffs,
    sectionCutoffs,
    enableQuestionTimer,
    questionTimerSeconds,
  };

  state.examConfig = config;

  state.engine = new ExamEngine({
    test,
    config,
    onTick: handleTimerTick,
    onSectionChange: handleSectionChange,
    onAutoSubmit: handleAutoSubmit,
  });

  navigateTo('view-exam', true, { testId: test.id });

  // Set header title
  $('#exam-header-title').textContent = test.title;

  renderSectionTabs();
  renderExamUI();
  state.engine.start();
}

/* ==========================================================================
   Exam UI Rendering
   ========================================================================== */

function renderSectionTabs() {
  const engine = state.engine;
  if (!engine) return;

  const tabsContainer = $('#exam-sections-tabs');
  tabsContainer.innerHTML = engine.test.sections.map((sec, i) => {
    const isActive = i === engine.activeSectionIndex;
    const isStrictLocked = !engine.config.allowSectionSwitching && i !== engine.activeSectionIndex;
    const shortName = sec.name.length > 16 ? sec.name.substring(0, 14) + '…' : sec.name;
    return `<button class="section-pill-tab ${isActive ? 'active' : ''} ${isStrictLocked ? 'disabled' : ''}" data-sec-index="${i}">${escapeHtml(shortName)} (${sec.questions.length})</button>`;
  }).join('');

  tabsContainer.querySelectorAll('.section-pill-tab').forEach(pill => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.dataset.secIndex);
      if (idx === engine.activeSectionIndex) return;
      if (engine.config.allowSectionSwitching) {
        if (engine.switchSection(idx)) {
          renderSectionTabs();
          renderExamUI();
        }
      } else {
        // Strict section mode: if clicking next section, offer to advance early
        if (idx === engine.activeSectionIndex + 1) {
          const nextSec = engine.test.sections[idx];
          if (confirm(`Advance to next section "${nextSec.name}"? You will begin with ${nextSec.durationMinutes || 15} minutes for the new section.`)) {
            engine.switchSection(idx, true);
            renderSectionTabs();
            renderExamUI();
          }
        } else {
          alert('Section navigation is set to sequential order. Click the "Next Section" button to proceed when you complete this section.');
        }
      }
    });
  });
}

function renderExamUI() {
  renderQuestion();
  renderPalette();

  const engine = state.engine;
  if (!engine) return;
  const sec = engine.getActiveSection();
  if (!sec) return;

  const isLastQ = engine.activeQuestionIndex === sec.questions.length - 1;
  const hasNextSec = engine.activeSectionIndex < engine.test.sections.length - 1;

  // Dynamic Save & Next button label
  const btnSaveNext = $('#btn-save-next');
  if (btnSaveNext) {
    if (isLastQ && hasNextSec) {
      btnSaveNext.innerHTML = 'Save & Next Section ⇥';
    } else if (isLastQ && !hasNextSec) {
      btnSaveNext.innerHTML = 'Save & Submit Exam 🏁';
    } else {
      btnSaveNext.innerHTML = 'Save & Next →';
    }
  }

  // Next Section early-advance button
  const btnNextSection = $('#btn-next-section');
  if (btnNextSection) {
    if (hasNextSec) {
      const nextSec = engine.test.sections[engine.activeSectionIndex + 1];
      const shortNext = nextSec.name.length > 14 ? nextSec.name.substring(0, 12) + '…' : nextSec.name;
      btnNextSection.style.display = 'inline-flex';
      btnNextSection.innerHTML = `Next Section (${escapeHtml(shortNext)}) ⇥`;
    } else {
      btnNextSection.style.display = 'none';
    }
  }
}

function renderQuestion() {
  const engine = state.engine;
  if (!engine) return;

  const section = engine.getActiveSection();
  const question = engine.getCurrentQuestion();
  const response = engine.getCurrentResponse();
  if (!question || !section) return;

  const qIdx = engine.activeQuestionIndex;
  const totalInSection = section.questions.length;

  // Header
  $('#exam-q-number-title').textContent = `Question ${qIdx + 1} of ${totalInSection}`;

  const mPerQ = section.marksPerQuestion || state.examConfig?.marksPerCorrect || 1;
  const penalty = state.examConfig?.negativeMarks || 0;
  $('#exam-q-marks-pill').textContent = `+${mPerQ} / -${penalty} Marks`;

  // Question text — parse markdown tables and preserve newlines
  $('#exam-q-text').innerHTML = parseQuestionText(getQuestionText(question));

  // Code snippet
  const codeBlock = $('#exam-q-code');
  if (question.codeSnippet) {
    codeBlock.style.display = '';
    codeBlock.textContent = question.codeSnippet;
  } else {
    codeBlock.style.display = 'none';
    codeBlock.textContent = '';
  }

  // Visual / SVG Diagram for Math Puzzles and Geometry
  const visualBlock = $('#exam-q-visual');
  if (visualBlock) {
    const visualHtml = renderQuestionVisual(question);
    if (visualHtml) {
      visualBlock.innerHTML = visualHtml;
      visualBlock.style.display = 'block';
    } else {
      visualBlock.innerHTML = '';
      visualBlock.style.display = 'none';
    }
  }

  // Question Timer Badge
  const qTimerBadge = $('#exam-q-timer-badge');
  const qTimerVal = $('#exam-q-timer-val');
  if (engine.enableQuestionTimer && qTimerBadge && qTimerVal) {
    qTimerBadge.style.display = 'inline-flex';
    const rem = response?.timerRemaining ?? engine.questionTimerSeconds;
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    qTimerVal.textContent = mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}s`;
    qTimerBadge.classList.toggle('timer-expired', !!response?.timerExpired);
    qTimerBadge.classList.toggle('timer-warning', rem > 0 && rem <= 15);
  } else if (qTimerBadge) {
    qTimerBadge.style.display = 'none';
  }

  // Solution Peek Area & Card State
  const peekArea = $('#exam-solution-peek-area');
  const solutionCard = $('#exam-solution-card');
  const earlyPeekArea = $('#exam-early-peek-area');

  if (peekArea) {
    if (engine.enableQuestionTimer && (response?.timerExpired || response?.solutionRevealed)) {
      // Timer expired — show main peek area, hide early peek
      peekArea.style.display = 'block';
      if (earlyPeekArea) earlyPeekArea.style.display = 'none';
      if (response?.solutionRevealed && solutionCard) {
        solutionCard.style.display = 'block';
        solutionCard.innerHTML = `
          <div class="solution-answer-badge">✓ Correct Answer: ${question.correctAnswer ? ('Option ' + question.correctAnswer) : 'Solution'}</div>
          <div style="margin-top: 6px; line-height: 1.6;">${question.explanation || 'No detailed explanation provided.'}</div>
        `;
      } else if (solutionCard) {
        solutionCard.style.display = 'none';
      }
    } else if (engine.enableQuestionTimer && !response?.timerExpired) {
      // Timer still running — hide expired-peek area, show early peek button
      peekArea.style.display = 'none';
      if (solutionCard) solutionCard.style.display = 'none';
      if (earlyPeekArea) earlyPeekArea.style.display = 'flex';
    } else {
      peekArea.style.display = 'none';
      if (solutionCard) solutionCard.style.display = 'none';
      if (earlyPeekArea) earlyPeekArea.style.display = 'none';
    }
  }

  // Palette subtitle
  $('#palette-sec-subtitle').textContent = `Section: ${section.name}`;

  const optionsContainer = $('#exam-options-container');

  // Check if subjective
  if (question.type === 'subjective') {
    renderSubjectiveUI(question, response, optionsContainer);
  } else {
    renderMCQOptions(question, response, optionsContainer);
  }
}

function renderMCQOptions(question, response, container) {
  const options = question.options || [];
  const selectedOpt = response?.selectedOption || null;
  const letters = ['A', 'B', 'C', 'D'];

  container.innerHTML = options.map((opt, i) => {
    const isSelected = selectedOpt === opt.id;
    return `
      <div class="option-item ${isSelected ? 'selected' : ''}" data-option-id="${opt.id}">
        <div class="option-letter">${letters[i] || opt.id}</div>
        <div class="option-text">${opt.text}</div>
      </div>`;
  }).join('');

  container.querySelectorAll('.option-item').forEach(item => {
    item.addEventListener('click', () => {
      const optId = item.dataset.optionId;
      state.engine.selectOption(optId);
      renderExamUI();
    });
  });
}

function renderSubjectiveUI(question, response, container) {
  const existingText = response?.selectedOption || '';
  const wc = wordCount(existingText);
  const cc = existingText.length;
  const limit = question.wordLimit || 250;

  const rubricsList = question.rubrics && Array.isArray(question.rubrics) ? question.rubrics : [];
  const rubricsHtml = rubricsList.length > 0
    ? `<div style="margin-bottom: 14px; padding: 12px 16px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 6px;">
        <div style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Evaluation Rubrics / Guidelines:</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
          ${rubricsList.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  container.innerHTML = `
    <div class="subjective-writing-area">
      ${rubricsHtml}
      <div style="margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--text-secondary);">
        Write your response below (Recommended: up to ${limit} words):
      </div>
      <textarea id="subjective-textarea" class="subjective-textarea" placeholder="Start writing your essay / email response here..." rows="12">${escapeHtml(existingText)}</textarea>
      <div class="subjective-counters">
        <span id="subjective-word-count">Words: ${wc} / ${limit}</span>
        <span id="subjective-char-count">Characters: ${cc}</span>
      </div>
    </div>`;

  const textarea = $('#subjective-textarea');
  textarea.addEventListener('input', () => {
    const text = textarea.value;
    state.engine.selectOption(text);
    const w = wordCount(text);
    const c = text.length;
    $('#subjective-word-count').textContent = `Words: ${w} / ${limit}`;
    $('#subjective-char-count').textContent = `Characters: ${c}`;

    // Update palette without re-rendering the textarea (to keep focus)
    renderPalette();
  });

  // Focus the textarea
  setTimeout(() => textarea.focus(), 50);
}

function renderPalette() {
  const engine = state.engine;
  if (!engine) return;

  const section = engine.getActiveSection();
  if (!section) return;

  // Update legend counts — counts are across ALL sections
  const summary = engine.getPaletteSummary();
  const totalAnsweredCount = summary.answered + summary.markedAnswered;
  $('#palette-count-answered').textContent = totalAnsweredCount;
  $('#palette-count-unanswered').textContent = summary.notAnswered;
  $('#palette-count-marked').textContent = summary.marked + summary.markedAnswered;
  $('#palette-count-unvisited').textContent = summary.notVisited;

  // Update mobile palette toggle button indicator
  const mobileToggleText = $('#mobile-palette-toggle-text');
  if (mobileToggleText) {
    mobileToggleText.textContent = `Palette (${totalAnsweredCount}/${engine.totalQuestions})`;
  }

  // Render palette grid for current section only
  const grid = $('#palette-grid-buttons');
  grid.innerHTML = section.questions.map((q, i) => {
    const status = engine.getQuestionStatus(q.id);
    const isActive = i === engine.activeQuestionIndex;

    let btnClass = 'btn-not-visited';
    switch (status) {
      case 'answered': btnClass = 'btn-answered'; break;
      case 'not-answered': btnClass = 'btn-unanswered'; break;
      case 'marked': btnClass = 'btn-marked'; break;
      case 'answered-marked': btnClass = 'btn-marked-answered'; break;
      default: btnClass = 'btn-not-visited';
    }

    return `<button class="q-palette-btn ${btnClass} ${isActive ? 'active-q' : ''}" data-q-index="${i}">${i + 1}</button>`;
  }).join('');

  grid.querySelectorAll('.q-palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.qIndex);
      engine.navigateToQuestion(idx);
      renderExamUI();

      // On mobile, auto-close drawer upon selecting question
      if (window.innerWidth <= 768) {
        $('#exam-palette-sidebar')?.classList.remove('mobile-open');
        $('#palette-backdrop')?.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   Timer & Section Change Callbacks
   ========================================================================== */

function handleTimerTick(info) {
  const display = $('#exam-timer-display');
  const label = $('#exam-timer-label');
  const wrapper = $('#exam-timer-container');

  display.textContent = formatSeconds(info.remainingSeconds);

  if (info.mode === 'section') {
    label.textContent = info.sectionName || 'Section Timer';
  } else {
    label.textContent = 'Time Remaining';
  }

  // Warning state when < 5 minutes
  if (info.remainingSeconds < 300) {
    wrapper.classList.add('timer-warning');
  } else {
    wrapper.classList.remove('timer-warning');
  }

  // Handle per-question speed timer countdown & solution peek reveal
  const qTimerBadge = $('#exam-q-timer-badge');
  const qTimerVal = $('#exam-q-timer-val');
  const peekArea = $('#exam-solution-peek-area');
  const earlyPeekArea = $('#exam-early-peek-area');

  if (info.questionTimer && qTimerBadge && qTimerVal) {
    qTimerBadge.style.display = 'inline-flex';
    const rem = info.questionTimer.remainingSeconds;
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    qTimerVal.textContent = mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}s`;

    if (info.questionTimer.expired || rem <= 0) {
      // Timer expired — switch to main peek area, hide early peek
      qTimerBadge.classList.remove('timer-warning');
      qTimerBadge.classList.add('timer-expired');
      if (peekArea) peekArea.style.display = 'block';
      if (earlyPeekArea) earlyPeekArea.style.display = 'none';
    } else if (info.questionTimer.solutionRevealed) {
      // Solution peeked early — also show main peek (already rendered via renderExamUI)
      if (earlyPeekArea) earlyPeekArea.style.display = 'none';
    } else if (rem <= 15) {
      qTimerBadge.classList.add('timer-warning');
      qTimerBadge.classList.remove('timer-expired');
    } else {
      qTimerBadge.classList.remove('timer-warning', 'timer-expired');
    }
  } else if (qTimerBadge) {
    qTimerBadge.style.display = 'none';
  }
}


function handleSectionChange(newIndex) {
  renderSectionTabs();
  renderExamUI();
}

function handleAutoSubmit(message) {
  alert(message);
  submitExam();
}

/* ==========================================================================
   Submit Exam
   ========================================================================== */

function submitExam() {
  const engine = state.engine;
  if (!engine) return;

  engine.stop();

  const test = engine.test;
  const responses = engine.getUserResponses();
  const timeSpent = engine.getTotalTimeSpent();
  const config = state.examConfig;

  // Evaluate
  const result = evaluateAssessment({
    test,
    userResponses: responses,
    timeSpentSeconds: timeSpent,
    config: {
      marksPerCorrect: config.marksPerCorrect,
      negativeMarks: config.negativeMarks,
    }
  });

  // Add sectional cutoff evaluation
  const cutoffResults = { sections: [], allPassed: true };
  if (config.enableCutoffs) {
    result.sectionMetrics.forEach((secMetric, i) => {
      const section = test.sections[i];
      const cutoffPct = config.sectionCutoffs[i] || section?.cutoffPercent || 50;
      const secMaxMarks = secMetric.maxMarks || 1;
      const secScorePct = secMaxMarks > 0 ? Math.round((secMetric.marksObtained / secMaxMarks) * 100) : 0;
      const passed = secScorePct >= cutoffPct;

      if (!passed) cutoffResults.allPassed = false;

      cutoffResults.sections.push({
        sectionName: secMetric.sectionName,
        scorePct: secScorePct,
        cutoffPct,
        passed,
        marksObtained: secMetric.marksObtained,
        maxMarks: secMaxMarks,
      });
    });

    // Overall pass requires both score threshold AND all cutoffs
    if (!cutoffResults.allPassed) {
      result.isPassed = false;
    }
  }
  result.cutoffResults = cutoffResults;
  result.enableCutoffs = config.enableCutoffs;

  // Generate unique result id
  result.resultId = `result-${test.id}-${Date.now()}`;

  // Store config info for review
  result.examConfig = { ...config };

  state.results.push(result);
  saveState();

  closeModal('modal-submit-confirm');
  showEvaluation(result);
}

/* ==========================================================================
   Evaluation View
   ========================================================================== */

function showEvaluation(result, pushHistory = true) {
  state.engine = null;
  navigateTo('view-evaluation', pushHistory, { result });

  const test = state.tests.find(t => t.id === result.testId);

  // Hero
  $('#eval-test-title').textContent = result.testTitle || 'Assessment Results';
  $('#eval-date-time').textContent = `Submitted on ${result.formattedDate || 'N/A'}`;

  const scoreDisplay = $('#eval-score-display');
  scoreDisplay.textContent = `${result.scorePercent}%`;
  scoreDisplay.className = `huge-score-num ${result.isPassed ? 'passed' : 'failed'}`;

  const statusDisplay = $('#eval-status-display');
  statusDisplay.textContent = result.isPassed ? 'PASSED' : 'FAILED';

  // Metrics strip
  $('#eval-marks-val').textContent = `${result.userScore} / ${result.totalMaxMarks}`;
  $('#eval-marks-sub').textContent = `Passing Benchmark: ${result.passingScore}%`;
  $('#eval-accuracy-val').textContent = `${result.accuracyPercent}%`;
  $('#eval-accuracy-sub').textContent = `${result.correctCount} correct of ${result.attemptedCount} attempted`;
  $('#eval-attempted-val').textContent = `${result.attemptedCount} / ${result.totalQuestions}`;
  $('#eval-unattempted-sub').textContent = `${result.unattemptedCount} skipped`;
  $('#eval-time-val').textContent = formatHumanTime(result.timeSpentSeconds || 0);

  // Sectional Cutoff Results
  renderCutoffResults(result);

  // Weak Topics
  renderWeakTopics(result);

  // Section Chart
  const chartWrapper = $('#eval-chart-wrapper');
  chartWrapper.innerHTML = renderSectionBarChart(result.sectionMetrics);

  // Section Table
  renderSectionTable(result);

  // Question Review
  renderQuestionReview(result, test);

  // Store for re-attempt
  state.currentTestId = result.testId;
}

function renderCutoffResults(result) {
  // Insert cutoff section after the metrics grid
  let cutoffContainer = $('#eval-cutoff-container');
  if (!cutoffContainer) {
    cutoffContainer = document.createElement('div');
    cutoffContainer.id = 'eval-cutoff-container';
    cutoffContainer.className = 'analytics-section-box';
    const metricsGrid = $('.eval-metrics-grid');
    if (metricsGrid && metricsGrid.nextSibling) {
      metricsGrid.parentNode.insertBefore(cutoffContainer, metricsGrid.nextSibling);
    }
  }

  if (!result.enableCutoffs || !result.cutoffResults) {
    cutoffContainer.style.display = 'none';
    return;
  }

  cutoffContainer.style.display = '';
  const cr = result.cutoffResults;

  cutoffContainer.innerHTML = `
    <div class="section-box-header">
      <div>
        <h3>Mandatory Sectional Cutoff Verification</h3>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Each section must meet its minimum required score to pass the overall assessment.</div>
      </div>
      <div style="font-size: 14px; font-weight: 700; color: ${cr.allPassed ? 'var(--status-answered)' : 'var(--status-unanswered)'};">
        ${cr.allPassed ? '✓ Passed All Cutoffs' : '✗ Failed Sectional Cutoffs'}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
      ${cr.sections.map(sec => `
        <div style="border: 1px solid ${sec.passed ? '#BBF7D0' : '#FECACA'}; background: ${sec.passed ? '#F0FDF4' : '#FEF2F2'}; border-radius: 6px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${escapeHtml(sec.sectionName)}</div>
            <div style="font-size: 12px; color: var(--text-muted);">Score: ${sec.marksObtained} / ${sec.maxMarks} (${sec.scorePct}%)</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; font-weight: 600; color: var(--text-muted);">Cutoff: ${sec.cutoffPct}%</span>
            <span style="font-size: 18px; color: ${sec.passed ? 'var(--status-answered)' : 'var(--status-unanswered)'};">
              ${sec.passed ? '✓' : '✗'}
            </span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderWeakTopics(result) {
  const container = $('#eval-weak-topics-container');
  if (!container) return;

  const topics = result.topicList || [];

  if (topics.length === 0) {
    container.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">No topic data available.</div>';
    return;
  }

  const weakCount = (result.weakTopics || []).length;
  let bannerHtml = '';
  if (weakCount > 0) {
    bannerHtml = `
      <div class="weak-topics-banner">
        <span style="font-size: 22px;">⚠️</span>
        <div class="weak-banner-text">
          <strong>${weakCount} weak topic${weakCount > 1 ? 's' : ''} identified</strong> — These subjects require focused revision and practice to improve your placement readiness.
        </div>
      </div>`;
  }

  container.innerHTML = `
    ${bannerHtml}
    <table class="data-table">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Section</th>
          <th>Total</th>
          <th>Attempted</th>
          <th>Correct</th>
          <th>Accuracy</th>
          <th>Mastery</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${topics.map(t => `
          <tr>
            <td><strong>${escapeHtml(t.topic)}</strong></td>
            <td style="font-size:12px; color:var(--text-muted);">${escapeHtml(t.sectionName)}</td>
            <td>${t.total}</td>
            <td>${t.attempted}</td>
            <td>${t.correct}</td>
            <td>${t.accuracy}%</td>
            <td>${t.masteryPercent}%</td>
            <td><span class="badge-tag ${t.statusClass}">${t.status === 'Critical Weakness' ? '🔴 ' : t.status === 'Needs Improvement' ? '🟡 ' : '🟢 '}${t.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function renderSectionTable(result) {
  const tbody = $('#eval-sections-table-body');
  if (!tbody) return;

  const cr = result.cutoffResults;
  const hasCutoffs = result.enableCutoffs && cr;

  tbody.innerHTML = result.sectionMetrics.map((sec, i) => {
    let cutoffCell = '';
    if (hasCutoffs && cr.sections[i]) {
      const cs = cr.sections[i];
      cutoffCell = `<td style="font-weight:600; color:${cs.passed ? 'var(--status-answered)' : 'var(--status-unanswered)'};">${cs.passed ? '✓ Pass' : '✗ Fail'} (${cs.cutoffPct}%)</td>`;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(sec.sectionName)}</strong></td>
        <td>${sec.totalQuestions}</td>
        <td>${sec.attempted}</td>
        <td style="color: var(--status-answered); font-weight: 600;">${sec.correct}</td>
        <td style="color: var(--status-unanswered); font-weight: 600;">${sec.incorrect}</td>
        <td>${sec.accuracy}%</td>
        <td>${sec.marksObtained} / ${sec.maxMarks}</td>
        ${cutoffCell}
      </tr>`;
  }).join('');

  // Add cutoff header column if needed
  if (hasCutoffs) {
    const thead = tbody.closest('table')?.querySelector('thead tr');
    if (thead && !thead.querySelector('.cutoff-header')) {
      const th = document.createElement('th');
      th.className = 'cutoff-header';
      th.textContent = 'Cutoff Status';
      thead.appendChild(th);
    }
  } else {
    // Remove cutoff header if it exists and cutoffs are off
    const cutoffTh = tbody.closest('table')?.querySelector('.cutoff-header');
    if (cutoffTh) cutoffTh.remove();
  }
}

function renderQuestionReview(result, test, filter = 'all') {
  const container = $('#eval-questions-review-list');
  if (!container) return;
  if (!test) {
    test = state.tests.find(t => t.id === result.testId);
  }
  if (!test) return;

  const responses = result.userResponses || {};
  let globalIdx = 0;
  let html = '';

  test.sections.forEach((section) => {
    section.questions.forEach((q) => {
      globalIdx++;
      const resp = responses[q.id] || { selectedOption: null, visited: false };
      const isSubjective = q.type === 'subjective';

      let statusLabel, statusClass, itemClass;

      if (isSubjective) {
        // For subjective: check if something was written
        const hasText = resp.selectedOption && String(resp.selectedOption).trim().length > 0;
        statusLabel = hasText ? 'ATTEMPTED' : 'SKIPPED';
        statusClass = hasText ? 'badge-attempted' : 'badge-unattempted';
        itemClass = hasText ? 'is-correct' : 'is-unattempted';

        // Filter logic
        if (filter === 'correct' && !hasText) return;
        if (filter === 'incorrect') return; // subjective can't be "incorrect"
        if (filter === 'unattempted' && hasText) return;
      } else {
        const hasAnswered = resp.selectedOption !== null && resp.selectedOption !== undefined && resp.selectedOption !== '';
        const isCorrect = hasAnswered && String(resp.selectedOption).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();

        if (!hasAnswered) {
          statusLabel = 'SKIPPED';
          statusClass = 'badge-unattempted';
          itemClass = 'is-unattempted';
        } else if (isCorrect) {
          statusLabel = 'CORRECT';
          statusClass = 'badge-attempted';
          itemClass = 'is-correct';
        } else {
          statusLabel = 'INCORRECT';
          statusClass = 'badge-unattempted';
          itemClass = 'is-incorrect';
        }

        // Filter
        if (filter === 'correct' && statusLabel !== 'CORRECT') return;
        if (filter === 'incorrect' && statusLabel !== 'INCORRECT') return;
        if (filter === 'unattempted' && statusLabel !== 'SKIPPED') return;
      }

      let optionsHtml = '';
      if (isSubjective) {
        const writtenText = resp.selectedOption ? String(resp.selectedOption) : '';
        const wc = wordCount(writtenText);
        const rubricsHtml = (q.rubrics || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');

        optionsHtml = `
          <div style="margin-top: 12px;">
            <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">YOUR WRITTEN RESPONSE (${wc} words):</div>
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: var(--text-primary); min-height: 60px;">
              ${writtenText.length > 0 ? escapeHtml(writtenText) : '<em style="color: var(--text-muted);">No response written</em>'}
            </div>
            ${rubricsHtml ? `
              <div style="margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">EVALUATION RUBRICS:</div>
              <ul style="padding-left: 20px; font-size: 13px; color: var(--text-secondary);">${rubricsHtml}</ul>
            ` : ''}
          </div>`;
      } else {
        const letters = ['A', 'B', 'C', 'D'];
        optionsHtml = `
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
            ${(q.options || []).map((opt, oi) => {
              const isCorrectOpt = String(opt.id).toUpperCase() === String(q.correctAnswer).toUpperCase();
              const isUserChoice = resp.selectedOption && String(resp.selectedOption).toUpperCase() === String(opt.id).toUpperCase();
              let border = '1px solid var(--border-light)';
              let bg = 'var(--bg-primary)';
              let marker = '';

              if (isCorrectOpt) {
                border = '1px solid #BBF7D0';
                bg = '#F0FDF4';
                marker = '<span style="font-size:11px; font-weight:700; color:var(--status-answered); margin-left:auto;">✓ Correct Answer</span>';
              }
              if (isUserChoice && !isCorrectOpt) {
                border = '1px solid #FECACA';
                bg = '#FEF2F2';
                marker = '<span style="font-size:11px; font-weight:700; color:var(--status-unanswered); margin-left:auto;">✗ Your Choice</span>';
              }
              if (isUserChoice && isCorrectOpt) {
                marker = '<span style="font-size:11px; font-weight:700; color:var(--status-answered); margin-left:auto;">✓ Your Choice (Correct)</span>';
              }

              return `
                <div style="display:flex; align-items:center; gap:12px; padding:10px 14px; border:${border}; background:${bg}; border-radius:4px;">
                  <span style="width:22px; height:22px; border-radius:50%; border:1px solid var(--border-dark); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">${letters[oi] || opt.id}</span>
                  <span style="font-size:14px; color:var(--text-primary);">${opt.text}</span>
                  ${marker}
                </div>`;
            }).join('')}
          </div>`;
      }

      html += `
        <div class="question-review-item ${itemClass}" data-review-status="${statusLabel.toLowerCase()}">
          <div class="review-q-header">
            <div>
              <span style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.4px;">${escapeHtml(section.name)}</span>
              <span style="font-size:14px; font-weight:700; color:var(--text-primary); margin-left:8px;">Q${globalIdx}.</span>
              <span class="badge-tag" style="background:var(--bg-tertiary); color:var(--text-secondary); margin-left:6px; font-size:10px;">${escapeHtml(q.topic || 'General')}</span>
            </div>
            <span class="badge-tag ${statusLabel === 'CORRECT' || statusLabel === 'ATTEMPTED' ? 'badge-success' : statusLabel === 'INCORRECT' ? 'badge-danger' : 'badge-warning'}">${statusLabel}</span>
          </div>
          <div style="font-size:15px; line-height:1.6; color:var(--text-primary); margin-bottom:8px;">${parseQuestionText(getQuestionText(q))}</div>
          ${q.codeSnippet ? `<div class="question-code-block">${escapeHtml(q.codeSnippet)}</div>` : ''}
          ${renderQuestionVisual(q)}
          ${optionsHtml}
          ${q.explanation ? `<div class="review-explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
        </div>`;
    });
  });

  container.innerHTML = html || '<div style="padding:30px; text-align:center; color:var(--text-muted);">No questions match this filter.</div>';

  // Store the result and test for filter re-render
  container._result = result;
  container._test = test;
}

/* ==========================================================================
   Event Wiring
   ========================================================================== */

function init() {
  loadState();
  renderDashboard();

  // ── Browser History Initialization & Popstate (No Page Reload) ──
  try {
    window.history.replaceState({ viewId: 'view-dashboard' }, '', '');
  } catch (e) {}

  window.addEventListener('popstate', (e) => {
    isHandlingPopState = true;
    try {
      const historyState = e.state;
      if (state.engine) {
        const confirmExit = confirm('Are you sure you want to exit the assessment? Your progress will not be submitted.');
        if (!confirmExit) {
          try {
            window.history.pushState({ viewId: 'view-exam' }, '', '');
          } catch (err) {}
          return;
        }
        if (state.engine.overallInterval) clearInterval(state.engine.overallInterval);
        if (state.engine.questionTimerInterval) clearInterval(state.engine.questionTimerInterval);
        state.engine = null;
      }

      if (!historyState || !historyState.viewId || historyState.viewId === 'view-dashboard') {
        showDashboard(false);
      } else if (historyState.viewId === 'view-pre-exam') {
        if (historyState.testId) {
          showPreExam(historyState.testId, false);
        } else {
          showDashboard(false);
        }
      } else if (historyState.viewId === 'view-ai-generate') {
        showAIGenerateView(false);
      } else if (historyState.viewId === 'view-evaluation') {
        if (historyState.result) {
          showEvaluation(historyState.result, false);
        } else if (state.results.length > 0) {
          showEvaluation(state.results[state.results.length - 1], false);
        } else {
          showDashboard(false);
        }
      } else {
        switchView(historyState.viewId);
      }
    } finally {
      isHandlingPopState = false;
    }
  });

  // ── Navigation Buttons ──
  const btnHeaderBack = $('#btn-header-back');
  if (btnHeaderBack) btnHeaderBack.addEventListener('click', goBack);

  const btnPreExamTopBack = $('#btn-pre-exam-top-back');
  if (btnPreExamTopBack) btnPreExamTopBack.addEventListener('click', goBack);

  const btnEvalTopBack = $('#btn-eval-top-back');
  if (btnEvalTopBack) btnEvalTopBack.addEventListener('click', goBack);

  const btnExamExit = $('#btn-exam-exit');
  if (btnExamExit) btnExamExit.addEventListener('click', goBack);

  $('#brand-home-btn').addEventListener('click', () => {
    if (state.engine) {
      goBack();
    } else {
      showDashboard(true);
    }
  });
  $('#btn-eval-back-dash').addEventListener('click', goBack);
  $('#btn-pre-exam-cancel').addEventListener('click', goBack);
  $('#btn-eval-reattempt').addEventListener('click', () => {
    if (state.currentTestId) showPreExam(state.currentTestId);
  });

  // ── Upload Modal ──
  $('#btn-open-upload-modal').addEventListener('click', () => {
    $('#textarea-json-input').value = '';
    $('#upload-validation-msg').textContent = '';
    $('#upload-validation-msg').style.color = '';
    openModal('modal-upload');
  });

  $('#btn-confirm-upload-test').addEventListener('click', handleUploadTest);

  $('#btn-copy-skeleton-sample').addEventListener('click', () => {
    const text = JSON.stringify(ASSESSMENT_SCHEMA_EXAMPLE, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('#btn-copy-skeleton-sample');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy Sample Schema'; }, 2000);
    }).catch(() => {});
  });

  $('#file-input-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      $('#textarea-json-input').value = ev.target.result;
    };
    reader.readAsText(file);
    e.target.value = ''; // reset for re-upload
  });

  // ── AI Prompt Modal ──
  $('#btn-open-prompt-modal').addEventListener('click', () => {
    $('#textarea-ai-prompt').value = PROMPT_TEMPLATE;
    openModal('modal-prompt-helper');
  });

  $('#btn-copy-ai-prompt').addEventListener('click', () => {
    navigator.clipboard.writeText(PROMPT_TEMPLATE).then(() => {
      const btn = $('#btn-copy-ai-prompt');
      const origHtml = btn.innerHTML;
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.innerHTML = origHtml; }, 2000);
    }).catch(() => {});
  });

  // ── Sample Test ──
  $('#btn-load-sample-test').addEventListener('click', () => {
    if (!SAMPLE_ITM_TEST) return;
    const newTest = JSON.parse(JSON.stringify(SAMPLE_ITM_TEST));
    newTest.id = `itm-placement-mock-${Date.now()}`;
    newTest.title = newTest.title + ` (Copy ${state.tests.length})`;
    state.tests.push(newTest);
    saveState();
    renderDashboard();
  });

  // ── Pre-Exam ──
  $('#btn-pre-exam-start').addEventListener('click', startExam);

  // Timer mode radio cards
  $$('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        updateRadioCardVisuals();

        // If section mode selected, disable section switching
        if (radio.value === 'section') {
          $('#input-allow-section-switching').checked = false;
        } else {
          $('#input-allow-section-switching').checked = true;
        }
      }
    });
  });

  // ── Pre-Exam Speed / Question Timer Events ──
  const qTimerCheck = $('#input-enable-question-timer');
  const qTimerWrapper = $('#wrapper-question-timer-sec');
  const qTimerSelect = $('#select-question-timer-sec');
  const qTimerCustom = $('#input-custom-question-sec');

  if (qTimerCheck && qTimerWrapper) {
    qTimerCheck.addEventListener('change', () => {
      qTimerWrapper.style.display = qTimerCheck.checked ? '' : 'none';
    });
  }
  if (qTimerSelect && qTimerCustom) {
    qTimerSelect.addEventListener('change', () => {
      qTimerCustom.style.display = qTimerSelect.value === 'custom' ? '' : 'none';
    });
  }

  // ── In-Exam Solution Peek Event ──
  const btnPeek = $('#btn-peek-solution');
  if (btnPeek) {
    btnPeek.addEventListener('click', () => {
      if (!state.engine) return;
      const currentQ = state.engine.getCurrentQuestion();
      if (!currentQ) return;
      state.engine.revealSolution(currentQ.id);
      const card = $('#exam-solution-card');
      if (card) {
        card.style.display = 'block';
        card.innerHTML = `
          <div class="solution-answer-badge">✓ Correct Answer: ${currentQ.correctAnswer ? ('Option ' + currentQ.correctAnswer) : 'Solution'}</div>
          <div style="margin-top: 6px; line-height: 1.6;">${currentQ.explanation || 'No detailed explanation provided.'}</div>
        `;
      }
    });
  }

  // ── Early Peek Button (when timer is still running) ──
  const btnEarlyPeek = $('#btn-early-peek-solution');
  if (btnEarlyPeek) {
    btnEarlyPeek.addEventListener('click', () => {
      if (!state.engine) return;
      const currentQ = state.engine.getCurrentQuestion();
      if (!currentQ) return;
      // Mark solution as revealed and re-render (this will switch to the main peek area)
      state.engine.revealSolution(currentQ.id);
      renderExamUI();
    });
  }


  // ── Exam Action Buttons ──
  $('#btn-save-next').addEventListener('click', () => {
    if (!state.engine) return;
    const engine = state.engine;
    const sec = engine.getActiveSection();
    const isLastQ = engine.activeQuestionIndex === sec.questions.length - 1;
    const hasNextSec = engine.activeSectionIndex < engine.test.sections.length - 1;

    if (isLastQ && !hasNextSec) {
      // Last question of final section -> open submit modal
      const summary = engine.getPaletteSummary();
      $('#confirm-answered-count').textContent = summary.answered + summary.markedAnswered;
      $('#confirm-marked-count').textContent = summary.marked + summary.markedAnswered;
      $('#confirm-unanswered-count').textContent = summary.notAnswered + summary.notVisited;
      openModal('modal-submit-confirm');
      return;
    }

    if (isLastQ && hasNextSec && engine.config.timerMode === 'section') {
      const nextSec = engine.test.sections[engine.activeSectionIndex + 1];
      if (!confirm(`You have reached the end of this section. Advance to next section "${nextSec.name}"?`)) {
        return;
      }
    }

    engine.saveAndNext();
    renderSectionTabs();
    renderExamUI();
  });

  const btnNextSection = $('#btn-next-section');
  if (btnNextSection) {
    btnNextSection.addEventListener('click', () => {
      if (!state.engine) return;
      const engine = state.engine;
      if (engine.activeSectionIndex < engine.test.sections.length - 1) {
        const nextSec = engine.test.sections[engine.activeSectionIndex + 1];
        const isStrict = engine.config.timerMode === 'section';
        const msg = isStrict
          ? `You have remaining time in this section. Complete this section and advance to "${nextSec.name}" now?`
          : `Switch to next section "${nextSec.name}"?`;
        if (confirm(msg)) {
          engine.advanceToNextSection(true);
          renderSectionTabs();
          renderExamUI();
        }
      }
    });
  }

  $('#btn-mark-review').addEventListener('click', () => {
    if (!state.engine) return;
    state.engine.markForReviewAndNext();
    renderSectionTabs();
    renderExamUI();
  });

  $('#btn-clear-response').addEventListener('click', () => {
    if (!state.engine) return;
    state.engine.clearResponse();
    renderExamUI();
  });

  $('#btn-prev-question').addEventListener('click', () => {
    if (!state.engine) return;
    state.engine.previousQuestion();
    renderSectionTabs();
    renderExamUI();
  });

  // ── Submit Flow ──
  $('#btn-submit-exam-trigger').addEventListener('click', () => {
    if (!state.engine) return;
    const summary = state.engine.getPaletteSummary();
    $('#confirm-answered-count').textContent = summary.answered + summary.markedAnswered;
    $('#confirm-marked-count').textContent = summary.marked + summary.markedAnswered;
    $('#confirm-unanswered-count').textContent = summary.notAnswered + summary.notVisited;
    openModal('modal-submit-confirm');
  });

  $('#btn-final-confirm-submit').addEventListener('click', submitExam);

  // ── Modal Close Buttons ──
  $$('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.closeModal);
    });
  });

  // Click outside modal closes it
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ── Dashboard Filter Tabs ──
  $$('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeFilter = tab.dataset.filter || 'all';
      renderTestCards();
    });
  });

  // ── Review Filter Tabs ──
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('review-filter-btn')) {
      $$('.review-filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter || 'all';
      const container = $('#eval-questions-review-list');
      if (container && container._result) {
        renderQuestionReview(container._result, container._test, filter);
        // Re-activate the button
        $$('.review-filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.filter === filter);
        });
      }
    }
  });

  // ── Keyboard Support in Exam ──
  document.addEventListener('keydown', (e) => {
    if (!state.engine) return;
    // Don't capture keys if user is typing in a textarea or input
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'textarea' || tag === 'input') return;

    const question = state.engine.getCurrentQuestion();
    if (!question || question.type === 'subjective') return;

    const key = e.key.toUpperCase();

    // Option selection via 1-4 or A-D
    const optionMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };
    if (optionMap[key]) {
      e.preventDefault();
      state.engine.selectOption(optionMap[key]);
      renderExamUI();
      return;
    }

    // Arrow keys
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      state.engine.saveAndNext();
      renderSectionTabs();
      renderExamUI();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      state.engine.previousQuestion();
      renderSectionTabs();
      renderExamUI();
      return;
    }

    // Enter = Save & Next
    if (e.key === 'Enter') {
      e.preventDefault();
      state.engine.saveAndNext();
      renderSectionTabs();
      renderExamUI();
    }
  });

  // ── AI Generated Test Studio Navigation ──
  const btnOpenAI = $('#btn-open-ai-generator');
  if (btnOpenAI) btnOpenAI.addEventListener('click', showAIGenerateView);

  const btnGenBack = $('#btn-gen-back-dash');
  if (btnGenBack) btnGenBack.addEventListener('click', goBack);

  // ── Multi-Device Data Sync (Export / Import Backup) ──
  const btnExport = $('#btn-export-backup');
  if (btnExport) btnExport.addEventListener('click', exportBackup);

  const btnImportTrigger = $('#btn-import-backup-trigger');
  const inputBackupFile = $('#input-backup-file');
  if (btnImportTrigger && inputBackupFile) {
    btnImportTrigger.addEventListener('click', () => inputBackupFile.click());
    inputBackupFile.addEventListener('change', handleImportBackup);
  }

  // ── AI Studio Interactive Controls ──
  const topicInput = $('#input-gen-topic');
  if (topicInput) {
    topicInput.addEventListener('input', updateAIPromptPreview);
  }

  ['select-gen-count', 'select-gen-difficulty', 'input-gen-duration', 'input-gen-marks', 'input-gen-negative', 'input-gen-cutoff'].forEach(id => {
    const el = $(`#${id}`);
    if (el) {
      el.addEventListener('change', updateAIPromptPreview);
      el.addEventListener('input', updateAIPromptPreview);
    }
  });

  const btnCopyGenPrompt = $('#btn-copy-gen-prompt');
  if (btnCopyGenPrompt) {
    btnCopyGenPrompt.addEventListener('click', () => {
      const text = $('#textarea-gen-prompt').value;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btnCopyGenPrompt.innerHTML;
        btnCopyGenPrompt.textContent = '✓ Copied!';
        setTimeout(() => { btnCopyGenPrompt.innerHTML = orig; }, 2000);
      }).catch(() => {});
    });
  }

  const btnLoadSampleAI = $('#btn-load-sample-ai-json');
  if (btnLoadSampleAI) {
    btnLoadSampleAI.addEventListener('click', () => {
      const textarea = $('#textarea-gen-json');
      if (textarea) textarea.value = JSON.stringify(AI_SAMPLE_TOPIC_TEST, null, 2);
      const topInp = $('#input-gen-topic');
      if (topInp) topInp.value = 'Dynamic Programming & Memoization';
      updateAIPromptPreview();
      const msg = $('#gen-validation-msg');
      if (msg) {
        msg.className = 'gen-validation-box success';
        msg.style.display = 'block';
        msg.textContent = '✓ Sample 5-Question DP test loaded into editor. Ready to save or launch!';
      }
    });
  }

  $$('input[name="genDestination"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isAppend = radio.value === 'append' && radio.checked;
      const appendOpts = $('#append-test-options');
      if (appendOpts) appendOpts.style.display = isAppend ? 'block' : 'none';
      $('#radio-label-standalone')?.classList.toggle('selected', !isAppend);
      $('#radio-label-append')?.classList.toggle('selected', isAppend);
      if (isAppend) populateAppendTargetDropdown();
    });
  });

  const btnSaveGenOnly = $('#btn-gen-save-only');
  if (btnSaveGenOnly) {
    btnSaveGenOnly.addEventListener('click', () => handleSaveAITest(false));
  }

  const btnSaveGenLaunch = $('#btn-gen-save-launch');
  if (btnSaveGenLaunch) {
    btnSaveGenLaunch.addEventListener('click', () => handleSaveAITest(true));
  }

  // ── Mobile Exam Palette Drawer ──
  const btnMobilePaletteToggle = $('#btn-mobile-palette-toggle');
  const paletteSidebar = $('#exam-palette-sidebar');
  const paletteBackdrop = $('#palette-backdrop');
  const btnClosePalette = $('#btn-close-palette');

  if (btnMobilePaletteToggle && paletteSidebar && paletteBackdrop) {
    btnMobilePaletteToggle.addEventListener('click', () => {
      paletteSidebar.classList.toggle('mobile-open');
      paletteBackdrop.classList.toggle('active');
    });
  }
  if (paletteBackdrop && paletteSidebar) {
    paletteBackdrop.addEventListener('click', () => {
      paletteSidebar.classList.remove('mobile-open');
      paletteBackdrop.classList.remove('active');
    });
  }
  if (btnClosePalette && paletteSidebar && paletteBackdrop) {
    btnClosePalette.addEventListener('click', () => {
      paletteSidebar.classList.remove('mobile-open');
      paletteBackdrop.classList.remove('active');
    });
  }
}

/* ==========================================================================
   AI Generated Test Studio Controller
   ========================================================================== */

function updateAIPromptPreview() {
  const topic = $('#input-gen-topic')?.value?.trim() || 'Dynamic Programming';
  const count = parseInt($('#select-gen-count')?.value) || 20;
  const difficulty = $('#select-gen-difficulty')?.value || 'Standard Placement (TCS/Infosys/AMCAT)';
  const duration = parseInt($('#input-gen-duration')?.value) || 25;
  const marksCorrect = parseFloat($('#input-gen-marks')?.value) || 1;
  const negativeMarks = parseFloat($('#input-gen-negative')?.value) || 0;
  const cutoffPercent = parseInt($('#input-gen-cutoff')?.value) || 50;

  const promptText = generateCustomTopicPrompt({
    topic,
    count,
    difficulty,
    duration,
    marksCorrect,
    negativeMarks,
    cutoffPercent
  });

  const textarea = $('#textarea-gen-prompt');
  if (textarea) textarea.value = promptText;
}

function populateAppendTargetDropdown() {
  const select = $('#select-append-target-test');
  if (!select) return;
  select.innerHTML = state.tests.map(t => {
    return `<option value="${t.id}">${escapeHtml(t.title)} (${getTotalQuestions(t)} Qs)</option>`;
  }).join('');
}

function parseAndNormalizeAIJson(rawStr) {
  let parsed;
  try {
    parsed = JSON.parse(rawStr);
  } catch (err) {
    throw new Error(`JSON syntax error: ${err.message}`);
  }

  const topic = $('#input-gen-topic')?.value?.trim() || 'Custom Topic';
  const duration = parseInt($('#input-gen-duration')?.value) || 25;
  const marks = parseFloat($('#input-gen-marks')?.value) || 1;
  const penalty = parseFloat($('#input-gen-negative')?.value) || 0;
  const cutoff = parseInt($('#input-gen-cutoff')?.value) || 50;

  // Case 1: Full Test Object with .sections
  if (parsed.sections && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
    if (!parsed.id) parsed.id = `ai-test-${Date.now()}`;
    if (!parsed.companyOrType) parsed.companyOrType = "AI Generated Test";
    parsed.sections.forEach((sec, si) => {
      if (!sec.id) sec.id = `sec-ai-${Date.now()}-${si + 1}`;
      if (!sec.name) sec.name = `${topic} (Part ${si + 1})`;
      (sec.questions || []).forEach((q, qi) => {
        if (!q.id) q.id = `${sec.id}-q${qi + 1}`;
        if (!q.topic) q.topic = topic;
        if (!q.text && q.prompt) q.text = q.prompt;
        if (!q.text && q.question) q.text = q.question;
        if (!q.type && (sec.type === 'subjective' || q.prompt || q.wordLimit)) q.type = 'subjective';
      });
    });
    return parsed;
  }

  // Case 2: Single Section Object with .questions
  if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
    const secId = `sec-ai-${Date.now()}`;
    parsed.questions.forEach((q, qi) => {
      if (!q.id) q.id = `${secId}-q${qi + 1}`;
      if (!q.topic) q.topic = topic;
      if (!q.text && q.prompt) q.text = q.prompt;
      if (!q.text && q.question) q.text = q.question;
      if (!q.type && (parsed.type === 'subjective' || q.prompt || q.wordLimit)) q.type = 'subjective';
    });
    return {
      id: `ai-test-${Date.now()}`,
      title: parsed.name || `AI Practice: ${topic}`,
      companyOrType: "AI Generated Test",
      description: `Targeted placement assessment on ${topic} (${parsed.questions.length} Questions)`,
      defaultDurationMinutes: parsed.durationMinutes || duration,
      passingScorePercent: cutoff,
      sectionalCutoffs: true,
      defaultCutoffPercent: cutoff,
      markingScheme: { correct: marks, incorrect: -penalty },
      sections: [
        {
          id: secId,
          name: parsed.name || topic,
          durationMinutes: parsed.durationMinutes || duration,
          cutoffPercent: parsed.cutoffPercent || cutoff,
          marksPerQuestion: parsed.marksPerQuestion || marks,
          type: parsed.type || "mcq",
          questions: parsed.questions
        }
      ]
    };
  }

  // Case 3: Raw Array of questions
  if (Array.isArray(parsed) && parsed.length > 0) {
    const secId = `sec-ai-${Date.now()}`;
    parsed.forEach((q, qi) => {
      if (!q.id) q.id = `${secId}-q${qi + 1}`;
      if (!q.topic) q.topic = topic;
      if (!q.text && q.prompt) q.text = q.prompt;
      if (!q.text && q.question) q.text = q.question;
      if (!q.type && (q.prompt || q.wordLimit)) q.type = 'subjective';
    });
    return {
      id: `ai-test-${Date.now()}`,
      title: `AI Practice: ${topic}`,
      companyOrType: "AI Generated Test",
      description: `Custom placement practice assessment covering ${topic} (${parsed.length} Questions)`,
      defaultDurationMinutes: duration,
      passingScorePercent: cutoff,
      sectionalCutoffs: true,
      defaultCutoffPercent: cutoff,
      markingScheme: { correct: marks, incorrect: -penalty },
      sections: [
        {
          id: secId,
          name: topic,
          durationMinutes: duration,
          cutoffPercent: cutoff,
          marksPerQuestion: marks,
          type: "mcq",
          questions: parsed
        }
      ]
    };
  }

  throw new Error('Unsupported JSON format. Expected a test object, section object, or question array.');
}

function handleSaveAITest(launchImmediately = false) {
  const textarea = $('#textarea-gen-json');
  const msgBox = $('#gen-validation-msg');
  const raw = textarea.value.trim();

  if (!raw) {
    msgBox.className = 'gen-validation-box error';
    msgBox.style.display = 'block';
    msgBox.textContent = '✗ Please paste your AI-generated JSON into the box above before saving.';
    return;
  }

  let testObj;
  try {
    testObj = parseAndNormalizeAIJson(raw);
  } catch (err) {
    msgBox.className = 'gen-validation-box error';
    msgBox.style.display = 'block';
    msgBox.textContent = `✗ ${err.message}`;
    return;
  }

  const customTitle = $('#input-gen-custom-title')?.value?.trim();
  if (customTitle) {
    testObj.title = customTitle;
  }

  const destination = $('input[name="genDestination"]:checked')?.value || 'standalone';
  let targetTestId = testObj.id;

  if (destination === 'append') {
    const targetId = $('#select-append-target-test')?.value;
    const targetTest = state.tests.find(t => t.id === targetId);
    if (!targetTest) {
      msgBox.className = 'gen-validation-box error';
      msgBox.style.display = 'block';
      msgBox.textContent = '✗ Please select a target assessment from the dropdown.';
      return;
    }

    const secNameInput = $('#input-append-sec-name')?.value?.trim();
    testObj.sections.forEach((sec, idx) => {
      const newSec = JSON.parse(JSON.stringify(sec));
      newSec.id = `sec-appended-${Date.now()}-${idx}`;
      if (secNameInput) newSec.name = secNameInput;
      targetTest.sections.push(newSec);
      targetTest.defaultDurationMinutes = (targetTest.defaultDurationMinutes || 60) + (newSec.durationMinutes || 15);
    });

    targetTestId = targetTest.id;
    saveState();
    msgBox.className = 'gen-validation-box success';
    msgBox.style.display = 'block';
    msgBox.textContent = `✓ Successfully appended questions to "${targetTest.title}"! Total sections now: ${targetTest.sections.length}.`;
  } else {
    // Standalone test
    if (!testObj.id) testObj.id = `ai-test-${Date.now()}`;
    if (!testObj.companyOrType) testObj.companyOrType = "AI Generated Test";
    state.tests.unshift(testObj);
    saveState();
    msgBox.className = 'gen-validation-box success';
    msgBox.style.display = 'block';
    msgBox.textContent = `✓ Standalone topic test "${testObj.title}" created with ${getTotalQuestions(testObj)} questions!`;
  }

  setTimeout(() => {
    if (launchImmediately) {
      showPreExam(targetTestId);
    } else {
      showDashboard();
    }
  }, 1000);
}

/* ==========================================================================
   Upload Test Handler
   ========================================================================== */

function handleUploadTest() {
  const textarea = $('#textarea-json-input');
  const msgDiv = $('#upload-validation-msg');
  const raw = textarea.value.trim();

  if (!raw) {
    msgDiv.style.color = 'var(--status-unanswered)';
    msgDiv.textContent = '✗ Please paste a JSON test skeleton.';
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    msgDiv.style.color = 'var(--status-unanswered)';
    msgDiv.textContent = `✗ Invalid JSON: ${err.message}`;
    return;
  }

  // Validate required fields
  if (!parsed.title) {
    msgDiv.style.color = 'var(--status-unanswered)';
    msgDiv.textContent = '✗ Missing required field: "title"';
    return;
  }
  if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    msgDiv.style.color = 'var(--status-unanswered)';
    msgDiv.textContent = '✗ Missing or empty "sections" array.';
    return;
  }

  let totalQ = 0;
  for (const sec of parsed.sections) {
    if (!sec.questions || !Array.isArray(sec.questions)) {
      msgDiv.style.color = 'var(--status-unanswered)';
      msgDiv.textContent = `✗ Section "${sec.name || sec.id}" has no "questions" array.`;
      return;
    }
    totalQ += sec.questions.length;
  }

  // Auto-generate id if missing
  if (!parsed.id) {
    parsed.id = `test-${Date.now()}`;
  }

  // Check for duplicate id
  if (state.tests.some(t => t.id === parsed.id)) {
    parsed.id = `${parsed.id}-${Date.now()}`;
  }

  // Auto-assign section ids, question ids, and normalize subjective questions if missing
  parsed.sections.forEach((sec, si) => {
    if (!sec.id) sec.id = `sec-${si + 1}`;
    if (!sec.name) sec.name = `Section ${si + 1}`;
    (sec.questions || []).forEach((q, qi) => {
      if (!q.id) q.id = `${sec.id}-q${qi + 1}`;
      if (!q.text && q.prompt) q.text = q.prompt;
      if (!q.text && q.question) q.text = q.question;
      if (!q.text && q.statement) q.text = q.statement;
      if (!q.type && (sec.type === 'subjective' || q.prompt || q.wordLimit)) q.type = 'subjective';
    });
  });

  state.tests.push(parsed);
  saveState();

  msgDiv.style.color = 'var(--status-answered)';
  msgDiv.textContent = `✓ Test "${parsed.title}" created with ${totalQ} questions across ${parsed.sections.length} sections.`;

  setTimeout(() => {
    closeModal('modal-upload');
    renderDashboard();
  }, 1200);
}

/* ==========================================================================
   Boot
   ========================================================================== */

document.addEventListener('DOMContentLoaded', init);
