import React, { useMemo } from "react";
import { getMathStandardObjectives } from "../data/mathObjectives";
import { normalizeMatrixPercentages } from "../lib/matrixUtils";

interface MatrixRow {
  topic: string;
  content: string;
  halfGroup?: "firstHalf" | "secondHalf" | string;
  periods?: number;
  percentage?: number;
  mcq_nb?: number; mcq_th?: number; mcq_vd?: number;
  tf_nb?: number; tf_th?: number; tf_vd?: number;
  sa_nb?: number; sa_th?: number; sa_vd?: number;
  tl_nb?: number; tl_th?: number; tl_vd?: number;
  total_nb?: number; total_th?: number; total_vd?: number;
  totalPoints?: number;
}

interface MatrixViewProps {
  subject?: string;
  matrix?: MatrixRow[];
  departmentName?: string;
  schoolName: string;
  schoolYear: string;
  grade: string;
  period: string;
  time?: string;
  examFormat?: string;
  endContent?: string;
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
}

export function getDefaultEndContent(grade: string, period: string, matrix?: MatrixRow[], customEndContent?: string, subject?: string): string {
  if (customEndContent && customEndContent.trim()) {
    return customEndContent.trim();
  }
  if (matrix && matrix.length > 0) {
    const lastRow = matrix[matrix.length - 1];
    if (lastRow.topic) {
      return lastRow.topic;
    }
  }
  if (subject?.toLowerCase().trim().includes("toán")) {
    if (period.toLowerCase().includes("cuối") && (period.includes("I") || period.includes("1")) && !period.includes("II")) {
      return "Vai trò của đối xứng trong thế giới tự nhiên";
    }
    return "Chương III. Số nguyên";
  }
  const p = (period || "").toLowerCase();
  if (p.includes("giữa") && (p.includes("học kỳ i") || p.includes("học kì i") || p.includes("kỳ i") || p.includes("kì i")) && !p.includes("ii")) {
    if (grade === "6") return "Chủ đề 2 - Mạng máy tính và Internet";
    if (grade === "7") return "Chủ đề 2 - Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin";
    if (grade === "8") return "Chủ đề 3 - Đạo đức pháp luật và văn hoá trong môi trường số";
    if (grade === "9") return "Chủ đề 2 - Mạng máy tính và Internet";
  }
  if (p.includes("cuối") && (p.includes("học kỳ i") || p.includes("học kì i") || p.includes("kỳ i") || p.includes("kì i")) && !p.includes("ii")) {
    if (grade === "6") return "Chủ đề 3 - Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin";
    if (grade === "7") return "Chủ đề 3 - Đạo đức, pháp luật và văn hóa trong môi trường số";
    if (grade === "8") return "Chủ đề 4 - Ứng dụng tin học";
    if (grade === "9") return "Chủ đề 3 - Đạo đức, pháp luật và văn hoá trong môi trường số";
  }
  if (p.includes("giữa") && (p.includes("ii") || p.includes("2"))) {
    if (grade === "6") return "Chủ đề 4 - Đạo đức, pháp luật và văn hóa trong môi trường số";
    if (grade === "7") return "Chủ đề 4 - Ứng dụng tin học";
    if (grade === "8") return "Chủ đề 5 - Giải quyết vấn đề với sự trợ giúp của máy tính";
    if (grade === "9") return "Chủ đề 4 - Ứng dụng tin học";
  }
  if (p.includes("cuối") && (p.includes("ii") || p.includes("2"))) {
    if (grade === "6") return "Chủ đề 6 - Giải quyết vấn đề với sự trợ giúp của máy tính";
    if (grade === "7") return "Chủ đề 5 - Giải quyết vấn đề với sự trợ giúp của máy tính";
    if (grade === "8") return "Chủ đề 6 - Hướng nghiệp với tin học";
    if (grade === "9") return "Chủ đề 5 - Tin học ứng dụng và Định hướng nghề nghiệp";
  }
  return "Chủ đề 3 - Đạo đức pháp luật và văn hoá trong môi trường số";
}

const formatCount = (val?: number | string | null) => {
  const num = Number(val);
  return num > 0 ? String(num) : "";
};

