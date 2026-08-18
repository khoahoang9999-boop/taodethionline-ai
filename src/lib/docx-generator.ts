/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UnderlineType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ImageRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import { parseAppliedQuestion, formatAnswerLines } from "./formatter";
import { getMathStandardObjectives, enrichSpecificationItem } from "../data/mathObjectives";
import { svgToPngBuffer } from "./math-figures";
import { normalizeMatrixPercentages } from "./matrixUtils";

interface MatrixRow {
  topic: string;
  content: string;
  periods: number;
  percentage: number;
  mcq_nb: number;
  mcq_th: number;
  mcq_vd: number;
  tf_nb: number;
  tf_th: number;
  tf_vd: number;
  sa_nb?: number;
  sa_th?: number;
  sa_vd?: number;
  tl_nb: number;
  tl_th: number;
  tl_vd: number;
  total_nb: number;
  total_th: number;
  total_vd: number;
  totalPoints: number;
  halfGroup?: "firstHalf" | "secondHalf" | string;
}

interface SpecRow {
  topic: string;
  content: string;
  nb_desc?: string;
  th_desc?: string;
  vd_desc?: string;
  nb_count?: number;
  th_count?: number;
  vd_count?: number;
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
  figureImageBuffer?: Uint8Array | null;
  imageUrl?: string;
}

interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
}

interface TFQuestion {
  id: number;
  question: string;
  statements: Statement[];
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
  figureImageBuffer?: Uint8Array | null;
  imageUrl?: string;
}

interface Breakdown {
  criteria: string;
  points: string;
}

interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer: string;
  unit?: string;
  explanation?: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
  figureImageBuffer?: Uint8Array | null;
  imageUrl?: string;
}

interface Applied {
  id: number;
  question: string;
  answer: string;
  pointsBreakdown: Breakdown[];
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
  figureImageBuffer?: Uint8Array | null;
  imageUrl?: string;
}

interface ExamVariant {
  code: string;
  title?: string;
  mcq: MCQ[];
  tf: TFQuestion[];
  shortAnswer?: ShortAnswerQuestion[];
  applied: Applied[];
}

export interface StudyGuideTopic {
  topic: string;
  lessonName?: string;
  summaryPoints: string[];
}

export interface StudyGuideData {
  title?: string;
  subject: string;
  grade: string;
  period: string;
  examFormat?: string;
  schoolName?: string;
  departmentName?: string;
  schoolYear?: string;
  topics: StudyGuideTopic[];
  mcq: (MCQ & { isExamCore?: boolean })[];
  tf: (TFQuestion & { isExamCore?: boolean })[];
  shortAnswer?: (ShortAnswerQuestion & { isExamCore?: boolean })[];
  applied?: (Applied & { isExamCore?: boolean })[];
}

interface TestData {
  subject?: string;
  title: string;
  time: string;
  grade?: string;
  period?: string;
  examFormat?: string;
  endContent?: string;
  schoolName?: string;
  schoolYear?: string;
  departmentName?: string;
  code?: string;
  matrix: MatrixRow[];
  specification: SpecRow[];
  mcq?: MCQ[];
  tf?: TFQuestion[];
  shortAnswer?: ShortAnswerQuestion[];
  applied?: Applied[];
  examVariants?: ExamVariant[];
}

const COMMON_FONT = "Times New Roman";
const BASE_SIZE = 26; // 13pt in half-points (Cỡ chữ 13pt)
const TABLE_SIZE = 24; // 12pt in half-points (Cho nội dung trong bảng)
const TITLE_SIZE = 26; // 13pt in half-points (Cỡ chữ 13pt)
const PARAGRAPH_SPACING = { before: 0, after: 60, line: 276 };

const DEFAULT_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

function formatDocxCount(val?: number | string | null): string {
  const num = Number(val);
  return num > 0 ? String(num) : "";
}

async function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 300, height: 150 });
    img.src = dataUrl;
  });
}

function base64ToUint8Array(base64: string) {
  const binaryString = window.atob(base64.split(",")[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function createSignatureBlockDocx(data: any): (Paragraph | Table)[] {
  const activeRoles: { title: string; name: string; signature?: string | null }[] = [];
  if (data.bghName?.trim()) {
    activeRoles.push({ title: "DUYỆT CỦA BGH", name: data.bghName.trim(), signature: data.bghSignature });
  }
  if (data.teacherHeadName?.trim()) {
    activeRoles.push({ title: "DUYỆT TỔ CM", name: data.teacherHeadName.trim(), signature: data.teacherHeadSignature });
  }
  if (data.creatorName?.trim()) {
    activeRoles.push({ title: "NGƯỜI RA ĐỀ", name: data.creatorName.trim(), signature: data.creatorSignature });
  }

  if (activeRoles.length === 0) return [];

  const dateLocation = data.examDateLocation?.trim() || "Hàm Yên, ngày 10 tháng 02 năm 2026";

  const datePara = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: dateLocation,
        italics: true,
        size: BASE_SIZE,
        font: COMMON_FONT,
      }),
    ],
  });

  const cells: TableCell[] = activeRoles.map((role) => {
    const children: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: role.title,
            bold: true,
            size: BASE_SIZE,
            font: COMMON_FONT,
          }),
        ],
      }),
    ];

    let hasImage = false;
    if (role.signature && typeof role.signature === "string" && role.signature.startsWith("data:image")) {
      try {
        const imgBytes = base64ToUint8Array(role.signature);
        if (imgBytes) {
          hasImage = true;
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              children: [
                new ImageRun({
                  type: role.signature.includes("image/jpeg") || role.signature.includes("image/jpg") ? "jpg" : "png",
                  data: imgBytes,
                  transformation: {
                    width: 110,
                    height: 48,
                  },
                }),
              ],
            })
          );
        }
      } catch (err) {
        console.warn("Could not embed signature image in DOCX:", err);
      }
    }

    if (!hasImage) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 0 },
          children: [],
        })
      );
    }

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 0 },
        children: [
          new TextRun({
            text: role.name,
            bold: true,
            size: BASE_SIZE,
            font: COMMON_FONT,
          }),
        ],
      })
    );

    return new TableCell({
      width: { size: Math.floor(100 / activeRoles.length), type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      verticalAlign: VerticalAlign.TOP,
      children,
    });
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [new TableRow({ children: cells })],
  });

  return [datePara, table];
}

function createOfficialHeaderTable(
  data: any,
  titleText: string,
  subTitleLine3: string,
  boxedLabel: string
): Table {
  const deptText = (data.departmentName || "UBND XÃ HÀM YÊN").toUpperCase();
  const schoolText = (data.schoolName || "TRƯỜNG THCS TÂN LOAN").toUpperCase();
  const yearText = `NĂM HỌC ${data.schoolYear || "2026 - 2027"}`;
  const timeText = `Thời gian: ${data.time || "45 phút"} (Không kể thời gian giao đề)`;

  // Left Cell children:
  const leftChildren: any[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: deptText, font: COMMON_FONT, size: 20, bold: true })],
      spacing: { before: 0, after: 40 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: schoolText, font: COMMON_FONT, size: 20, bold: true })],
      spacing: { before: 0, after: 80 }
    }),
  ];

  if (boxedLabel) {
    leftChildren.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 1800, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: boxedLabel, font: COMMON_FONT, size: 18, bold: true })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    );
  } else {
    leftChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "---------", font: COMMON_FONT, size: 18, bold: false })],
      })
    );
  }

  // Right Cell children:
  const rightChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: titleText.toUpperCase(), font: COMMON_FONT, size: 22, bold: true })],
      spacing: { before: 0, after: 40 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: yearText, font: COMMON_FONT, size: 20, bold: true })],
      spacing: { before: 0, after: 40 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: subTitleLine3, font: COMMON_FONT, size: 18, bold: true })],
      spacing: { before: 0, after: 40 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: timeText, font: COMMON_FONT, size: 18, italics: true, bold: false })],
    })
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: leftChildren,
            verticalAlign: VerticalAlign.CENTER
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: rightChildren,
            verticalAlign: VerticalAlign.CENTER
          })
        ]
      })
    ]
  });
}

async function createImageParagraph(dataUrl: string): Promise<Paragraph> {
  const dims = await getImageDimensions(dataUrl);
  // Scale down if too wide, max width ~ 450
  let w = dims.width;
  let h = dims.height;
  if (w > 450) {
    h = Math.round(h * (450 / w));
    w = 450;
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        type: dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg") ? "jpg" : "png",
        data: base64ToUint8Array(dataUrl),
        transformation: {
          width: w,
          height: h,
        },
      }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
}

function createOptionParagraph(optionText: string): Paragraph {
  const match = (optionText || "").match(/^([A-D]\.\s*)(.*)$/);
  if (match) {
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: match[1],
          font: COMMON_FONT,
          size: BASE_SIZE,
          bold: true,
          color: "0000FF",
        }),
        new TextRun({
          text: match[2],
          font: COMMON_FONT,
          size: BASE_SIZE,
          bold: false,
          color: "000000",
        }),
      ],
      spacing: PARAGRAPH_SPACING,
    });
  }
  return createText(optionText);
}

