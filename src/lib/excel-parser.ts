import * as XLSX from "xlsx";
import { CustomLessonConfig } from "../components/ScopeConfigModal";

/**
 * Smart extraction of structured textual content from an Excel (.xlsx / .xls) workbook.
 * Produces clean tabular text representation for Gemini AI prompts.
 */
export function extractSmartTextFromExcel(
  data: ArrayBuffer | Uint8Array | Buffer | string,
  fileName?: string
): string {
  try {
    const isBase64 = typeof data === "string";
    const workbook = isBase64
      ? XLSX.read(data, { type: "base64" })
      : XLSX.read(data, { type: "array" });

    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      return "";
    }

    let output = `\n=== TÀI LIỆU PHÂN PHỐI CHƯƠNG TRÌNH / KẾ HOẠCH DẠY HỌC EXCEL: ${fileName || "PPCT.xlsx"} ===\n`;

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const rawRows = XLSX.utils.sheet_to_json<any[]>(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      if (!rawRows || rawRows.length === 0) return;

      output += `\n--- [SHEET: ${sheetName}] ---\n`;

      rawRows.forEach((row) => {
        if (!Array.isArray(row)) return;
        const cleanCells = row
          .map((cell) => String(cell != null ? cell : "").trim())
          .filter((cell) => cell.length > 0);

        if (cleanCells.length === 0) return;
        output += cleanCells.join(" | ") + "\n";
      });

      output += `--- [HẾT SHEET: ${sheetName}] ---\n`;
    });

    output += `=== HẾT TÀI LIỆU EXCEL ===\n`;
    return output;
  } catch (err) {
    console.error("Error in extractSmartTextFromExcel:", err);
    return "";
  }
}

export interface ParsedPpctResult {
  firstHalfLessons: CustomLessonConfig[];
  secondHalfLessons: CustomLessonConfig[];
  sheetNames: string[];
  totalLessons: number;
  totalPeriods: number;
  detectedSubject?: string;
  detectedGrade?: string;
}

/**
 * Smart parser for school PPCT (Phân phối chương trình) Excel files (.xlsx, .xls).
 * Automatically detects column headers, chapters/topics, lesson names, periods, and semester divisions.
 */