export default function MatrixView({
  subject = "Tin học",
  matrix: rawMatrix = [],
  departmentName = "XÃ HÀM YÊN",
  schoolName,
  schoolYear,
  grade,
  period,
  time = "45 phút",
  examFormat = "Tự luận",
  endContent,
  examDateLocation,
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
}: MatrixViewProps) {
  const isFinalExam = (period || "").toLowerCase().includes("cuối");

  const matrix = useMemo(() => {
    return normalizeMatrixPercentages(rawMatrix, isFinalExam);
  }, [rawMatrix, isFinalExam]);

  const isMath = subject.toLowerCase().trim().includes("toán") || matrix.some(r => (r.sa_nb || 0) > 0 || (r.sa_th || 0) > 0 || (r.sa_vd || 0) > 0);

  // Partition matrix rows into First Half (30%) and Second Half (70%) for Final exams
  let firstHalfIndices: number[] = [];
  let secondHalfIndices: number[] = [];

  if (isFinalExam && matrix.length > 1) {
    const hasHalfGroup = matrix.some(r => r.halfGroup === "firstHalf" || r.halfGroup === "secondHalf");
    if (hasHalfGroup) {
      matrix.forEach((r, idx) => {
        if (r.halfGroup === "secondHalf") {
          secondHalfIndices.push(idx);
        } else {
          firstHalfIndices.push(idx);
        }
      });
    } else {
      let splitIdx = -1;
      let accPoints = 0;
      for (let i = 0; i < matrix.length; i++) {
        const topicStr = matrix[i].topic || "";
        const isLaterTopic = /chủ đề\s*([4-9]|[1-9][0-9])|chương\s*(iv|v|vi|[4-9])/i.test(topicStr);
        if (i > 0 && isLaterTopic && firstHalfIndices.length > 0) {
          splitIdx = i;
          break;
        }
        accPoints += Number(matrix[i].totalPoints) || 0;
        if (accPoints >= 3.25 && i > 0) {
          splitIdx = i;
          break;
        }
        firstHalfIndices.push(i);
      }
      if (splitIdx > 0) {
        secondHalfIndices = matrix.map((_, idx) => idx).slice(splitIdx);
      } else {
        const cut = Math.max(1, Math.floor(matrix.length * 0.45));
        firstHalfIndices = matrix.map((_, idx) => idx).slice(0, cut);
        secondHalfIndices = matrix.map((_, idx) => idx).slice(cut);
      }
    }
  }

  // Calculate summary totals
  const totalPeriods = matrix.reduce((sum, r) => sum + (Number(r.periods) || 0), 0) || (isMath ? 53 : 15);
  const firstHalfPeriods = firstHalfIndices.length > 0
    ? firstHalfIndices.reduce((sum, idx) => sum + (Number(matrix[idx].periods) || 0), 0) || (isMath ? 31 : 7)
    : 0;
  const secondHalfPeriods = secondHalfIndices.length > 0
    ? secondHalfIndices.reduce((sum, idx) => sum + (Number(matrix[idx].periods) || 0), 0) || (isMath ? 22 : 8)
    : 0;

  const totalMcqNb = matrix.reduce((sum, r) => sum + (Number(r.mcq_nb) || 0), 0);
  const totalMcqTh = matrix.reduce((sum, r) => sum + (Number(r.mcq_th) || 0), 0);
  const totalMcqVd = matrix.reduce((sum, r) => sum + (Number(r.mcq_vd) || 0), 0);
  
  const totalTfNb = matrix.reduce((sum, r) => sum + (Number(r.tf_nb) || 0), 0);
  const totalTfTh = matrix.reduce((sum, r) => sum + (Number(r.tf_th) || 0), 0);
  const totalTfVd = matrix.reduce((sum, r) => sum + (Number(r.tf_vd) || 0), 0);

  const totalSaNb = matrix.reduce((sum, r) => sum + (Number(r.sa_nb) || 0), 0);
  const totalSaTh = matrix.reduce((sum, r) => sum + (Number(r.sa_th) || 0), 0);
  const totalSaVd = matrix.reduce((sum, r) => sum + (Number(r.sa_vd) || 0), 0);

  const totalTlNb = matrix.reduce((sum, r) => sum + (Number(r.tl_nb) || 0), 0);
  const totalTlTh = matrix.reduce((sum, r) => sum + (Number(r.tl_th) || 0), 0);
  const totalTlVd = matrix.reduce((sum, r) => sum + (Number(r.tl_vd) || 0), 0);

  const totalAllNb = matrix.reduce((sum, r) => sum + (Number(r.total_nb) || 0), 0);
  const totalAllTh = matrix.reduce((sum, r) => sum + (Number(r.total_th) || 0), 0);
  const totalAllVd = matrix.reduce((sum, r) => sum + (Number(r.total_vd) || 0), 0);

  // Sub-points calculations
  const mcqNbPoints = (totalMcqNb * 0.25).toFixed(totalMcqNb % 4 === 0 ? 0 : 2);
  const mcqThPoints = (totalMcqTh * 0.25).toFixed(totalMcqTh % 4 === 0 ? 0 : 2);
  const mcqVdPoints = totalMcqVd > 0 ? (totalMcqVd * 0.25).toFixed(2) : "0";

  const tfNbPoints = (totalTfNb * 0.25).toFixed(totalTfNb % 4 === 0 ? 0 : 2);
  const tfThPoints = (totalTfTh * 0.25).toFixed(totalTfTh % 4 === 0 ? 0 : 2);
  const tfVdPoints = totalTfVd > 0 ? (totalTfVd * 0.25).toFixed(2) : "0";

  const saNbPoints = (totalSaNb * 0.5).toFixed(totalSaNb % 2 === 0 ? 0 : 1);
  const saThPoints = (totalSaTh * 0.5).toFixed(totalSaTh % 2 === 0 ? 0 : 1);
  const saVdPoints = (totalSaVd * 0.5).toFixed(totalSaVd % 2 === 0 ? 0 : 1);

  const tlNbPoints = totalTlNb > 0 ? String(totalTlNb) : "0";
  const tlThPoints = totalTlTh > 0 ? String(totalTlTh) : (isMath ? "1.0" : "0");
  const tlVdPoints = totalTlVd > 0 ? String(totalTlVd) : (isMath ? "2.0" : "3");

  const totalNbPoints = isMath
    ? (Number(mcqNbPoints) + Number(tfNbPoints) + Number(saNbPoints) + Number(tlNbPoints)).toFixed(1)
    : (Number(mcqNbPoints) + Number(tfNbPoints) + Number(tlNbPoints)).toFixed(0);

  const totalThPoints = isMath
    ? (Number(mcqThPoints) + Number(tfThPoints) + Number(saThPoints) + Number(tlThPoints)).toFixed(1)
    : (Number(mcqThPoints) + Number(tfThPoints) + Number(tlThPoints)).toFixed(0);

  const totalVdPoints = isMath
    ? (Number(mcqVdPoints) + Number(tfVdPoints) + Number(saVdPoints) + Number(tlVdPoints)).toFixed(1)
    : (Number(mcqVdPoints) + Number(tfVdPoints) + Number(tlVdPoints)).toFixed(0);

  const resolvedEndContent = getDefaultEndContent(grade, period, matrix, endContent, subject);
  const isPractice = examFormat?.toLowerCase().includes("thực hành");
  const formatText = isPractice
    ? "Kết hợp giữa trắc nghiệm và thực hành (tỉ lệ 70% trắc nghiệm, 30% thực hành)."
    : "Kết hợp giữa trắc nghiệm và tự luận (tỉ lệ 70% trắc nghiệm, 30% tự luận).";
  
  const periodUpper = (period || "GIỮA HỌC KỲ I").toUpperCase();

  // Helper to compute consecutive rowSpan for topics
  const getTopicSpan = (idx: number) => {
    let span = 1;
    for (let i = idx + 1; i < matrix.length; i++) {
      if (matrix[i].topic === matrix[idx].topic) {
        span++;
      } else {
        break;
      }
    }
    return span;
  };

  const mathObjectives = getMathStandardObjectives(grade, period);

  return (
    <div 
      className="space-y-4 w-full font-times exam-preview-document text-black"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {isMath ? (
        <>
          {/* Header Môn Toán */}
          <div className="text-center font-bold text-[14px] leading-tight pb-3">
            <p className="uppercase tracking-wide">KIỂM TRA {periodUpper} – NĂM HỌC {schoolYear || "2026-2027"}</p>
            <p className="font-bold text-[13px] mt-0.5">Môn: Toán {grade}</p>
          </div>

          {/* I. MỤC TIÊU */}
          <div className="text-[14px] leading-relaxed text-black space-y-2 pt-1 border-b border-gray-200 pb-3">
            <div className="font-bold text-[14px] uppercase tracking-wide text-black">
              I. MỤC TIÊU
            </div>
            <div>
              <p className="pl-6"><span className="font-bold">1. Về kiến thức:</span> {mathObjectives.knowledge.title}</p>
              <div className="pl-10 space-y-0.5">
                <p>+ <span className="font-bold">Số học:</span> {mathObjectives.knowledge.arithmetic}</p>
                <p>+ <span className="font-bold">Hình học:</span> {mathObjectives.knowledge.geometry}</p>
                {mathObjectives.knowledge.statistics && (
                  <p>+ <span className="font-bold">Thống kê và Xác suất:</span> {mathObjectives.knowledge.statistics}</p>
                )}
              </div>
            </div>
            <div>
              <p className="pl-6"><span className="font-bold">2. Về năng lực:</span> Kiểm tra và đánh giá các năng lực của HS như năng lực tư duy và lập luận toán học, năng lực giải quyết các vấn đề toán học, năng lực mô hình hóa toán học, năng lực giao tiếp toán học, năng lực sử dụng các công cụ và phương tiện học toán, thể hiện thông qua một số dạng bài tập như:</p>
              <div className="pl-10 space-y-0.5">
                {mathObjectives.competencies.map((comp, cIdx) => (
                  <p key={cIdx}>– {comp}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="pl-6 font-bold">3 Về phẩm chất:</p>
              <div className="pl-10 space-y-0.5">
                {mathObjectives.qualities.map((qual, qIdx) => (
                  <p key={qIdx}>+ {qual}</p>
                ))}
              </div>
            </div>
          </div>

          {/* II. HÌNH THỨC KIỂM TRA VÀ MA TRẬN CÂU HỎI, MA TRẬN ĐẶC TẢ. */}
          <div className="text-[14px] leading-relaxed text-black space-y-1.5 pt-1">
            <div className="font-bold text-[14px] uppercase tracking-wide text-black">
              II. HÌNH THỨC KIỂM TRA VÀ MA TRẬN CÂU HỎI, MA TRẬN ĐẶC TẢ.
            </div>
            <div className="font-bold pl-6">
              1. Hình thức kiểm tra.
            </div>
            <p className="pl-6">
              - Thời điểm kiểm tra: Kiểm tra {period.toLowerCase()}{period.toLowerCase().includes("giữa") ? `, khi kết thúc nội dung: ${resolvedEndContent}` : "."}
            </p>
            <p className="pl-6">
              - Thời gian làm bài: {time || (period.toLowerCase().includes("cuối") ? "90 phút." : "45 phút.")}
            </p>
            <p className="pl-6">
              - Hình thức kiểm tra: {formatText}
            </p>
            <p className="font-bold pl-6">
              Cấu trúc:
            </p>
            <p className="pl-10">
              - Mức độ đề: 40% Nhận biết; 30% Thông hiểu; 30% Vận dụng.
            </p>
            <p className="pl-10">
              - Phần trắc nghiệm 4 lựa chọn: 3,0 điểm (12 câu); Trắc nghiệm Đúng - Sai: 2,0 điểm (02 câu); Trả lời ngắn: 2,0 điểm (04 câu)
            </p>
            <p className="pl-10">
              - Phần tự luận: 3,0 điểm (Vận dụng: 2,0 điểm; Thông hiểu: 1 điểm)
            </p>

            <div className="font-bold pl-6 pt-2">
              2. Ma trận câu hỏi
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header Tin học */}
          <div className="flex justify-between items-start text-[14px] leading-tight pb-3">
            <div className="text-center font-bold uppercase">
              <p>{departmentName || "XÃ HÀM YÊN"}</p>
              <p>{schoolName || "TRƯỜNG THCS TÂN LOAN"}</p>
              <div className="w-20 h-[1px] bg-black mx-auto mt-1"></div>
            </div>
            <div className="text-center font-bold uppercase">
              <p className="text-base">KHUNG MA TRẬN ĐỀ KIỂM TRA {periodUpper}</p>
              <p>MÔN: {subject.toUpperCase()} {grade} - NĂM HỌC {schoolYear || "2026 - 2027"}</p>
              <p className="normal-case font-normal italic text-[13px]">(Thời gian làm bài: {time || "45 phút"})</p>
            </div>
          </div>

          {/* Preamble Details Tin học */}
          <div className="text-[14px] leading-relaxed text-black space-y-1.5">
            <div className="font-bold text-[14px] uppercase tracking-wide text-black">
              I. KHUNG MA TRẬN KIỂM TRA ĐÁNH GIÁ {periodUpper}, MÔN {subject.toUpperCase()} {grade}
            </div>
            <p className="pl-6">
              - Thời điểm kiểm tra: Kiểm tra {period.toLowerCase()}, khi kết thúc nội dung: {resolvedEndContent}
            </p>
            <p className="pl-6">
              - Thời gian làm bài: {time || "45 phút"}. Hình thức kiểm tra: {formatText}
            </p>
            <p className="font-bold pl-6">
              * Cấu trúc:
            </p>
            <p className="pl-10">
              - Mức độ đề: 40% Nhận biết (16 câu/lệnh hỏi); 30% Thông hiểu (12 câu/lệnh hỏi); 30% Vận dụng (03 câu).
            </p>
            <p className="pl-10">
              - Phần trắc nghiệm 4 lựa chọn: 3,0 điểm (12 câu - gồm 8 câu Nhận biết, 4 câu Thông hiểu); Trắc nghiệm Đúng - Sai: 4,0 điểm (04 câu - 16 lệnh hỏi gồm 8 ý Nhận biết, 8 ý Thông hiểu).
            </p>
            <p className="pl-10">
              {isPractice ? "- Phần thực hành: 3,0 điểm (3 câu)" : "- Phần tự luận: 3,0 điểm (3 câu)"}
            </p>
          </div>
        </>
      )}

      {/* Matrix Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full border-collapse border-2 border-black text-[12px] leading-snug">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-white font-bold text-center">
              <th className="border border-black p-1.5 align-middle" rowSpan={3}>
                Chương/<br />chủ đề
              </th>
              <th className="border border-black p-1.5 align-middle" rowSpan={3}>
                Nội dung/đơn vị kiến<br />thức
              </th>
              <th className="border border-black p-1 w-10 text-blue-800 align-middle" rowSpan={3}>
                Số<br />tiết
              </th>
              <th className="border border-black p-1 w-14 text-blue-800 align-middle" rowSpan={3}>
                %<br />Thời<br />lượng
              </th>
              <th className="border border-black p-1 text-blue-800" colSpan={isMath ? 12 : 9}>
                Các mức độ đánh giá
              </th>
              <th className="border border-black p-1 align-middle" colSpan={3} rowSpan={2}>
                Tổng số câu / số lệnh hỏi
              </th>
              <th className="border border-black p-1 w-12 align-middle" rowSpan={3}>
                Tổng<br />điểm
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-white font-bold text-center">
              <th className="border border-black p-1" colSpan={3}>Nhiều lựa chọn</th>
              <th className="border border-black p-1" colSpan={3}>Đúng - Sai</th>
              {isMath && (
                <th className="border border-black p-1 bg-amber-50/50" colSpan={3}>Trả lời ngắn</th>
              )}
              <th className="border border-black p-1" colSpan={3}>{isPractice ? "Thực hành" : "Tự luận"}</th>
            </tr>

            {/* Header Row 3 (Biết / Hiểu / VD) */}
            <tr className="bg-white font-medium text-center text-[10px]">
              {/* MCQ */}
              <th className="border border-black p-0.5 w-7">Biết</th>
              <th className="border border-black p-0.5 w-7">Hiểu</th>
              <th className="border border-black p-0.5 w-7">VD</th>
              {/* TF */}
              <th className="border border-black p-0.5 w-7">Biết</th>
              <th className="border border-black p-0.5 w-7">Hiểu</th>
              <th className="border border-black p-0.5 w-7">VD</th>
              {/* Short Answer (if Math) */}
              {isMath && (
                <>
                  <th className="border border-black p-0.5 w-7 bg-amber-50/50">Biết</th>
                  <th className="border border-black p-0.5 w-7 bg-amber-50/50">Hiểu</th>
                  <th className="border border-black p-0.5 w-7 bg-amber-50/50">VD</th>
                </>
              )}
              {/* TL */}
              <th className="border border-black p-0.5 w-7">Biết</th>
              <th className="border border-black p-0.5 w-7">Hiểu</th>
              <th className="border border-black p-0.5 w-7">VD</th>
              {/* Total Count */}
              <th className="border border-black p-0.5 w-7 font-bold">Biết</th>
              <th className="border border-black p-0.5 w-7 font-bold">Hiểu</th>
              <th className="border border-black p-0.5 w-7 font-bold">VD</th>
            </tr>
          </thead>

          <tbody>
            {matrix.map((row, idx) => {
              const isTopicStart = idx === 0 || matrix[idx - 1].topic !== row.topic;
              const topicSpan = isTopicStart ? getTopicSpan(idx) : 1;

              // 30% First Half vs 70% Second Half cell merge logic for Final Exams
              const isFirstHalfStart = isFinalExam && firstHalfIndices.length > 0 && idx === firstHalfIndices[0];
              const isSecondHalfStart = isFinalExam && secondHalfIndices.length > 0 && idx === secondHalfIndices[0];
              const inFirstHalf = isFinalExam && firstHalfIndices.includes(idx);
              const inSecondHalf = isFinalExam && secondHalfIndices.includes(idx);

              // Distinct divider border between first half (30%) and second half (70%)
              const isBoundaryRow = isFinalExam && firstHalfIndices.length > 0 && idx === firstHalfIndices[firstHalfIndices.length - 1];

              return (
                <tr
                  key={idx}
                  className={`hover:bg-blue-50/20 ${isBoundaryRow ? "border-b-2 border-black" : ""}`}
                >
                  {/* Column 1: Topic (Merged vertically per topic) */}
                  {isTopicStart && (
                    <td
                      className="border border-black p-2 font-bold align-middle bg-white"
                      rowSpan={topicSpan}
                    >
                      {row.topic}
                    </td>
                  )}

                  {/* Column 2: Content / Lesson */}
                  <td className="border border-black p-1.5 align-middle">
                    {row.content}
                  </td>

                  {/* Column 3: Số tiết (Merged for 30% and 70% in final exams) */}
                  {isFinalExam ? (
                    isFirstHalfStart ? (
                      <td
                        className="border border-black p-1 text-center align-middle font-medium bg-white"
                        rowSpan={firstHalfIndices.length}
                      >
                        {firstHalfPeriods}
                      </td>
                    ) : isSecondHalfStart ? (
                      <td
                        className="border border-black p-1 text-center align-middle font-medium bg-white"
                        rowSpan={secondHalfIndices.length}
                      >
                        {secondHalfPeriods}
                      </td>
                    ) : inFirstHalf || inSecondHalf ? null : (
                      <td className="border border-black p-1 text-center align-middle">
                        {row.periods || ""}
                      </td>
                    )
                  ) : (
                    <td className="border border-black p-1 text-center align-middle">
                      {row.periods || ""}
                    </td>
                  )}

                  {/* Column 4: % Thời lượng (Merged with blue font for 30% and 70%) */}
                  {isFinalExam ? (
                    isFirstHalfStart ? (
                      <td
                        className="border border-black p-1 text-center align-middle font-bold text-blue-700 bg-white"
                        rowSpan={firstHalfIndices.length}
                      >
                        30.0
                      </td>
                    ) : isSecondHalfStart ? (
                      <td
                        className="border border-black p-1 text-center align-middle font-bold text-blue-700 bg-white"
                        rowSpan={secondHalfIndices.length}
                      >
                        70.0
                      </td>
                    ) : inFirstHalf || inSecondHalf ? null : (
                      <td className="border border-black p-1 text-center align-middle font-bold text-blue-700">
                        {row.percentage ? `${row.percentage}` : ""}
                      </td>
                    )
                  ) : (
                    <td className="border border-black p-1 text-center align-middle font-bold text-blue-700">
                      {row.percentage ? `${row.percentage}` : ""}
                    </td>
                  )}

                  {/* MCQ (Biết, Hiểu, VD) */}
                  <td className="border border-black p-1 text-center">{formatCount(row.mcq_nb)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.mcq_th)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.mcq_vd)}</td>

                  {/* TF (Biết, Hiểu, VD) */}
                  <td className="border border-black p-1 text-center">{formatCount(row.tf_nb)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.tf_th)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.tf_vd)}</td>

                  {/* SA (Biết, Hiểu, VD) if Math */}
                  {isMath && (
                    <>
                      <td className="border border-black p-1 text-center bg-amber-50/30">{formatCount(row.sa_nb)}</td>
                      <td className="border border-black p-1 text-center bg-amber-50/30">{formatCount(row.sa_th)}</td>
                      <td className="border border-black p-1 text-center bg-amber-50/30">{formatCount(row.sa_vd)}</td>
                    </>
                  )}

                  {/* TL (Biết, Hiểu, VD) */}
                  <td className="border border-black p-1 text-center">{formatCount(row.tl_nb)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.tl_th)}</td>
                  <td className="border border-black p-1 text-center">{formatCount(row.tl_vd)}</td>

                  {/* Total Counts per row (Biết, Hiểu, VD in RED as shown in reference) */}
                  <td className="border border-black p-1 text-center font-bold text-red-600">
                    {formatCount(row.total_nb)}
                  </td>
                  <td className="border border-black p-1 text-center font-bold text-red-600">
                    {formatCount(row.total_th)}
                  </td>
                  <td className="border border-black p-1 text-center font-bold text-red-600">
                    {formatCount(row.total_vd) || (Number(row.totalPoints || 0) > 0 && row.total_vd === 0 ? "0" : formatCount(row.total_vd))}
                  </td>

                  {/* Row Total Points */}
                  <td className="border border-black p-1 text-center font-bold text-black">
                    {Number(row.totalPoints || 0) > 0 ? Number(row.totalPoints).toFixed(2) : ""}
                  </td>
                </tr>
              );
            })}

            {/* SUMMARY ROW 1: Số lệnh hỏi TN/ Số câu TL */}
            <tr className="bg-white font-bold text-center border-t-2 border-black">
              <td className="border border-black p-1.5 text-center" colSpan={2}>
                Số lệnh hỏi TN/ Số câu TL
              </td>
              <td className="border border-black p-1">{totalPeriods}</td>
              <td className="border border-black p-1 text-blue-700">100.0</td>
              {/* MCQ */}
              <td className="border border-black p-1">{formatCount(totalMcqNb)}</td>
              <td className="border border-black p-1">{formatCount(totalMcqTh)}</td>
              <td className="border border-black p-1">{totalMcqVd > 0 ? formatCount(totalMcqVd) : "0"}</td>
              {/* TF */}
              <td className="border border-black p-1">{formatCount(totalTfNb)}</td>
              <td className="border border-black p-1">{formatCount(totalTfTh)}</td>
              <td className="border border-black p-1">{totalTfVd > 0 ? formatCount(totalTfVd) : "0"}</td>
              {/* SA if Math */}
              {isMath && (
                <>
                  <td className="border border-black p-1 bg-amber-50/50">{formatCount(totalSaNb)}</td>
                  <td className="border border-black p-1 bg-amber-50/50">{formatCount(totalSaTh)}</td>
                  <td className="border border-black p-1 bg-amber-50/50">{formatCount(totalSaVd)}</td>
                </>
              )}
              {/* TL */}
              <td className="border border-black p-1">{totalTlNb > 0 ? formatCount(totalTlNb) : "0"}</td>
              <td className="border border-black p-1">{totalTlTh > 0 ? formatCount(totalTlTh) : (isMath ? "1" : "0")}</td>
              <td className="border border-black p-1">{formatCount(totalTlVd) || (isMath ? "2" : "3")}</td>
              {/* Totals */}
              <td className="border border-black p-1">{formatCount(totalAllNb) || (isMath ? "17" : "16")}</td>
              <td className="border border-black p-1">{formatCount(totalAllTh) || (isMath ? "6" : "12")}</td>
              <td className="border border-black p-1">{formatCount(totalAllVd) || (isMath ? "7" : "3")}</td>
              <td className="border border-black p-1 font-bold text-black">10</td>
            </tr>

            {/* SUMMARY ROW 2: Tổng điểm (Sub-points in red as in reference) */}
            <tr className="bg-white font-bold text-center">
              <td className="border border-black p-1.5 text-center" colSpan={2}>
                Tổng điểm
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
              {/* MCQ Points */}
              <td className="border border-black p-1 text-red-600">{mcqNbPoints}</td>
              <td className="border border-black p-1 text-red-600">{mcqThPoints}</td>
              <td className="border border-black p-1 text-red-600">{mcqVdPoints}</td>
              {/* TF Points */}
              <td className="border border-black p-1 text-red-600">{tfNbPoints}</td>
              <td className="border border-black p-1 text-red-600">{tfThPoints}</td>
              <td className="border border-black p-1 text-red-600">{tfVdPoints}</td>
              {/* SA Points if Math */}
              {isMath && (
                <>
                  <td className="border border-black p-1 text-red-600 bg-amber-50/50">{saNbPoints}</td>
                  <td className="border border-black p-1 text-red-600 bg-amber-50/50">{saThPoints}</td>
                  <td className="border border-black p-1 text-red-600 bg-amber-50/50">{saVdPoints}</td>
                </>
              )}
              {/* TL Points */}
              <td className="border border-black p-1 text-red-600">{tlNbPoints}</td>
              <td className="border border-black p-1 text-red-600">{tlThPoints}</td>
              <td className="border border-black p-1 text-red-600">{tlVdPoints}</td>
              {/* Totals */}
              <td className="border border-black p-1 text-black">{totalNbPoints}</td>
              <td className="border border-black p-1 text-black">{totalThPoints}</td>
              <td className="border border-black p-1 text-black">{totalVdPoints}</td>
              <td className="border border-black p-1 text-black">10</td>
            </tr>

            {/* SUMMARY ROW 3: Tỉ lệ % (Tính động chuẩn xác theo điểm thực tế) */}
            {(() => {
              const sumMcqPoints = Number(mcqNbPoints) + Number(mcqThPoints) + Number(mcqVdPoints);
              const sumTfPoints = Number(tfNbPoints) + Number(tfThPoints) + Number(tfVdPoints);
              const sumSaPoints = Number(saNbPoints) + Number(saThPoints) + Number(saVdPoints);
              const sumTlPoints = Number(tlNbPoints) + Number(tlThPoints) + Number(tlVdPoints);

              const mcqPercent = sumMcqPoints > 0 ? `${Math.round(sumMcqPoints * 10)}%` : "";
              const tfPercent = sumTfPoints > 0 ? `${Math.round(sumTfPoints * 10)}%` : "";
              const saPercent = sumSaPoints > 0 ? `${Math.round(sumSaPoints * 10)}%` : "";
              const tlPercent = sumTlPoints > 0 ? `${Math.round(sumTlPoints * 10)}%` : "";

              const nbPercent = Math.round(Number(totalNbPoints) * 10);
              const thPercent = Math.round(Number(totalThPoints) * 10);
              const vdPercent = Math.round(Number(totalVdPoints) * 10);

              return (
                <tr className="bg-white font-bold text-center text-[10.5px]">
                  <td className="border border-black p-1.5 text-center" colSpan={2}>
                    Tỉ lệ %
                  </td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  {/* Question type percentages */}
                  <td className="border border-black p-1" colSpan={3}>
                    {mcqPercent || "30%"}
                  </td>
                  <td className="border border-black p-1" colSpan={3}>
                    {tfPercent || (isMath ? "20%" : "40%")}
                  </td>
                  {isMath && (
                    <td className="border border-black p-1 bg-amber-50/50" colSpan={3}>
                      {saPercent}
                    </td>
                  )}
                  <td className="border border-black p-1" colSpan={3}>
                    {tlPercent || "30%"}
                  </td>
                  {/* Cognitive level percentages */}
                  <td className="border border-black p-1">{nbPercent}</td>
                  <td className="border border-black p-1">{thPercent}</td>
                  <td className="border border-black p-1">{vdPercent}</td>
                  <td className="border border-black p-1">100.0</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

