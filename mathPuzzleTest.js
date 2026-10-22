/**
 * mathPuzzleTest.js
 * 15 Verified Pure-Logic Math & Geometric Puzzles with responsive SVGs
 */

export const MATH_PUZZLE_TEST = {
  "id": "test-math-puzzle-geometric-logic",
  "title": "Math Puzzle & Geometric Logic Assessment",
  "companyOrType": "Logical Reasoning",
  "description": "15 High-impact visual reasoning puzzles testing geometric deduction, vertex-to-center mathematical relations, concentric dials, gears, and matrix logic.",
  "defaultDurationMinutes": 25,
  "passingScorePercent": 50,
  "totalMarks": 15,
  "sectionalCutoffs": true,
  "defaultCutoffPercent": 50,
  "markingScheme": {
    "correct": 1,
    "incorrect": 0
  },
  "sections": [
    {
      "id": "sec-math-puzzle-1",
      "name": "Math Puzzle & Geometric Logic",
      "durationMinutes": 25,
      "cutoffPercent": 50,
      "marksPerQuestion": 1,
      "type": "mcq",
      "questions": [
        {
          "id": "mp-v-1",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the triangular number puzzle below, the number at the center of each triangle is computed using a consistent mathematical rule from its three vertex numbers. What number replaces the question mark (?) in the third triangle?",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <!-- Triangle 1 -->\n      <g transform=\"translate(10, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#f1f5f9\" stroke=\"#3b82f6\" stroke-width=\"2.5\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">3</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">4</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">5</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#3b82f6\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"13\" fill=\"#ffffff\">60</text>\n      </g>\n      <!-- Triangle 2 -->\n      <g transform=\"translate(115, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#f1f5f9\" stroke=\"#3b82f6\" stroke-width=\"2.5\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">2</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">6</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">7</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#3b82f6\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"13\" fill=\"#ffffff\">84</text>\n      </g>\n      <!-- Triangle 3 -->\n      <g transform=\"translate(220, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#fef3c7\" stroke=\"#f59e0b\" stroke-width=\"2.5\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">4</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">5</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\">8</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#f59e0b\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#ffffff\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "120"
            },
            {
              "id": "B",
              "text": "160"
            },
            {
              "id": "C",
              "text": "140"
            },
            {
              "id": "D",
              "text": "180"
            }
          ],
          "correctAnswer": "B",
          "explanation": "Rule: Center number = (Top Vertex) × (Bottom-Left Vertex) × (Bottom-Right Vertex).\nTriangle 1: 3 × 4 × 5 = 60.\nTriangle 2: 2 × 6 × 7 = 84.\nTriangle 3: 4 × 5 × 8 = 160."
        },
        {
          "id": "mp-v-2",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the triangular relations below, the center value is derived from the apex and base vertices by: (Base Left + Base Right) × (Apex). Find the missing value (?) in the third triangle.",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(10, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#f8fafc\" stroke=\"#6366f1\" stroke-width=\"2\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">4</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">3</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">5</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#6366f1\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#ffffff\">32</text>\n      </g>\n      <g transform=\"translate(115, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#f8fafc\" stroke=\"#6366f1\" stroke-width=\"2\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">6</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">2</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">7</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#6366f1\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#ffffff\">54</text>\n      </g>\n      <g transform=\"translate(220, 20)\">\n        <polygon points=\"45,15 10,120 80,120\" fill=\"#fef2f2\" stroke=\"#ef4444\" stroke-width=\"2\"/>\n        <text x=\"45\" y=\"10\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">5</text>\n        <text x=\"5\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">6</text>\n        <text x=\"85\" y=\"135\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">8</text>\n        <circle cx=\"45\" cy=\"80\" r=\"16\" fill=\"#ef4444\"/>\n        <text x=\"45\" y=\"85\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"14\" fill=\"#ffffff\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "70"
            },
            {
              "id": "B",
              "text": "65"
            },
            {
              "id": "C",
              "text": "80"
            },
            {
              "id": "D",
              "text": "75"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Rule: Center = (Base Left + Base Right) × Apex.\nTriangle 1: (3 + 5) × 4 = 8 × 4 = 32.\nTriangle 2: (2 + 7) × 6 = 9 × 6 = 54.\nTriangle 3: (6 + 8) × 5 = 14 × 5 = 70."
        },
        {
          "id": "mp-v-3",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 4-quadrant circular wheel, each inner quadrant number is related to its corresponding outer ring number by: Inner = (Outer)² - 5. What number replaces the question mark (?) in the bottom-right quadrant?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 100)\">\n        <!-- Outer Circle -->\n        <circle cx=\"0\" cy=\"0\" r=\"85\" fill=\"#f8fafc\" stroke=\"#0ea5e9\" stroke-width=\"3\"/>\n        <!-- Inner Circle -->\n        <circle cx=\"0\" cy=\"0\" r=\"45\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n        <!-- Dividers -->\n        <line x1=\"-85\" y1=\"0\" x2=\"85\" y2=\"0\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n        <line x1=\"0\" y1=\"-85\" x2=\"0\" y2=\"85\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n        <!-- Outer Numbers -->\n        <text x=\"-42\" y=\"-55\" font-weight=\"bold\" font-size=\"14\" fill=\"#0369a1\" text-anchor=\"middle\">5</text>\n        <text x=\"42\" y=\"-55\" font-weight=\"bold\" font-size=\"14\" fill=\"#0369a1\" text-anchor=\"middle\">7</text>\n        <text x=\"-42\" y=\"65\" font-weight=\"bold\" font-size=\"14\" fill=\"#0369a1\" text-anchor=\"middle\">8</text>\n        <text x=\"42\" y=\"65\" font-weight=\"bold\" font-size=\"14\" fill=\"#0369a1\" text-anchor=\"middle\">9</text>\n        <!-- Inner Numbers -->\n        <text x=\"-22\" y=\"-20\" font-weight=\"bold\" font-size=\"13\" fill=\"#0f172a\" text-anchor=\"middle\">20</text>\n        <text x=\"22\" y=\"-20\" font-weight=\"bold\" font-size=\"13\" fill=\"#0f172a\" text-anchor=\"middle\">44</text>\n        <text x=\"-22\" y=\"26\" font-weight=\"bold\" font-size=\"13\" fill=\"#0f172a\" text-anchor=\"middle\">59</text>\n        <text x=\"22\" y=\"26\" font-weight=\"bold\" font-size=\"14\" fill=\"#dc2626\" text-anchor=\"middle\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "76"
            },
            {
              "id": "B",
              "text": "72"
            },
            {
              "id": "C",
              "text": "80"
            },
            {
              "id": "D",
              "text": "78"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Rule: Inner = (Outer)² - 5.\nTop-Left: 5² - 5 = 25 - 5 = 20.\nTop-Right: 7² - 5 = 49 - 5 = 44.\nBottom-Left: 8² - 5 = 64 - 5 = 59.\nBottom-Right: 9² - 5 = 81 - 5 = 76."
        },
        {
          "id": "mp-v-4",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 6-sector number dial below, numbers in diametrically opposite sectors obey a constant symmetry rule. What is the missing number (?) opposite to 6?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 100)\">\n        <circle cx=\"0\" cy=\"0\" r=\"80\" fill=\"#f8fafc\" stroke=\"#8b5cf6\" stroke-width=\"3\"/>\n        <line x1=\"0\" y1=\"-80\" x2=\"0\" y2=\"80\" stroke=\"#8b5cf6\" stroke-width=\"2\"/>\n        <line x1=\"-69.3\" y1=\"-40\" x2=\"69.3\" y2=\"40\" stroke=\"#8b5cf6\" stroke-width=\"2\"/>\n        <line x1=\"-69.3\" y1=\"40\" x2=\"69.3\" y2=\"-40\" stroke=\"#8b5cf6\" stroke-width=\"2\"/>\n        <!-- Numbers in 6 sectors: Top, Top-Right, Bot-Right, Bot, Bot-Left, Top-Left -->\n        <!-- Opposite pairs: (4, 64), (5, 125), (6, ?) -->\n        <text x=\"0\" y=\"-50\" font-weight=\"bold\" font-size=\"14\" fill=\"#6d28d9\" text-anchor=\"middle\">4</text>\n        <text x=\"45\" y=\"-20\" font-weight=\"bold\" font-size=\"14\" fill=\"#6d28d9\" text-anchor=\"middle\">5</text>\n        <text x=\"45\" y=\"35\" font-weight=\"bold\" font-size=\"14\" fill=\"#6d28d9\" text-anchor=\"middle\">6</text>\n        <text x=\"0\" y=\"60\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e293b\" text-anchor=\"middle\">64</text>\n        <text x=\"-45\" y=\"35\" font-weight=\"bold\" font-size=\"14\" fill=\"#1e293b\" text-anchor=\"middle\">125</text>\n        <text x=\"-45\" y=\"-20\" font-weight=\"bold\" font-size=\"15\" fill=\"#dc2626\" text-anchor=\"middle\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "216"
            },
            {
              "id": "B",
              "text": "196"
            },
            {
              "id": "C",
              "text": "256"
            },
            {
              "id": "D",
              "text": "180"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Opposite sectors follow the cubic rule: Opposite = (Number)³.\nOpposite to 4: 4³ = 64.\nOpposite to 5: 5³ = 125.\nOpposite to 6: 6³ = 216."
        },
        {
          "id": "mp-v-5",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "Find the missing number (?) in the 3x3 logic matrix below, where elements in each row satisfy: (Col 1 × Col 2) + Col 1 = Col 3.",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(55, 15)\">\n        <!-- 3x3 Grid of squares -->\n        <!-- Row 1 -->\n        <rect x=\"0\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">4</text>\n        <rect x=\"70\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">6</text>\n        <rect x=\"140\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f1f5f9\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n        <text x=\"170\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#2563eb\" text-anchor=\"middle\">28</text>\n        <!-- Row 2 -->\n        <rect x=\"0\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">5</text>\n        <rect x=\"70\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">8</text>\n        <rect x=\"140\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f1f5f9\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n        <text x=\"170\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#2563eb\" text-anchor=\"middle\">45</text>\n        <!-- Row 3 -->\n        <rect x=\"0\" y=\"104\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"132\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">7</text>\n        <rect x=\"70\" y=\"104\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"132\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">9</text>\n        <rect x=\"140\" y=\"104\" width=\"60\" height=\"45\" fill=\"#fef3c7\" stroke=\"#f59e0b\" stroke-width=\"2.5\"/>\n        <text x=\"170\" y=\"133\" font-weight=\"bold\" font-size=\"16\" fill=\"#d97706\" text-anchor=\"middle\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "70"
            },
            {
              "id": "B",
              "text": "63"
            },
            {
              "id": "C",
              "text": "72"
            },
            {
              "id": "D",
              "text": "68"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Rule: (Col 1 × Col 2) + Col 1 = Col 3 (or Col 1 × (Col 2 + 1) = Col 3).\nRow 1: (4 × 6) + 4 = 24 + 4 = 28.\nRow 2: (5 × 8) + 5 = 40 + 5 = 45.\nRow 3: (7 × 9) + 7 = 63 + 7 = 70."
        },
        {
          "id": "mp-v-6",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 3x3 cross-product grid below, each cell in Column 3 is computed as: (Col 1)² + (Col 2)². What is the missing value (?) in the third row?",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(55, 15)\">\n        <rect x=\"0\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">6</text>\n        <rect x=\"70\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">8</text>\n        <rect x=\"140\" y=\"0\" width=\"60\" height=\"45\" fill=\"#f0fdf4\" stroke=\"#22c55e\" stroke-width=\"2\"/>\n        <text x=\"170\" y=\"28\" font-weight=\"bold\" font-size=\"15\" fill=\"#16a34a\" text-anchor=\"middle\">100</text>\n\n        <rect x=\"0\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">5</text>\n        <rect x=\"70\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">12</text>\n        <rect x=\"140\" y=\"52\" width=\"60\" height=\"45\" fill=\"#f0fdf4\" stroke=\"#22c55e\" stroke-width=\"2\"/>\n        <text x=\"170\" y=\"80\" font-weight=\"bold\" font-size=\"15\" fill=\"#16a34a\" text-anchor=\"middle\">169</text>\n\n        <rect x=\"0\" y=\"104\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"30\" y=\"132\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">8</text>\n        <rect x=\"70\" y=\"104\" width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n        <text x=\"100\" y=\"132\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">15</text>\n        <rect x=\"140\" y=\"104\" width=\"60\" height=\"45\" fill=\"#fef2f2\" stroke=\"#ef4444\" stroke-width=\"2.5\"/>\n        <text x=\"170\" y=\"133\" font-weight=\"bold\" font-size=\"16\" fill=\"#dc2626\" text-anchor=\"middle\">?</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "289"
            },
            {
              "id": "B",
              "text": "225"
            },
            {
              "id": "C",
              "text": "256"
            },
            {
              "id": "D",
              "text": "300"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Sum of squares (Pythagorean squares):\nRow 1: 6² + 8² = 36 + 64 = 100.\nRow 2: 5² + 12² = 25 + 144 = 169.\nRow 3: 8² + 15² = 64 + 225 = 289."
        },
        {
          "id": "mp-v-7",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 3x3 geometric shape matrix below, each row follows a rule of combining outer shapes and inner fillings: Triangle, Square, Pentagon; with None, Dot, Cross. Which shape replaces (?) in row 3, column 3?",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(55, 15)\">\n        <!-- Row 1 -->\n        <g transform=\"translate(0, 0)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 15,38 45,38\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        </g>\n        <g transform=\"translate(70, 0)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <rect x=\"16\" y=\"9\" width=\"28\" height=\"28\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <circle cx=\"30\" cy=\"23\" r=\"3.5\" fill=\"#2563eb\"/>\n        </g>\n        <g transform=\"translate(140, 0)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 48,21 41,40 19,40 12,21\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <line x1=\"26\" y1=\"21\" x2=\"34\" y2=\"29\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <line x1=\"34\" y1=\"21\" x2=\"26\" y2=\"29\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        </g>\n\n        <!-- Row 2 -->\n        <g transform=\"translate(0, 52)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <rect x=\"16\" y=\"9\" width=\"28\" height=\"28\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        </g>\n        <g transform=\"translate(70, 52)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 48,21 41,40 19,40 12,21\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <circle cx=\"30\" cy=\"25\" r=\"3.5\" fill=\"#2563eb\"/>\n        </g>\n        <g transform=\"translate(140, 52)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 15,38 45,38\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <line x1=\"26\" y1=\"22\" x2=\"34\" y2=\"30\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <line x1=\"34\" y1=\"22\" x2=\"26\" y2=\"30\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        </g>\n\n        <!-- Row 3 -->\n        <g transform=\"translate(0, 104)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 48,21 41,40 19,40 12,21\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        </g>\n        <g transform=\"translate(70, 104)\">\n          <rect width=\"60\" height=\"45\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n          <polygon points=\"30,8 15,38 45,38\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n          <circle cx=\"30\" cy=\"27\" r=\"3.5\" fill=\"#2563eb\"/>\n        </g>\n        <g transform=\"translate(140, 104)\">\n          <rect width=\"60\" height=\"45\" fill=\"#fef3c7\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"30\" y=\"28\" font-weight=\"bold\" font-size=\"18\" fill=\"#d97706\" text-anchor=\"middle\">?</text>\n        </g>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "Square with an interior Cross (X)"
            },
            {
              "id": "B",
              "text": "Triangle with an interior Dot"
            },
            {
              "id": "C",
              "text": "Pentagon with an interior Cross (X)"
            },
            {
              "id": "D",
              "text": "Circle with an interior Dot"
            }
          ],
          "correctAnswer": "A",
          "explanation": "In each row, each outer shape appears exactly once (Triangle, Square, Pentagon) and each inner feature appears exactly once (Empty, Dot, Cross).\nIn Row 3: Shapes are Pentagon and Triangle, so missing shape is Square.\nFeatures in Row 3: Empty and Dot, so missing feature is Cross (X).\nAnswer is a Square with an interior Cross."
        },
        {
          "id": "mp-v-8",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 3-circle Venn diagram below, regions A, B, and C represent sets of elements. How many elements belong to EXACTLY two sets?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 105)\">\n        <!-- Circle 1 (Top) -->\n        <circle cx=\"0\" cy=\"-35\" r=\"50\" fill=\"#3b82f6\" fill-opacity=\"0.2\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        <!-- Circle 2 (Bottom-Left) -->\n        <circle cx=\"-35\" cy=\"25\" r=\"50\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/>\n        <!-- Circle 3 (Bottom-Right) -->\n        <circle cx=\"35\" cy=\"25\" r=\"50\" fill=\"#f59e0b\" fill-opacity=\"0.2\" stroke=\"#d97706\" stroke-width=\"2\"/>\n\n        <!-- Only one set labels -->\n        <text x=\"0\" y=\"-60\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\">12</text>\n        <text x=\"-60\" y=\"45\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\">14</text>\n        <text x=\"60\" y=\"45\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\">16</text>\n\n        <!-- Two set overlaps -->\n        <text x=\"-25\" y=\"-10\" font-weight=\"bold\" font-size=\"12\" fill=\"#b91c1c\" text-anchor=\"middle\">7</text>\n        <text x=\"25\" y=\"-10\" font-weight=\"bold\" font-size=\"12\" fill=\"#b91c1c\" text-anchor=\"middle\">5</text>\n        <text x=\"0\" y=\"45\" font-weight=\"bold\" font-size=\"12\" fill=\"#b91c1c\" text-anchor=\"middle\">6</text>\n\n        <!-- Central all-three overlap -->\n        <text x=\"0\" y=\"10\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">4</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "18"
            },
            {
              "id": "B",
              "text": "22"
            },
            {
              "id": "C",
              "text": "15"
            },
            {
              "id": "D",
              "text": "16"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Elements belonging to EXACTLY two sets are the three two-way overlap regions (excluding the central 3-way intersection):\nOverlaps = 7 + 5 + 6 = 18."
        },
        {
          "id": "mp-v-9",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "Four interlocking rings have numbers placed in their non-overlapping and overlapping zones. The number in each intersection is the positive difference between the two ring values. What is the value of 'X' in the last intersection?",
          "diagramSvg": "<svg viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(10, 30)\">\n        <!-- 4 Circles -->\n        <circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"3\"/>\n        <circle cx=\"115\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"3\"/>\n        <circle cx=\"180\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"#d97706\" stroke-width=\"3\"/>\n        <circle cx=\"245\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"#9333ea\" stroke-width=\"3\"/>\n\n        <!-- Ring Base Numbers -->\n        <text x=\"30\" y=\"55\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\">27</text>\n        <text x=\"115\" y=\"55\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">19</text>\n        <text x=\"180\" y=\"55\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\" text-anchor=\"middle\">33</text>\n        <text x=\"260\" y=\"55\" font-weight=\"bold\" font-size=\"15\" fill=\"#1e293b\">18</text>\n\n        <!-- Intersection values -->\n        <text x=\"82\" y=\"55\" font-weight=\"bold\" font-size=\"14\" fill=\"#2563eb\" text-anchor=\"middle\">8</text>\n        <text x=\"148\" y=\"55\" font-weight=\"bold\" font-size=\"14\" fill=\"#d97706\" text-anchor=\"middle\">14</text>\n        <text x=\"212\" y=\"55\" font-weight=\"bold\" font-size=\"16\" fill=\"#dc2626\" text-anchor=\"middle\">X</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "15"
            },
            {
              "id": "B",
              "text": "12"
            },
            {
              "id": "C",
              "text": "18"
            },
            {
              "id": "D",
              "text": "16"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Rule: Intersection = |Ring A - Ring B|.\nIntersection 1: |27 - 19| = 8.\nIntersection 2: |19 - 33| = 14.\nIntersection 3: X = |33 - 18| = 15."
        },
        {
          "id": "mp-v-10",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the 5-pointed star number network below, the value at each inner triangular valley is the sum of its two flanking outer tips. Find the missing value (?) at the rightmost valley.",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 100)\">\n        <!-- Star polygon -->\n        <polygon points=\"0,-80 24,-24 80,-24 35,12 50,70 0,35 -50,70 -35,12 -80,-24 -24,-24\"\n                 fill=\"#f8fafc\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/>\n\n        <!-- Outer vertex values -->\n        <text x=\"0\" y=\"-88\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">14</text>\n        <text x=\"92\" y=\"-20\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">19</text>\n        <text x=\"58\" y=\"85\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">12</text>\n        <text x=\"-58\" y=\"85\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">16</text>\n        <text x=\"-92\" y=\"-20\" font-weight=\"bold\" font-size=\"13\" fill=\"#1e293b\" text-anchor=\"middle\">23</text>\n\n        <!-- Inner valley values -->\n        <text x=\"35\" y=\"-30\" font-weight=\"bold\" font-size=\"11\" fill=\"#4f46e5\" text-anchor=\"middle\">33</text>\n        <text x=\"45\" y=\"15\" font-weight=\"bold\" font-size=\"14\" fill=\"#dc2626\" text-anchor=\"middle\">?</text>\n        <text x=\"0\" y=\"25\" font-weight=\"bold\" font-size=\"11\" fill=\"#4f46e5\" text-anchor=\"middle\">28</text>\n        <text x=\"-45\" y=\"15\" font-weight=\"bold\" font-size=\"11\" fill=\"#4f46e5\" text-anchor=\"middle\">39</text>\n        <text x=\"-35\" y=\"-30\" font-weight=\"bold\" font-size=\"11\" fill=\"#4f46e5\" text-anchor=\"middle\">37</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "31"
            },
            {
              "id": "B",
              "text": "35"
            },
            {
              "id": "C",
              "text": "29"
            },
            {
              "id": "D",
              "text": "32"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Rule: Inner valley = sum of its two flanking outer tips.\nThe question mark is between tip 19 and tip 12:\nValue = 19 + 12 = 31."
        },
        {
          "id": "mp-v-11",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the hexagram (6-pointed star formed by two interlocking equilateral triangles) below, the sum of numbers at the three vertices of each triangle must be equal. What is the value of 'X'?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 100)\">\n        <!-- Triangle 1 (Points Up) -->\n        <polygon points=\"0,-75 65,38 -65,38\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2.5\"/>\n        <circle cx=\"0\" cy=\"-75\" r=\"14\" fill=\"#dbeafe\" stroke=\"#2563eb\"/>\n        <text x=\"0\" y=\"-70\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e3a8a\" text-anchor=\"middle\">7</text>\n        <circle cx=\"65\" cy=\"38\" r=\"14\" fill=\"#dbeafe\" stroke=\"#2563eb\"/>\n        <text x=\"65\" y=\"43\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e3a8a\" text-anchor=\"middle\">11</text>\n        <circle cx=\"-65\" cy=\"38\" r=\"14\" fill=\"#dbeafe\" stroke=\"#2563eb\"/>\n        <text x=\"-65\" y=\"43\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e3a8a\" text-anchor=\"middle\">12</text>\n\n        <!-- Triangle 2 (Points Down) -->\n        <polygon points=\"0,75 65,-38 -65,-38\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2.5\"/>\n        <circle cx=\"0\" cy=\"75\" r=\"14\" fill=\"#fef3c7\" stroke=\"#f59e0b\"/>\n        <text x=\"0\" y=\"80\" font-weight=\"bold\" font-size=\"12\" fill=\"#78350f\" text-anchor=\"middle\">9</text>\n        <circle cx=\"65\" cy=\"-38\" r=\"14\" fill=\"#fef3c7\" stroke=\"#f59e0b\"/>\n        <text x=\"65\" y=\"-33\" font-weight=\"bold\" font-size=\"12\" fill=\"#78350f\" text-anchor=\"middle\">8</text>\n        <circle cx=\"-65\" cy=\"-38\" r=\"14\" fill=\"#fef3c7\" stroke=\"#f59e0b\"/>\n        <text x=\"-65\" y=\"-33\" font-weight=\"bold\" font-size=\"13\" fill=\"#dc2626\" text-anchor=\"middle\">X</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "13"
            },
            {
              "id": "B",
              "text": "14"
            },
            {
              "id": "C",
              "text": "15"
            },
            {
              "id": "D",
              "text": "12"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Sum of Triangle 1 vertices (Blue): 7 + 11 + 12 = 30.\nSum of Triangle 2 vertices (Gold) must equal 30:\n9 + 8 + X = 30 ⇒ 17 + X = 30 ⇒ X = 13."
        },
        {
          "id": "mp-v-12",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In rectangle ABCD of width 14 cm and height 8 cm, what is the area of the shaded triangle ABE if E lies anywhere along the top edge CD?",
          "diagramSvg": "<svg viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(60, 20)\">\n        <!-- Rectangle ABCD -->\n        <rect x=\"0\" y=\"0\" width=\"200\" height=\"120\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\"/>\n        <!-- Shaded Triangle ABE -->\n        <polygon points=\"0,120 200,120 130,0\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2.5\"/>\n\n        <!-- Labels -->\n        <text x=\"-12\" y=\"125\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">A</text>\n        <text x=\"206\" y=\"125\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">B</text>\n        <text x=\"206\" y=\"-5\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">C</text>\n        <text x=\"-12\" y=\"-5\" font-weight=\"bold\" font-size=\"12\" fill=\"#0f172a\">D</text>\n        <text x=\"130\" y=\"-8\" font-weight=\"bold\" font-size=\"13\" fill=\"#0284c7\" text-anchor=\"middle\">E</text>\n\n        <!-- Dimensions -->\n        <text x=\"100\" y=\"140\" font-weight=\"bold\" font-size=\"12\" fill=\"#475569\" text-anchor=\"middle\">Base = 14 cm</text>\n        <text x=\"215\" y=\"65\" font-weight=\"bold\" font-size=\"12\" fill=\"#475569\">Height = 8 cm</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "56 cm²"
            },
            {
              "id": "B",
              "text": "112 cm²"
            },
            {
              "id": "C",
              "text": "48 cm²"
            },
            {
              "id": "D",
              "text": "64 cm²"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Area of a triangle = (1/2) × base × height.\nThe base of triangle ABE is the length of side AB = 14 cm.\nThe perpendicular height is the width of the rectangle AD = 8 cm.\nArea = 0.5 × 14 × 8 = 56 cm² (regardless of where E is positioned along CD)."
        },
        {
          "id": "mp-v-13",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "In the concentric circular target below, the inner circle has radius r = 3 cm and the outer circle has radius R = 5 cm. What is the ratio of the shaded outer ring area (annulus) to the unshaded inner circle area?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(160, 100)\">\n        <!-- Outer Circle Shaded -->\n        <circle cx=\"0\" cy=\"0\" r=\"80\" fill=\"#cbd5e1\" stroke=\"#334155\" stroke-width=\"2\"/>\n        <!-- Inner Circle Unshaded -->\n        <circle cx=\"0\" cy=\"0\" r=\"48\" fill=\"#ffffff\" stroke=\"#334155\" stroke-width=\"2\"/>\n\n        <!-- Radius indicators -->\n        <line x1=\"0\" y1=\"0\" x2=\"48\" y2=\"0\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n        <text x=\"24\" y=\"-6\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">r = 3</text>\n\n        <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-80\" stroke=\"#2563eb\" stroke-width=\"2\"/>\n        <text x=\"6\" y=\"-45\" font-size=\"11\" font-weight=\"bold\" fill=\"#2563eb\">R = 5</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "16 : 9"
            },
            {
              "id": "B",
              "text": "25 : 9"
            },
            {
              "id": "C",
              "text": "4 : 3"
            },
            {
              "id": "D",
              "text": "16 : 25"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Inner circle area = π × r² = π × 3² = 9π.\nOuter circle area = π × R² = π × 5² = 25π.\nShaded annulus area = 25π - 9π = 16π.\nRatio of Shaded Ring : Inner Circle = 16π : 9π = 16 : 9."
        },
        {
          "id": "mp-v-14",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "Three interlocking gears A, B, and C are connected in a linear train. Gear A has 12 teeth and rotates clockwise at 60 RPM. Gear B has 24 teeth. Gear C has 18 teeth. What is the rotation speed and direction of Gear C?",
          "diagramSvg": "<svg viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(20, 20)\">\n        <!-- Gear A -->\n        <g transform=\"translate(45, 60)\">\n          <circle cx=\"0\" cy=\"0\" r=\"30\" fill=\"#dbeafe\" stroke=\"#2563eb\" stroke-width=\"3\" stroke-dasharray=\"4,2\"/>\n          <text x=\"0\" y=\"-5\" font-weight=\"bold\" font-size=\"12\" fill=\"#1e3a8a\" text-anchor=\"middle\">Gear A</text>\n          <text x=\"0\" y=\"10\" font-size=\"10\" fill=\"#1e3a8a\" text-anchor=\"middle\">12 Teeth</text>\n          <text x=\"0\" y=\"22\" font-size=\"10\" fill=\"#16a34a\" text-anchor=\"middle\">60 RPM ↻</text>\n        </g>\n        <!-- Gear B -->\n        <g transform=\"translate(125, 60)\">\n          <circle cx=\"0\" cy=\"0\" r=\"48\" fill=\"#f1f5f9\" stroke=\"#64748b\" stroke-width=\"3\" stroke-dasharray=\"6,3\"/>\n          <text x=\"0\" y=\"-5\" font-weight=\"bold\" font-size=\"12\" fill=\"#334155\" text-anchor=\"middle\">Gear B</text>\n          <text x=\"0\" y=\"10\" font-size=\"10\" fill=\"#334155\" text-anchor=\"middle\">24 Teeth</text>\n          <text x=\"0\" y=\"22\" font-size=\"10\" fill=\"#475569\" text-anchor=\"middle\">Idle</text>\n        </g>\n        <!-- Gear C -->\n        <g transform=\"translate(225, 60)\">\n          <circle cx=\"0\" cy=\"0\" r=\"40\" fill=\"#fef3c7\" stroke=\"#d97706\" stroke-width=\"3\" stroke-dasharray=\"5,2.5\"/>\n          <text x=\"0\" y=\"-5\" font-weight=\"bold\" font-size=\"12\" fill=\"#78350f\" text-anchor=\"middle\">Gear C</text>\n          <text x=\"0\" y=\"10\" font-size=\"10\" fill=\"#78350f\" text-anchor=\"middle\">18 Teeth</text>\n          <text x=\"0\" y=\"22\" font-weight=\"bold\" font-size=\"11\" fill=\"#dc2626\" text-anchor=\"middle\">? RPM</text>\n        </g>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "40 RPM Clockwise"
            },
            {
              "id": "B",
              "text": "40 RPM Counter-Clockwise"
            },
            {
              "id": "C",
              "text": "30 RPM Clockwise"
            },
            {
              "id": "D",
              "text": "45 RPM Clockwise"
            }
          ],
          "correctAnswer": "A",
          "explanation": "1. Rotation Direction: Gear A rotates Clockwise (CW) → Gear B rotates Counter-Clockwise (CCW) → Gear C rotates Clockwise (CW).\n2. Speed: Teeth × RPM is constant through the mesh. Teeth(A) × RPM(A) = Teeth(C) × RPM(C) ⇒ 12 × 60 = 18 × RPM(C) ⇒ 720 = 18 × RPM(C) ⇒ RPM(C) = 40 RPM.\nResult: 40 RPM Clockwise."
        },
        {
          "id": "mp-v-15",
          "topic": "Math Puzzle & Geometric Logic",
          "text": "A square sheet of side 10 cm has 4 congruent right triangles cut from its corners (each with perpendicular legs of 3 cm and 4 cm). What is the area of the remaining central tilted octagon/polygon?",
          "diagramSvg": "<svg viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"max-height: 200px; width: 100%;\">\n      <g transform=\"translate(90, 25)\">\n        <!-- Outer square 140x140 representing 10cm -->\n        <rect x=\"0\" y=\"0\" width=\"140\" height=\"140\" fill=\"#e2e8f0\" stroke=\"#334155\" stroke-width=\"2\"/>\n        <!-- 4 Corner right triangles shaded -->\n        <polygon points=\"0,0 42,0 0,56\" fill=\"#3b82f6\" fill-opacity=\"0.5\"/>\n        <polygon points=\"140,0 98,0 140,56\" fill=\"#3b82f6\" fill-opacity=\"0.5\"/>\n        <polygon points=\"0,140 42,140 0,84\" fill=\"#3b82f6\" fill-opacity=\"0.5\"/>\n        <polygon points=\"140,140 98,140 140,84\" fill=\"#3b82f6\" fill-opacity=\"0.5\"/>\n\n        <!-- Labels -->\n        <text x=\"70\" y=\"75\" font-weight=\"bold\" font-size=\"14\" fill=\"#0f172a\" text-anchor=\"middle\">Remaining Area?</text>\n        <text x=\"70\" y=\"155\" font-size=\"11\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Side = 10 cm</text>\n        <text x=\"-15\" y=\"30\" font-size=\"10\" font-weight=\"bold\" fill=\"#2563eb\">4 cm</text>\n        <text x=\"20\" y=\"-5\" font-size=\"10\" font-weight=\"bold\" fill=\"#2563eb\">3 cm</text>\n      </g>\n    </svg>",
          "options": [
            {
              "id": "A",
              "text": "76 cm²"
            },
            {
              "id": "B",
              "text": "88 cm²"
            },
            {
              "id": "C",
              "text": "72 cm²"
            },
            {
              "id": "D",
              "text": "80 cm²"
            }
          ],
          "correctAnswer": "A",
          "explanation": "Area of the full square = 10 × 10 = 100 cm².\nArea of each corner right triangle = 0.5 × base × height = 0.5 × 3 × 4 = 6 cm².\nTotal area of the 4 corner triangles = 4 × 6 = 24 cm².\nRemaining central area = 100 - 24 = 76 cm²."
        }
      ]
    }
  ]
};