export function parsePpctLessonsFromExcel(
  data: ArrayBuffer | Uint8Array | Buffer | string,
  defaultSubject = "Tin học",
  defaultGrade = "8"
): ParsedPpctResult {
  const isBase64 = typeof data === "string";
  const workbook = isBase64
    ? XLSX.read(data, { type: "base64" })
    : XLSX.read(data, { type: "array" });

  const firstHalfLessons: CustomLessonConfig[] = [];
  const secondHalfLessons: CustomLessonConfig[] = [];

  let currentGroup: "firstHalf" | "secondHalf" = "firstHalf";
  let currentTopic = "Chủ đề 1";
  let lessonCounter = 1;

  let detectedSubject = defaultSubject;
  let detectedGrade = defaultGrade;

  const sheetNames = workbook.SheetNames || [];

  sheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    const rawRows = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    if (!rawRows || rawRows.length === 0) return;

    // Detect headers and column mapping
    let headerRowIdx = -1;
    let colNameIdx = -1;
    let colPeriodsIdx = -1;
    let colTopicIdx = -1;
    let colLessonNumIdx = -1;

    for (let r = 0; r < Math.min(20, rawRows.length); r++) {
      const row = rawRows[r];
      if (!Array.isArray(row)) continue;
      const rowText = row.map((c) => String(c).toLowerCase()).join(" ");

      // Check subject & grade in headers
      if (rowText.includes("tin học") || rowText.includes("tin hoc")) detectedSubject = "Tin học";
      else if (rowText.includes("toán") || rowText.includes("toan")) detectedSubject = "Toán học";
      else if (rowText.includes("khoa học tự nhiên") || rowText.includes("khtn")) detectedSubject = "Khoa học tự nhiên";
      else if (rowText.includes("công nghệ")) detectedSubject = "Công nghệ";
      else if (rowText.includes("lịch sử") || rowText.includes("địa lí")) detectedSubject = "Lịch sử & Địa lí";
      else if (rowText.includes("ngữ văn")) detectedSubject = "Ngữ văn";
      else if (rowText.includes("tiếng anh")) detectedSubject = "Tiếng Anh";

      const gradeMatch = rowText.match(/lớp\s*([6-9])/i) || rowText.match(/khối\s*([6-9])/i) || rowText.match(/\b([6-9])\b/);
      if (gradeMatch && ["6", "7", "8", "9"].includes(gradeMatch[1])) {
        detectedGrade = gradeMatch[1];
      }

      // Check if this row is the column headers row
      const isHeaderRow =
        (rowText.includes("tên bài") || rowText.includes("bài học") || rowText.includes("nội dung dạy")) ||
        (rowText.includes("tiết") && (rowText.includes("bài") || rowText.includes("chủ đề")));

      if (isHeaderRow) {
        headerRowIdx = r;
        row.forEach((cell, cIdx) => {
          const str = String(cell).toLowerCase().trim();
          if (
            str.includes("tên bài") ||
            str.includes("bài học") ||
            str === "nội dung bài dạy" ||
            str === "nội dung" ||
            (str.includes("tên chủ đề") && !str.includes("stt"))
          ) {
            if (colNameIdx === -1) colNameIdx = cIdx;
          } else if (
            str.includes("số tiết") ||
            str.includes("thời lượng") ||
            str === "tiết" ||
            str.includes("số lượng tiết")
          ) {
            if (colPeriodsIdx === -1) colPeriodsIdx = cIdx;
          } else if (
            str.includes("chủ đề") ||
            str.includes("chương") ||
            str.includes("mạch kiến thức") ||
            str.includes("phần")
          ) {
            if (colTopicIdx === -1) colTopicIdx = cIdx;
          } else if (
            str.includes("tiết ppct") ||
            str.includes("thứ tự") ||
            str === "stt" ||
            str === "tt"
          ) {
            if (colLessonNumIdx === -1) colLessonNumIdx = cIdx;
          }
        });
        break;
      }
    }

    // Default column fallback if not detected
    if (colNameIdx === -1) {
      colNameIdx = 1;
    }

    const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;

    for (let r = startRow; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!Array.isArray(row)) continue;

      const fullRowText = row
        .map((c) => String(c).trim())
        .filter(Boolean)
        .join(" ");

      if (!fullRowText) continue;

      const lowerRow = fullRowText.toLowerCase();

      // Detect Semester switch
      if (
        lowerRow.includes("học kỳ ii") ||
        lowerRow.includes("học kỳ 2") ||
        lowerRow.includes("học kì ii") ||
        lowerRow.includes("học kì 2") ||
        lowerRow.includes("nửa sau học kỳ") ||
        lowerRow.includes("sau giữa kỳ")
      ) {
        currentGroup = "secondHalf";
        continue;
      } else if (
        lowerRow.includes("học kỳ i") ||
        lowerRow.includes("học kỳ 1") ||
        lowerRow.includes("học kì i") ||
        lowerRow.includes("học kì 1") ||
        lowerRow.includes("nửa đầu học kỳ")
      ) {
        currentGroup = "firstHalf";
        continue;
      }

      // Detect Chapter / Topic headers
      if (
        lowerRow.startsWith("chủ đề") ||
        lowerRow.startsWith("chương") ||
        lowerRow.startsWith("mạch") ||
        lowerRow.startsWith("phần ") ||
        /^chủ đề\s+[a-z0-9]/i.test(fullRowText) ||
        /^chương\s+[ivx0-9]/i.test(fullRowText)
      ) {
        currentTopic = fullRowText;
        continue;
      }

      // Extract Lesson Name
      let lessonName = String(row[colNameIdx] || "").trim();

      // If lesson name cell is empty or too short, look in neighboring cells
      if (!lessonName || lessonName.length < 3) {
        const found = row.find(
          (c) =>
            typeof c === "string" &&
            c.trim().length > 4 &&
            !/^\d+$/.test(c.trim()) &&
            !/^\d+[\s\-\–]\d+$/.test(c.trim())
        );
        if (found) lessonName = String(found).trim();
      }

      if (!lessonName || lessonName.length < 3) continue;

      // Ignore metadata and footer rows
      const lowerName = lessonName.toLowerCase();
      if (
        lowerName.includes("cộng") ||
        lowerName.includes("tổng số") ||
        lowerName.includes("người duyệt") ||
        lowerName.includes("tổ trưởng") ||
        lowerName.includes("hiệu trưởng") ||
        lowerName.includes("giáo viên lập") ||
        lowerName.startsWith("ngày ") ||
        lowerName.startsWith("tháng ")
      ) {
        continue;
      }

      // Extract number of periods
      let periods = 1;
      if (colPeriodsIdx !== -1 && row[colPeriodsIdx]) {
        const pStr = String(row[colPeriodsIdx]).trim();
        // Check for range like "3-4", "3 - 4", "1-2"
        const rangeMatch = pStr.match(/(\d+)\s*[-–]\s*(\d+)/);
        if (rangeMatch) {
          periods = Math.max(1, parseInt(rangeMatch[2], 10) - parseInt(rangeMatch[1], 10) + 1);
        } else {
          const pMatch = pStr.match(/\d+/);
          if (pMatch) periods = parseInt(pMatch[0], 10) || 1;
        }
      }

      // Topic column if present
      if (colTopicIdx !== -1 && row[colTopicIdx]) {
        const tStr = String(row[colTopicIdx]).trim();
        if (tStr.length > 3) currentTopic = tStr;
      }

      const lessonConfig: CustomLessonConfig = {
        id: `ppct_excel_${lessonCounter}_${Date.now()}`,
        lessonNumber: String(lessonCounter),
        name: lessonName,
        topicId: `topic_${lessonCounter}`,
        topicName: currentTopic || "Chủ đề chung",
        periods: Math.min(15, Math.max(1, periods)),
        selected: true,
        halfGroup: currentGroup,
      };

      if (currentGroup === "firstHalf") {
        firstHalfLessons.push(lessonConfig);
      } else {
        secondHalfLessons.push(lessonConfig);
      }
      lessonCounter++;
    }
  });

  // If all lessons landed in firstHalf (no explicit semester switch found) and there are many lessons,
  // split roughly 50-50 for Semester 1 (Giữa kỳ 1 vs Sau giữa kỳ 1 / Cuối kỳ 1)
  if (secondHalfLessons.length === 0 && firstHalfLessons.length > 6) {
    const halfIndex = Math.ceil(firstHalfLessons.length * 0.45);
    const moved = firstHalfLessons.splice(halfIndex);
    moved.forEach((l) => {
      l.halfGroup = "secondHalf";
      secondHalfLessons.push(l);
    });
  }

  const totalLessons = firstHalfLessons.length + secondHalfLessons.length;
  const totalPeriods =
    firstHalfLessons.reduce((sum, l) => sum + (l.periods || 1), 0) +
    secondHalfLessons.reduce((sum, l) => sum + (l.periods || 1), 0);

  return {
    firstHalfLessons,
    secondHalfLessons,
    sheetNames,
    totalLessons,
    totalPeriods,
    detectedSubject,
    detectedGrade,
  };
}