function createText(text: string, bold = false, italics = false, align: any = AlignmentType.JUSTIFIED, color?: string, customSize?: number): Paragraph {
  return new Paragraph({
    alignment: align,
    children: [
      new TextRun({
        text,
        font: COMMON_FONT,
        size: customSize || BASE_SIZE,
        bold,
        italics,
        color,
      }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
}

function createTextWithIndent(
  text: string,
  bold = false,
  italics = false,
  align: any = AlignmentType.JUSTIFIED,
  color?: string,
  indent?: { firstLine?: number; left?: number }
): Paragraph {
  return new Paragraph({
    alignment: align,
    indent: indent || { firstLine: 720 }, // 720 dxa = ~1.27 cm (chuẩn thụt đầu dòng thể thức văn bản)
    children: [
      new TextRun({
        text,
        font: COMMON_FONT,
        size: BASE_SIZE,
        bold,
        italics,
        color,
      }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
}

function createCell(
  text: string,
  colSpan = 1,
  rowSpan = 1,
  bold = false,
  align: any = AlignmentType.CENTER,
  color?: string,
  italics = false
): TableCell {
  return new TableCell({
    columnSpan: colSpan,
    rowSpan: rowSpan,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text, font: COMMON_FONT, size: TABLE_SIZE, bold, color, italics })],
        spacing: { before: 60, after: 60 }
      })
    ]
  });
}

function createSpecDescCell(s: SpecRow, isMath = false): TableCell {
  const children: Paragraph[] = [];
  const enriched = isMath 
    ? enrichSpecificationItem(s.content || "", s.topic || "", s.nb_desc, s.th_desc, s.vd_desc)
    : { nb: s.nb_desc || "", th: s.th_desc || "", vd: s.vd_desc || "" };
  
  const addDescSection = (title: string, desc?: string, count?: number) => {
    if (!desc || !desc.trim()) return;
    const cleanDesc = desc.trim();
    const lines = cleanDesc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    // Section Header (Nhận biết:, Thông hiểu:, Vận dụng:)
    children.push(new Paragraph({
      spacing: { before: children.length === 0 ? 30 : 60, after: 20 },
      children: [
        new TextRun({ 
          text: `${title}:`, 
          bold: true, 
          italics: true, 
          font: COMMON_FONT, 
          size: TABLE_SIZE 
        })
      ]
    }));

    // Bullet lines
    lines.forEach(line => {
      const bulletText = line.startsWith("–") || line.startsWith("-") || line.startsWith("+") 
        ? line 
        : `– ${line}`;
      children.push(new Paragraph({
        spacing: { before: 15, after: 15 },
        children: [
          new TextRun({ 
            text: bulletText, 
            font: COMMON_FONT, 
            size: TABLE_SIZE,
            underline: (count && count > 0) ? { type: UnderlineType.SINGLE, color: "000000" } : undefined
          })
        ]
      }));
    });
  };

  addDescSection("Nhận biết", enriched.nb, s.nb_count);
  addDescSection("Thông hiểu", enriched.th, s.th_count);
  addDescSection("Vận dụng", enriched.vd, s.vd_count);

  return new TableCell({
    children: children.length ? children : [new Paragraph({ text: "" })],
    verticalAlign: VerticalAlign.CENTER,
  });
}

function createAnswerCell(answerText: string, colSpan = 1, rowSpan = 1): TableCell {
  const lines = formatAnswerLines(answerText);
  const children: Paragraph[] = [];

  if (lines.length === 0) {
    children.push(new Paragraph({ text: "", spacing: { before: 40, after: 40 } }));
  } else {
    lines.forEach((line, idx) => {
      const matchLetter = line.match(/^([a-eA-E][\.\)])\s*(.*)$/);
      const matchDash = line.match(/^([\-•])\s*(.*)$/);
      const matchPlus = line.match(/^([\+\*])\s*(.*)$/);
      const matchNum = line.match(/^([1-9][\.\)])\s*(.*)$/);

      if (matchLetter) {
        const subText = matchLetter[2];
        const colonIdx = subText.indexOf(":");
        if (colonIdx > 0 && colonIdx < 60) {
          const boldPart = subText.substring(0, colonIdx + 1);
          const normalPart = subText.substring(colonIdx + 1).trim();
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: idx === 0 ? 40 : 60, after: 20, line: 260 },
              children: [
                new TextRun({ text: matchLetter[1] + " " + boldPart + (normalPart ? " " : ""), font: COMMON_FONT, size: TABLE_SIZE, bold: true, color: "000000" }),
                ...(normalPart ? [new TextRun({ text: normalPart, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" })] : []),
              ],
            })
          );
        } else {
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: idx === 0 ? 40 : 60, after: 20, line: 260 },
              children: [
                new TextRun({ text: matchLetter[1] + " ", font: COMMON_FONT, size: TABLE_SIZE, bold: true, color: "000000" }),
                new TextRun({ text: subText, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" }),
              ],
            })
          );
        }
      } else if (matchDash) {
        const subText = matchDash[2];
        const colonIdx = subText.indexOf(":");
        if (colonIdx > 0 && colonIdx < 60) {
          const boldPart = subText.substring(0, colonIdx + 1);
          const normalPart = subText.substring(colonIdx + 1).trim();
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: idx === 0 ? 40 : 50, after: 20, line: 260 },
              children: [
                new TextRun({ text: "- " + boldPart + (normalPart ? " " : ""), font: COMMON_FONT, size: TABLE_SIZE, bold: true, color: "000000" }),
                ...(normalPart ? [new TextRun({ text: normalPart, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" })] : []),
              ],
            })
          );
        } else {
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: idx === 0 ? 40 : 40, after: 20, line: 260 },
              children: [
                new TextRun({ text: "- " + subText, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" }),
              ],
            })
          );
        }
      } else if (matchPlus) {
        const subText = matchPlus[2];
        const colonIdx = subText.indexOf(":");
        if (colonIdx > 0 && colonIdx < 60) {
          const boldPart = subText.substring(0, colonIdx + 1);
          const normalPart = subText.substring(colonIdx + 1).trim();
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 240 },
              spacing: { before: 20, after: 20, line: 260 },
              children: [
                new TextRun({ text: "+ " + boldPart + (normalPart ? " " : ""), font: COMMON_FONT, size: TABLE_SIZE, bold: true, color: "000000" }),
                ...(normalPart ? [new TextRun({ text: normalPart, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" })] : []),
              ],
            })
          );
        } else {
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 240 },
              spacing: { before: 20, after: 20, line: 260 },
              children: [
                new TextRun({ text: "+ " + subText, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" }),
              ],
            })
          );
        }
      } else if (matchNum) {
        const subText = matchNum[2];
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 240 },
            spacing: { before: 20, after: 20, line: 260 },
            children: [
              new TextRun({ text: matchNum[1] + " ", font: COMMON_FONT, size: TABLE_SIZE, bold: true, color: "000000" }),
              new TextRun({ text: subText, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" }),
            ],
          })
        );
      } else {
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: idx === 0 ? 40 : 30, after: 20, line: 260 },
            children: [
              new TextRun({ text: line, font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" }),
            ],
          })
        );
      }
    });
  }

  return new TableCell({
    columnSpan: colSpan,
    rowSpan: rowSpan,
    verticalAlign: VerticalAlign.TOP,
    children,
  });
}

function getEndContent(data: TestData): string {
  if (data.endContent && data.endContent.trim()) {
    return data.endContent.trim();
  }
  if (data.matrix && data.matrix.length > 0) {
    const lastRow = data.matrix[data.matrix.length - 1];
    if (lastRow.topic) return lastRow.topic;
  }
  const grade = data.grade || "8";
  const period = (data.period || "").toLowerCase();
  if (period.includes("giữa") && (period.includes("i") || period.includes("1")) && !period.includes("ii")) {
    if (grade === "6") return "Chủ đề 2 - Mạng máy tính và Internet";
    if (grade === "7") return "Chủ đề 2 - Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin";
    if (grade === "8") return "Chủ đề 3 - Đạo đức pháp luật và văn hoá trong môi trường số";
    if (grade === "9") return "Chủ đề 2 - Mạng máy tính và Internet";
  }
  if (period.includes("cuối") && (period.includes("i") || period.includes("1")) && !period.includes("ii")) {
    if (grade === "6") return "Chủ đề 3 - Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin";
    if (grade === "7") return "Chủ đề 3 - Đạo đức, pháp luật và văn hóa trong môi trường số";
    if (grade === "8") return "Chủ đề 4 - Ứng dụng tin học"; // Not modifying this since it is specific to tin hoc, maybe it does not matter for math
    if (grade === "9") return "Chủ đề 3 - Đạo đức, pháp luật và văn hoá trong môi trường số";
  }
  return "Chủ đề 3 - Đạo đức pháp luật và văn hoá trong môi trường số";
}


