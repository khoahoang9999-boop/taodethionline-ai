import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle
} from "docx";
import { saveAs } from "file-saver";
import { StudyGuideData } from "./docx-generator";
import { svgToPngBuffer } from "./math-figures";
import { formatAnswerLines } from "./formatter";

const COMMON_FONT = "Times New Roman";
const BASE_SIZE = 28; // 14pt
const TITLE_SIZE = 28; // 14pt
const PARAGRAPH_SPACING = { before: 0, after: 60, line: 276 };


const DEFAULT_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};


function parseMarkdownToTextRuns(text: string): TextRun[] {
  if (!text) return [];
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        font: COMMON_FONT,
        size: BASE_SIZE
      });
    }
    return new TextRun({
      text: part,
      font: COMMON_FONT,
      size: BASE_SIZE
    });
  });
}

function createAnswerCell(answerText: string, colSpan = 1, rowSpan = 1): TableCell {
  const lines = formatAnswerLines(answerText);
  const children: Paragraph[] = [];
  
  if (lines.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "", font: COMMON_FONT, size: BASE_SIZE })] }));
  } else {
    for (const line of lines) {
       children.push(new Paragraph({
         alignment: AlignmentType.LEFT,
         children: parseMarkdownToTextRuns(line),
         spacing: PARAGRAPH_SPACING
       }));
    }
  }

  return new TableCell({
    columnSpan: colSpan,
    rowSpan: rowSpan,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    verticalAlign: "center",
    children
  });
}

function createCell(text: string, colSpan = 1, rowSpan = 1, bold = false, align: any = AlignmentType.CENTER) {
  return new TableCell({
    columnSpan: colSpan,
    rowSpan: rowSpan,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    verticalAlign: "center",
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text: text || "", font: COMMON_FONT, size: BASE_SIZE, bold })],
      })
    ]
  });
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

function createOptionParagraph(optionText: string): Paragraph {
  const match = (optionText || "").match(/^([A-D]\.\s*)(.*)$/);
  if (match) {
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: match[1], font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
        new TextRun({ text: match[2], font: COMMON_FONT, size: BASE_SIZE, bold: false, color: "000000" }),
      ],
      spacing: PARAGRAPH_SPACING,
    });
  }
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text: optionText, font: COMMON_FONT, size: BASE_SIZE, bold: false, color: "000000" })],
    spacing: PARAGRAPH_SPACING,
  });
}


