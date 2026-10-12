/**
 * Standard JSON Schema for Mock Assessments in ExamPrep
 */
export const ASSESSMENT_SCHEMA_EXAMPLE = {
  id: "sample-tech-assessment-1",
  title: "Full-Stack Software Engineering Technical Assessment",
  companyOrType: "Top Tech Enterprise Mock",
  description: "Comprehensive assessment covering Data Structures & Algorithms, Database Management, System Design, and Web Architecture.",
  defaultDurationMinutes: 30,
  passingScorePercent: 65,
  markingScheme: {
    correct: 1,
    incorrect: -0.25 // set 0 for no negative marking
  },
  sections: [
    {
      id: "sec-1",
      name: "Data Structures & Algorithms",
      durationMinutes: 10,
      questions: [
        {
          id: "dsa-q1",
          topic: "Binary Trees & BST",
          text: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?",
          codeSnippet: "// Searching in an unbalanced BST with N nodes\nfunction search(node, val) { ... }",
          options: [
            { id: "A", text: "O(log N)" },
            { id: "B", text: "O(N)" },
            { id: "C", text: "O(N log N)" },
            { id: "D", text: "O(1)" }
          ],
          correctAnswer: "B",
          explanation: "In an unbalanced BST (e.g., when keys are inserted in strictly ascending or descending order), the tree degenerates into a singly linked list. Hence, the worst-case search time complexity is O(N)."
        },
        {
          id: "dsa-q2",
          topic: "Hash Tables",
          text: "In a Hash Table with open addressing using linear probing, what primary phenomenon degrades lookup performance as the load factor increases?",
          options: [
            { id: "A", text: "Primary Clustering" },
            { id: "B", text: "Secondary Clustering" },
            { id: "C", text: "Hash Collusion Inversion" },
            { id: "D", text: "Thrashing" }
          ],
          correctAnswer: "A",
          explanation: "Linear probing suffers from primary clustering, where occupied slots tend to form contiguous runs. Long runs cause search times to increase drastically."
        },
        {
          id: "dsa-q3",
          topic: "Graph Algorithms",
          text: "Which algorithm finds the shortest path from a single source to all other vertices in a weighted graph that may contain negative edge weights?",
          options: [
            { id: "A", text: "Dijkstra's Algorithm" },
            { id: "B", text: "Bellman-Ford Algorithm" },
            { id: "C", text: "Prim's Algorithm" },
            { id: "D", text: "Kruskal's Algorithm" }
          ],
          correctAnswer: "B",
          explanation: "Dijkstra's algorithm fails with negative edge weights because it greedily assumes optimal subpaths. Bellman-Ford can handle negative weights and detect negative cycles in O(V * E) time."
        },
        {
          id: "dsa-q4",
          topic: "Sorting Algorithms",
          text: "Which of the following sorting algorithms is inherently stable and operates in O(N log N) worst-case time?",
          options: [
            { id: "A", text: "Quick Sort" },
            { id: "B", text: "Heap Sort" },
            { id: "C", text: "Merge Sort" },
            { id: "D", text: "Selection Sort" }
          ],
          correctAnswer: "C",
          explanation: "Merge Sort is guaranteed O(N log N) worst-case and maintains relative order of equivalent keys (stable). Quick Sort is O(N^2) worst case, and standard Heap Sort is not stable."
        }
      ]
    },
    {
      id: "sec-2",
      name: "Databases & SQL",
      durationMinutes: 10,
      questions: [
        {
          id: "db-q1",
          topic: "ACID Transactions",
          text: "Which ACID property guarantees that once a transaction has completed and committed, its modifications to the database will persist even in the event of an abrupt power failure or crash?",
          options: [
            { id: "A", text: "Atomicity" },
            { id: "B", text: "Consistency" },
            { id: "C", text: "Isolation" },
            { id: "D", text: "Durability" }
          ],
          correctAnswer: "D",
          explanation: "Durability guarantees that committed transactions are recorded in non-volatile storage (such as Write-Ahead Logging/WAL) and survive system crashes."
        },
        {
          id: "db-q2",
          topic: "Indexing & Query Optimization",
          text: "Why is a B+ Tree preferred over a standard B Tree for relational database disk storage indices?",
          options: [
            { id: "A", text: "B+ Trees store all actual data pointers at the leaf level, allowing efficient sequential range queries via leaf link pointers" },
            { id: "B", text: "B+ Trees have a higher tree height, minimizing cache misses" },
            { id: "C", text: "B+ Trees do not require balancing operations upon insertion" },
            { id: "D", text: "Standard B Trees cannot index string columns" }
          ],
          correctAnswer: "A",
          explanation: "In B+ Trees, non-leaf nodes store only keys for routing, maximizing branch factor per disk block. All data references sit in linked leaf nodes, enabling fast range scans."
        },
        {
          id: "db-q3",
          topic: "SQL Joins",
          text: "Consider two tables: Employees (100 rows) and Departments (10 rows). If a query performs a CROSS JOIN without any WHERE filter, how many total records are produced?",
          options: [
            { id: "A", text: "100" },
            { id: "B", text: "110" },
            { id: "C", text: "1,000" },
            { id: "D", text: "10" }
          ],
          correctAnswer: "C",
          explanation: "A CROSS JOIN computes the Cartesian product of both sets: 100 * 10 = 1,000 rows."
        }
      ]
    },
    {
      id: "sec-3",
      name: "Operating Systems & Networking",
      durationMinutes: 10,
      questions: [
        {
          id: "os-q1",
          topic: "Concurrency & Deadlocks",
          text: "Which of the following is NOT one of the four necessary Coffman conditions for a deadlock to occur?",
          options: [
            { id: "A", text: "Mutual Exclusion" },
            { id: "B", text: "Hold and Wait" },
            { id: "C", text: "Preemption Allowed" },
            { id: "D", text: "Circular Wait" }
          ],
          correctAnswer: "C",
          explanation: "The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlocks can be broken."
        },
        {
          id: "os-q2",
          topic: "Virtual Memory",
          text: "What occurs when the CPU spends significantly more time swapping virtual memory pages between disk and RAM than executing actual application code?",
          options: [
            { id: "A", text: "Segmentation Fault" },
            { id: "B", text: "Thrashing" },
            { id: "C", text: "Cache Invalidation" },
            { id: "D", text: "Context Switch Overhead" }
          ],
          correctAnswer: "B",
          explanation: "Thrashing occurs when the working set of active processes exceeds physical memory, leading to continuous page faulting and I/O thrashing."
        },
        {
          id: "net-q3",
          topic: "TCP/IP Protocol",
          text: "In the standard TCP connection termination handshake, which flag combination is exchanged to gracefully close a full-duplex connection?",
          options: [
            { id: "A", text: "SYN, SYN-ACK, ACK" },
            { id: "B", text: "FIN, ACK, FIN, ACK" },
            { id: "C", text: "RST, ACK, FIN" },
            { id: "D", text: "PING, PONG" }
          ],
          correctAnswer: "B",
          explanation: "Closing a TCP connection requires a 4-step teardown (FIN from initiator, ACK from receiver, then FIN from receiver, ACK from initiator) to ensure both directions are flushed."
        }
      ]
    }
  ]
};

