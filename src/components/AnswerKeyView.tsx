import React, { useState } from "react";
import { parseAppliedQuestion, formatAnswerLines } from "../lib/formatter";
import { Edit3, Check, Sparkles, AlertCircle } from "lucide-react";
import SignatureBlock from "./SignatureBlock";

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface TFStatement {
  id: string;
  text: string;
  isTrue: boolean;
}

interface TFQuestion {
  id: number;
  question: string;
  statements: TFStatement[];
}

interface Breakdown {
  criteria: string;
  points: string;
}

interface Applied {
  id: number;
  question: string;
  answer: string;
  pointsBreakdown?: Breakdown[];
}

export interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer?: string;
  unit?: string;
  explanation?: string;
}

interface AnswerKeyViewProps {
  title?: string;
  departmentName?: string;
  schoolName: string;
  schoolYear: string;
  grade: string;
  period: string;
  examCode?: string;
  mcq?: MCQ[];
  tf?: TFQuestion[];
  shortAnswer?: ShortAnswerQuestion[];
  applied?: Applied[];
  examFormat?: string;
  onUpdateMcqAnswer?: (questionId: number, newAnswer: string) => void;
  onToggleTfStatement?: (questionId: number, statementId: string) => void;
  onUpdateShortAnswer?: (questionId: number, newAnswer: string) => void;
  onOpenQuestionEditor?: (questionId: number, questionType: "mcq" | "tf" | "applied" | "shortAnswer", questionData: any) => void;
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
}

