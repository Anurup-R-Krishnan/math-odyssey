import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const TEAM_NAME = "NeuroMath";

const MEMBERS = [
  {
    name: import.meta.env.VITE_TEAM_MEMBER_1_NAME || "Team Member 1",
    rollNo: import.meta.env.VITE_TEAM_MEMBER_1_ROLL_NO || "CB.EN.U4CSE00X",
    role: import.meta.env.VITE_TEAM_MEMBER_1_ROLE || "Developer",
  },
  {
    name: import.meta.env.VITE_TEAM_MEMBER_2_NAME || "Team Member 2",
    rollNo: import.meta.env.VITE_TEAM_MEMBER_2_ROLL_NO || "CB.EN.U4CSE00Y",
    role: import.meta.env.VITE_TEAM_MEMBER_2_ROLE || "Designer",
  },
  {
    name: import.meta.env.VITE_TEAM_MEMBER_3_NAME || "Team Member 3",
    rollNo: import.meta.env.VITE_TEAM_MEMBER_3_ROLL_NO || "CB.EN.U4CSE00Z",
    role: import.meta.env.VITE_TEAM_MEMBER_3_ROLE || "Tester",
  },
];

function createBorderedCell(text: string, bold = false): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold, size: 20 })],
        spacing: { after: 40 },
      }),
    ],
    width: { size: 3000, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
}