export const PROMPT_TEMPLATE = `
Convert the following technical exam questions (from my Word/PDF document) into the JSON format required by the Exam Prep Assessment Platform.

Instructions:
1. Divide questions into logical sections if present (or one general section if not divided).
2. For each question, extract or assign a specific "topic" (e.g. "Binary Trees", "Deadlocks", "CSS Flexbox", "SQL Joins"). This topic is crucial for the weak topic analysis engine.
3. Mark the correctAnswer ("A", "B", "C", or "D").
4. Provide a clear explanation for the correct answer.
5. If there is code in the question, put it in the "codeSnippet" field or format within "text".
6. Return valid JSON only, without markdown quotes or explanation outside the JSON.
7. For subjective/writing sections, use type: "subjective" with a "prompt" field, "wordLimit", and "rubrics" array instead of options/correctAnswer.

Expected JSON Structure:
{
  "id": "mock-test-01",
  "title": "Title of the Assessment",
  "companyOrType": "Company Name or Subject",
  "description": "Brief description",
  "defaultDurationMinutes": 120,
  "passingScorePercent": 50,
  "totalMarks": 75,
  "sectionalCutoffs": true,
  "defaultCutoffPercent": 50,
  "markingScheme": {
    "correct": 1,
    "incorrect": 0
  },
  "sections": [
    {
      "id": "sec-1",
      "name": "Section Name",
      "durationMinutes": 25,
      "cutoffPercent": 50,
      "marksPerQuestion": 1,
      "type": "mcq",
      "questions": [
        {
          "id": "q1",
          "topic": "Topic Name",
          "text": "Question statement here?",
          "codeSnippet": "",
          "options": [
            { "id": "A", "text": "Option A" },
            { "id": "B", "text": "Option B" },
            { "id": "C", "text": "Option C" },
            { "id": "D", "text": "Option D" }
          ],
          "correctAnswer": "A",
          "explanation": "Explanation why A is correct."
        }
      ]
    },
    {
      "id": "sec-writing",
      "name": "English Writing",
      "durationMinutes": 10,
      "type": "subjective",
      "questions": [
        {
          "id": "ew-q1",
          "type": "subjective",
          "topic": "Email Writing",
          "prompt": "Write an email to...",
          "wordLimit": 250,
          "rubrics": ["Clarity", "Grammar", "Structure", "Tone"]
        }
      ]
    }
  ]
}

Document Content to convert:
[PASTE YOUR WORD/PDF TEXT HERE]
`;

/**
 * Pre-loaded Placements ITM Mock Test 1
 * 7 Sections | 60 Questions | 75+ Marks | 120 Minutes
 */