export default function AnswerKeyView({
  title = "ĐỀ KIỂM TRA",
  departmentName = "XÃ HÀM YÊN",
  schoolName,
  schoolYear,
  grade,
  period,
  examCode = "101",
  mcq = [],
  tf = [],
  shortAnswer = [],
  applied = [],
  examFormat = "Tự luận",
  onUpdateMcqAnswer,
  onToggleTfStatement,
  onUpdateShortAnswer,
  onOpenQuestionEditor,
  examDateLocation,
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
}: AnswerKeyViewProps) {
  const [activeMcqPopId, setActiveMcqPopId] = useState<number | null>(null);
  const hasShortAnswer = shortAnswer && shortAnswer.length > 0;

  return (
    <div 
      className="space-y-6 w-full font-times exam-preview-document"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Interactive Helper Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <b>Tính năng đổi đáp án & soạn lại thông minh:</b> Thầy/cô có thể <u>bấm trực tiếp vào các ô đáp án</u> (A, B, C, D hoặc ĐÚNG/SAI) bên dưới để đổi đáp án nhanh. Toàn bộ đáp án, hướng dẫn chấm và file Word (.docx) sẽ được tự động đồng bộ ngay lập tức!
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start text-[14px] leading-tight pb-2 border-b border-black">
        <div className="text-center font-bold uppercase w-[42%]">
          <p>{departmentName || "XÃ HÀM YÊN"}</p>
          <p className="text-[14px]">{schoolName || "TRƯỜNG THCS TÂN LOAN"}</p>
          <div className="w-24 h-[1px] bg-black mx-auto mt-1.5"></div>
        </div>
        <div className="text-center font-bold uppercase w-[58%]">
          <p className="text-[14px]">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN</p>
          <p>{title}</p>
          <p>NĂM HỌC {schoolYear || "2026 - 2027"}</p>
          <p className="text-[13px] font-bold text-blue-900 mt-0.5">MÃ ĐỀ: {examCode}</p>
          <div className="w-24 h-[1px] bg-black mx-auto mt-1.5"></div>
        </div>
      </div>

      <div className="text-center font-bold text-[14px] uppercase tracking-wider text-black">
        ĐÁP ÁN VÀ THANG ĐIỂM CHI TIẾT - MÃ ĐỀ {examCode}
      </div>

      <div className="text-[14px] leading-relaxed text-justify space-y-6">
        {/* PART I ANSWERS */}
        {hasShortAnswer && (
          <div className="font-bold text-[15px] mb-4 text-black uppercase">
            A. ĐÁP ÁN TRẮC NGHIỆM KHÁCH QUAN (7,0 ĐIỂM)
          </div>
        )}
        <div>
          <div className="font-bold text-[14px] mb-2 text-black flex items-center justify-between">
            <span>{hasShortAnswer ? "Phần 1. Đáp án trắc nghiệm nhiều lựa chọn (3,0 điểm)" : "PHẦN I. ĐÁP ÁN TRẮC NGHIỆM NHIỀU LỰA CHỌN (3,0 ĐIỂM)"}</span>
            <span className="font-normal text-[12px] italic text-gray-700">Mỗi câu đúng: 0,25 điểm (Bấm vào ô để đổi đáp án)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[12px] text-center mb-3">
              <thead>
                <tr className="bg-gray-100 font-bold">
                  {mcq.map((q) => (
                    <th key={q.id} className="border border-black p-1">
                      Câu {q.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold text-blue-900 text-[13px] bg-blue-50/50">
                  {mcq.map((q) => {
                    const isPopped = activeMcqPopId === q.id;
                    return (
                      <td key={q.id} className="border border-black p-1 relative">
                        <button
                          type="button"
                          onClick={() => setActiveMcqPopId(isPopped ? null : q.id)}
                          className="w-full h-8 flex items-center justify-center rounded hover:bg-blue-200/60 font-black text-blue-900 transition-colors cursor-pointer group"
                          title="Bấm để đổi đáp án đúng"
                        >
                          <span>{q.correctAnswer || "A"}</span>
                          <span className="text-[9px] text-blue-500 opacity-0 group-hover:opacity-100 ml-0.5">▼</span>
                        </button>

                        {/* Popover choice */}
                        {isPopped && (
                          <div className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-1 bg-white shadow-xl border-2 border-blue-600 rounded-lg p-1.5 flex gap-1 animate-in fade-in zoom-in-95 duration-150">
                            {(["A", "B", "C", "D"] as const).map((letter) => (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => {
                                  if (onUpdateMcqAnswer) {
                                    onUpdateMcqAnswer(q.id, letter);
                                  }
                                  setActiveMcqPopId(null);
                                }}
                                className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                                  q.correctAnswer === letter
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                                }`}
                              >
                                {letter}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed explanation toggle or list if needed */}
          {mcq.length > 0 && (
            <div className="mt-2 space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-200 text-[12px]">
              <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                <p className="font-semibold text-gray-800">Giải thích chi tiết câu trắc nghiệm:</p>
                <span className="text-[11px] text-gray-500 italic">Thầy/cô có thể chọn nhanh đáp án đúng hoặc bấm nút Sửa</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 text-gray-700">
                {mcq.map((q) => (
                  <div key={q.id} className="flex items-start justify-between gap-2 p-1 rounded hover:bg-white/80 transition-colors">
                    <div className="flex-1">
                      <span className="font-bold text-blue-900">Câu {q.id}: </span>
                      <span className="text-gray-800 mr-2">{q.question}</span>
                      <div className="inline-flex gap-1 items-center ml-1">
                        {(["A", "B", "C", "D"] as const).map((letter) => (
                          <button
                            key={letter}
                            type="button"
                            onClick={() => onUpdateMcqAnswer && onUpdateMcqAnswer(q.id, letter)}
                            className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                              q.correctAnswer === letter
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                      {q.explanation && (
                        <span className="text-gray-600 italic block mt-0.5 pl-2 border-l-2 border-blue-200">
                          Giải thích: {q.explanation}
                        </span>
                      )}
                    </div>
                    {onOpenQuestionEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenQuestionEditor(q.id, "mcq", q)}
                        className="shrink-0 text-blue-700 hover:text-blue-900 bg-blue-100/80 hover:bg-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Sửa / Soạn lại
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART II ANSWERS */}
        <div>
          <div className="font-bold text-[14px] mb-2 text-black flex items-center justify-between">
            <span>{hasShortAnswer ? "Phần 2. Đáp án trắc nghiệm đúng - sai (2,0 điểm)" : "PHẦN II. ĐÁP ÁN TRẮC NGHIỆM ĐÚNG - SAI (4,0 ĐIỂM)"}</span>
            <span className="font-normal text-[12px] italic text-gray-700">Bấm trực tiếp vào nút [ĐÚNG] / [SAI] để đổi đáp án</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[12px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black p-1.5 w-16">Câu hỏi</th>
                  <th className="border border-black p-1.5">Nội dung câu lệnh / Ý phát biểu</th>
                  <th className="border border-black p-1.5 w-28">Đáp án (Bấm đổi)</th>
                  <th className="border border-black p-1.5 w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tf.map((q) => (
                  <React.Fragment key={q.id}>
                    <tr className="bg-gray-50/70 font-semibold">
                      <td className="border border-black p-1.5 text-center font-bold text-blue-900" rowSpan={5}>
                        Câu {q.id}
                      </td>
                      <td className="border border-black p-1.5 font-bold" colSpan={2}>
                        {q.question}
                      </td>
                      <td className="border border-black p-1.5 text-center" rowSpan={5}>
                        {onOpenQuestionEditor && (
                          <button
                            type="button"
                            onClick={() => onOpenQuestionEditor(q.id, "tf", q)}
                            className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            Soạn lại câu {q.id}
                          </button>
                        )}
                        <p className="text-[10px] text-gray-500 mt-1">Đúng 1 ý: 0.1đ<br/>2 ý: 0.25đ<br/>3 ý: 0.5đ<br/>4 ý: 1.0đ</p>
                      </td>
                    </tr>
                    {q.statements?.map((st) => (
                      <tr key={st.id} className="hover:bg-blue-50/20">
                        <td className="border border-black p-1.5">
                          <span className="font-bold text-blue-600 italic mr-1">{st.id})</span> {st.text}
                        </td>
                        <td className="border border-black p-1.5 text-center font-bold">
                          <button
                            type="button"
                            onClick={() => onToggleTfStatement && onToggleTfStatement(q.id, st.id)}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${
                              st.isTrue
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-400 hover:bg-emerald-200"
                                : "bg-rose-100 text-rose-800 border border-rose-400 hover:bg-rose-200"
                            }`}
                            title="Bấm để đổi giữa ĐÚNG và SAI"
                          >
                            {st.isTrue ? "✓ ĐÚNG" : "✗ SAI"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PART III ANSWERS: SHORT ANSWER (if exists - MÔN TOÁN) */}
        {hasShortAnswer && (
          <div>
            <div className="font-bold text-[14px] mb-2 text-black flex items-center justify-between">
              <span>Phần 3. Đáp án trắc nghiệm trả lời ngắn (2,0 điểm)</span>
              <span className="font-normal text-[12px] italic text-gray-700">Mỗi câu đúng: 0,5 điểm</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-[12px]">
                <thead>
                  <tr className="bg-gray-100 font-bold text-center">
                    <th className="border border-black p-1.5 w-16">Câu</th>
                    <th className="border border-black p-1.5">Nội dung câu hỏi</th>
                    <th className="border border-black p-1.5 w-36">Đáp án / Kết quả</th>
                    <th className="border border-black p-1.5 w-20">Điểm</th>
                    <th className="border border-black p-1.5 w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shortAnswer.map((q) => (
                    <tr key={q.id} className="hover:bg-blue-50/20">
                      <td className="border border-black p-2 text-center font-bold text-blue-900">
                        Câu {q.id}
                      </td>
                      <td className="border border-black p-2 text-black">
                        <div>{q.question}</div>
                        {q.explanation && (
                          <div className="text-[11px] text-gray-600 italic mt-1 pl-2 border-l-2 border-amber-300">
                            {q.explanation}
                          </div>
                        )}
                      </td>
                      <td className="border border-black p-2 text-center font-bold text-emerald-800 bg-emerald-50/40">
                        <input
                          type="text"
                          defaultValue={q.answer || ""}
                          onBlur={(e) => onUpdateShortAnswer && onUpdateShortAnswer(q.id, e.target.value)}
                          className="w-full text-center font-bold text-emerald-900 bg-transparent border-b border-dashed border-emerald-500 focus:outline-none focus:border-emerald-700 text-[12px]"
                          title="Bấm để chỉnh sửa đáp án"
                        />
                        {q.unit && <span className="text-[11px] text-gray-600 font-normal ml-1">({q.unit})</span>}
                      </td>
                      <td className="border border-black p-2 text-center font-bold text-black">
                        0,5 đ
                      </td>
                      <td className="border border-black p-2 text-center">
                        {onOpenQuestionEditor && (
                          <button
                            type="button"
                            onClick={() => onOpenQuestionEditor(q.id, "shortAnswer", q)}
                            className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            Soạn lại
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PART APPLIED / TỰ LUẬN */}
        <div>
          <div className="font-bold text-[14px] mb-2 text-black flex items-center justify-between">
            <span>
              {hasShortAnswer
                ? "B. HƯỚNG DẪN CHẤM TỰ LUẬN (3,0 ĐIỂM)"
                : `PHẦN III. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM VẬN DỤNG / ${examFormat?.toUpperCase() || "TỰ LUẬN"} (3,0 ĐIỂM)`}
            </span>
            <span className="font-normal text-[12px] italic text-gray-700">Mỗi câu 1,0 điểm</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[12px]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black p-1.5 w-16">Câu</th>
                  <th className="border border-black p-1.5">Nội dung yêu cầu & Đáp án chi tiết</th>
                  <th className="border border-black p-1.5 w-24">Điểm</th>
                  <th className="border border-black p-1.5 w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {applied.map((q) => {
                  const parsed = parseAppliedQuestion(q.question);
                  const answerLines = formatAnswerLines(q.answer);

                  return (
                    <tr key={q.id} className="align-top hover:bg-gray-50/40">
                      <td className="border border-black p-2 text-center font-bold text-blue-900">
                        Câu {q.id}
                        <p className="text-[11px] font-normal text-gray-500">(1,0 điểm)</p>
                      </td>
                      <td className="border border-black p-2 space-y-2">
                        <div className="font-normal text-gray-900 space-y-0.5">
                          <span className="font-semibold text-gray-700">Yêu cầu: </span>
                          <span className="font-bold text-black">
                            {parsed.firstLine}
                          </span>
                          {parsed.subLines.map((line, lIdx) => {
                            const matchSub = line.match(/^([a-eA-E][\.\)]|[1-9][\.\)])\s*(.*)$/);
                            return (
                              <div key={lIdx} className="pl-3 font-normal text-black">
                                {matchSub ? (
                                  <>
                                    <span className="font-bold">{matchSub[1]} </span>
                                    <span>{matchSub[2]}</span>
                                  </>
                                ) : (
                                  line
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-blue-50/50 p-2 rounded border border-blue-100 text-gray-800">
                          <span className="font-bold text-blue-900 block mb-1">Đáp án / Hướng dẫn giải chi tiết:</span>
                          <div className="space-y-1">
                            {answerLines.map((line, aIdx) => {
                              const isSub = line.startsWith("+") || /^[1-9][\.\)]/.test(line);
                              const isHeader = /^[a-eA-E][\.\)]/.test(line) || (/^[\-]/.test(line) && line.includes(":"));
                              return (
                                <div
                                  key={aIdx}
                                  className={`${isSub ? "pl-4 text-gray-700" : "text-gray-900"} ${isHeader ? "font-semibold text-slate-900" : ""}`}
                                >
                                  {line}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {q.pointsBreakdown && q.pointsBreakdown.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <p className="font-bold text-gray-800 text-[11px]">Thang điểm chi tiết:</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                              {q.pointsBreakdown.map((pb, pbIdx) => (
                                <li key={pbIdx} className="flex justify-between items-center text-[11px] border-b border-gray-100 pb-0.5">
                                  <span>{pb.criteria}</span>
                                  <span className="font-bold text-blue-800 shrink-0 ml-2">{pb.points} điểm</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>
                      <td className="border border-black p-2 text-center font-bold text-blue-900">
                        1,0 đ
                      </td>
                      <td className="border border-black p-2 text-center">
                        {onOpenQuestionEditor && (
                          <button
                            type="button"
                            onClick={() => onOpenQuestionEditor(q.id, "applied", q)}
                            className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            Soạn lại
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-[12px] text-gray-600 font-bold italic pt-4">
          ------------------- HẾT HƯỚNG DẪN CHẤM -------------------
        </div>

        {/* SIGNATURE BLOCK */}
        <SignatureBlock
          examDateLocation={examDateLocation}
          bghName={bghName}
          bghSignature={bghSignature}
          teacherHeadName={teacherHeadName}
          teacherHeadSignature={teacherHeadSignature}
          creatorName={creatorName}
          creatorSignature={creatorSignature}
        />
      </div>
    </div>
  );
}
