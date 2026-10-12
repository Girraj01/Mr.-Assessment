# Project Implementation Plan: Placements ITM Exam Prep Platform

## 1. Project Overview & Workflow
A 100% pure client-side local web application (HTML, Vanilla CSS, Vanilla JavaScript) running in your browser with zero external AI dependencies or API keys.

### The Direct Workflow:
1. **User provides the Test Document**: User drops or pastes test PDF/Word document into AntiGravity chat.
2. **AntiGravity generates the JSON**: AntiGravity extracts questions, assigns syllabus topics, and produces the clean JSON skeleton.
3. **User pastes into Localhost**: User opens the web page on `localhost`, clicks **"Upload Mock Test"**, pastes the JSON, and the test banner is instantly created.
4. **Attempt & Analyze**: User attempts the test under authentic exam conditions (timers, question palette, section controls) and gets instant evaluation with weak topic diagnosis. All tests and results persist in browser `localStorage`.

---

## 2. Placements ITM Assessment Specification

| # | Section Name | Questions | Marks | Duration | Question Type | Core Topics / Syllabus |
|---|---|:---:|:---:|:---:|:---:|---|
| 1 | **Reasoning Ability** | 15 | 15 | 25 mins | MCQ | Syllogism, Data Sufficiency, Coding-Decoding, Blood Relations, Direction Sense |
| 2 | **Technical Ability (Quant)** | 10 | 10 | 35 mins | MCQ | P&C, Probability, Profit & Loss, Time & Work, Speed/Distance, Interest |
| 3 | **Verbal Ability** | 20 | 20 | 20 mins | MCQ | Reading Comprehension, Sentence Correction, Para-jumbles, Vocabulary |
| 4 | **Pseudo Code** | 5 | 10 | 10 mins | MCQ | Bitwise Operators, Loops, Recursion, Data Structures, Output Prediction |
| 5 | **Numeric Puzzle Solving** | 4 | 10 | 10 mins | MCQ | Matrix logic, Circular wheel puzzles, Pattern sequences, Matchstick |
| 6 | **English Grammar** | 5 | 10 | 10 mins | MCQ | Subject-Verb Agreement, Tenses, Prepositions, Error Spotting, Articles |
| 7 | **English Writing** | 1 | Evaluated | 10 mins | **Subjective Text** | Email writing / short technical essay with live word counter |
| **Total** | **7 Distinct Sections** | **60 Qs** | **75+ Marks** | **120 mins** | Mixed | **Mandatory Sectional Cutoffs** |

---

## 3. Architecture & Core Modules

### Module 1: Dashboard & Test Management
- **Test Banners**: Displays tests with status pills (`ATTEMPTED` vs `UNATTEMPTED`), section counts, total time, high score, and date.
- **Sectional Cutoff Indicator**: Displays overall verdict (**Passed All Cutoffs** vs **Failed Sectional Cutoff**).
- **Upload / Import Modal**: Paste JSON mock skeleton or upload `.json` file.
- **Persistence**: Auto-saves tests and results to browser `localStorage`.

### Module 2: Pre-Exam Configuration
- **Timer Modes**:
  - *Strict ITM Placement Mode (Recommended)*: Strict per-section timers (25m, 35m, 20m, 10m, 10m, 10m, 10m) auto-advancing upon expiry with sectional cutoff tracking.
  - *Custom Overall Mode*: Single 120-min global timer with free section navigation.
- **Customizable Cutoffs**: Set required sectional cutoff percentage per section (default: 50% or 60%).
- **Marking Scheme Customizer**: Configurable marks per question and negative marking (0 or -0.25).

### Module 3: Live Assessment Engine (Exam Mode)
- **Minimalist Assessment Topbar**: Clean corporate test layout (like Mettl, TCS iON, AMCAT).
  - Section switch tabs with question counts.
  - Live Countdown Clock with visual amber/red warning states when < 5 mins remain.
  - "Submit Assessment" trigger with confirmation modal.
- **MCQ Interface (Sections 1 to 6)**:
  - Formatted question statement, code blocks for *Pseudo Code*, image/matrix support for *Numeric Puzzles*.
  - Radio options (A, B, C, D) with distinct keyboard navigation and instant selection.
  - Action footer: *Save & Next*, *Mark for Review & Next*, *Clear Response*, *Previous*.
- **Subjective Text Editor (Section 7 - English Writing)**:
  - Rich writing area for prompt-based email/essay writing.
  - Real-time word counter and character counter.
  - Time tracking dedicated to the writing segment.
- **Right-Hand Question Palette**:
  - Live status indicators: **Answered** (Green), **Not Answered** (Red), **Marked for Review** (Purple), **Answered & Marked** (Purple+Check), **Not Visited** (Gray).
  - Quick jump to any question across the current section.

### Module 4: Diagnostic Evaluation & Weak Topic Engine
- **Overall Result Summary**: Total score, score percentage, overall pass/fail status.
- **Mandatory Sectional Cutoff Verification**:
  - Clear breakdown verifying whether each of the 7 sections met its required passing threshold.
  - Highlights exact sections where cutoff was missed.
- **Weak Topic Diagnostic Report (The Core Requirement)**:
  - Aggregates performance by topic from the syllabus (e.g. *Syllogism*, *Time & Work*, *Bitwise Operators*, *Prepositions*).
  - Ranks topics by lowest accuracy.
  - Categorizes into:
    - 🔴 **Critical Weakness** (< 50% accuracy) — High priority revision.
    - 🟡 **Needs Improvement** (50% – 74% accuracy) — Practice more problems.
    - 🟢 **Proficient** (≥ 75% accuracy) — Strong command.
- **Section Performance Visuals**:
  - SVG comparison charts: Total Questions vs Attempted vs Correct per section.
- **Full Solution Review**:
  - Filter by: *Incorrect Only*, *Skipped*, *Correct*.
  - Displays user choice, correct answer, and full step-by-step reasoning.
  - For English Writing: Displays prompt, user's typed text, and evaluation rubrics.

---

## 4. Phased Implementation Roadmap

### Phase 1: Data Model & Schema Preparation
- Finalize schema for the 7 sections (Reasoning, Technical Quant, Verbal, Pseudo Code, Numeric Puzzles, English Grammar, English Writing).
- Create a pre-loaded full-length **Placements ITM Mock Test 1** with authentic questions across all 7 sections.

### Phase 2: Live Engine & UI Implementation
- Update assessment engine to support:
  - Strict 7-section timer mode with sequential section transition.
  - Subjective essay/writing answer recording for Section 7 with word count.
  - Sectional cutoff thresholds.
- Implement responsive corporate white minimalist styling.

### Phase 3: Analytics & Diagnostic Reports
- Build the sectional cutoff evaluation logic.
- Implement the weak topic analyzer mapping questions to the specific ITM syllabus topics.
- Render SVG charts and question-by-question review screens.

### Phase 4: Verification & Testing
- Test mock test import via JSON and test creation.
- Test exam timer transitions across sections 1 through 7.
- Verify evaluation metrics, weak topic recommendations, and print/export feature.