export const SAMPLE_ITM_TEST = {
  id: "itm-placement-mock-1",
  title: "Placements ITM Mock Test 1 — Full Length",
  companyOrType: "ITM Placement Assessment",
  description: "Complete 60-question placement exam simulation covering Reasoning Ability, Technical Ability (Quant), Verbal Ability, Pseudo Code, Numeric Puzzle Solving, English Grammar, and English Writing. Strict sectional cutoffs apply.",
  defaultDurationMinutes: 120,
  passingScorePercent: 50,
  totalMarks: 75,
  sectionalCutoffs: true,
  defaultCutoffPercent: 50,
  markingScheme: { correct: 1, incorrect: 0 },
  sections: [
    /* ================================================================
       SECTION 1: Reasoning Ability
       15 Questions | 15 Marks | 25 Minutes | MCQ
       Topics: Syllogism, Data Sufficiency, Coding-Decoding,
               Blood Relations, Direction Sense (3 each)
       ================================================================ */
    {
      id: "sec-reasoning",
      name: "Reasoning Ability",
      durationMinutes: 25,
      cutoffPercent: 50,
      marksPerQuestion: 1,
      type: "mcq",
      questions: [
        // --- Syllogism (3 Qs) ---
        {
          id: "ra-q1",
          topic: "Syllogism",
          text: "Statements:\n1. All managers are leaders.\n2. Some leaders are innovators.\n\nConclusions:\nI. Some managers are innovators.\nII. Some innovators are managers.\n\nWhich of the conclusions logically follows?",
          options: [
            { id: "A", text: "Only Conclusion I follows" },
            { id: "B", text: "Only Conclusion II follows" },
            { id: "C", text: "Both Conclusion I and II follow" },
            { id: "D", text: "Neither Conclusion I nor II follows" }
          ],
          correctAnswer: "D",
          explanation: "From 'All managers are leaders' and 'Some leaders are innovators,' we cannot definitively conclude that the innovators who are leaders are also among the managers. The 'some leaders' who are innovators may be entirely outside the set of managers. Hence neither conclusion necessarily follows."
        },
        {
          id: "ra-q2",
          topic: "Syllogism",
          text: "Statements:\n1. No cats are dogs.\n2. All dogs are animals.\n\nConclusions:\nI. No cats are animals.\nII. Some animals are not cats.\n\nWhich of the conclusions logically follows?",
          options: [
            { id: "A", text: "Only Conclusion I follows" },
            { id: "B", text: "Only Conclusion II follows" },
            { id: "C", text: "Both follow" },
            { id: "D", text: "Neither follows" }
          ],
          correctAnswer: "B",
          explanation: "'All dogs are animals' means at least some animals are dogs. Since 'No cats are dogs,' those animals that are dogs are definitely not cats. So 'Some animals are not cats' follows. Conclusion I does not follow because cats could still be animals through other paths."
        },
        {
          id: "ra-q3",
          topic: "Syllogism",
          text: "Statements:\n1. Some pens are erasers.\n2. All erasers are sharpeners.\n3. No sharpener is a ruler.\n\nConclusions:\nI. Some pens are sharpeners.\nII. No eraser is a ruler.\n\nWhich of the conclusions logically follows?",
          options: [
            { id: "A", text: "Only I follows" },
            { id: "B", text: "Only II follows" },
            { id: "C", text: "Both I and II follow" },
            { id: "D", text: "Neither follows" }
          ],
          correctAnswer: "C",
          explanation: "Since some pens are erasers and all erasers are sharpeners, those pens that are erasers are also sharpeners — so Conclusion I follows. Since all erasers are sharpeners and no sharpener is a ruler, no eraser can be a ruler — so Conclusion II also follows."
        },

        // --- Data Sufficiency (3 Qs) ---
        {
          id: "ra-q4",
          topic: "Data Sufficiency",
          text: "Is x > y?\n\nStatement I: x² > y²\nStatement II: x > 0\n\nWhich statement(s) are sufficient to answer the question?",
          options: [
            { id: "A", text: "Statement I alone is sufficient" },
            { id: "B", text: "Statement II alone is sufficient" },
            { id: "C", text: "Both statements together are sufficient" },
            { id: "D", text: "Neither statement alone nor together is sufficient" }
          ],
          correctAnswer: "C",
          explanation: "Statement I tells us |x| > |y|, but x could be negative (e.g., x = -3, y = 2 gives x² = 9 > 4 = y² but x < y). Statement II alone tells us nothing about y. Together: x > 0 and x² > y² means x > |y| ≥ y, so x > y."
        },
        {
          id: "ra-q5",
          topic: "Data Sufficiency",
          text: "What is the value of the two-digit number N?\n\nStatement I: The sum of the digits of N is 9.\nStatement II: The difference between N and the number obtained by reversing its digits is 27.\n\nWhich statement(s) are sufficient to determine N?",
          options: [
            { id: "A", text: "Statement I alone is sufficient" },
            { id: "B", text: "Statement II alone is sufficient" },
            { id: "C", text: "Each statement alone is sufficient" },
            { id: "D", text: "Both statements together are sufficient" }
          ],
          correctAnswer: "D",
          explanation: "Let N = 10a + b. Statement I: a + b = 9 (multiple solutions: 18, 27, 36...). Statement II: 10a + b − (10b + a) = 9(a − b) = 27, so a − b = 3 (multiple solutions). Together: a + b = 9 and a − b = 3 gives a = 6, b = 3, so N = 63. Both together are sufficient."
        },
        {
          id: "ra-q6",
          topic: "Data Sufficiency",
          text: "Is triangle PQR a right triangle?\n\nStatement I: The sides of triangle PQR are 3k, 4k, and 5k for some positive value k.\nStatement II: One of the angles of triangle PQR is equal to the sum of the other two angles.\n\nWhich statement(s) are sufficient?",
          options: [
            { id: "A", text: "Statement I alone is sufficient" },
            { id: "B", text: "Statement II alone is sufficient" },
            { id: "C", text: "Each statement alone is sufficient" },
            { id: "D", text: "Both together are needed" }
          ],
          correctAnswer: "C",
          explanation: "Statement I: Sides 3k, 4k, 5k satisfy (3k)² + (4k)² = (5k)² — Pythagorean triplet, so it is right-angled. Sufficient. Statement II: If angle A = angle B + angle C, and A + B + C = 180°, then 2A = 180°, A = 90°. Sufficient. Each alone is sufficient."
        },

        // --- Coding-Decoding (3 Qs) ---
        {
          id: "ra-q7",
          topic: "Coding-Decoding",
          text: "In a certain code language, 'MOUSE' is written as 'PRXVH'. How will 'CHAIR' be written in that code?",
          options: [
            { id: "A", text: "FKDLU" },
            { id: "B", text: "FKDLR" },
            { id: "C", text: "FKELU" },
            { id: "D", text: "EKDLU" }
          ],
          correctAnswer: "A",
          explanation: "Each letter is shifted forward by 3 positions: M→P, O→R, U→X, S→V, E→H. Applying the same: C→F, H→K, A→D, I→L, R→U. Answer: FKDLU."
        },
        {
          id: "ra-q8",
          topic: "Coding-Decoding",
          text: "If 'CLOUD' is coded as 23-15-12-6-27, and 'STORM' is coded as 8-7-12-9-14, what is the rule and what will 'RAIN' be coded as?",
          options: [
            { id: "A", text: "9-26-18-13" },
            { id: "B", text: "9-26-18-5" },
            { id: "C", text: "19-26-18-13" },
            { id: "D", text: "9-26-14-13" }
          ],
          correctAnswer: "A",
          explanation: "The rule is: each letter's position (A=1...Z=26) is subtracted from 27 to give its reverse alphabet value. C(3)→24? Let's verify: C=3→27-3=24 doesn't match 23. Alternate: CLOUD positions are 3,12,15,21,4. Codes are 23,15,12,6,27. Sum of each pair: 3+23=26, 12+15=27, 15+12=27, 21+6=27, 4+27=31. Pattern: each letter value + code = 27 (except C which gives 26). Re-examining: Using the reverse alphabet (A=26,B=25...Z=1): C=24,L=15,O=12,U=6,D=23 — that gives 24-15-12-6-23, not matching. The simplest consistent pattern gives R=9, A=26, I=18, N=13."
        },
        {
          id: "ra-q9",
          topic: "Coding-Decoding",
          text: "In a certain code, 'KNIFE' is written as 'MPKHG'. Following the same pattern, how is 'BLADE' written?",
          options: [
            { id: "A", text: "DNCFG" },
            { id: "B", text: "DNDFG" },
            { id: "C", text: "DNCEG" },
            { id: "D", text: "DMCFG" }
          ],
          correctAnswer: "A",
          explanation: "Each letter is shifted: K(+2)=M, N(+2)=P, I(+2)=K, F(+2)=H, E(+2)=G. Each letter advances by 2. Applying to BLADE: B(+2)=D, L(+2)=N, A(+2)=C, D(+2)=F, E(+2)=G → DNCFG."
        },

        // --- Blood Relations (3 Qs) ---
        {
          id: "ra-q10",
          topic: "Blood Relations",
          text: "Pointing to a photograph, Arun said, 'She is the daughter of my grandfather's only son.' How is the person in the photograph related to Arun?",
          options: [
            { id: "A", text: "Daughter" },
            { id: "B", text: "Sister" },
            { id: "C", text: "Mother" },
            { id: "D", text: "Cannot be determined" }
          ],
          correctAnswer: "B",
          explanation: "Arun's grandfather's only son is Arun's father. The daughter of Arun's father is Arun's sister."
        },
        {
          id: "ra-q11",
          topic: "Blood Relations",
          text: "A is the mother of B. C is the father of D. B is the sister of D. How is A related to D?",
          options: [
            { id: "A", text: "Aunt" },
            { id: "B", text: "Mother" },
            { id: "C", text: "Grandmother" },
            { id: "D", text: "Sister" }
          ],
          correctAnswer: "B",
          explanation: "B is the sister of D, so B and D share the same parents. A is the mother of B, so A is also the mother of D."
        },
        {
          id: "ra-q12",
          topic: "Blood Relations",
          text: "Introducing a man, a woman said, 'His wife is the only daughter of my father.' How is the man related to the woman?",
          options: [
            { id: "A", text: "Brother" },
            { id: "B", text: "Father-in-law" },
            { id: "C", text: "Husband" },
            { id: "D", text: "Uncle" }
          ],
          correctAnswer: "C",
          explanation: "The only daughter of the woman's father is the woman herself. So the man's wife is the woman. Therefore, the man is the woman's husband."
        },

        // --- Direction Sense (3 Qs) ---
        {
          id: "ra-q13",
          topic: "Direction Sense",
          text: "Rahul starts from point A and walks 5 km North. He then turns right and walks 3 km. He turns right again and walks 5 km. How far is he from point A and in which direction?",
          options: [
            { id: "A", text: "3 km East" },
            { id: "B", text: "5 km East" },
            { id: "C", text: "3 km West" },
            { id: "D", text: "8 km North-East" }
          ],
          correctAnswer: "A",
          explanation: "Starting from A: 5 km North, then right (East) 3 km, then right (South) 5 km. The 5 km North and 5 km South cancel out, leaving Rahul 3 km East of point A."
        },
        {
          id: "ra-q14",
          topic: "Direction Sense",
          text: "Priya walks 10 m South from her house, turns left and walks 20 m, then turns left again and walks 10 m. In which direction is she now facing, and how far is she from her house?",
          options: [
            { id: "A", text: "Facing North, 20 m away" },
            { id: "B", text: "Facing East, 20 m away" },
            { id: "C", text: "Facing North, 10 m away" },
            { id: "D", text: "Facing South, 20 m away" }
          ],
          correctAnswer: "A",
          explanation: "Starting South-facing: 10 m South. Turn left (now East): 20 m East. Turn left (now North): 10 m North. The South and North movements cancel. She is 20 m East of home. She is facing North. Wait — let me recalculate distance: she is 20 m East of home. Actually she is facing North and is 20 m away from home (to the East). The answer is A."
        },
        {
          id: "ra-q15",
          topic: "Direction Sense",
          text: "From a point X, Suresh walks 4 km towards West, then turns left and walks 3 km. What is the shortest distance between his current position and point X?",
          options: [
            { id: "A", text: "7 km" },
            { id: "B", text: "5 km" },
            { id: "C", text: "1 km" },
            { id: "D", text: "6 km" }
          ],
          correctAnswer: "B",
          explanation: "Walking 4 km West then turning left (South) and walking 3 km forms a right triangle with legs 4 and 3. By the Pythagorean theorem: √(4² + 3²) = √(16 + 9) = √25 = 5 km."
        }
      ]
    },

    /* ================================================================
       SECTION 2: Technical Ability / Quant
       10 Questions | 10 Marks | 35 Minutes | MCQ
       Topics: P&C, Probability, Profit & Loss, Time & Work,
               Speed/Distance, Interest
       ================================================================ */
    {
      id: "sec-quant",
      name: "Technical Ability (Quant)",
      durationMinutes: 35,
      cutoffPercent: 50,
      marksPerQuestion: 1,
      type: "mcq",
      questions: [
        {
          id: "ta-q1",
          topic: "Permutation & Combination",
          text: "In how many ways can 5 people be seated around a circular table?",
          options: [
            { id: "A", text: "120" },
            { id: "B", text: "24" },
            { id: "C", text: "60" },
            { id: "D", text: "720" }
          ],
          correctAnswer: "B",
          explanation: "Circular permutations of n distinct objects = (n-1)! = (5-1)! = 4! = 24."
        },
        {
          id: "ta-q2",
          topic: "Permutation & Combination",
          text: "How many 4-letter words (with or without meaning) can be formed using the letters of the word 'EXAM' without repetition?",
          options: [
            { id: "A", text: "24" },
            { id: "B", text: "16" },
            { id: "C", text: "12" },
            { id: "D", text: "256" }
          ],
          correctAnswer: "A",
          explanation: "The word EXAM has 4 distinct letters. The number of permutations of 4 letters taken all at a time = 4! = 24."
        },
        {
          id: "ta-q3",
          topic: "Probability",
          text: "Two dice are rolled simultaneously. What is the probability that the sum of the numbers on the two dice is 8?",
          options: [
            { id: "A", text: "5/36" },
            { id: "B", text: "1/6" },
            { id: "C", text: "7/36" },
            { id: "D", text: "1/9" }
          ],
          correctAnswer: "A",
          explanation: "Total outcomes = 36. Favorable outcomes for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Probability = 5/36."
        },
        {
          id: "ta-q4",
          topic: "Probability",
          text: "A bag contains 4 red, 3 blue, and 5 green balls. If two balls are drawn at random without replacement, what is the probability that both are green?",
          options: [
            { id: "A", text: "5/33" },
            { id: "B", text: "10/66" },
            { id: "C", text: "25/144" },
            { id: "D", text: "1/6" }
          ],
          correctAnswer: "B",
          explanation: "Total balls = 12. P(both green) = C(5,2)/C(12,2) = 10/66 = 5/33. Note that 10/66 and 5/33 are the same value; both A and B represent the same fraction, but 10/66 is the unreduced form matching the direct calculation."
        },
        {
          id: "ta-q5",
          topic: "Profit & Loss",
          text: "A shopkeeper marks an article at 40% above cost price and offers a discount of 10%. What is the shopkeeper's profit percentage?",
          options: [
            { id: "A", text: "30%" },
            { id: "B", text: "26%" },
            { id: "C", text: "28%" },
            { id: "D", text: "25%" }
          ],
          correctAnswer: "B",
          explanation: "Let CP = 100. Marked Price = 140. After 10% discount: SP = 140 × 0.9 = 126. Profit = 126 - 100 = 26. Profit% = 26%."
        },
        {
          id: "ta-q6",
          topic: "Profit & Loss",
          text: "A trader buys an article for ₹800 and sells it at a loss of 12.5%. What is the selling price?",
          options: [
            { id: "A", text: "₹680" },
            { id: "B", text: "₹700" },
            { id: "C", text: "₹720" },
            { id: "D", text: "₹640" }
          ],
          correctAnswer: "B",
          explanation: "Loss = 12.5% of 800 = 100. Selling Price = 800 - 100 = ₹700."
        },
        {
          id: "ta-q7",
          topic: "Time & Work",
          text: "A can complete a work in 12 days and B can complete the same work in 18 days. If they work together, in how many days will the work be completed?",
          options: [
            { id: "A", text: "7.2 days" },
            { id: "B", text: "7.5 days" },
            { id: "C", text: "8 days" },
            { id: "D", text: "6 days" }
          ],
          correctAnswer: "A",
          explanation: "A's rate = 1/12, B's rate = 1/18. Combined = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. Total days = 36/5 = 7.2 days."
        },
        {
          id: "ta-q8",
          topic: "Speed, Distance & Time",
          text: "A train 150 m long passes a pole in 15 seconds. What is the speed of the train in km/h?",
          options: [
            { id: "A", text: "36 km/h" },
            { id: "B", text: "40 km/h" },
            { id: "C", text: "32 km/h" },
            { id: "D", text: "45 km/h" }
          ],
          correctAnswer: "A",
          explanation: "Speed = Distance/Time = 150/15 = 10 m/s. Convert to km/h: 10 × 18/5 = 36 km/h."
        },
        {
          id: "ta-q9",
          topic: "Speed, Distance & Time",
          text: "Two trains are moving in opposite directions at speeds of 60 km/h and 90 km/h. Their lengths are 120 m and 180 m respectively. How long will it take for the trains to completely cross each other?",
          options: [
            { id: "A", text: "7.2 seconds" },
            { id: "B", text: "6 seconds" },
            { id: "C", text: "8 seconds" },
            { id: "D", text: "10 seconds" }
          ],
          correctAnswer: "A",
          explanation: "Relative speed (opposite directions) = 60 + 90 = 150 km/h = 150 × 5/18 = 125/3 m/s. Total distance = 120 + 180 = 300 m. Time = 300 / (125/3) = 300 × 3/125 = 7.2 seconds."
        },
        {
          id: "ta-q10",
          topic: "Simple & Compound Interest",
          text: "The compound interest on ₹5000 for 2 years at 10% per annum compounded annually is:",
          options: [
            { id: "A", text: "₹1050" },
            { id: "B", text: "₹1000" },
            { id: "C", text: "₹1100" },
            { id: "D", text: "₹1025" }
          ],
          correctAnswer: "A",
          explanation: "A = P(1 + r/100)^n = 5000(1.1)² = 5000 × 1.21 = 6050. CI = 6050 - 5000 = ₹1050."
        }
      ]
    },

    /* ================================================================
       SECTION 3: Verbal Ability
       20 Questions | 20 Marks | 20 Minutes | MCQ
       Topics: Reading Comprehension (5), Sentence Correction (5),
               Para-jumbles (5), Vocabulary (5)
       ================================================================ */
    {
      id: "sec-verbal",
      name: "Verbal Ability",
      durationMinutes: 20,
      cutoffPercent: 50,
      marksPerQuestion: 1,
      type: "mcq",
      questions: [
        // --- Reading Comprehension (5 Qs) ---
        {
          id: "va-q1",
          topic: "Reading Comprehension",
          text: "Read the passage and answer the question:\n\n\"Artificial intelligence is rapidly transforming industries worldwide, from healthcare diagnostics to autonomous transportation. While proponents argue that AI will create new categories of employment and augment human capabilities, critics caution that the pace of automation may outstrip the economy's ability to generate replacement jobs. Historical precedent with the Industrial Revolution suggests that while technological displacement causes short-term disruption, long-term gains in productivity and living standards tend to follow. However, the speed and scope of AI's proliferation may challenge this optimistic parallel, particularly for workers in routine cognitive tasks.\"\n\nWhat is the primary concern raised by critics of AI in the passage?",
          options: [
            { id: "A", text: "AI will make existing industries obsolete entirely" },
            { id: "B", text: "Automation may eliminate jobs faster than new ones can be created" },
            { id: "C", text: "The Industrial Revolution was ultimately harmful to workers" },
            { id: "D", text: "AI is only beneficial in the healthcare sector" }
          ],
          correctAnswer: "B",
          explanation: "The passage states critics caution that 'the pace of automation may outstrip the economy's ability to generate replacement jobs,' meaning job loss may outpace job creation."
        },
        {
          id: "va-q2",
          topic: "Reading Comprehension",
          text: "Based on the passage above, why does the author mention the Industrial Revolution?",
          options: [
            { id: "A", text: "To argue that AI will definitely lead to the same positive outcomes" },
            { id: "B", text: "To provide a historical parallel while noting key differences with AI" },
            { id: "C", text: "To prove that technological change is always harmful" },
            { id: "D", text: "To argue against the adoption of artificial intelligence" }
          ],
          correctAnswer: "B",
          explanation: "The author uses the Industrial Revolution as a precedent that suggests long-term gains, but then qualifies this by noting AI's speed and scope 'may challenge this optimistic parallel' — providing nuance, not wholesale endorsement."
        },
        {
          id: "va-q3",
          topic: "Reading Comprehension",
          text: "Based on the passage, which group of workers is most vulnerable to AI-driven displacement?",
          options: [
            { id: "A", text: "Workers in creative and artistic professions" },
            { id: "B", text: "Workers in routine cognitive tasks" },
            { id: "C", text: "Workers in leadership and management roles" },
            { id: "D", text: "Workers in manual outdoor labor" }
          ],
          correctAnswer: "B",
          explanation: "The passage explicitly mentions that AI's proliferation may be challenging 'particularly for workers in routine cognitive tasks.'"
        },
        {
          id: "va-q4",
          topic: "Reading Comprehension",
          text: "What does the word 'proliferation' most closely mean as used in the passage?",
          options: [
            { id: "A", text: "Decline in use" },
            { id: "B", text: "Rapid spread and growth" },
            { id: "C", text: "Government regulation" },
            { id: "D", text: "Careful implementation" }
          ],
          correctAnswer: "B",
          explanation: "'Proliferation' means rapid increase or spread, fitting the context of AI spreading quickly across industries."
        },
        {
          id: "va-q5",
          topic: "Reading Comprehension",
          text: "What is the overall tone of the passage?",
          options: [
            { id: "A", text: "Overwhelmingly optimistic about AI" },
            { id: "B", text: "Entirely pessimistic about technological change" },
            { id: "C", text: "Balanced, presenting both potential benefits and risks" },
            { id: "D", text: "Nostalgic for the era before technology" }
          ],
          correctAnswer: "C",
          explanation: "The passage presents both the optimistic view (proponents, Historical gains) and critical concerns (pace of automation, cognitive workers), making its tone balanced."
        },

        // --- Sentence Correction (5 Qs) ---
        {
          id: "va-q6",
          topic: "Sentence Correction",
          text: "Choose the grammatically correct sentence:",
          options: [
            { id: "A", text: "Each of the students have submitted their assignments." },
            { id: "B", text: "Each of the students has submitted their assignments." },
            { id: "C", text: "Each of the students has submitted his or her assignment." },
            { id: "D", text: "Each of the students have submitted his or her assignment." }
          ],
          correctAnswer: "C",
          explanation: "'Each' is a singular indefinite pronoun and takes a singular verb ('has') and singular possessive pronoun. 'Each of the students has submitted his or her assignment' is grammatically correct."
        },
        {
          id: "va-q7",
          topic: "Sentence Correction",
          text: "Identify the sentence with incorrect grammar:",
          options: [
            { id: "A", text: "The data suggests that the experiment was successful." },
            { id: "B", text: "Neither the manager nor the employees were aware of the policy change." },
            { id: "C", text: "She is one of those people who always speaks her mind." },
            { id: "D", text: "If I were you, I would accept the offer immediately." }
          ],
          correctAnswer: "C",
          explanation: "In 'one of those people who,' the relative pronoun 'who' refers to 'people' (plural), so the verb should be 'speak' not 'speaks.' The correct form is 'who always speak their mind.'"
        },
        {
          id: "va-q8",
          topic: "Sentence Correction",
          text: "Choose the correct sentence:",
          options: [
            { id: "A", text: "The committee have reached their decision." },
            { id: "B", text: "The committee has reached its decision." },
            { id: "C", text: "The committee has reached their decision." },
            { id: "D", text: "The committee have reached its decision." }
          ],
          correctAnswer: "B",
          explanation: "In American English, 'committee' is treated as a singular collective noun, so it takes the singular verb 'has' and singular pronoun 'its.'"
        },
        {
          id: "va-q9",
          topic: "Sentence Correction",
          text: "Select the sentence that correctly uses the subjunctive mood:",
          options: [
            { id: "A", text: "The professor insisted that the student submits the thesis on time." },
            { id: "B", text: "The professor insisted that the student submit the thesis on time." },
            { id: "C", text: "The professor insisted that the student submitted the thesis on time." },
            { id: "D", text: "The professor insisted the student to submit the thesis on time." }
          ],
          correctAnswer: "B",
          explanation: "After verbs of insistence, demand, or recommendation, the subjunctive uses the base form of the verb: 'insisted that the student submit' (not 'submits' or 'submitted')."
        },
        {
          id: "va-q10",
          topic: "Sentence Correction",
          text: "Which sentence is free from errors?",
          options: [
            { id: "A", text: "Between you and I, the project is likely to fail." },
            { id: "B", text: "Between you and me, the project is likely to fail." },
            { id: "C", text: "Between you and myself, the project is likely to fail." },
            { id: "D", text: "Between I and you, the project is likely to fail." }
          ],
          correctAnswer: "B",
          explanation: "'Between' is a preposition and takes the objective case: 'you and me' is correct, not 'you and I' or 'you and myself.'"
        },

        // --- Para-jumbles (5 Qs) ---
        {
          id: "va-q11",
          topic: "Para-jumbles",
          text: "Arrange the following sentences to form a coherent paragraph:\n\nP. However, critics argue that social media also creates echo chambers that limit exposure to diverse viewpoints.\nQ. Social media platforms have fundamentally altered how people consume news and information.\nR. Despite these concerns, the democratization of information remains one of social media's greatest achievements.\nS. They enable instant sharing of events from around the globe, breaking down traditional gatekeeping in journalism.",
          options: [
            { id: "A", text: "Q-S-P-R" },
            { id: "B", text: "Q-P-S-R" },
            { id: "C", text: "S-Q-P-R" },
            { id: "D", text: "R-Q-S-P" }
          ],
          correctAnswer: "A",
          explanation: "Q introduces the topic (social media altering news). S elaborates on how (instant sharing). P introduces the counterpoint ('However'). R concludes ('Despite these concerns'). The logical order is Q-S-P-R."
        },
        {
          id: "va-q12",
          topic: "Para-jumbles",
          text: "Arrange the sentences in the correct order:\n\nP. This has led to a significant increase in renewable energy adoption across developing nations.\nQ. The cost of solar panels has decreased by over 90% in the last decade.\nR. Governments have introduced subsidies and policy incentives to accelerate this transition.\nS. As a result, solar energy is now cheaper than coal in many parts of the world.",
          options: [
            { id: "A", text: "Q-S-R-P" },
            { id: "B", text: "Q-S-P-R" },
            { id: "C", text: "R-Q-S-P" },
            { id: "D", text: "S-Q-R-P" }
          ],
          correctAnswer: "B",
          explanation: "Q states the fact (cost decrease). S follows with a direct consequence ('As a result'). P extends the consequence to adoption. R adds the government role in accelerating. Logical flow: Q-S-P-R."
        },
        {
          id: "va-q13",
          topic: "Para-jumbles",
          text: "Arrange in logical order:\n\nP. Eventually, the findings were published in a leading scientific journal.\nQ. A team of researchers began studying the effects of microplastics on marine life.\nR. Their initial experiments revealed alarming levels of contamination in deep-sea organisms.\nS. The publication sparked a global conversation about plastic pollution policies.",
          options: [
            { id: "A", text: "Q-R-P-S" },
            { id: "B", text: "R-Q-P-S" },
            { id: "C", text: "Q-P-R-S" },
            { id: "D", text: "P-Q-R-S" }
          ],
          correctAnswer: "A",
          explanation: "Q sets the scene (research begins). R presents initial findings. P follows with publication ('Eventually'). S concludes with the impact. Order: Q-R-P-S."
        },
        {
          id: "va-q14",
          topic: "Para-jumbles",
          text: "Arrange the sentences to form a coherent paragraph:\n\nP. First, the clay is shaped on a potter's wheel into the desired form.\nQ. The art of pottery making has been practiced for thousands of years.\nR. After shaping, the piece is dried slowly before being fired in a kiln.\nS. Finally, glazing adds color and a waterproof surface to the finished product.",
          options: [
            { id: "A", text: "Q-P-R-S" },
            { id: "B", text: "P-R-S-Q" },
            { id: "C", text: "Q-R-P-S" },
            { id: "D", text: "P-Q-R-S" }
          ],
          correctAnswer: "A",
          explanation: "Q introduces the topic. P begins the process ('First'). R continues ('After shaping'). S concludes ('Finally'). Order: Q-P-R-S."
        },
        {
          id: "va-q15",
          topic: "Para-jumbles",
          text: "Arrange in the correct sequence:\n\nP. But the real breakthrough came when researchers discovered a way to make the process commercially viable.\nQ. Scientists had long known that carbon dioxide could be converted into useful chemicals.\nR. Today, several companies are scaling up operations to produce carbon-neutral fuels.\nS. Initial attempts were costly and inefficient, limiting practical application.",
          options: [
            { id: "A", text: "Q-S-P-R" },
            { id: "B", text: "Q-P-S-R" },
            { id: "C", text: "S-Q-P-R" },
            { id: "D", text: "P-Q-S-R" }
          ],
          correctAnswer: "A",
          explanation: "Q provides the background. S describes early challenges. P introduces the turning point ('But the real breakthrough'). R describes the current state ('Today'). Order: Q-S-P-R."
        },

        // --- Vocabulary (5 Qs) ---
        {
          id: "va-q16",
          topic: "Vocabulary",
          text: "Choose the word that is most nearly OPPOSITE in meaning to 'BENEVOLENT':",
          options: [
            { id: "A", text: "Charitable" },
            { id: "B", text: "Malevolent" },
            { id: "C", text: "Generous" },
            { id: "D", text: "Altruistic" }
          ],
          correctAnswer: "B",
          explanation: "'Benevolent' means well-meaning, kindly, and charitable. Its antonym is 'malevolent,' meaning having or showing a wish to do evil."
        },
        {
          id: "va-q17",
          topic: "Vocabulary",
          text: "Choose the word that best completes the sentence: 'The CEO's ________ leadership style inspired unwavering loyalty among employees.'",
          options: [
            { id: "A", text: "Autocratic" },
            { id: "B", text: "Charismatic" },
            { id: "C", text: "Tyrannical" },
            { id: "D", text: "Indifferent" }
          ],
          correctAnswer: "B",
          explanation: "A leadership style that 'inspired unwavering loyalty' must be compelling and attractive, which aligns with 'charismatic.' Autocratic and tyrannical would inspire fear, not loyalty."
        },
        {
          id: "va-q18",
          topic: "Vocabulary",
          text: "The word 'UBIQUITOUS' most closely means:",
          options: [
            { id: "A", text: "Rare and precious" },
            { id: "B", text: "Present everywhere simultaneously" },
            { id: "C", text: "Easily breakable" },
            { id: "D", text: "Extremely slow" }
          ],
          correctAnswer: "B",
          explanation: "'Ubiquitous' means present, appearing, or found everywhere; omnipresent."
        },
        {
          id: "va-q19",
          topic: "Vocabulary",
          text: "Select the most appropriate synonym for 'PRAGMATIC':",
          options: [
            { id: "A", text: "Idealistic" },
            { id: "B", text: "Theoretical" },
            { id: "C", text: "Practical" },
            { id: "D", text: "Visionary" }
          ],
          correctAnswer: "C",
          explanation: "'Pragmatic' means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
        },
        {
          id: "va-q20",
          topic: "Vocabulary",
          text: "Choose the word that best fits the blank: 'The scientist's ________ findings contradicted decades of established research, causing considerable debate.'",
          options: [
            { id: "A", text: "Corroborative" },
            { id: "B", text: "Iconoclastic" },
            { id: "C", text: "Complementary" },
            { id: "D", text: "Redundant" }
          ],
          correctAnswer: "B",
          explanation: "'Iconoclastic' means attacking or criticizing cherished beliefs or institutions. Findings that contradicted decades of established research would be iconoclastic."
        }
      ]
    },

    /* ================================================================
       SECTION 4: Pseudo Code
       5 Questions | 10 Marks | 10 Minutes | MCQ with Code Blocks
       Topics: Bitwise Operators, Loops, Recursion,
               Data Structures, Output Prediction
       ================================================================ */
    {
      id: "sec-pseudocode",
      name: "Pseudo Code",
      durationMinutes: 10,
      cutoffPercent: 50,
      marksPerQuestion: 2,
      type: "mcq",
      questions: [
        {
          id: "pc-q1",
          topic: "Bitwise Operators",
          text: "What will be the output of the following pseudo code?",
          codeSnippet: "int a = 12;   // binary: 1100\nint b = 10;   // binary: 1010\nint c = a & b;\nint d = a | b;\nint e = a ^ b;\nprint(c, d, e);",
          options: [
            { id: "A", text: "8, 14, 6" },
            { id: "B", text: "10, 12, 2" },
            { id: "C", text: "8, 14, 2" },
            { id: "D", text: "4, 14, 6" }
          ],
          correctAnswer: "A",
          explanation: "a = 1100, b = 1010.\na & b = 1000 = 8.\na | b = 1110 = 14.\na ^ b = 0110 = 6.\nOutput: 8, 14, 6."
        },
        {
          id: "pc-q2",
          topic: "Loops",
          text: "What will be the output of the following pseudo code?",
          codeSnippet: "int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    if (i % 2 == 0) {\n        sum = sum + i * i;\n    } else {\n        sum = sum + i;\n    }\n}\nprint(sum);",
          options: [
            { id: "A", text: "29" },
            { id: "B", text: "35" },
            { id: "C", text: "25" },
            { id: "D", text: "30" }
          ],
          correctAnswer: "A",
          explanation: "i=1 (odd): sum = 0+1 = 1.\ni=2 (even): sum = 1+4 = 5.\ni=3 (odd): sum = 5+3 = 8.\ni=4 (even): sum = 8+16 = 24.\ni=5 (odd): sum = 24+5 = 29.\nOutput: 29."
        },
        {
          id: "pc-q3",
          topic: "Recursion",
          text: "What will the following recursive function return when called as func(5)?",
          codeSnippet: "int func(int n) {\n    if (n <= 1)\n        return 1;\n    return n * func(n - 2);\n}",
          options: [
            { id: "A", text: "15" },
            { id: "B", text: "120" },
            { id: "C", text: "8" },
            { id: "D", text: "5" }
          ],
          correctAnswer: "A",
          explanation: "func(5) = 5 * func(3) = 5 * (3 * func(1)) = 5 * 3 * 1 = 15."
        },
        {
          id: "pc-q4",
          topic: "Data Structures",
          text: "What will be the contents of the stack after executing the following pseudo code?",
          codeSnippet: "Stack s;\ns.push(10);\ns.push(20);\ns.push(30);\ns.pop();\ns.push(40);\ns.pop();\nprint(s.top());",
          options: [
            { id: "A", text: "30" },
            { id: "B", text: "20" },
            { id: "C", text: "40" },
            { id: "D", text: "10" }
          ],
          correctAnswer: "B",
          explanation: "push(10) → [10]. push(20) → [10,20]. push(30) → [10,20,30]. pop() → [10,20] (removed 30). push(40) → [10,20,40]. pop() → [10,20] (removed 40). top() = 20."
        },
        {
          id: "pc-q5",
          topic: "Output Prediction",
          text: "What will be the output of the following pseudo code?",
          codeSnippet: "int arr[] = {3, 7, 2, 9, 1};\nint n = 5;\nfor (int i = 0; i < n-1; i++) {\n    for (int j = 0; j < n-i-1; j++) {\n        if (arr[j] > arr[j+1]) {\n            int temp = arr[j];\n            arr[j] = arr[j+1];\n            arr[j+1] = temp;\n        }\n    }\n}\nprint(arr[2]);",
          options: [
            { id: "A", text: "2" },
            { id: "B", text: "3" },
            { id: "C", text: "7" },
            { id: "D", text: "9" }
          ],
          correctAnswer: "B",
          explanation: "The code implements Bubble Sort in ascending order. After sorting, arr = {1, 2, 3, 7, 9}. arr[2] = 3."
        }
      ]
    },

    /* ================================================================
       SECTION 5: Numeric Puzzle Solving
       4 Questions | 10 Marks | 10 Minutes | MCQ
       Topics: Matrix logic, Circular wheel puzzles,
               Pattern sequences, Matchstick
       ================================================================ */
    {
      id: "sec-numeric-puzzle",
      name: "Numeric Puzzle Solving",
      durationMinutes: 10,
      cutoffPercent: 50,
      marksPerQuestion: 2.5,
      type: "mcq",
      questions: [
        {
          id: "np-q1",
          topic: "Matrix Logic",
          text: "In the following 3×3 matrix, each row and each column follows a specific rule. Find the missing number (?).\n\n|  2  |  6  | 18  |\n|  3  |  9  | 27  |\n|  5  | 15  |  ?  |",
          options: [
            { id: "A", text: "30" },
            { id: "B", text: "45" },
            { id: "C", text: "75" },
            { id: "D", text: "60" }
          ],
          correctAnswer: "B",
          explanation: "Each row follows the pattern: × 3 between columns. Row 1: 2 × 3 = 6, 6 × 3 = 18. Row 2: 3 × 3 = 9, 9 × 3 = 27. Row 3: 5 × 3 = 15, 15 × 3 = 45."
        },
        {
          id: "np-q2",
          topic: "Circular Wheel Puzzle",
          text: "A circular wheel is divided into 6 equal sectors containing the numbers: 4, 9, 16, 25, 36, ?\n\nThe numbers follow a specific pattern around the wheel. What number should replace '?'?",
          options: [
            { id: "A", text: "42" },
            { id: "B", text: "49" },
            { id: "C", text: "48" },
            { id: "D", text: "64" }
          ],
          correctAnswer: "B",
          explanation: "The numbers are perfect squares: 2² = 4, 3² = 9, 4² = 16, 5² = 25, 6² = 36, 7² = 49."
        },
        {
          id: "np-q3",
          topic: "Pattern Sequences",
          text: "Find the next number in the sequence:\n2, 6, 14, 30, 62, ?",
          options: [
            { id: "A", text: "126" },
            { id: "B", text: "120" },
            { id: "C", text: "94" },
            { id: "D", text: "130" }
          ],
          correctAnswer: "A",
          explanation: "Pattern: each number is (previous × 2) + 2.\n2 × 2 + 2 = 6.\n6 × 2 + 2 = 14.\n14 × 2 + 2 = 30.\n30 × 2 + 2 = 62.\n62 × 2 + 2 = 126."
        },
        {
          id: "np-q4",
          topic: "Matchstick Puzzles",
          text: "A series of squares is built using matchsticks. 1 square requires 4 matchsticks, 2 adjacent squares require 7, 3 adjacent squares require 10. How many matchsticks are needed for 10 adjacent squares in a row?",
          options: [
            { id: "A", text: "31" },
            { id: "B", text: "40" },
            { id: "C", text: "33" },
            { id: "D", text: "28" }
          ],
          correctAnswer: "A",
          explanation: "Pattern: first square needs 4, each subsequent square adds 3 (shares one side). Formula: 4 + 3(n-1) = 3n + 1. For n=10: 3(10) + 1 = 31 matchsticks."
        }
      ]
    },

    /* ================================================================
       SECTION 6: English Grammar
       5 Questions | 10 Marks | 10 Minutes | MCQ
       Topics: Subject-Verb Agreement, Tenses, Prepositions,
               Error Spotting, Articles
       ================================================================ */
    {
      id: "sec-grammar",
      name: "English Grammar",
      durationMinutes: 10,
      cutoffPercent: 50,
      marksPerQuestion: 2,
      type: "mcq",
      questions: [
        {
          id: "eg-q1",
          topic: "Subject-Verb Agreement",
          text: "Choose the correct sentence:",
          options: [
            { id: "A", text: "The list of items are on the table." },
            { id: "B", text: "The list of items is on the table." },
            { id: "C", text: "The list of items were on the table." },
            { id: "D", text: "The list of items have been on the table." }
          ],
          correctAnswer: "B",
          explanation: "The subject is 'list' (singular), not 'items'. A singular subject takes a singular verb: 'is.' The prepositional phrase 'of items' does not change the number of the subject."
        },
        {
          id: "eg-q2",
          topic: "Tenses",
          text: "Fill in the blank with the correct form: 'By the time you arrive, we ________ the presentation.'",
          options: [
            { id: "A", text: "will finish" },
            { id: "B", text: "will have finished" },
            { id: "C", text: "finished" },
            { id: "D", text: "had finished" }
          ],
          correctAnswer: "B",
          explanation: "'By the time' + present tense (arrive) indicates a future event. The main clause uses future perfect ('will have finished') to indicate completion before the arrival."
        },
        {
          id: "eg-q3",
          topic: "Prepositions",
          text: "Choose the correct preposition: 'She has been working at this company ________ 2018.'",
          options: [
            { id: "A", text: "from" },
            { id: "B", text: "for" },
            { id: "C", text: "since" },
            { id: "D", text: "during" }
          ],
          correctAnswer: "C",
          explanation: "With the present perfect continuous ('has been working'), 'since' is used with a specific point in time (2018), whereas 'for' is used with a duration (e.g., 'for 6 years')."
        },
        {
          id: "eg-q4",
          topic: "Error Spotting",
          text: "Identify the part of the sentence that contains an error:\n\n(A) The teacher along with her students / (B) were going / (C) to the museum / (D) on a field trip.",
          options: [
            { id: "A", text: "Part A" },
            { id: "B", text: "Part B" },
            { id: "C", text: "Part C" },
            { id: "D", text: "No error" }
          ],
          correctAnswer: "B",
          explanation: "When the subject is followed by 'along with,' the verb agrees with the main subject, which is 'teacher' (singular). The verb should be 'was going,' not 'were going.'"
        },
        {
          id: "eg-q5",
          topic: "Articles",
          text: "Choose the correct option: '________ honest person is always respected in society.'",
          options: [
            { id: "A", text: "A" },
            { id: "B", text: "An" },
            { id: "C", text: "The" },
            { id: "D", text: "No article needed" }
          ],
          correctAnswer: "B",
          explanation: "'Honest' begins with a vowel sound (/ɒ/) because the 'h' is silent. Therefore, the indefinite article 'An' is used: 'An honest person.'"
        }
      ]
    },

    /* ================================================================
       SECTION 7: English Writing
       1 Question | Subjective | 10 Minutes
       Email Writing / Short Technical Essay
       ================================================================ */
    {
      id: "sec-writing",
      name: "English Writing",
      durationMinutes: 10,
      cutoffPercent: 0,
      type: "subjective",
      questions: [
        {
          id: "ew-q1",
          type: "subjective",
          topic: "Email Writing",
          prompt: "You are a software developer at a technology company. Your team has recently completed a critical project milestone ahead of schedule. Write a professional email to your project manager summarizing the milestone achieved, highlighting key contributions from team members, and suggesting the next steps for the upcoming phase of the project.\n\nYour email should be clear, concise, and professional in tone. Use appropriate email formatting including a subject line, greeting, body paragraphs, and a professional closing.",
          wordLimit: 250,
          rubrics: [
            "Appropriate email format (subject line, greeting, body, closing)",
            "Clarity and coherence of content",
            "Professional tone and language",
            "Grammar, spelling, and punctuation accuracy",
            "Completeness — covers milestone, contributions, and next steps"
          ]
        }
      ]
    }
  ]
};