function createText(text: string, bold = false, italics = false, align: any = AlignmentType.JUSTIFIED, color?: string): Paragraph {
  return new Paragraph({
    alignment: align,
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

function createTextWithIndent(
  text: string,
  bold = false,
  italics = false,
  align: any = AlignmentType.JUSTIFIED,
  indentLeft: number = 360
): Paragraph {
  return new Paragraph({
    alignment: align,
    indent: { left: indentLeft },
    children: [
      new TextRun({
        text,
        font: COMMON_FONT,
        size: BASE_SIZE,
        bold,
        italics,
      }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
}

function createExplanationParagraph(
  prefix: string,
  explanationText: string,
  indentLeft: number = 360
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: { left: indentLeft },
    children: [
      new TextRun({
        text: prefix,
        font: COMMON_FONT,
        size: BASE_SIZE,
        bold: true,
        color: "0000FF",
      }),
      ...parseMarkdownToTextRuns(explanationText),
    ],
    spacing: PARAGRAPH_SPACING,
  });
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

async function createImageParagraph(dataUrl: string): Promise<Paragraph> {
  const dims = await getImageDimensions(dataUrl);
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

export async function exportStudyGuideToWord(data: StudyGuideData) {
  // SVG Pre-processing
  const arrays = [data.mcq, data.tf, data.shortAnswer, data.applied];
  for (const arr of arrays) {
    if (arr) {
      for (const q of arr) {
        if (q.question.includes("<svg") && q.question.includes("</svg>")) {
          try {
            const svgString = q.question.substring(q.question.indexOf("<svg"), q.question.indexOf("</svg>") + 6);
            const pngBuffer = await svgToPngBuffer(svgString, 450);
            if (pngBuffer) {
              (q as any)._preRenderedQuestionImage = pngBuffer;
            }
          } catch (err) {
            console.warn("Could not convert SVG to PNG", q.id, err);
          }
        }
      }
    }
  }

  const sections: any[] = [];

  // Section 1: Main Content
  const mainChildren: any[] = [];
  
  // Official Header Table
  const dept = (data.departmentName || "PHÒNG GD&ĐT").toUpperCase();
  const school = (data.schoolName || "TRƯỜNG THCS").toUpperCase();

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: dept, font: COMMON_FONT, size: 22, bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: school, font: COMMON_FONT, size: 22, bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", font: COMMON_FONT, size: 22, bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", font: COMMON_FONT, size: 22, bold: true, underline: {} })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  mainChildren.push(headerTable);
  mainChildren.push(new Paragraph({ spacing: { after: 180 }, children: [] }));

  const title1 = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: data.title || `ĐỀ CƯƠNG ÔN TẬP KIỂM TRA ${data.period?.toUpperCase() || "HỌC KỲ"}`, font: COMMON_FONT, size: TITLE_SIZE, bold: true }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
  const title2 = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `MÔN: ${data.subject.toUpperCase()} ${data.grade} - ${data.period.toUpperCase()}`, font: COMMON_FONT, size: BASE_SIZE, bold: true }),
    ],
    spacing: PARAGRAPH_SPACING,
  });
  const title3 = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `NĂM HỌC: ${data.schoolYear}`, font: COMMON_FONT, size: BASE_SIZE, bold: false }),
    ],
    spacing: { before: 0, after: 240 },
  });
  mainChildren.push(title1, title2, title3);

  mainChildren.push(
    createText("PHẦN A. TÓM TẮT KIẾN THỨC TRỌNG TÂM", true, false, AlignmentType.LEFT, "000000"),
    new Paragraph({ spacing: { after: 120 }, children: [] })
  );
  
  if (data.topics && data.topics.length > 0) {
    for (const t of data.topics) {
      mainChildren.push(createTextWithIndent(`- ${t.topic}${t.lessonName ? `: ${t.lessonName}` : ""}`, true, false, AlignmentType.LEFT, 360));
      if (t.summaryPoints) {
        for (const pt of t.summaryPoints) {
          mainChildren.push(createTextWithIndent(`+ ${pt}`, false, false, AlignmentType.LEFT, 720));
        }
      }
    }
  }
  mainChildren.push(new Paragraph({ spacing: { after: 240 }, children: [] }));

  mainChildren.push(
    createText("PHẦN B. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP", true, false, AlignmentType.LEFT, "000000"),
    new Paragraph({ spacing: { after: 120 }, children: [] })
  );

  const addQuestionText = async (q: any, index: number, type: string) => {
    let prefix = `Câu ${index}. `;
    
    if (type === "applied") {
      const lines = q.question.replace(/<[^>]*>?/gm, '').split('\n');
      
      const firstLine = lines[0] || "";
      const firstLineParagraphChildren: any[] = [
        new TextRun({ text: prefix, bold: true, font: COMMON_FONT, size: BASE_SIZE, color: "0000FF" })
      ];
      
      const appendParsedTextRuns = (targetArr: any[], textContent: string, defaultBold: boolean) => {
        const parts = textContent.split(/(\*\*.*?\*\*)/g);
        parts.forEach((part) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            targetArr.push(new TextRun({
              text: part.slice(2, -2),
              bold: true,
              font: COMMON_FONT,
              size: BASE_SIZE,
              color: "000000"
            }));
          } else if (part) {
            targetArr.push(new TextRun({
              text: part,
              bold: defaultBold,
              font: COMMON_FONT,
              size: BASE_SIZE,
              color: "000000"
            }));
          }
        });
      };
      
      appendParsedTextRuns(firstLineParagraphChildren, firstLine, false);
      
      mainChildren.push(
        new Paragraph({
          children: firstLineParagraphChildren,
          spacing: PARAGRAPH_SPACING
        })
      );
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const lineParagraphChildren: any[] = [];
          appendParsedTextRuns(lineParagraphChildren, lines[i], false);
          mainChildren.push(
            new Paragraph({
              children: lineParagraphChildren,
              spacing: PARAGRAPH_SPACING,
              indent: { left: 360 }
            })
          );
        }
      }
    } else {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: prefix, bold: true, font: COMMON_FONT, size: BASE_SIZE, color: "0000FF" }),
            new TextRun({ text: q.question.replace(/<[^>]*>?/gm, ''), font: COMMON_FONT, size: BASE_SIZE, bold: true, color: "000000" }),
          ],
          spacing: PARAGRAPH_SPACING,
        })
      );
    }

    if (q._preRenderedQuestionImage) {
      mainChildren.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: "png",
            data: q._preRenderedQuestionImage,
            transformation: { width: 350, height: 150 },
          })
        ]
      }));
    } else if (q.imageUrl) {
      try {
        const p = await createImageParagraph(q.imageUrl);
        mainChildren.push(p);
      } catch (e) {}
    }

    if (type === "mcq" && q.options) {
      const options = q.options || [];
      const hasFigure = !!(q._preRenderedQuestionImage || q.imageUrl);
      const maxLen = Math.max(...options.map((o: any) => (o || "").trim().length), 0);
      const totalLen = options.reduce((sum: number, o: any) => sum + (o || "").trim().length, 0);

      let optionTableRows: TableRow[] = [];
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
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] })] }),
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
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[0] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[1] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[2] || "")] })] }),
            new TableRow({ children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, children: [createOptionParagraph(options[3] || "")] })] }),
          ];
        }
      }
      
      mainChildren.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: optionTableRows
      }));

    } else if (type === "tf" && q.statements) {
      const rows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: DEFAULT_BORDERS,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "Các phát biểu", font: COMMON_FONT, size: BASE_SIZE, bold: true })]
                })
              ]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              borders: DEFAULT_BORDERS,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Đúng", font: COMMON_FONT, size: BASE_SIZE, bold: true })]
                })
              ]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              borders: DEFAULT_BORDERS,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Sai", font: COMMON_FONT, size: BASE_SIZE, bold: true })]
                })
              ]
            }),
          ]
        })
      ];

      q.statements.forEach((st: any) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: DEFAULT_BORDERS,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${st.id}) `, font: COMMON_FONT, size: BASE_SIZE, bold: true }),
                      new TextRun({ text: st.text, font: COMMON_FONT, size: BASE_SIZE })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                borders: DEFAULT_BORDERS,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "", font: COMMON_FONT, size: BASE_SIZE })]
                  })
                ]
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                borders: DEFAULT_BORDERS,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "", font: COMMON_FONT, size: BASE_SIZE })]
                  })
                ]
              }),
            ]
          })
        );
      });

      mainChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows
        })
      );
    }

    mainChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  };

  let qCount = 1;
  if (data.mcq && data.mcq.length > 0) {
    mainChildren.push(createText("I. Trắc nghiệm nhiều lựa chọn", true, false));
    for (const q of data.mcq) {
      await addQuestionText(q, qCount++, "mcq");
    }
  }

  if (data.tf && data.tf.length > 0) {
    mainChildren.push(createText("II. Trắc nghiệm Đúng - Sai", true, false));
    let localQCount = 1;
    for (const q of data.tf) {
      await addQuestionText(q, localQCount++, "tf");
    }
  }

  if (data.shortAnswer && data.shortAnswer.length > 0) {
    mainChildren.push(createText("III. Trắc nghiệm trả lời ngắn", true, false));
    let localQCount = 1;
    for (const q of data.shortAnswer) {
      await addQuestionText(q, localQCount++, "sa");
    }
  }

  if (data.applied && data.applied.length > 0) {
    mainChildren.push(createText(data.shortAnswer && data.shortAnswer.length > 0 ? "IV. Bài tập vận dụng / Tự luận" : "III. Bài tập vận dụng / Tự luận", true, false));
    let localQCount = 1;
    for (const q of data.applied) {
      await addQuestionText(q, localQCount++, "applied");
    }
  }

  sections.push({
    properties: {
      page: { margin: { top: "1.5cm", bottom: "1.5cm", left: "2.0cm", right: "1.5cm" } }
    },
    children: mainChildren
  });

  // Section 2: Answers
  const ansChildren: any[] = [];
  ansChildren.push(
    createText("PHẦN C. ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI", true, false, AlignmentType.CENTER),
    new Paragraph({ spacing: { after: 240 }, children: [] })
  );

  if (data.mcq && data.mcq.length > 0) {
    ansChildren.push(createText("I. Trắc nghiệm nhiều lựa chọn", true, false));
    
    // Group into chunks of 6 (like exam paper)
    const chunkSize = 6;
    for (let i = 0; i < data.mcq.length; i += chunkSize) {
      const chunk = data.mcq.slice(i, i + chunkSize);
      ansChildren.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: DEFAULT_BORDERS,
        rows: [
          new TableRow({ children: chunk.map((_, idx) => createCell(`Câu ${i + idx + 1}`, 1, 1, true)) }),
          new TableRow({ children: chunk.map((q: any) => createCell(q.correctAnswer, 1, 1, true)) })
        ]
      }));
      ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }
    
    // Add explanations after table
    for (let i = 0; i < data.mcq.length; i++) {
      const q = data.mcq[i];
      if (q.explanation) {
        ansChildren.push(createExplanationParagraph(`Câu ${i + 1} - Giải thích: `, q.explanation, 360));
      }
    }
    ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }

  if (data.tf && data.tf.length > 0) {
    ansChildren.push(createText("II. Trắc nghiệm Đúng - Sai", true, false));
    ansChildren.push(new Table({
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
          ...data.tf.flatMap((q: any, qIdx: number) => {
             return (q.statements || []).map((st: any, sIdx: number) => new TableRow({
                children: [
                   ...(sIdx === 0 ? [createCell(`Câu ${qIdx + 1}`, 1, 4, true)] : []),
                   createCell(st.id + ")", 1, 1, true),
                   createCell(st.isTrue ? "Đ" : "S", 1, 1, true),
                   createCell(st.text || "", 1, 1, false, AlignmentType.LEFT)
                ]
             }));
          })
        ]
    }));
    ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    // Add explanations after table
    for (let i = 0; i < data.tf.length; i++) {
      const q = data.tf[i] as any;
      if (q.explanation) {
        ansChildren.push(createExplanationParagraph(`Câu ${i + 1} - Giải thích: `, q.explanation, 360));
      }
    }
    ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }

  if (data.shortAnswer && data.shortAnswer.length > 0) {
    ansChildren.push(createText("III. Trắc nghiệm trả lời ngắn", true, false));
    ansChildren.push(new Table({
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
        ...data.shortAnswer.map((q: any, i: number) => new TableRow({
          children: [
            createCell(`Câu ${i + 1}`, 1, 1, true),
            createCell(q.answer || "", 1, 1, true),
            createCell(q.unit || "", 1, 1, false),
            createCell(q.explanation || "", 1, 1, false, AlignmentType.LEFT)
          ]
        }))
      ]
    }));
    ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }

  if (data.applied && data.applied.length > 0) {
    ansChildren.push(createText(data.shortAnswer && data.shortAnswer.length > 0 ? "IV. Bài tập vận dụng / Tự luận" : "III. Bài tập vận dụng / Tự luận", true, false));
    ansChildren.push(new Table({
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
        ...data.applied.flatMap((q: any, i: number) => {
           const rows = [
             new TableRow({
               children: [
                 createCell(`Câu ${i + 1}`, 1, 1 + (q.pointsBreakdown?.length || 0), true),
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
    }));
    ansChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }

  // Signature Block
  const dateStr = `Hàm Yên, ngày ..... tháng ..... năm 202...`;
  const datePara = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text: dateStr, italics: true, size: BASE_SIZE, font: COMMON_FONT })],
  });

  ansChildren.push(datePara);

  sections.push({
    properties: {
      page: { margin: { top: "1.5cm", bottom: "1.5cm", left: "2.0cm", right: "1.5cm" } }
    },
    children: ansChildren
  });

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  
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
  
  saveAs(blob, `De_Cuong_On_Tap_${cleanSubject}_${cleanGrade}_${cleanPeriod}_${cleanSchool}.docx`);
}
