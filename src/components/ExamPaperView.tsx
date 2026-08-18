import React from "react";
import { parseAppliedQuestion } from "../lib/formatter";
import { Edit3 } from "lucide-react";
import MathFigureDisplay from "./MathFigureDisplay";

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
  imageUrl?: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
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
  imageUrl?: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
}

export interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer?: string;
  unit?: string;
  explanation?: string;
  imageUrl?: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
}

interface Applied {
  id: number;
  question: string;
  answer?: string;
  pointsBreakdown?: { criteria: string; points: string }[];
  imageUrl?: string;
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
}

interface ExamPaperViewProps {
  title?: string;
  time?: string;
  departmentName?: string;
  schoolName: string;
  schoolYear: string;
  examCode?: string;
  mcq?: MCQ[];
  tf?: TFQuestion[];
  shortAnswer?: ShortAnswerQuestion[];
  applied?: Applied[];
  examFormat?: string;
  onOpenQuestionEditor?: (questionId: number, questionType: "mcq" | "tf" | "applied" | "shortAnswer", questionData: any) => void;
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
}

const getOptionLayout = (options: string[] = []) => {
  const maxLen = Math.max(...options.map((o) => (o || "").trim().length), 0);
  const totalLen = options.reduce((sum, o) => sum + (o || "").trim().length, 0);

  if (maxLen <= 18 && totalLen <= 70) {
    return "1-row"; // 4 options in 1 line
  } else if (maxLen <= 42 && totalLen <= 150) {
    return "2-row"; // 2 pairs of options (AB, CD)
  } else {
    return "4-row"; // 4 separate rows (A, B, C, D)
  }
};