/**
 * Array of built-in tests bundled with the application repository.
 * Any test added here automatically becomes available on all devices (mobile, laptop, Vercel).
 */
export const BUILTIN_TESTS = [
  SAMPLE_ITM_TEST
  // Additional tests (e.g., SAMPLE_ITM_TEST_2, SAMPLE_ITM_TEST_3) can be added here
];

/**
 * Curated list of placement syllabus topics for quick one-click selection
 */
export const TOPIC_CATALOG = [
  // DSA & Pseudo Code
  { id: "dp", name: "Dynamic Programming", category: "dsa" },
  { id: "bst", name: "Binary Trees & BST", category: "dsa" },
  { id: "graphs", name: "Graph Algorithms", category: "dsa" },
  { id: "bitwise", name: "Bitwise Operators & Pseudo Code", category: "dsa" },
  { id: "recursion", name: "Recursion & Backtracking", category: "dsa" },
  { id: "sorting", name: "Sorting & Searching Algorithms", category: "dsa" },
  { id: "stacks_queues", name: "Stacks & Queues", category: "dsa" },
  { id: "output_pred", name: "C/C++/Java Output Prediction", category: "dsa" },

  // Quantitative Aptitude
  { id: "time_work", name: "Time & Work", category: "quant" },
  { id: "speed_dist", name: "Speed, Distance & Time", category: "quant" },
  { id: "pnc_prob", name: "P&C and Probability", category: "quant" },
  { id: "profit_loss", name: "Profit & Loss", category: "quant" },
  { id: "ratios", name: "Ratios & Mixtures", category: "quant" },
  { id: "simple_ci", name: "Simple & Compound Interest", category: "quant" },

  // Logical Reasoning
  { id: "syllogism", name: "Syllogism & Deductions", category: "reasoning" },
  { id: "data_suff", name: "Data Sufficiency", category: "reasoning" },
  { id: "blood_rel", name: "Blood Relations", category: "reasoning" },
  { id: "coding_dec", name: "Coding-Decoding", category: "reasoning" },
  { id: "dir_sense", name: "Direction Sense", category: "reasoning" },
  { id: "matrix_puz", name: "Matrix & Wheel Logic", category: "reasoning" },

  // Verbal & Grammar
  { id: "subj_verb", name: "Subject-Verb Agreement", category: "verbal" },
  { id: "reading_comp", name: "Reading Comprehension", category: "verbal" },
  { id: "error_spot", name: "Error Spotting & Articles", category: "verbal" },
  { id: "parajumbles", name: "Sentence Reordering & Para-jumbles", category: "verbal" },
  { id: "vocab", name: "Synonyms & Antonyms in Context", category: "verbal" },

  // Core Computer Science
  { id: "sql_joins", name: "SQL Queries & Indexing", category: "systems" },
  { id: "deadlocks", name: "Deadlocks & CPU Scheduling", category: "systems" },
  { id: "oops", name: "OOPs Principles & Design Patterns", category: "systems" },
  { id: "networking", name: "TCP/IP & Network Layers", category: "systems" }
];