function sanitizeMathTypeLatex(text: string): string {
  if (typeof text !== "string") return text;
  
  // Replace non-breaking spaces
  let sanitized = text.replace(/\u00A0/g, " ");
  
  // Replace \( ... \) with $ ... $
  sanitized = sanitized.replace(/\\\((.*?)\\\)/g, "$$$1$$");

  sanitized = sanitized.replace(/\$([^\$]+)\$/g, (match, mathContent) => {
    let cleanMath = mathContent
      .replace(/[–—−]/g, "-")
      .replace(/\\degree\b/g, "^\\circ")
      .replace(/\\R\b/g, "\\mathbb{R}")
      .replace(/\\N\b/g, "\\mathbb{N}")
      .replace(/\\Z\b/g, "\\mathbb{Z}")
      .replace(/\\Q\b/g, "\\mathbb{Q}")
      .replace(/\\C\b/g, "\\mathbb{C}")
      .replace(/\\geqslant\b/g, "\\ge")
      .replace(/\\leqslant\b/g, "\\le");
    return "$" + cleanMath + "$";
  });

  return sanitized;
}

function deeplySanitizeData(obj: any): any {
  if (typeof obj === "string") {
    return sanitizeMathTypeLatex(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deeplySanitizeData);
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (key === "figureSvg" || key === "figureTikz") {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deeplySanitizeData(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function generateDocx(data: TestData, specificVariantCode?: string) {
  // Sanitize data specifically for MathType LaTeX conversion before generating Docx
  data = deeplySanitizeData(data);
  const sections = [];
  const isMath = data.subject?.toLowerCase().trim().includes("toán") || data.subject === "Toán" || (data.matrix && data.matrix.some((r: any) => (r.sa_nb || 0) + (r.sa_th || 0) + (r.sa_vd || 0) > 0));
  const periodUpper = (data.period || "GIỮA HỌC KỲ I").toUpperCase();
  const gradeText = data.grade || "8";
  const resolvedEndContent = getEndContent(data);
  const isPractice = (data.examFormat || "").toLowerCase().includes("thực hành");
  const formatText = isPractice
    ? "Kết hợp giữa trắc nghiệm và thực hành (tỉ lệ 70% trắc nghiệm, 30% thực hành)."
    : "Kết hợp giữa trắc nghiệm và tự luận (tỉ lệ 70% trắc nghiệm, 30% tự luận).";
  const appliedLine = isPractice
    ? "- Phần thực hành: 3,0 điểm (3 câu)"
    : "- Phần tự luận: 3,0 điểm (3 câu)";

  // 1. Matrix Section (LANDSCAPE)
  if (data.matrix && data.matrix.length > 0) {
    // Matrix calculation and grouping
    const isFinalExam = (data.period || "").toLowerCase().includes("cuối");
    data.matrix = normalizeMatrixPercentages(data.matrix, isFinalExam);
    let firstHalfIndices: number[] = [];
    let secondHalfIndices: number[] = [];

    if (isFinalExam && data.matrix.length > 1) {
      const hasHalfGroup = data.matrix.some(r => r.halfGroup === "firstHalf" || r.halfGroup === "secondHalf");
      if (hasHalfGroup) {
        data.matrix.forEach((r, idx) => {
          if (r.halfGroup === "secondHalf") {
            secondHalfIndices.push(idx);
          } else {
            firstHalfIndices.push(idx);
          }
        });
      } else {
        let splitIdx = -1;
        let accPoints = 0;
        for (let i = 0; i < data.matrix.length; i++) {
          const topicStr = data.matrix[i].topic || "";
          const isLaterTopic = /chủ đề\s*([4-9]|[1-9][0-9])/i.test(topicStr);
          if (i > 0 && isLaterTopic && firstHalfIndices.length > 0) {
            splitIdx = i;
            break;
          }
          accPoints += Number(data.matrix[i].totalPoints) || 0;
          if (accPoints >= 3.25 && i > 0) {
            splitIdx = i;
            break;
          }
          firstHalfIndices.push(i);
        }
        if (splitIdx > 0) {
          secondHalfIndices = data.matrix.map((_, idx) => idx).slice(splitIdx);
        } else {
          const cut = Math.max(1, Math.floor(data.matrix.length * 0.45));
          firstHalfIndices = data.matrix.map((_, idx) => idx).slice(0, cut);
          secondHalfIndices = data.matrix.map((_, idx) => idx).slice(cut);
        }
      }
    }

    const totalPeriods = data.matrix.reduce((sum, r) => sum + (Number(r.periods) || 0), 0) || 15;
    const firstHalfPeriods = firstHalfIndices.length > 0
      ? firstHalfIndices.reduce((sum, idx) => sum + (Number(data.matrix[idx].periods) || 0), 0) || 7
      : 0;
    const secondHalfPeriods = secondHalfIndices.length > 0
      ? secondHalfIndices.reduce((sum, idx) => sum + (Number(data.matrix[idx].periods) || 0), 0) || 8
      : 0;

    const isMath = data.subject?.toLowerCase().trim().includes("toán") || data.subject === "Toán";
    const totalMcqNb = data.matrix.reduce((sum, r) => sum + (Number(r.mcq_nb) || 0), 0);
    const totalMcqTh = data.matrix.reduce((sum, r) => sum + (Number(r.mcq_th) || 0), 0);
    const totalMcqVd = data.matrix.reduce((sum, r) => sum + (Number(r.mcq_vd) || 0), 0);
    
    const totalTfNb = data.matrix.reduce((sum, r) => sum + (Number(r.tf_nb) || 0), 0);
    const totalTfTh = data.matrix.reduce((sum, r) => sum + (Number(r.tf_th) || 0), 0);
    const totalTfVd = data.matrix.reduce((sum, r) => sum + (Number(r.tf_vd) || 0), 0);

    const totalSaNb = data.matrix.reduce((sum, r) => sum + (Number(r.sa_nb) || 0), 0);
    const totalSaTh = data.matrix.reduce((sum, r) => sum + (Number(r.sa_th) || 0), 0);
    const totalSaVd = data.matrix.reduce((sum, r) => sum + (Number(r.sa_vd) || 0), 0);

    const totalTlNb = data.matrix.reduce((sum, r) => sum + (Number(r.tl_nb) || 0), 0);
    const totalTlTh = data.matrix.reduce((sum, r) => sum + (Number(r.tl_th) || 0), 0);
    const totalTlVd = data.matrix.reduce((sum, r) => sum + (Number(r.tl_vd) || 0), 0);

    const totalAllNb = data.matrix.reduce((sum, r) => sum + (Number(r.total_nb) || 0), 0);
    const totalAllTh = data.matrix.reduce((sum, r) => sum + (Number(r.total_th) || 0), 0);
    const totalAllVd = data.matrix.reduce((sum, r) => sum + (Number(r.total_vd) || 0), 0);

    const mcqNbPoints = (totalMcqNb * 0.25).toFixed(totalMcqNb % 4 === 0 ? 0 : 2);
    const mcqThPoints = (totalMcqTh * 0.25).toFixed(totalMcqTh % 4 === 0 ? 0 : 2);
    const mcqVdPoints = totalMcqVd > 0 ? (totalMcqVd * 0.25).toFixed(2) : "0";

    const tfNbPoints = (totalTfNb * 0.25).toFixed(totalTfNb % 4 === 0 ? 0 : 2);
    const tfThPoints = (totalTfTh * 0.25).toFixed(totalTfTh % 4 === 0 ? 0 : 2);
    const tfVdPoints = totalTfVd > 0 ? (totalTfVd * 0.25).toFixed(2) : "0";

    const saNbPoints = (totalSaNb * 0.5).toFixed(totalSaNb % 2 === 0 ? 0 : 2);
    const saThPoints = (totalSaTh * 0.5).toFixed(totalSaTh % 2 === 0 ? 0 : 2);
    const saVdPoints = (totalSaVd * 0.5).toFixed(totalSaVd % 2 === 0 ? 0 : 2);

    const tlNbPoints = totalTlNb > 0 ? String(totalTlNb) : "0";
    const tlThPoints = totalTlTh > 0 ? String(totalTlTh) : "0";
    const tlVdPoints = totalTlVd > 0 ? String(totalTlVd) : (isMath ? "2" : "3");

    const totalNbPoints = isMath
      ? (Number(mcqNbPoints) + Number(tfNbPoints) + Number(saNbPoints) + Number(tlNbPoints)).toFixed(0)
      : (Number(mcqNbPoints) + Number(tfNbPoints) + Number(tlNbPoints)).toFixed(0);
    const totalThPoints = isMath
      ? (Number(mcqThPoints) + Number(tfThPoints) + Number(saThPoints) + Number(tlThPoints)).toFixed(0)
      : (Number(mcqThPoints) + Number(tfThPoints) + Number(tlThPoints)).toFixed(0);
    const totalVdPoints = isMath
      ? (Number(mcqVdPoints) + Number(tfVdPoints) + Number(saVdPoints) + Number(tlVdPoints)).toFixed(0)
      : (Number(mcqVdPoints) + Number(tfVdPoints) + Number(tlVdPoints)).toFixed(0);

    const getTopicSpan = (idx: number) => {
      let span = 1;
      for (let i = idx + 1; i < data.matrix.length; i++) {
        if (data.matrix[i].topic === data.matrix[idx].topic) {
          span++;
        } else {
          break;
        }
      }
      return span;
    };

    const matrixTableRows: TableRow[] = isMath
      ? [
          new TableRow({
            children: [
              createCell("Chương/\nchủ đề", 1, 3, true),
              createCell("Nội dung/đơn vị kiến thức", 1, 3, true),
              createCell("Số\ntiết", 1, 3, true, AlignmentType.CENTER, "0052CC"),
              createCell("%\nThời\nlượng", 1, 3, true, AlignmentType.CENTER, "0052CC"),
              createCell("Các mức độ đánh giá", 12, 1, true, AlignmentType.CENTER, "0052CC"),
              createCell("Tổng số câu / số lệnh hỏi", 3, 2, true),
              createCell("Tổng\nđiểm", 1, 3, true),
            ]
          }),
          new TableRow({
            children: [
              createCell("Nhiều lựa chọn", 3, 1, true),
              createCell("Đúng - Sai", 3, 1, true),
              createCell("Trả lời ngắn", 3, 1, true),
              createCell("Tự luận", 3, 1, true),
            ]
          }),
          new TableRow({
            children: [
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết", 1, 1, true), createCell("Hiểu", 1, 1, true), createCell("VD", 1, 1, true),
            ]
          }),
        ]
      : [
          new TableRow({
            children: [
              createCell("Chương/\nchủ đề", 1, 3, true),
              createCell("Nội dung/đơn vị kiến thức", 1, 3, true),
              createCell("Số\ntiết", 1, 3, true, AlignmentType.CENTER, "0052CC"),
              createCell("%\nThời\nlượng", 1, 3, true, AlignmentType.CENTER, "0052CC"),
              createCell("Các mức độ nhận thức", 9, 1, true, AlignmentType.CENTER, "0052CC"),
              createCell("Tổng số câu", 3, 2, true),
              createCell("Tổng\nđiểm", 1, 3, true),
            ]
          }),
          new TableRow({
            children: [
              createCell("Nhiều lựa chọn", 3, 1, true),
              createCell("Đúng - Sai", 3, 1, true),
              createCell(isPractice ? "Thực hành" : "Tự luận", 3, 1, true),
            ]
          }),
          new TableRow({
            children: [
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết"), createCell("Hiểu"), createCell("VD"),
              createCell("Biết", 1, 1, true), createCell("Hiểu", 1, 1, true), createCell("VD", 1, 1, true),
            ]
          }),
        ];

    data.matrix.forEach((m, idx) => {
      const isTopicStart = idx === 0 || data.matrix[idx - 1].topic !== m.topic;
      const topicSpan = isTopicStart ? getTopicSpan(idx) : 1;

      const isFirstHalfStart = isFinalExam && firstHalfIndices.length > 0 && idx === firstHalfIndices[0];
      const isSecondHalfStart = isFinalExam && secondHalfIndices.length > 0 && idx === secondHalfIndices[0];
      const inFirstHalf = isFinalExam && firstHalfIndices.includes(idx);
      const inSecondHalf = isFinalExam && secondHalfIndices.includes(idx);

      const rowCells: TableCell[] = [];

      if (isTopicStart) {
        rowCells.push(createCell(m.topic || "", 1, topicSpan, true, AlignmentType.LEFT));
      }

      rowCells.push(createCell(m.content || "", 1, 1, false, AlignmentType.LEFT));

      if (isFinalExam) {
        if (isFirstHalfStart) {
          rowCells.push(createCell(String(firstHalfPeriods), 1, firstHalfIndices.length, false));
        } else if (isSecondHalfStart) {
          rowCells.push(createCell(String(secondHalfPeriods), 1, secondHalfIndices.length, false));
        } else if (!inFirstHalf && !inSecondHalf) {
          rowCells.push(createCell(String(m.periods || "")));
        }
      } else {
        rowCells.push(createCell(String(m.periods || "")));
      }

      if (isFinalExam) {
        if (isFirstHalfStart) {
          rowCells.push(createCell("30.0", 1, firstHalfIndices.length, true, AlignmentType.CENTER, "0052CC"));
        } else if (isSecondHalfStart) {
          rowCells.push(createCell("70.0", 1, secondHalfIndices.length, true, AlignmentType.CENTER, "0052CC"));
        } else if (!inFirstHalf && !inSecondHalf) {
          rowCells.push(createCell(m.percentage ? `${m.percentage}%` : "", 1, 1, true, AlignmentType.CENTER, "0052CC"));
        }
      } else {
        rowCells.push(createCell(m.percentage ? `${m.percentage}%` : "", 1, 1, true, AlignmentType.CENTER, "0052CC"));
      }

      // MCQ
      rowCells.push(createCell(formatDocxCount(m.mcq_nb)));
      rowCells.push(createCell(formatDocxCount(m.mcq_th)));
      rowCells.push(createCell(formatDocxCount(m.mcq_vd)));

      // TF
      rowCells.push(createCell(formatDocxCount(m.tf_nb)));
      rowCells.push(createCell(formatDocxCount(m.tf_th)));
      rowCells.push(createCell(formatDocxCount(m.tf_vd)));

      // Short Answer for Math
      if (isMath) {
        rowCells.push(createCell(formatDocxCount(m.sa_nb)));
        rowCells.push(createCell(formatDocxCount(m.sa_th)));
        rowCells.push(createCell(formatDocxCount(m.sa_vd)));
      }

      // TL
      rowCells.push(createCell(formatDocxCount(m.tl_nb)));
      rowCells.push(createCell(formatDocxCount(m.tl_th)));
      rowCells.push(createCell(formatDocxCount(m.tl_vd)));

      // Totals (in Red "C00000")
      rowCells.push(createCell(formatDocxCount(m.total_nb), 1, 1, true, AlignmentType.CENTER, "C00000"));
      rowCells.push(createCell(formatDocxCount(m.total_th), 1, 1, true, AlignmentType.CENTER, "C00000"));
      rowCells.push(createCell(formatDocxCount(m.total_vd) || (Number(m.totalPoints || 0) > 0 && m.total_vd === 0 ? "0" : formatDocxCount(m.total_vd)), 1, 1, true, AlignmentType.CENTER, "C00000"));

      // Points
      rowCells.push(createCell(Number(m.totalPoints || 0) > 0 ? Number(m.totalPoints).toFixed(2) : "", 1, 1, true));

      matrixTableRows.push(new TableRow({ children: rowCells }));
    });

    if (isMath) {
      // Math Summary Row 1
      matrixTableRows.push(new TableRow({
        children: [
          createCell("Số lệnh hỏi TN/ Số câu TL", 2, 1, true),
          createCell(String(totalPeriods), 1, 1, true),
          createCell("100.0", 1, 1, true, AlignmentType.CENTER, "0052CC"),
          createCell(formatDocxCount(totalMcqNb) || "12", 1, 1, true),
          createCell(formatDocxCount(totalMcqTh), 1, 1, true),
          createCell(formatDocxCount(totalMcqVd), 1, 1, true),
          createCell(formatDocxCount(totalTfNb) || "4", 1, 1, true),
          createCell(formatDocxCount(totalTfTh) || "2", 1, 1, true),
          createCell(formatDocxCount(totalTfVd) || "2", 1, 1, true),
          createCell(formatDocxCount(totalSaNb) || "1", 1, 1, true),
          createCell(formatDocxCount(totalSaTh) || "2", 1, 1, true),
          createCell(formatDocxCount(totalSaVd) || "1", 1, 1, true),
          createCell(formatDocxCount(totalTlNb), 1, 1, true),
          createCell(formatDocxCount(totalTlTh) || "1", 1, 1, true),
          createCell(formatDocxCount(totalTlVd) || "2", 1, 1, true),
          createCell(formatDocxCount(totalAllNb) || "17", 1, 1, true),
          createCell(formatDocxCount(totalAllTh) || "5", 1, 1, true),
          createCell(formatDocxCount(totalAllVd) || "5", 1, 1, true),
          createCell("10", 1, 1, true)
        ]
      }));

      // Math Summary Row 2
      matrixTableRows.push(new TableRow({
        children: [
          createCell("Tổng điểm", 2, 1, true),
          createCell(""),
          createCell(""),
          createCell(mcqNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(mcqThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(mcqVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(saNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(saThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(saVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(totalNbPoints || "4", 1, 1, true),
          createCell(totalThPoints || "3", 1, 1, true),
          createCell(totalVdPoints || "3", 1, 1, true),
          createCell("10", 1, 1, true)
        ]
      }));

      // Math Summary Row 3 (Tính động theo điểm thực tế)
      const mathMcqPoints = Number(mcqNbPoints) + Number(mcqThPoints) + Number(mcqVdPoints);
      const mathTfPoints = Number(tfNbPoints) + Number(tfThPoints) + Number(tfVdPoints);
      const mathSaPoints = Number(saNbPoints) + Number(saThPoints) + Number(saVdPoints);
      const mathTlPoints = Number(tlNbPoints) + Number(tlThPoints) + Number(tlVdPoints);

      const mathMcqPercentStr = mathMcqPoints > 0 ? `${Math.round(mathMcqPoints * 10)}%` : "30%";
      const mathTfPercentStr = mathTfPoints > 0 ? `${Math.round(mathTfPoints * 10)}%` : "20%";
      const mathSaPercentStr = mathSaPoints > 0 ? `${Math.round(mathSaPoints * 10)}%` : "";
      const mathTlPercentStr = mathTlPoints > 0 ? `${Math.round(mathTlPoints * 10)}%` : "30%";

      const mathNbPercent = Math.round(Number(totalNbPoints || 4) * 10);
      const mathThPercent = Math.round(Number(totalThPoints || 3) * 10);
      const mathVdPercent = Math.round(Number(totalVdPoints || 3) * 10);

      matrixTableRows.push(new TableRow({
        children: [
          createCell("Tỉ lệ %", 2, 1, true),
          createCell(""),
          createCell(""),
          createCell(mathMcqPercentStr, 3, 1, true),
          createCell(mathTfPercentStr, 3, 1, true),
          createCell(mathSaPercentStr, 3, 1, true),
          createCell(mathTlPercentStr, 3, 1, true),
          createCell(`${mathNbPercent}%`, 1, 1, true),
          createCell(`${mathThPercent}%`, 1, 1, true),
          createCell(`${mathVdPercent}%`, 1, 1, true),
          createCell("100%", 1, 1, true)
        ]
      }));
    } else {
      // Informatics Summary Row 1
      matrixTableRows.push(new TableRow({
        children: [
          createCell("Số lệnh hỏi TN/ Số câu TL", 2, 1, true),
          createCell(String(totalPeriods), 1, 1, true),
          createCell("100.0", 1, 1, true, AlignmentType.CENTER, "0052CC"),
          createCell(formatDocxCount(totalMcqNb), 1, 1, true),
          createCell(formatDocxCount(totalMcqTh), 1, 1, true),
          createCell(totalMcqVd > 0 ? formatDocxCount(totalMcqVd) : "0", 1, 1, true),
          createCell(formatDocxCount(totalTfNb), 1, 1, true),
          createCell(formatDocxCount(totalTfTh), 1, 1, true),
          createCell(totalTfVd > 0 ? formatDocxCount(totalTfVd) : "0", 1, 1, true),
          createCell(totalTlNb > 0 ? formatDocxCount(totalTlNb) : "0", 1, 1, true),
          createCell(totalTlTh > 0 ? formatDocxCount(totalTlTh) : "0", 1, 1, true),
          createCell(formatDocxCount(totalTlVd) || "3", 1, 1, true),
          createCell(formatDocxCount(totalAllNb) || "16", 1, 1, true),
          createCell(formatDocxCount(totalAllTh) || "12", 1, 1, true),
          createCell(formatDocxCount(totalAllVd) || "3", 1, 1, true),
          createCell("10", 1, 1, true)
        ]
      }));

      // Informatics Summary Row 2
      matrixTableRows.push(new TableRow({
        children: [
          createCell("Tổng điểm", 2, 1, true),
          createCell(""),
          createCell(""),
          createCell(mcqNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(mcqThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(mcqVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tfVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlNbPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlThPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(tlVdPoints, 1, 1, true, AlignmentType.CENTER, "C00000"),
          createCell(totalNbPoints, 1, 1, true),
          createCell(totalThPoints, 1, 1, true),
          createCell(totalVdPoints, 1, 1, true),
          createCell("10", 1, 1, true)
        ]
      }));

      // Informatics Summary Row 3 (Tính động theo điểm thực tế)
      const infoMcqPoints = Number(mcqNbPoints) + Number(mcqThPoints) + Number(mcqVdPoints);
      const infoTfPoints = Number(tfNbPoints) + Number(tfThPoints) + Number(tfVdPoints);
      const infoTlPoints = Number(tlNbPoints) + Number(tlThPoints) + Number(tlVdPoints);

      const infoMcqPercentStr = infoMcqPoints > 0 ? `${Math.round(infoMcqPoints * 10)}%` : "30%";
      const infoTfPercentStr = infoTfPoints > 0 ? `${Math.round(infoTfPoints * 10)}%` : "40%";
      const infoTlPercentStr = infoTlPoints > 0 ? `${Math.round(infoTlPoints * 10)}%` : "30%";

      const infoNbPercent = Math.round(Number(totalNbPoints || 4) * 10);
      const infoThPercent = Math.round(Number(totalThPoints || 3) * 10);
      const infoVdPercent = Math.round(Number(totalVdPoints || 3) * 10);

      matrixTableRows.push(new TableRow({
        children: [
          createCell("Tỉ lệ %", 2, 1, true),
          createCell(""),
          createCell(""),
          createCell(infoMcqPercentStr, 3, 1, true),
          createCell(infoTfPercentStr, 3, 1, true),
          createCell(infoTlPercentStr, 3, 1, true),
          createCell(`${infoNbPercent}%`, 1, 1, true),
          createCell(`${infoThPercent}%`, 1, 1, true),
          createCell(`${infoVdPercent}%`, 1, 1, true),
          createCell("100%", 1, 1, true)
        ]
      }));
    }

    if (isMath) {
      const mathObj = getMathStandardObjectives(gradeText, data.period || "");
      const mathChildren: (Paragraph | Table)[] = [
        createOfficialHeaderTable(
          data,
          `KHUNG MA TRẬN & ĐẶC TẢ KIỂM TRA ${periodUpper}`,
          `Môn: Toán ${gradeText}`,
          "Ma trận & Đặc tả"
        ),
        new Paragraph({ spacing: { after: 180 }, children: [] }),

        // I. MỤC TIÊU
        createText(`I. MỤC TIÊU`, true, false, AlignmentType.LEFT),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "1. Về kiến thức: ", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
            new TextRun({ text: mathObj.knowledge.title, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: "+ Số học: ", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
            new TextRun({ text: mathObj.knowledge.arithmetic, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: "+ Hình học: ", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
            new TextRun({ text: mathObj.knowledge.geometry, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
      ];

      if (mathObj.knowledge.statistics) {
        mathChildren.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 720, firstLine: 360 },
            children: [
              new TextRun({ text: "+ Thống kê và Xác suất: ", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
              new TextRun({ text: mathObj.knowledge.statistics, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
            ],
            spacing: PARAGRAPH_SPACING,
          })
        );
      }

      mathChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "2. Về năng lực: ", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
            new TextRun({ text: "Kiểm tra và đánh giá các năng lực của HS như năng lực tư duy và lập luận toán học, năng lực giải quyết các vấn đề toán học, năng lực mô hình hóa toán học, năng lực giao tiếp toán học, năng lực sử dụng các công cụ và phương tiện học toán, thể hiện thông qua một số dạng bài tập như:", font: COMMON_FONT, size: BASE_SIZE, bold: false }),
          ],
          spacing: PARAGRAPH_SPACING,
        })
      );

      mathObj.competencies.forEach((comp) => {
        mathChildren.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 720, firstLine: 360 },
            children: [
              new TextRun({ text: `– ${comp}`, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
            ],
            spacing: PARAGRAPH_SPACING,
          })
        );
      });

      mathChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "3 Về phẩm chất:", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        ...mathObj.qualities.map(q => new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: `+ ${q}`, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
          ],
          spacing: PARAGRAPH_SPACING,
        })),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
        
        // II. HÌNH THỨC KIỂM TRA VÀ MA TRẬN CÂU HỎI, MA TRẬN ĐẶC TẢ.
        createText(`II. HÌNH THỨC KIỂM TRA VÀ MA TRẬN CÂU HỎI, MA TRẬN ĐẶC TẢ.`, true, false, AlignmentType.LEFT),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "1. Hình thức kiểm tra.", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: `- Thời điểm kiểm tra: Kiểm tra ${(data.period || "giữa học kì I").toLowerCase()}${(data.period || "").toLowerCase().includes("giữa") ? `, khi kết thúc nội dung: ${resolvedEndContent}` : "."}`, font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: `- Thời gian làm bài: ${data.time || ((data.period || "").toLowerCase().includes("cuối") ? "90 phút." : "45 phút.")}`, font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: `- Hình thức kiểm tra: ${formatText}`, font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "Cấu trúc:", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: "- Mức độ đề: 40% Nhận biết; 30% Thông hiểu; 30% Vận dụng.", font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: "- Phần trắc nghiệm 4 lựa chọn: 3,0 điểm (12 câu); Trắc nghiệm Đúng - Sai: 2,0 điểm (02 câu); Trả lời ngắn: 2,0 điểm (04 câu)", font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, firstLine: 360 },
          children: [
            new TextRun({ text: "- Phần tự luận: 3,0 điểm (Vận dụng: 2,0 điểm; Thông hiểu: 1 điểm)", font: COMMON_FONT, size: BASE_SIZE }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
        
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          children: [
            new TextRun({ text: "2. Ma trận câu hỏi", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
          ],
          spacing: { before: 80, after: 100 },
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: DEFAULT_BORDERS,
          rows: matrixTableRows
        })
      );

      sections.push({
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: { top: "1.5cm", bottom: "1.5cm", left: "2.0cm", right: "1.5cm" },
          },
        },
        children: [
          ...mathChildren
        ]
      });
    } else {
      sections.push({
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: { top: "1.5cm", bottom: "1.5cm", left: "2.0cm", right: "1.5cm" },
          },
        },
        children: [
          createOfficialHeaderTable(
            data,
            `KHUNG MA TRẬN ĐỀ KIỂM TRA ${periodUpper}`,
            `Môn: ${data.subject || "Tin học"} ${gradeText}`,
            "Ma trận đề"
          ),
          new Paragraph({ spacing: { after: 180 }, children: [] }),
          
          // Preamble metadata for Section I
          createText(`I. KHUNG MA TRẬN KIỂM TRA ĐÁNH GIÁ ${periodUpper}, MÔN ${data.subject?.toUpperCase() || "TIN HỌC"} ${gradeText}`, true),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            children: [
              new TextRun({ text: `- Thời điểm kiểm tra: Kiểm tra ${(data.period || "giữa học kì I").toLowerCase()}, khi kết thúc nội dung: ${resolvedEndContent}`, font: COMMON_FONT, size: BASE_SIZE }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            children: [
              new TextRun({ text: `- Thời gian làm bài: ${data.time || "45 phút"}. Hình thức kiểm tra: ${formatText}`, font: COMMON_FONT, size: BASE_SIZE }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            children: [
              new TextRun({ text: "* Cấu trúc:", font: COMMON_FONT, size: BASE_SIZE, bold: true }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 720, firstLine: 360 },
            children: [
              new TextRun({ text: `- Mức độ đề: 40% Nhận biết (16 câu/lệnh hỏi); 30% Thông hiểu (12 câu/lệnh hỏi); 30% Vận dụng (03 câu).`, font: COMMON_FONT, size: BASE_SIZE }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 720, firstLine: 360 },
            children: [
              new TextRun({ text: `- Phần trắc nghiệm 4 lựa chọn: 3,0 điểm (12 câu - gồm 8 câu Nhận biết, 4 câu Thông hiểu); Trắc nghiệm Đúng - Sai: 4,0 điểm (04 câu - 16 lệnh hỏi gồm 8 ý Nhận biết, 8 ý Thông hiểu)`, font: COMMON_FONT, size: BASE_SIZE }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 720, firstLine: 360 },
            children: [
              new TextRun({ text: appliedLine, font: COMMON_FONT, size: BASE_SIZE }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Paragraph({ spacing: { after: 140 }, children: [] }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: DEFAULT_BORDERS,
            rows: matrixTableRows
          })
        ]
      });
    }
  }

  // 2. Specification Section (LANDSCAPE)
  if (data.specification && data.specification.length > 0) {
    const specList = data.specification;

    // Calculate rowSpan for topic column
    const topicSpans: number[] = new Array(specList.length).fill(1);
    let topicIdx = 0;
    while (topicIdx < specList.length) {
      let count = 1;
      const currentTopic = (specList[topicIdx].topic || "").trim();
      while (
        topicIdx + count < specList.length &&
        currentTopic !== "" &&
        (specList[topicIdx + count].topic || "").trim() === currentTopic
      ) {
        count++;
      }
      topicSpans[topicIdx] = count;
      for (let j = 1; j < count; j++) {
        topicSpans[topicIdx + j] = 0;
      }
      topicIdx += count;
    }

    const specTableRows: TableRow[] = [
      new TableRow({
        children: [
          createCell("TT", 1, 2, true),
          createCell("Chương/ Chủ đề", 1, 2, true),
          createCell("Nội dung/Đơn vị kiến thức", 1, 2, true),
          createCell("Mức độ đánh giá", 1, 2, true),
          createCell("Số câu hỏi theo mức độ nhận thức", 3, 1, true),
        ]
      }),
      new TableRow({
        children: [
          createCell("Nhận biết", 1, 1, true),
          createCell("Thông hiểu", 1, 1, true),
          createCell("Vận dụng", 1, 1, true),
        ]
      }),
      ...specList.map((s, idx) => {
        const span = topicSpans[idx];
        const rowCells: TableCell[] = [
          createCell(String(idx + 1)),
        ];

        if (span > 0) {
          rowCells.push(createCell(s.topic || "", 1, span, true, AlignmentType.LEFT));
        }

        rowCells.push(
          createCell(s.content || "", 1, 1, false, AlignmentType.LEFT),
          createSpecDescCell(s, isMath),
          createCell(formatDocxCount(s.nb_count)),
          createCell(formatDocxCount(s.th_count)),
          createCell(formatDocxCount(s.vd_count))
        );

        return new TableRow({ children: rowCells });
      }),
      new TableRow({
        children: [
          createCell("Tổng số câu", 3, 1, true),
          createCell("", 1, 1, false),
          createCell(specList.reduce((sum, r) => sum + (Number(r.nb_count) || 0), 0) ? `${specList.reduce((sum, r) => sum + (Number(r.nb_count) || 0), 0)}TN` : (isMath ? "17TN" : "16TN"), 1, 1, true),
          createCell(specList.reduce((sum, r) => sum + (Number(r.th_count) || 0), 0) ? `${specList.reduce((sum, r) => sum + (Number(r.th_count) || 0), 0)} TN` : (isMath ? "5 TN" : "12 TN"), 1, 1, true),
          createCell(isMath ? "3 TL" : (isPractice ? "3 TH" : (data.examFormat || "").toLowerCase().includes("tự luận") ? "3 TL" : "2 TL, 1 TH"), 1, 1, true),
        ]
      }),
      new TableRow({
        children: [
          createCell("Tổng số điểm", 3, 1, true),
          createCell("", 1, 1, false),
          createCell("4", 1, 1, true),
          createCell("3", 1, 1, true),
          createCell("3", 1, 1, true),
        ]
      }),
      new TableRow({
        children: [
          createCell("Tỉ lệ %", 3, 1, true, AlignmentType.CENTER, undefined, true),
          createCell("", 1, 1, false),
          createCell("40%", 1, 1, true, AlignmentType.CENTER, undefined, true),
          createCell("30%", 1, 1, true, AlignmentType.CENTER, undefined, true),
          createCell("30%", 1, 1, true, AlignmentType.CENTER, undefined, true),
        ]
      }),
      new TableRow({
        children: [
          createCell("Tỉ lệ chung", 3, 1, true),
          createCell("", 1, 1, false),
          createCell("70%", 2, 1, true),
          createCell("30%", 1, 1, true),
        ]
      })
    ];

    sections.push({
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
          },
          margin: { top: "1.5cm", bottom: "1.5cm", left: "2.0cm", right: "1.5cm" },
        },
      },
      children: [
        createOfficialHeaderTable(
          data,
          `BẢNG ĐẶC TẢ ĐỀ KIỂM TRA ${periodUpper}`,
          `Môn: ${isMath ? "Toán" : (data.subject || "Tin học")} ${gradeText}`,
          "Bản đặc tả"
        ),
        new Paragraph({ spacing: { after: 180 }, children: [] }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: DEFAULT_BORDERS,
          rows: specTableRows
        })
      ]
    });
  }

  // Helper function to build Exam Paper Section for a variant
  function buildExamPaperSection(variant: ExamVariant): any {
    const mcqQuestions = (variant.mcq || []).flatMap((q) => {
      const options = q.options || [];
      const hasFigure = !!(q.figureImageBuffer || q.figureSvg || q.imageUrl);
      
      const maxLen = Math.max(...options.map((o) => (o || "").trim().length), 0);
      const totalLen = options.reduce((sum, o) => sum + (o || "").trim().length, 0);

      let optionTableRows: TableRow[] = [];

      // If question has a figure, option layout uses narrower column widths
      if (hasFigure) {
        if (maxLen <= 24 && totalLen <= 80) {
          optionTableRows = [
            new TableRow({
              children: [
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] }),
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] }),
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] }),
              ],
            }),
          ];
        } else {
          optionTableRows = [
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] })],
            }),
          ];
        }
      } else {
        if (maxLen <= 18 && totalLen <= 70) {
          optionTableRows = [
            new TableRow({
              children: [
                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] }),
                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] }),
                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] }),
                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] }),
              ],
            }),
          ];
        } else if (maxLen <= 42 && totalLen <= 150) {
          optionTableRows = [
            new TableRow({
              children: [
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] }),
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] }),
                new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] }),
              ],
            }),
          ];
        } else {
          optionTableRows = [
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] })],
            }),
            new TableRow({
              children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] })],
            }),
          ];
        }
      }

      // If question has figure -> Render as 2-column Word table with hidden borders
      if (hasFigure && q.figureImageBuffer) {
        const rightChildren: any[] = [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: q.figureImageBuffer,
                transformation: { width: 195, height: 130 },
                type: "png",
              } as any),
            ],
            spacing: { before: 20, after: 20 },
          }),
        ];
        if (q.figureDescription) {
          rightChildren.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `(${q.figureDescription})`,
                  font: COMMON_FONT,
                  size: TABLE_SIZE,
                  italics: true,
                  color: "475569",
                }),
              ],
              spacing: { before: 20, after: 20 },
            })
          );
        }

        const leftChildren: any[] = [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: `Câu ${q.id}. `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "0000FF" }),
              new TextRun({ text: q.question, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
            ],
            spacing: PARAGRAPH_SPACING,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            rows: optionTableRows,
          }),
        ];

        return [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 62, type: WidthType.PERCENTAGE },
                    children: leftChildren,
                  }),
                  new TableCell({
                    width: { size: 38, type: WidthType.PERCENTAGE },
                    verticalAlign: VerticalAlign.CENTER,
                    children: rightChildren,
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 60 }, children: [] }),
        ];
      }

      // Standard 1-column layout without figure
      return [
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `Câu ${q.id}. `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "0000FF" }),
            new TextRun({ text: q.question, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: NO_BORDERS,
          rows: optionTableRows,
        }),
      ];
    });

    const tfQuestions = (variant.tf || []).flatMap((q) => {
      const rows = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Ý", font: COMMON_FONT, size: TABLE_SIZE, bold: true })],
                  spacing: { before: 40, after: 40 }
                })
              ],
            }),
            new TableCell({
              width: { size: 72, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Phát biểu / Nhận định", font: COMMON_FONT, size: TABLE_SIZE, bold: true })],
                  spacing: { before: 40, after: 40 }
                })
              ],
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Đúng", font: COMMON_FONT, size: TABLE_SIZE, bold: true })],
                  spacing: { before: 40, after: 40 }
                })
              ],
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Sai", font: COMMON_FONT, size: TABLE_SIZE, bold: true })],
                  spacing: { before: 40, after: 40 }
                })
              ],
            }),
          ],
        }),
      ];

      for (const st of q.statements || []) {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 8, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${st.id})`,
                        font: COMMON_FONT,
                        size: TABLE_SIZE,
                        bold: true,
                        color: "0000FF",
                      }),
                    ],
                    spacing: { before: 40, after: 40 },
                  }),
                ],
              }),
              new TableCell({
                width: { size: 72, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [new TextRun({ text: st.text || "", font: COMMON_FONT, size: TABLE_SIZE, bold: false, color: "000000" })],
                    spacing: { before: 40, after: 40, line: 260 }
                  })
                ],
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ text: "" })],
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ text: "" })],
              }),
            ],
          })
        );
      }

      return [
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `Câu ${q.id}. `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "0000FF" }),
            new TextRun({ text: q.question, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
          ],
          spacing: PARAGRAPH_SPACING,
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: DEFAULT_BORDERS,
          rows,
        }),
        new Paragraph({ spacing: { after: 180 }, children: [] }),
      ];
    });

    const appliedQuestions = (variant.applied || []).flatMap((q) => {
      const parsed = parseAppliedQuestion(q.question);
      const paragraphs: Paragraph[] = [];

      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `Câu ${q.id} `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "0000FF" }),
            new TextRun({ text: `(1,0 điểm): `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
            new TextRun({
              text: parsed.firstLine,
              font: COMMON_FONT,
              size: BASE_SIZE,
              bold: parsed.subLines.length > 0,
              italics: false,
              color: "000000",
            }),
          ],
          spacing: { before: 100, after: (parsed.subLines.length > 0 || q.figureImageBuffer) ? 40 : 140, line: 276 },
        })
      );

      // Render image/figure if attached to applied question
      if (q.figureImageBuffer) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: q.figureImageBuffer,
                transformation: { width: 260, height: 160 },
                type: "png",
              } as any),
            ],
            spacing: { before: 60, after: 40 },
          })
        );
        if (q.figureDescription) {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `(${q.figureDescription})`,
                  font: COMMON_FONT,
                  size: TABLE_SIZE,
                  italics: true,
                  color: "475569",
                }),
              ],
              spacing: { before: 20, after: 80 },
            })
          );
        }
      }

      // Sub-item paragraphs: a), b), c)... on separate lines, indented
      parsed.subLines.forEach((line, idx) => {
        const matchSub = line.match(/^([a-e][\.\)]|[1-9][\.\)])\s*(.*)$/);
        if (matchSub) {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 280 }, // indent ~0.5cm for sub-items
              children: [
                new TextRun({ text: matchSub[1] + " ", font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
                new TextRun({ text: matchSub[2], font: COMMON_FONT, size: BASE_SIZE, bold: false, italics: false, color: "000000" }),
              ],
              spacing: { before: 30, after: idx === parsed.subLines.length - 1 ? 140 : 30, line: 276 },
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 280 },
              children: [
                new TextRun({ text: line, font: COMMON_FONT, size: BASE_SIZE, bold: false, italics: false, color: "000000" }),
              ],
              spacing: { before: 30, after: idx === parsed.subLines.length - 1 ? 140 : 30, line: 276 },
            })
          );
        }
      });

      return paragraphs;
    });

    const isMath = data.subject?.toLowerCase().trim().includes("toán") || data.subject === "Toán" || (variant.shortAnswer && variant.shortAnswer.length > 0);

    const shortAnswerQuestions = (variant.shortAnswer || []).flatMap((q) => {
      return [
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `Câu ${q.id}. `, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "0000FF" }),
            new TextRun({ text: q.question, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
          ],
          spacing: { before: 80, after: 40, line: 276 },
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { left: 360 },
          children: [
            new TextRun({ text: "Kết quả: ", font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
            new TextRun({ text: "..................................................................................................................", font: COMMON_FONT, size: BASE_SIZE, bold: false, color: "000000" }),
            ...(q.unit ? [new TextRun({ text: ` (${q.unit})`, font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" })] : [])
          ],
          spacing: { before: 20, after: 120, line: 276 },
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { left: 360 },
          children: [
            new TextRun({ text: "................................................................................................................................", font: COMMON_FONT, size: BASE_SIZE, bold: false, color: "000000" })
          ],
          spacing: { before: 20, after: 120, line: 276 },
        })
      ];
    });

    const examChildren = [
      createOfficialHeaderTable(
        data,
        variant.title || data.title,
        `Môn: ${data.subject || "Tin học"} ${data.grade || "9"} - Mã đề: ${variant.code || "101"}`,
        "Đề chính thức"
      ),
      new Paragraph({ spacing: { after: 200 }, children: [] }),
      createText("A. TRẮC NGHIỆM KHÁCH QUAN (7,0 điểm)", true),
      new Paragraph({ spacing: { after: 100 }, children: [] }),
      createText("Phần 1. Trắc nghiệm nhiều lựa chọn (3,0 điểm)", true),
      createText(`Thí sinh trả lời từ câu 1 đến câu ${variant.mcq?.[variant.mcq.length - 1]?.id || 12}. Mỗi câu hỏi thí sinh chỉ chọn một phương án trả lời đúng nhất.`, false, true),
      new Paragraph({ spacing: { after: 140 }, children: [] }),
      ...mcqQuestions,
      new Paragraph({ spacing: { after: 240 }, children: [] }),
      createText(`Phần 2. Trắc nghiệm đúng - sai (${(isMath && shortAnswerQuestions.length > 0) ? "2,0 điểm" : "4,0 điểm"})`, true),
      createText(`Thí sinh trả lời từ câu ${variant.tf?.[0]?.id || 13} đến câu ${variant.tf?.[variant.tf.length - 1]?.id || (isMath && shortAnswerQuestions.length > 0 ? "14" : "16")}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`, false, true),
      new Paragraph({ spacing: { after: 140 }, children: [] }),
      ...tfQuestions,
      new Paragraph({ spacing: { after: 240 }, children: [] }),
    ];

    if (isMath && shortAnswerQuestions.length > 0) {
      examChildren.push(
        createText("Phần 3. Trắc nghiệm trả lời ngắn (2,0 điểm)", true),
        createText(`Thí sinh trả lời từ câu ${variant.shortAnswer?.[0]?.id || 15} đến câu ${variant.shortAnswer?.[variant.shortAnswer.length - 1]?.id || 18}. Ghi kết quả hoặc đáp số vào phần trả lời tương ứng.`, false, true),
        new Paragraph({ spacing: { after: 140 }, children: [] }),
        ...shortAnswerQuestions,
        new Paragraph({ spacing: { after: 240 }, children: [] })
      );
    }

    examChildren.push(
      createText(`B. ${isPractice ? "CÂU THỰC HÀNH TRÊN MÁY TÍNH" : "TỰ LUẬN"} (3,0 điểm)`, true),
      createText(`Thí sinh trả lời các câu hỏi từ câu ${variant.applied?.[0]?.id || (isMath && shortAnswerQuestions.length > 0 ? 19 : 17)} đến câu ${variant.applied?.[variant.applied.length - 1]?.id || (isMath && shortAnswerQuestions.length > 0 ? 21 : 19)}:`, false, true),
      new Paragraph({ spacing: { after: 140 }, children: [] }),
      ...appliedQuestions
    );

    examChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "------------------ HẾT ------------------", font: COMMON_FONT, size: BASE_SIZE, bold: true })],
        spacing: { before: 300, after: 300 }
      })
    );

    return {
      properties: {
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
          },
          margin: { top: "2.0cm", bottom: "2.0cm", left: "3.0cm", right: "2.0cm" },
        },
      },
      children: examChildren
    };
  }

  // Helper function to build Answer Key Section for a variant
  function buildAnswerKeySection(variant: ExamVariant): any {
    const isMath = data.subject?.toLowerCase().trim().includes("toán") || data.subject === "Toán" || (variant.shortAnswer && variant.shortAnswer.length > 0);

    const answerKeyChildren: any[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM - MÃ ĐỀ ${variant.code || "101"}`, font: COMMON_FONT, size: TITLE_SIZE, bold: true })
        ],
        spacing: { after: 200 }
      }),
      createText("A. TRẮC NGHIỆM KHÁCH QUAN (7,0 điểm)", true),
      new Paragraph({ spacing: { after: 100 }, children: [] }),
      createText("Phần 1. Trắc nghiệm nhiều lựa chọn (3,0 điểm)", true),
      createText("(Mỗi câu trả lời đúng thí sinh được 0,25 điểm)", false, true),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: DEFAULT_BORDERS,
        rows: [
          new TableRow({
            children: (variant.mcq || []).slice(0, 6).map(q => createCell(`Câu ${q.id}`, 1, 1, true))
          }),
          new TableRow({
            children: (variant.mcq || []).slice(0, 6).map(q => createCell(q.correctAnswer, 1, 1, true))
          }),
          new TableRow({
            children: (variant.mcq || []).slice(6, 12).map(q => createCell(`Câu ${q.id}`, 1, 1, true))
          }),
          new TableRow({
            children: (variant.mcq || []).slice(6, 12).map(q => createCell(q.correctAnswer, 1, 1, true))
          })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),
      createText(`Phần 2. Trắc nghiệm đúng - sai (${(variant.shortAnswer && variant.shortAnswer.length > 0) ? "2,0 điểm" : "4,0 điểm"})`, true),
      createText("- Điểm tối đa của 01 câu hỏi là 1,0 điểm.", false, true),
      createText("- Thí sinh chỉ lựa chọn chính xác 01 ý trong 1 câu được 0,1 điểm.", false, true),
      createText("- Thí sinh chỉ lựa chọn chính xác 02 ý trong 1 câu được 0,25 điểm.", false, true),
      createText("- Thí sinh chỉ lựa chọn chính xác 03 ý trong 1 câu được 0,50 điểm.", false, true),
      createText("- Thí sinh lựa chọn chính xác cả 04 ý trong 1 câu được 1,0 điểm.", false, true),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: DEFAULT_BORDERS,
        rows: [
          new TableRow({
            children: [
              createCell("Câu", 1, 1, true),
              createCell("Lệnh hỏi", 1, 1, true),
              createCell("Đáp án (Đ/S)", 1, 1, true),
              createCell("Hướng dẫn / Giải thích", 1, 1, true)
            ]
          }),
          ...(variant.tf || []).flatMap(q => {
             return (q.statements || []).map((st, sIdx) => new TableRow({
                children: [
                   ...(sIdx === 0 ? [createCell(`Câu ${q.id}`, 1, 4, true)] : []),
                   createCell(st.id + ")", 1, 1, true),
                   createCell(st.isTrue ? "Đ" : "S", 1, 1, true),
                   createCell(st.text, 1, 1, false, AlignmentType.LEFT)
                ]
             }));
          })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),
    ];

    if (isMath && variant.shortAnswer && variant.shortAnswer.length > 0) {
      answerKeyChildren.push(
        createText("Phần 3. Trắc nghiệm trả lời ngắn (2,0 điểm)", true),
        createText("(Mỗi câu trả lời đúng thí sinh được 0,50 điểm)", false, true),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: DEFAULT_BORDERS,
          rows: [
            new TableRow({
              children: [
                createCell("Câu", 1, 1, true),
                createCell("Đáp án", 1, 1, true),
                createCell("Đơn vị (nếu có)", 1, 1, true),
                createCell("Hướng dẫn giải / Giải thích", 1, 1, true)
              ]
            }),
            ...variant.shortAnswer.map(q => new TableRow({
              children: [
                createCell(`Câu ${q.id}`, 1, 1, true),
                createCell(q.answer || "", 1, 1, true),
                createCell(q.unit || "", 1, 1, false),
                createCell(q.explanation || "", 1, 1, false, AlignmentType.LEFT)
              ]
            }))
          ]
        }),
        new Paragraph({ spacing: { after: 300 }, children: [] }),
        createText(`B. ${isPractice ? "CÂU THỰC HÀNH TRÊN MÁY TÍNH" : "TỰ LUẬN"} (3,0 điểm)`, true)
      );
    } else {
      answerKeyChildren.push(
        createText(`B. ${isPractice ? "CÂU THỰC HÀNH TRÊN MÁY TÍNH" : "TỰ LUẬN"} (3,0 điểm)`, true)
      );
    }

    answerKeyChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: DEFAULT_BORDERS,
        rows: [
          new TableRow({
            children: [
              createCell("Câu", 1, 1, true),
              createCell("Nội dung đáp án", 1, 1, true),
              createCell("Điểm", 1, 1, true)
            ]
          }),
          ...(variant.applied || []).flatMap(q => {
             const rows = [
               new TableRow({
                 children: [
                    createCell(`Câu ${q.id}`, 1, 1 + (q.pointsBreakdown?.length || 0), true),
                    createAnswerCell(q.answer, 1, 1),
                    createCell("1,00", 1, 1, true)
                 ]
               })
             ];
             if (q.pointsBreakdown && q.pointsBreakdown.length > 0) {
               for (const b of q.pointsBreakdown) {
                 rows.push(new TableRow({
                   children: [
                     createCell(b.criteria, 1, 1, false, AlignmentType.LEFT),
                     createCell(b.points, 1, 1, false)
                   ]
                 }));
               }
             }
             return rows;
          })
        ]
      })
    );

    answerKeyChildren.push(...createSignatureBlockDocx(data));

    return {
      properties: {
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
          },
          margin: { top: "2.0cm", bottom: "2.0cm", left: "3.0cm", right: "2.0cm" },
        },
      },
      children: answerKeyChildren
    };
  }

  // Resolve variants list
  let variantsToExport: ExamVariant[] = [];
  if (data.examVariants && data.examVariants.length > 0) {
    if (specificVariantCode) {
      variantsToExport = data.examVariants.filter(v => v.code === specificVariantCode);
      if (variantsToExport.length === 0) {
        variantsToExport = [data.examVariants[0]];
      }
    } else {
      variantsToExport = data.examVariants;
    }
  } else if (data.mcq && data.mcq.length > 0) {
    variantsToExport = [
      {
        code: data.code || "101",
        title: data.title,
        mcq: data.mcq || [],
        tf: data.tf || [],
        applied: data.applied || []
      }
    ];
  }

  // Pre-process and render any figures (SVG or base64) into PNG byte buffers
  for (const v of variantsToExport) {
    const allQuestions = [
      ...(v.mcq || []),
      ...(v.tf || []),
      ...(v.shortAnswer || []),
      ...(v.applied || []),
    ];
    for (const q of allQuestions) {
      if (!q.figureImageBuffer) {
        if (q.imageUrl && q.imageUrl.startsWith("data:image/")) {
          try {
            const parts = q.imageUrl.split(",");
            if (parts[1]) {
              const binaryStr = atob(parts[1]);
              const len = binaryStr.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              q.figureImageBuffer = bytes;
            }
          } catch (err) {
            console.warn("Could not parse base64 imageUrl for question", q.id, err);
          }
        } else if (q.figureSvg) {
          try {
            q.figureImageBuffer = await svgToPngBuffer(q.figureSvg, 260, 160);
          } catch (err) {
            console.warn("Could not convert SVG to PNG for question", q.id, err);
          }
        }
      }
    }
  }

  for (const v of variantsToExport) {
    sections.push(buildExamPaperSection(v));
    sections.push(buildAnswerKeySection(v));
  }

  const doc = new Document({
    sections
  });

  const blob = await Packer.toBlob(doc);
  
  // Normalize subject, school, period for safe and clear filename
  const sanitizeName = (str: string) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const cleanSubject = sanitizeName(data.subject || "Tin_hoc");
  const cleanSchool = sanitizeName(data.schoolName || "THCS");
  const cleanPeriod = sanitizeName(data.period || "Kiem_tra");
  const cleanGrade = data.grade || "8";
  const codeSuffix = specificVariantCode ? `_MaDe_${specificVariantCode}` : (variantsToExport.length > 1 ? `_${variantsToExport.length}_MaDe` : "_MaDe_101");
  
  saveAs(blob, `Ho_So_Khao_Thi_${cleanSubject}_${cleanGrade}_${cleanPeriod}${codeSuffix}_${cleanSchool}.docx`);
}