export default function ExamPaperView({
  title = "ĐỀ KIỂM TRA MÔN TIN HỌC",
  time = "45 phút",
  departmentName = "XÃ HÀM YÊN",
  schoolName,
  schoolYear,
  examCode = "101",
  mcq = [],
  tf = [],
  shortAnswer = [],
  applied = [],
  examFormat = "Tự luận",
  onOpenQuestionEditor,
  examDateLocation,
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
}: ExamPaperViewProps) {
  const hasShortAnswer = shortAnswer && shortAnswer.length > 0;
  const renderOptionContent = (opt: string) => {
    const match = (opt || "").match(/^([A-D]\.\s*)(.*)$/);
    if (match) {
      return (
        <span>
          <span className="font-bold text-blue-600 mr-1">{match[1]}</span>
          <span className="text-black font-normal">{match[2]}</span>
        </span>
      );
    }
    return <span>{opt}</span>;
  };

  return (
    <div 
      className="space-y-6 w-full font-times exam-preview-document"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start text-[14px] leading-tight pb-2 border-b border-black">
        <div className="text-center font-bold uppercase w-[42%]">
          <p>{departmentName || "XÃ HÀM YÊN"}</p>
          <p className="text-[14px]">{schoolName || "TRƯỜNG THCS TÂN LOAN"}</p>
          <div className="w-24 h-[1px] bg-black mx-auto mt-1.5"></div>
          <p className="text-[12px] font-normal normal-case italic mt-1">Đề chính thức</p>
        </div>
        <div className="text-center font-bold uppercase w-[58%]">
          <p className="text-[14px]">{title}</p>
          <p>NĂM HỌC {schoolYear || "2026 - 2027"}</p>
          <p className="normal-case font-normal italic text-[13px]">(Thời gian làm bài: {time} - Không kể thời gian giao đề)</p>
          <p className="text-[13px] font-bold text-blue-900 mt-0.5">Mã đề thi: {examCode}</p>
          <div className="w-24 h-[1px] bg-black mx-auto mt-1.5"></div>
        </div>
      </div>

      {/* Candidate info box */}
      <div className="text-[13px] border border-dashed border-gray-400 p-2.5 rounded flex justify-between items-center bg-slate-50/50">
        <div>
          Họ và tên thí sinh: ............................................................................
        </div>
        <div>
          Số báo danh / Lớp: .........................
        </div>
        <div className="font-bold border border-slate-700 px-2 py-0.5 rounded bg-white text-blue-900">
          Mã đề: {examCode}
        </div>
      </div>

      <div className="text-center font-bold text-[14px] uppercase tracking-wider text-black">
        ĐỀ BÀI
      </div>

      <div className="text-[14px] leading-relaxed text-justify space-y-6">
        {/* SECTION A: TRẮC NGHIỆM KHÁCH QUAN */}
        <div className="font-bold text-[15px] mb-2 text-black uppercase border-b border-black/20 pb-1">
          A. TRẮC NGHIỆM KHÁCH QUAN (7,0 điểm)
        </div>

        {/* PART 1 */}
        <div>
          <div className="font-bold text-[14px] mb-1 text-black flex items-center justify-between">
            <span>Phần 1. Trắc nghiệm nhiều lựa chọn (3,0 điểm)</span>
            <span className="font-normal text-[12px] italic text-gray-700">{mcq.length} câu • 0,25 đ/câu</span>
          </div>
          <p className="italic mb-3 text-[13px] text-gray-800">
            Thí sinh trả lời từ câu 1 đến câu {mcq.length || 12}. Mỗi câu hỏi chỉ chọn một phương án trả lời đúng nhất.
          </p>

          <div className="space-y-4">
            {mcq.map((q) => {
              const hasFigure = !!(q.figureSvg || q.figureTikz || q.figurePython || q.imageUrl);
              const layout = getOptionLayout(q.options);
              return (
                <div key={q.id} className="group relative p-2 -m-1.5 rounded-lg hover:bg-blue-50/40 transition-colors border border-transparent hover:border-blue-100">
                  <div className="flex items-start justify-between">
                    <p className="leading-relaxed flex-1">
                      <span className="font-bold text-blue-600">Câu {q.id}. </span>
                      <span className="font-bold text-black">{q.question}</span>
                    </p>
                    {onOpenQuestionEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenQuestionEditor(q.id, "mcq", q)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-blue-700 hover:text-blue-900 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                        title={`Soạn lại câu ${q.id}`}
                      >
                        <Edit3 className="w-3 h-3" />
                        Soạn lại
                      </button>
                    )}
                  </div>

                  {/* 2-column layout if figure is present */}
                  {hasFigure ? (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-7">
                        <div
                          className={`pl-2 ${
                            layout === "1-row"
                              ? "grid grid-cols-2 gap-2"
                              : layout === "2-row"
                              ? "grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5"
                              : "grid grid-cols-1 gap-y-1.5"
                          }`}
                        >
                          {q.options?.map((opt, optIdx) => (
                            <div key={optIdx} className="text-[13.5px]">
                              {renderOptionContent(opt)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        {q.imageUrl ? (
                          <div className="flex justify-center w-full">
                            <img src={q.imageUrl} alt={`Hình ảnh câu ${q.id}`} className="max-w-full max-h-[160px] object-contain rounded" />
                          </div>
                        ) : (
                          <MathFigureDisplay
                            svg={q.figureSvg}
                            tikz={q.figureTikz}
                            python={q.figurePython}
                            description={q.figureDescription}
                            questionId={q.id}
                            compact={true}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={`pl-4 mt-1 ${
                          layout === "1-row"
                            ? "grid grid-cols-2 sm:grid-cols-4 gap-2"
                            : layout === "2-row"
                            ? "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"
                            : "grid grid-cols-1 gap-y-1"
                        }`}
                      >
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="text-[13.5px]">
                            {renderOptionContent(opt)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 2 */}
        <div>
          <div className="font-bold text-[14px] mb-1 text-black flex items-center justify-between">
            <span>Phần 2. Trắc nghiệm đúng - sai ({hasShortAnswer ? "2,0 điểm" : "4,0 điểm"})</span>
            <span className="font-normal text-[12px] italic text-gray-700">{tf.length} câu • 1,0 đ/câu</span>
          </div>
          <p className="italic mb-3 text-[13px] text-gray-800">
            Thí sinh trả lời từ câu {tf[0]?.id || 13} đến câu {tf[tf.length - 1]?.id || (hasShortAnswer ? 14 : 16)}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
          </p>

          <div className="space-y-4">
            {tf.map((q) => (
              <div key={q.id} className="group relative p-1.5 -m-1.5 rounded-lg hover:bg-blue-50/30 transition-colors space-y-1.5">
                <div className="flex items-start justify-between">
                  <p className="text-[14px] leading-relaxed flex-1">
                    <span className="font-bold text-blue-600">Câu {q.id}. </span>
                    <span className="font-bold text-black">{q.question}</span>
                  </p>
                  {onOpenQuestionEditor && (
                    <button
                      type="button"
                      onClick={() => onOpenQuestionEditor(q.id, "tf", q)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-blue-700 hover:text-blue-900 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                      title={`Soạn lại câu ${q.id}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      Soạn lại
                    </button>
                  )}
                </div>
                {q.imageUrl ? (
                  <div className="mt-2 mb-2 flex justify-center w-full">
                    <img src={q.imageUrl} alt={`Hình ảnh câu ${q.id}`} className="max-w-full max-h-[160px] object-contain rounded" />
                  </div>
                ) : (q.figureSvg || q.figureTikz || q.figurePython) ? (
                  <div className="mt-2 mb-2 max-w-sm mx-auto">
                    <MathFigureDisplay
                      svg={q.figureSvg}
                      tikz={q.figureTikz}
                      python={q.figurePython}
                      description={q.figureDescription}
                      questionId={q.id}
                      compact={true}
                    />
                  </div>
                ) : null}
                <div className="border border-black overflow-hidden bg-white">
                  <table className="w-full border-collapse text-[12px]">
                    <thead>
                      <tr className="bg-gray-100 font-bold uppercase text-center border-b border-black">
                        <th className="p-1.5 w-10 border-r border-black">Ý</th>
                        <th className="p-1.5 border-r border-black text-center">Phát biểu / Nhận định</th>
                        <th className="p-1.5 w-14 border-r border-black">Đúng</th>
                        <th className="p-1.5 w-14">Sai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {q.statements?.map((st, sIdx) => (
                        <tr key={sIdx} className="border-b border-black/40 last:border-b-0 hover:bg-gray-50">
                          <td className="p-1.5 text-center font-bold text-blue-600 border-r border-black">
                            {st.id})
                          </td>
                          <td className="p-1.5 border-r border-black text-justify text-black">
                            {st.text}
                          </td>
                          <td className="p-1.5 text-center border-r border-black"></td>
                          <td className="p-1.5 text-center"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 3: SHORT ANSWER (if exists - MÔN TOÁN) */}
        {hasShortAnswer && (
          <div>
            <div className="font-bold text-[14px] mb-1 text-black flex items-center justify-between">
              <span>Phần 3. Trắc nghiệm trả lời ngắn (2,0 điểm)</span>
              <span className="font-normal text-[12px] italic text-gray-700">{shortAnswer.length} câu • 0,5 đ/câu</span>
            </div>
            <p className="italic mb-3 text-[13px] text-gray-800">
              Thí sinh trả lời từ câu {shortAnswer[0]?.id || 15} đến câu {shortAnswer[shortAnswer.length - 1]?.id || 18}. Ghi kết quả hoặc đáp số vào phần trả lời tương ứng.
            </p>

            <div className="space-y-4">
              {shortAnswer.map((q) => (
                <div key={q.id} className="group relative p-1.5 -m-1.5 rounded-lg hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="leading-relaxed flex-1 text-[14px] text-black">
                      <span className="font-bold text-blue-600">Câu {q.id}. </span>
                      <span className="font-bold text-black">{q.question}</span>
                      <div className="mt-2.5 text-[14px] text-black pl-4 space-y-1.5">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="font-bold text-black shrink-0">Kết quả:</span>
                          <span className="border-b-2 border-dotted border-gray-700 flex-1 inline-block"></span>
                          {q.unit && <span className="font-bold text-black shrink-0">({q.unit})</span>}
                        </div>
                        <div className="flex items-center">
                          <span className="border-b-2 border-dotted border-gray-700 w-full inline-block"></span>
                        </div>
                      </div>
                    </div>
                    {onOpenQuestionEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenQuestionEditor(q.id, "shortAnswer", q)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-blue-700 hover:text-blue-900 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                        title={`Soạn lại câu ${q.id}`}
                      >
                        <Edit3 className="w-3 h-3" />
                        Soạn lại
                      </button>
                    )}
                  </div>
                  {q.imageUrl ? (
                    <div className="mt-2 mb-2 flex justify-center w-full">
                      <img src={q.imageUrl} alt={`Hình ảnh câu ${q.id}`} className="max-w-full max-h-[160px] object-contain rounded" />
                    </div>
                  ) : (q.figureSvg || q.figureTikz || q.figurePython) ? (
                    <div className="mt-2 mb-2 max-w-sm mx-auto">
                      <MathFigureDisplay
                        svg={q.figureSvg}
                        tikz={q.figureTikz}
                        python={q.figurePython}
                        description={q.figureDescription}
                        questionId={q.id}
                        compact={true}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION B: APPLIED / TỰ LUẬN */}
        <div>
          <div className="font-bold text-[15px] mb-2 text-black uppercase border-b border-black/20 pb-1 mt-2">
            <span>
              {examFormat?.toUpperCase() === "THỰC HÀNH"
                ? "B. THỰC HÀNH TRÊN MÁY TÍNH (3,0 điểm)"
                : "B. TỰ LUẬN (3,0 điểm)"}
            </span>
          </div>
          <div className="font-normal text-[12px] italic text-gray-700 mb-1 flex items-center justify-between">
            <span>{applied.length} câu • 1,0 đ/câu</span>
          </div>
          <p className="italic mb-3 text-[13px] text-gray-800">
            Thí sinh trả lời các câu hỏi từ câu {applied[0]?.id || (hasShortAnswer ? 19 : 17)} đến câu {applied[applied.length - 1]?.id || (hasShortAnswer ? 21 : 19)}:
          </p>

          <div className="space-y-3">
            {applied.map((q) => {
              const parsed = parseAppliedQuestion(q.question);

              return (
                <div key={q.id} className="group relative p-1.5 -m-1.5 rounded-lg hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="leading-relaxed flex-1 text-[14px] text-black">
                      <div>
                        <span className="font-bold text-blue-600">Câu {q.id} </span>
                        <span className="font-bold text-black">(1,0 điểm): </span>
                        <span className={parsed.subLines.length > 0 ? "font-bold text-black" : "font-normal text-black"}>
                          {parsed.firstLine}
                        </span>
                      </div>
                      {parsed.subLines.map((line, idx) => {
                        const matchSub = line.match(/^([a-e][\.\)]|[1-9][\.\)])\s*(.*)$/);
                        return (
                          <div key={idx} className="font-normal text-black mt-1 pl-4">
                            {matchSub ? (
                              <>
                                <span className="font-bold text-black">{matchSub[1]} </span>
                                <span>{matchSub[2]}</span>
                              </>
                            ) : (
                              line
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {onOpenQuestionEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenQuestionEditor(q.id, "applied", q)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-blue-700 hover:text-blue-900 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                        title={`Soạn lại câu ${q.id}`}
                      >
                        <Edit3 className="w-3 h-3" />
                        Soạn lại
                      </button>
                    )}
                  </div>
                  {q.imageUrl ? (
                    <div className="mt-2 mb-2 flex justify-center w-full">
                      <img src={q.imageUrl} alt={`Hình ảnh câu ${q.id}`} className="max-w-full max-h-[160px] object-contain rounded" />
                    </div>
                  ) : (q.figureSvg || q.figureTikz || q.figurePython) ? (
                    <div className="mt-2 mb-2 max-w-sm mx-auto">
                      <MathFigureDisplay
                        svg={q.figureSvg}
                        tikz={q.figureTikz}
                        python={q.figurePython}
                        description={q.figureDescription}
                        questionId={q.id}
                        compact={true}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-[12px] text-gray-600 font-bold italic pt-6">
          ------------------- HẾT -------------------
          <p className="font-normal text-[11px] text-gray-500 mt-1">Cán bộ coi thi không giải thích gì thêm.</p>
        </div>
      </div>
    </div>
  );
}