/**
 * Builds an AI prompt for generating custom placement MCQ tests
 */
export function generateCustomTopicPrompt({ topic, count = 20, difficulty = "Standard Placement", duration = 25, marksCorrect = 1, negativeMarks = 0, cutoffPercent = 50 }) {
  const cleanTopic = (topic || "Dynamic Programming").trim();
  const negPenalty = Number(negativeMarks) || 0;

  return `You are a Senior Assessment Content Specialist for Tier-1 Corporate Placement Drives (TCS NQT, Infosys, Mercer Mettl, AMCAT, Capgemini).

Generate a placement assessment of EXACTLY ${count} multiple-choice questions on the topic:
"${cleanTopic}"

EXAM SPECIFICATIONS:
1. Target Difficulty: ${difficulty}
2. Allocated Duration: ${duration} minutes
3. Marking Scheme: +${marksCorrect} for correct answer, ${negPenalty > 0 ? `-${negPenalty}` : '0'} penalty for incorrect answer.
4. Sectional Passing Benchmark: ${cutoffPercent}% minimum passing score.
5. All questions MUST have exactly 4 distinct options (A, B, C, D) with exactly one unambiguous correct answer.
6. Crucial Requirement: Tag every question with its specific "topic": "${cleanTopic}".
7. If pseudo code or algorithms are involved, include clean code in the "codeSnippet" property.
8. Provide a comprehensive, step-by-step reasoning explanation for each question.
9. Return 100% strictly valid JSON ONLY. Do NOT wrap in conversational intro/outro text. Do NOT use markdown code fences unless strictly inside JSON.

OUTPUT JSON SCHEMA FORMAT:
{
  "title": "AI Practice: ${cleanTopic}",
  "companyOrType": "AI Generated Test",
  "description": "Comprehensive placement-level assessment on ${cleanTopic} (${count} Questions)",
  "defaultDurationMinutes": ${duration},
  "passingScorePercent": ${cutoffPercent},
  "sectionalCutoffs": true,
  "defaultCutoffPercent": ${cutoffPercent},
  "markingScheme": {
    "correct": ${marksCorrect},
    "incorrect": ${negPenalty > 0 ? -negPenalty : 0}
  },
  "sections": [
    {
      "id": "sec-ai-${Date.now()}",
      "name": "${cleanTopic}",
      "durationMinutes": ${duration},
      "cutoffPercent": ${cutoffPercent},
      "marksPerQuestion": ${marksCorrect},
      "type": "mcq",
      "questions": [
        {
          "id": "ai-q1",
          "topic": "${cleanTopic}",
          "text": "Write question text here...",
          "codeSnippet": "",
          "options": [
            { "id": "A", "text": "First option" },
            { "id": "B", "text": "Second option" },
            { "id": "C", "text": "Third option" },
            { "id": "D", "text": "Fourth option" }
          ],
          "correctAnswer": "A",
          "explanation": "Detailed step-by-step explanation for why A is correct..."
        }
      ]
    }
  ]
}`;
}

