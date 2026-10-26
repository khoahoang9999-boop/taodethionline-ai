import React from "react";
import { enrichSpecificationItem } from "../data/mathObjectives";
import { syncSpecificationWithMatrix } from "../data/textbooks";
import { normalizeMatrixPercentages } from "../lib/matrixUtils";

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

interface SpecificationViewProps {
  subject?: string;
  specification?: SpecRow[];
  departmentName?: string;
  schoolName: string;
  schoolYear: string;
  grade: string;
  period: string;
  time?: string;
  examFormat?: string;
  endContent?: string;
  matrix?: any[];
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
}

const formatCount = (val?: number | string | null) => {
  const num = Number(val);
  return num > 0 ? String(num) : "";
};

export default function SpecificationView({
  subject = "Tin học",
  specification: rawSpecification = [],
  matrix: rawMatrix = [],
  departmentName = "XÃ HÀM YÊN",
  schoolName,
  schoolYear,
  grade,
  period,
  time = "45 phút",
  examFormat = "",
  examDateLocation,
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
}: SpecificationViewProps) {
  const isMath = subject.toLowerCase().includes("toán");
  const subjectDisplay = isMath ? "TOÁN" : subject.toUpperCase();
  const isFinalExam = (period || "").toLowerCase().includes("cuối");
  const normalizedMatrix = normalizeMatrixPercentages(rawMatrix, isFinalExam);

  const specification: SpecRow[] = syncSpecificationWithMatrix(
    rawSpecification,
    normalizedMatrix,
    subject,
    grade,
    period
  );

  const totalNb = specification.reduce((sum, r) => sum + (Number(r.nb_count) || 0), 0);
  const totalTh = specification.reduce((sum, r) => sum + (Number(r.th_count) || 0), 0);
  const totalVd = specification.reduce((sum, r) => sum + (Number(r.vd_count) || 0), 0);

  const periodUpper = (period || "GIỮA HỌC KỲ I").toUpperCase();
  const isPractice = (examFormat || "").toLowerCase().includes("thực hành");

  // Determine question count labels based on format
  const nbCountText = totalNb ? `${totalNb}TN` : (isMath ? "17TN" : "16TN");
  const thCountText = totalTh ? `${totalTh} TN` : (isMath ? "5 TN" : "12 TN");
  const vdCountText = isMath
    ? "3 TL"
    : (isPractice ? "3TH" : "3TL");

  // Calculate rowSpan and topic sequence number (TT) for consecutive identical topics in column "Chương/ Chủ đề"
  const topicSpans: number[] = new Array(specification.length).fill(1);
  const topicSeqNumbers: number[] = new Array(specification.length).fill(1);
  let topicIdx = 0;
  let currentSeq = 1;
  while (topicIdx < specification.length) {
    let count = 1;
    const currentTopic = (specification[topicIdx].topic || "").trim();
    while (
      topicIdx + count < specification.length &&
      currentTopic !== "" &&
      (specification[topicIdx + count].topic || "").trim() === currentTopic
    ) {
      count++;
    }
    topicSpans[topicIdx] = count;
    topicSeqNumbers[topicIdx] = currentSeq;
    for (let j = 1; j < count; j++) {
      topicSpans[topicIdx + j] = 0;
      topicSeqNumbers[topicIdx + j] = currentSeq;
    }
    currentSeq++;
    topicIdx += count;
  }

  const renderDescriptionBlock = (title: string, descText?: string, count?: number) => {
    if (!descText || !descText.trim()) return null;
    const lines = descText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return (
      <div className="text-left">
        <p className="font-bold text-black">{title}</p>
        <div className="space-y-0.5 mt-0.5">
          {lines.map((line, lIdx) => {
            const formattedLine =
              line.startsWith("–") ||
              line.startsWith("-") ||
              line.startsWith("+") ||
              line.endsWith(":")
                ? line
                : `– ${line}`;
            return (
              <p
                key={lIdx}
                className={`leading-relaxed text-[12px] text-gray-900 ${
                  isMath && count && count > 0 ? "underline underline-offset-2" : ""
                }`}
              >
                {formattedLine}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="space-y-4 w-full font-times exam-preview-document"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Header tiêu đề bảng đặc tả */}
      <div className="font-bold text-[13pt] uppercase tracking-wide text-black pb-2 text-left">
        II. BẢNG ĐẶC TẢ ĐỀ KIỂM TRA {periodUpper}, MÔN {subjectDisplay} {grade}
      </div>

      {/* Specification Table */}
      <div className="overflow-x-auto pt-1">
        <table className="w-full border-collapse border border-black text-[12px] leading-relaxed">
          <thead>
            <tr className="bg-white font-bold text-center">
              <th className="border border-black p-1.5 w-10 align-middle" rowSpan={2}>
                TT
              </th>
              <th className="border border-black p-1.5 w-32 align-middle" rowSpan={2}>
                Chương/<br />Chủ đề
              </th>
              <th className="border border-black p-1.5 w-44 align-middle" rowSpan={2}>
                Nội dung/Đơn vị kiến thức
              </th>
              <th className="border border-black p-1.5 align-middle" rowSpan={2}>
                Mức độ đánh giá
              </th>
              <th className="border border-black p-1.5 align-middle" colSpan={3}>
                Số câu hỏi theo mức độ nhận thức
              </th>
            </tr>
            <tr className="bg-white font-bold text-center">
              <th className="border border-black p-1 w-16 text-center align-middle">Nhận biết</th>
              <th className="border border-black p-1 w-16 text-center align-middle">Thông hiểu</th>
              <th className="border border-black p-1 w-16 text-center align-middle">Vận dụng</th>
            </tr>
          </thead>
          <tbody>
            {specification.map((row, idx) => {
              const topicSpan = topicSpans[idx];
              const topicSeq = topicSeqNumbers[idx];
              const enriched = isMath
                ? enrichSpecificationItem(row.content, row.topic, row.nb_desc, row.th_desc, row.vd_desc)
                : { nb: row.nb_desc || "", th: row.th_desc || "", vd: row.vd_desc || "" };

              return (
                <tr key={idx} className="hover:bg-blue-50/30">
                  {topicSpan > 0 && (
                    <td
                      className="border border-black p-1.5 text-center font-bold align-top"
                      rowSpan={topicSpan}
                    >
                      {topicSeq}
                    </td>
                  )}
                  {topicSpan > 0 && (
                    <td
                      className="border border-black p-1.5 font-bold align-top text-left"
                      rowSpan={topicSpan}
                    >
                      {row.topic}
                    </td>
                  )}
                  <td className="border border-black p-1.5 font-normal text-black align-top text-left">
                    {row.content}
                  </td>
                  <td className="border border-black p-2 text-left space-y-1.5 leading-relaxed align-top">
                    {renderDescriptionBlock("Nhận biết", enriched.nb, row.nb_count)}
                    {renderDescriptionBlock("Thông hiểu", enriched.th, row.th_count)}
                    {renderDescriptionBlock("Vận dụng", enriched.vd, row.vd_count)}
                  </td>
                  <td className="border border-black p-1.5 text-center font-semibold text-blue-900 align-middle">
                    {formatCount(row.nb_count)}
                  </td>
                  <td className="border border-black p-1.5 text-center font-semibold text-indigo-900 align-middle">
                    {formatCount(row.th_count)}
                  </td>
                  <td className="border border-black p-1.5 text-center font-semibold text-purple-900 align-middle">
                    {formatCount(row.vd_count)}
                  </td>
                </tr>
              );
            })}
            {/* Summary Rows as shown in official reference */}
            <tr className="font-bold text-center bg-white">
              <td className="border border-black p-1.5 text-center font-bold" colSpan={3}>
                Số lệnh hỏi TN/Số câu tự luận
              </td>
              <td className="border border-black p-1.5"></td>
              <td className="border border-black p-1.5 text-center font-bold">{nbCountText}</td>
              <td className="border border-black p-1.5 text-center font-bold">{thCountText}</td>
              <td className="border border-black p-1.5 text-center font-bold">{vdCountText}</td>
            </tr>

            <tr className="font-bold text-center bg-white">
              <td className="border border-black p-1.5 text-center font-bold" colSpan={3}>
                Tổng số điểm
              </td>
              <td className="border border-black p-1.5"></td>
              <td className="border border-black p-1.5 text-center font-bold">4</td>
              <td className="border border-black p-1.5 text-center font-bold">3</td>
              <td className="border border-black p-1.5 text-center font-bold">3</td>
            </tr>

            <tr className="font-bold italic text-center bg-white">
              <td className="border border-black p-1.5 text-center font-bold italic" colSpan={3}>
                Tỉ lệ %
              </td>
              <td className="border border-black p-1.5"></td>
              <td className="border border-black p-1.5 text-center font-bold italic">40%</td>
              <td className="border border-black p-1.5 text-center font-bold italic">30%</td>
              <td className="border border-black p-1.5 text-center font-bold italic">30%</td>
            </tr>

            <tr className="font-bold text-center bg-white">
              <td className="border border-black p-1.5 text-center font-bold" colSpan={3}>
                Tỉ lệ chung
              </td>
              <td className="border border-black p-1.5"></td>
              <td className="border border-black p-1.5 text-center font-bold" colSpan={2}>
                70%
              </td>
              <td className="border border-black p-1.5 text-center font-bold">
                30%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