function generateDocument(): Document {
  return new Document({
    sections: [
      {
        children: [
          // Cover page
          new Paragraph({ spacing: { after: 600 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Lab Evaluation 2",
                bold: true,
                size: 48,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Team: ${TEAM_NAME}`,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "NeuroMath -- Visual Game-Based Math Learning for Autism",
                size: 28,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Course header
          new Paragraph({
            text: "Course Information",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Course Teacher: ", bold: true }),
              new TextRun("Dr. T. Senthil Kumar"),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Department: ", bold: true }),
              new TextRun("Amrita School of Computing"),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Institution: ", bold: true }),
              new TextRun("Amrita Vishwa Vidyapeetham"),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Address: ", bold: true }),
              new TextRun("Coimbatore - 641112"),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun("t_senthilkumar@cb.amrita.edu"),
            ],
            spacing: { after: 200 },
          }),

          // Product description
          new Paragraph({
            text: "Product Description",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "NeuroMath is a visual, game-based math learning platform designed specifically for learners on the autism spectrum. " +
                  "It provides emotion-neutral feedback and guided micro-hints to support mathematical learning in a supportive, non-threatening environment."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Member details
          new Paragraph({
            text: "Team Members",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  createBorderedCell("Name", true),
                  createBorderedCell("Roll No", true),
                  createBorderedCell("Role", true),
                ],
              }),
              ...MEMBERS.map(
                (m) =>
                  new TableRow({
                    children: [
                      createBorderedCell(m.name),
                      createBorderedCell(m.rollNo),
                      createBorderedCell(m.role),
                    ],
                  })
              ),
            ],
            width: { size: 9000, type: WidthType.DXA },
          }),

          // Use-case justification
          new Paragraph({
            text: "Use-Case Justification: Why for Autism",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Children on the autism spectrum often face challenges with traditional educational software that relies heavily on social praise, " +
                  "ambiguous feedback, and rapid transitions. NeuroMath addresses these challenges through: (1) Emotion-neutral feedback that avoids " +
                  "anxiety-inducing language, (2) Deterministic hint escalation that provides predictable support, (3) Visual object representations " +
                  "that support concrete mathematical thinking, (4) Adaptive difficulty that adjusts to the learner's pace, and (5) Focus mode to " +
                  "reduce sensory stimulation."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Operations table
          new Paragraph({
            text: "Operations Table",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  createBorderedCell("Operation", true),
                  createBorderedCell("Description", true),
                  createBorderedCell("Hint Strategy", true),
                ],
              }),
              new TableRow({
                children: [
                  createBorderedCell("Addition"),
                  createBorderedCell("Count and combine groups of objects"),
                  createBorderedCell("Group into fives; show grouping animation"),
                ],
              }),
              new TableRow({
                children: [
                  createBorderedCell("Subtraction"),
                  createBorderedCell("Start with larger group, remove smaller"),
                  createBorderedCell("Fade out removed items"),
                ],
              }),
              new TableRow({
                children: [
                  createBorderedCell("Pattern Recognition"),
                  createBorderedCell("Identify repeating color sequences"),
                  createBorderedCell("Highlight color sequence and repetition"),
                ],
              }),
            ],
            width: { size: 9000, type: WidthType.DXA },
          }),

          // Improvements
          new Paragraph({
            text: "Expected Improvements in Learners",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Through the use of emotion-neutral feedback and guided micro-hints, learners are expected to: " +
                  "(1) Show reduced math anxiety compared to traditional error-based feedback, " +
                  "(2) Demonstrate improved independent problem-solving through scaffolded hints, " +
                  "(3) Build stronger mathematical foundations via adaptive difficulty, " +
                  "(4) Develop pattern recognition skills through visual representations."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Screenshots placeholder
          new Paragraph({
            text: "Outputs / Screenshots",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "[Screenshot 1: Home page with product introduction and Start CTA]"
              ),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "[Screenshot 2: Game page showing hint escalation after incorrect attempts]"
              ),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "[Screenshot 3: Dashboard with accuracy charts and CSV export]"
              ),
            ],
            spacing: { after: 200 },
          }),

          // Similar products
          new Paragraph({
            text: "Similar Products",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "1. Mathigon -- Interactive math learning platform with visual elements.\n" +
                  "2. Khan Academy -- Adaptive math exercises with hints.\n" +
                  "3. DreamBox Learning -- Adaptive math technology for K-8.\n" +
                  "4. Prodigy Math Game -- Game-based math learning.\n" +
                  "5. Splashlearn -- Visual math learning for early grades."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Research labs
          new Paragraph({
            text: "Research Labs",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "1. Autism CRC (Cooperative Research Centre for Living with Autism)\n" +
                  "2. MIT Media Lab -- Affective Computing Group\n" +
                  "3. Stanford Autism Center -- Technology and Behavioral Interventions\n" +
                  "4. University of Bath -- CAMERA Lab\n" +
                  "5. National Autistic Society -- Education Research\n" +
                  "6. Georgia Tech -- Accessibility and Assistive Technology Lab"
              ),
            ],
            spacing: { after: 200 },
          }),

          // Algorithms
          new Paragraph({
            text: "Algorithms Implemented",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "1. Deterministic Hint Escalation: JSON-mapped rule set that provides type-specific hints based on attempt count.\n" +
                  "2. Adaptive Difficulty: Rule-based algorithm that increases difficulty after 5 consecutive correct answers and decreases after 3 consecutive wrong answers.\n" +
                  "3. Question Generation: Randomized question generation with difficulty-scaled parameters.\n" +
                  "4. Micro-Practice Generation: Generates practice questions at reduced difficulty after answer reveal."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Future enhancements
          new Paragraph({
            text: "Future Enhancements",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "1. Additional math operations (multiplication, division, fractions).\n" +
                  "2. Multi-language support for broader accessibility.\n" +
                  "3. Teacher/parent dashboard with aggregated analytics.\n" +
                  "4. Audio-based hints with text-to-speech.\n" +
                  "5. Spaced repetition for long-term retention.\n" +
                  "6. Integration with classroom management systems."
              ),
            ],
            spacing: { after: 200 },
          }),

          // References
          new Paragraph({
            text: "References",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "1. American Psychiatric Association. (2013). Diagnostic and Statistical Manual of Mental Disorders (5th ed.).\n" +
                  "2. Ramdoss, S., et al. (2012). Computer-based interventions to improve social and emotional skills in individuals with autism spectrum disorders.\n" +
                  "3. Grynszpan, O., et al. (2014). Innovative technology-based interventions for autism spectrum disorders.\n" +
                  "4. Hume, K., et al. (2021). Evidence-based practices for children, youth, and young adults with autism.\n" +
                  "5. National Autism Center. (2015). Findings and Conclusions: National Standards Project, Phase 2."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Appendix
          new Paragraph({
            text: "Appendix: Sample Question Bank (CSV Format)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "type,prompt,operandA,operandB,answer,difficulty\n" +
                  "addition,What is 3 + 2?,3,2,5,1\n" +
                  "addition,What is 5 + 4?,5,4,9,1\n" +
                  "subtraction,What is 7 - 3?,7,3,4,1\n" +
                  "subtraction,What is 10 - 6?,10,6,4,2\n" +
                  "pattern,What color comes next?,,,red,1",
                font: "Courier New",
                size: 18,
              }),
            ],
          }),
        ],
      },
    ],
  });
}

export async function generateSubmissionZip(): Promise<void> {
  const doc = generateDocument();
  const docBuffer = await Packer.toBlob(doc);

  const zip = new JSZip();
  zip.file(`Lab_Eval_2_${TEAM_NAME}.docx`, docBuffer);

  // Placeholder screenshot files
  zip.file(
    "screenshots/README.txt",
    "Replace these placeholders with actual screenshots:\n1. screenshot_home.png\n2. screenshot_game.png\n3. screenshot_dashboard.png"
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `submission_${TEAM_NAME}.zip`);
}