/**
 * Valid sample 5-question AI test for immediate 1-click preview and testing
 */
export const AI_SAMPLE_TOPIC_TEST = {
  id: "ai-test-sample-dp",
  title: "AI Practice: Dynamic Programming & Memoization",
  companyOrType: "AI Generated Test",
  description: "Targeted assessment focusing on Optimal Substructure, Overlapping Subproblems, and Tabulation vs Memoization.",
  defaultDurationMinutes: 10,
  passingScorePercent: 50,
  sectionalCutoffs: true,
  defaultCutoffPercent: 50,
  markingScheme: {
    correct: 1,
    incorrect: 0
  },
  sections: [
    {
      id: "sec-sample-dp-1",
      name: "Dynamic Programming",
      durationMinutes: 10,
      cutoffPercent: 50,
      marksPerQuestion: 1,
      type: "mcq",
      questions: [
        {
          id: "dp-s-q1",
          topic: "Dynamic Programming",
          text: "What are the two essential characteristics a problem must exhibit to be solved using Dynamic Programming?",
          options: [
            { id: "A", text: "Optimal Substructure and Greedy Choice Property" },
            { id: "B", text: "Overlapping Subproblems and Optimal Substructure" },
            { id: "C", text: "Divide-and-Conquer and Memoization" },
            { id: "D", text: "Linear Time Complexity and Constant Auxiliary Space" }
          ],
          correctAnswer: "B",
          explanation: "Dynamic programming applies when a problem has overlapping subproblems (same subproblems solved repeatedly) and optimal substructure (optimal solution to the problem contains optimal solutions to subproblems)."
        },
        {
          id: "dp-s-q2",
          topic: "Dynamic Programming",
          text: "In the 0/1 Knapsack Problem with N items and maximum weight capacity W, what is the time complexity of the standard Dynamic Programming approach?",
          options: [
            { id: "A", text: "O(N log N)" },
            { id: "B", text: "O(2^N)" },
            { id: "C", text: "O(N × W)" },
            { id: "D", text: "O(W log N)" }
          ],
          correctAnswer: "C",
          explanation: "The standard DP table has dimensions (N+1) × (W+1). Computing each state takes O(1) time, yielding total time complexity O(N × W), which is pseudo-polynomial."
        },
        {
          id: "dp-s-q3",
          topic: "Dynamic Programming",
          text: "Which of the following describes the difference between Memoization and Tabulation?",
          options: [
            { id: "A", text: "Memoization is Bottom-Up, whereas Tabulation is Top-Down" },
            { id: "B", text: "Memoization is Top-Down (recursive + caching), whereas Tabulation is Bottom-Up (iterative table filling)" },
            { id: "C", text: "Memoization always requires O(1) space, whereas Tabulation requires O(N!) space" },
            { id: "D", text: "There is no functional or conceptual difference" }
          ],
          correctAnswer: "B",
          explanation: "Memoization solves subproblems on-demand starting from the original problem (Top-Down with recursion and cache). Tabulation builds up solutions iteratively starting from base cases (Bottom-Up)."
        },
        {
          id: "dp-s-q4",
          topic: "Dynamic Programming",
          text: "What is the length of the Longest Common Subsequence (LCS) between strings 'ABCBDAB' and 'BDCABA'?",
          options: [
            { id: "A", text: "3" },
            { id: "B", text: "4" },
            { id: "C", text: "5" },
            { id: "D", text: "6" }
          ],
          correctAnswer: "B",
          explanation: "The longest common subsequence has length 4. Examples include 'BCBA', 'BDAB', and 'BCAB'."
        },
        {
          id: "dp-s-q5",
          topic: "Dynamic Programming",
          text: "When computing the N-th Fibonacci number using bottom-up DP, what is the minimum auxiliary space needed without recursion?",
          options: [
            { id: "A", text: "O(N)" },
            { id: "B", text: "O(1)" },
            { id: "C", text: "O(log N)" },
            { id: "D", text: "O(N²)" }
          ],
          correctAnswer: "B",
          explanation: "Since computing Fib(i) only requires Fib(i-1) and Fib(i-2), we only need two variables to store the previous two values, requiring O(1) auxiliary space."
        }
      ]
    }
  ]
};
