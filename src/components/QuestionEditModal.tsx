import React, { useState, useEffect } from "react";
import { formatVietnameseError } from "../lib/error-formatter";
import { X, Sparkles, Edit3, Loader2, Check, AlertCircle, Plus, Trash2, HelpCircle, Image as ImageIcon } from "lucide-react";

interface Breakdown {
  criteria: string;
  points: string;
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
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
}

interface Applied {
  id: number;
  question: string;
  answer: string;
  pointsBreakdown?: Breakdown[];
  imageUrl?: string;
}

interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer: string;
  unit?: string;
  explanation?: string;
  imageUrl?: string;
}

interface QuestionEditModalProps {
  subject?: string;
  isOpen: boolean;
  onClose: () => void;
  variantCode: string;
  questionId: number;
  questionType: "mcq" | "tf" | "applied" | "shortAnswer";
  questionData: any;
  grade: string;
  period: string;
  examFormat?: string;
  referenceFiles?: any[];
  matrix?: any[];
  specification?: any[];
  onSaveQuestion: (updatedQuestion: any) => void;
}

export default function QuestionEditModal({
  subject = "Tin học",
  isOpen,
  onClose,
  variantCode,
  questionId,
  questionType,
  questionData,
// subject,
          grade,
  period,
  examFormat = "Tự luận",
  referenceFiles = [],
  matrix,
  specification,
  onSaveQuestion
}: QuestionEditModalProps) {
  const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreviewData, setAiPreviewData] = useState<any>(null);

  // Manual editing state
  const [manualMcq, setManualMcq] = useState<MCQ>({
    id: questionId,
    question: "",
    options: ["A. ", "B. ", "C. ", "D. "],
    correctAnswer: "A",
    explanation: ""
  });

  const [manualTf, setManualTf] = useState<TFQuestion>({
    id: questionId,
    question: "",
    statements: [
      { id: "a", text: "", isTrue: true },
      { id: "b", text: "", isTrue: false },
      { id: "c", text: "", isTrue: true },
      { id: "d", text: "", isTrue: false }
    ]
  });

  const [manualApplied, setManualApplied] = useState<Applied>({
    id: questionId,
    question: "",
    answer: "",
    pointsBreakdown: [
      { criteria: "Ý 1: Xác định đúng phương pháp / cú pháp", points: "0.5" },
      { criteria: "Ý 2: Trình bày kết quả / giải thuật hoàn chỉnh", points: "0.5" }
    ]
  });

  // Sync initial question data
  useEffect(() => {
    if (!isOpen || !questionData) return;
    setAiError("");
    setAiPreviewData(null);
    setCustomPrompt("");

    if (questionType === "mcq") {
      setManualMcq({
        id: questionData.id || questionId,
        question: questionData.question || "",
        options: questionData.options && questionData.options.length === 4 
          ? [...questionData.options] 
          : ["A. ", "B. ", "C. ", "D. "],
        correctAnswer: questionData.correctAnswer || "A",
        explanation: questionData.explanation || ""
      });
    } else if (questionType === "tf") {
      setManualTf({
        id: questionData.id || questionId,
        question: questionData.question || "",
        statements: questionData.statements && questionData.statements.length > 0
          ? questionData.statements.map((s: any) => ({ ...s }))
          : [
              { id: "a", text: "", isTrue: true },
              { id: "b", text: "", isTrue: false },
              { id: "c", text: "", isTrue: true },
              { id: "d", text: "", isTrue: false }
            ]
      });
    } else if (questionType === "applied") {
      setManualApplied({
        id: questionData.id || questionId,
        question: questionData.question || "",
        answer: questionData.answer || "",
        pointsBreakdown: questionData.pointsBreakdown && questionData.pointsBreakdown.length > 0
          ? questionData.pointsBreakdown.map((p: any) => ({ ...p }))
          : [
              { criteria: "Ý 1: Nêu đúng khái niệm / cú pháp", points: "0.5" },
              { criteria: "Ý 2: Viết đúng kết quả / hoàn thiện bài toán", points: "0.5" }
            ]
      });
    }
  }, [isOpen, questionData, questionId, questionType]);

  if (!isOpen) return null;

  const handleCallAiRegenerate = async () => {
    setIsAiLoading(true);
    setAiError("");
    setAiPreviewData(null);

    try {
      const savedKeys = localStorage.getItem("khaothi_user_api_keys");
      const userApiKeys = savedKeys ? JSON.parse(savedKeys) : undefined;
      const userCode = localStorage.getItem("khaothi_account_code") || undefined;

      const res = await fetch("/api/regenerate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        // subject,
          grade,
          period,
          examFormat,
          questionType,
          questionId,
          currentQuestion: questionData,
          customInstruction: customPrompt.trim(),
          matrix,
          specification,
          referenceFiles,
          userApiKeys,
          userCode
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể soạn lại câu hỏi.");
      }

      const generated = await res.json();
      setAiPreviewData(generated);
    } catch (err: any) {
      setAiError(formatVietnameseError(err));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiPreview = () => {
    if (!aiPreviewData) return;
    onSaveQuestion(aiPreviewData);
    onClose();
  };

  const renderImageUploader = (imageUrl: string | undefined, onUpload: (url: string) => void) => {
    return (
      <div className="mt-2">
        {imageUrl ? (
          <div className="relative inline-block border border-gray-300 rounded p-1 bg-white">
            <img src={imageUrl} alt="Đính kèm" className="max-h-32 object-contain" />
            <button
              type="button"
              onClick={() => onUpload("")}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
              title="Xoá ảnh"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div>
            <label className="cursor-pointer text-xs bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded px-2.5 py-1.5 text-gray-700 font-medium flex items-center gap-1.5 w-max transition-colors">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              Đính kèm hình ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => onUpload(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        )}
      </div>
    );
  };

  const handleSaveManual = () => {
    if (questionType === "mcq") {
      onSaveQuestion(manualMcq);
    } else if (questionType === "tf") {
      onSaveQuestion(manualTf);
    } else {
      onSaveQuestion(manualApplied);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-700/80 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                Mã đề {variantCode}
              </span>
              <h2 className="text-lg font-bold">
                Soạn lại / Chỉnh sửa Câu {questionId}
              </h2>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Loại: {questionType === "mcq" ? "Trắc nghiệm nhiều lựa chọn (4 phương án)" : questionType === "tf" ? "Trắc nghiệm Đúng / Sai" : `Vận dụng (${examFormat})`} • Môn {subject} {grade}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 shrink-0">
          <button
            onClick={() => setActiveMode("ai")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeMode === "ai"
                ? "border-blue-600 text-blue-700 bg-white shadow-sm -mb-[1px]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Yêu cầu AI soạn lại theo ý muốn
          </button>
          <button
            onClick={() => setActiveMode("manual")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeMode === "manual"
                ? "border-blue-600 text-blue-700 bg-white shadow-sm -mb-[1px]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            Tự chỉnh sửa / Dán câu hỏi thay thế
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeMode === "ai" ? (
            /* AI REGENERATION MODE */
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Hướng dẫn soạn lại bằng AI:</p>
                  <p className="text-blue-800 mt-0.5">
                    Thầy/cô có thể nhập yêu cầu cụ thể (ví dụ: <i>"Soạn câu hỏi về hàm COUNTIF trong Excel"</i> hoặc <i>"Thay đổi sang câu hỏi nhận biết về bộ nhớ RAM và ROM"</i>). Hệ thống sẽ tự động bám sát chương trình {subject} {grade} và SGK Kết nối tri thức.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nội dung yêu cầu soạn lại cụ thể (Tùy chọn):
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Soạn lại câu này hỏi về cách tạo liên kết Hyperlink trong văn bản, đáp án đúng là C..."
                  rows={3}
                  className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCallAiRegenerate}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI đang soạn lại câu {questionId}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Soạn lại Câu {questionId} ngay
                    </>
                  )}
                </button>
              </div>

              {aiError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {/* AI Preview */}
              {aiPreviewData && (
                <div className="border-2 border-emerald-500/50 bg-emerald-50/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Kết quả câu hỏi mới do AI soạn:
                    </span>
                    <button
                      onClick={handleApplyAiPreview}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Áp dụng thay thế câu {questionId}
                    </button>
                  </div>

                  {/* MCQ Preview */}
                  {questionType === "mcq" && (
                    <div className="text-sm space-y-2">
                      <p className="font-semibold text-gray-900">
                        <span className="text-blue-900 font-bold">Câu {aiPreviewData.id}: </span>
                        {aiPreviewData.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {aiPreviewData.options?.map((opt: string, idx: number) => {
                          const letter = String.fromCharCode(65 + idx);
                          const isCorrect = aiPreviewData.correctAnswer === letter || opt.startsWith(letter + ".");
                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded border ${
                                isCorrect
                                  ? "bg-emerald-100/70 border-emerald-400 font-semibold text-emerald-900"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              {opt} {isCorrect && "✓ (Đáp án đúng)"}
                            </div>
                          );
                        })}
                      </div>
                      {aiPreviewData.explanation && (
                        <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                          <span className="font-semibold text-gray-800">Giải thích: </span>
                          {aiPreviewData.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* TF Preview */}
                  {questionType === "tf" && (
                    <div className="text-sm space-y-2">
                      <p className="font-semibold text-gray-900">
                        <span className="text-blue-900 font-bold">Câu {aiPreviewData.id}: </span>
                        {aiPreviewData.question}
                      </p>
                      <div className="space-y-1 text-xs">
                        {aiPreviewData.statements?.map((st: any) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between p-2 rounded bg-white border border-gray-200"
                          >
                            <span>
                              <span className="font-bold text-blue-700 mr-1.5">{st.id})</span>
                              {st.text}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                st.isTrue
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-rose-100 text-rose-800 border border-rose-300"
                              }`}
                            >
                              {st.isTrue ? "ĐÚNG" : "SAI"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Applied Preview */}
                  {questionType === "applied" && (
                    <div className="text-sm space-y-2">
                      <p className="font-semibold text-gray-900">
                        <span className="text-blue-900 font-bold">Câu {aiPreviewData.id}: </span>
                        {aiPreviewData.question}
                      </p>
                      <div className="bg-white p-2.5 rounded border border-gray-200 text-xs space-y-1">
                        <span className="font-bold text-blue-900 block">Hướng dẫn giải:</span>
                        <p className="text-gray-700 whitespace-pre-line">{aiPreviewData.answer}</p>
                      </div>
                      {aiPreviewData.pointsBreakdown && (
                        <div className="text-xs space-y-1">
                          <p className="font-semibold text-gray-800">Thang điểm:</p>
                          {aiPreviewData.pointsBreakdown.map((pb: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-gray-600 border-b border-gray-100 py-0.5">
                              <span>{pb.criteria}</span>
                              <span className="font-bold text-blue-900">{pb.points}đ</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* MANUAL EDITING MODE */
            <div className="space-y-4">
              {questionType === "mcq" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nội dung câu hỏi:
                    </label>
                    <textarea
                      value={manualMcq.question}
                      onChange={(e) => setManualMcq({ ...manualMcq, question: e.target.value })}
                      rows={2}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                      placeholder="Nhập nội dung câu dẫn..."
                    />
                    {renderImageUploader(manualMcq.imageUrl, (url) => setManualMcq({ ...manualMcq, imageUrl: url }))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      4 Phương án lựa chọn & Chọn đáp án đúng:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(["A", "B", "C", "D"] as const).map((letter, idx) => {
                        const isSelected = manualMcq.correctAnswer === letter;
                        return (
                          <div
                            key={letter}
                            className={`p-2.5 rounded-lg border flex flex-col gap-1.5 transition-all ${
                              isSelected
                                ? "bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400"
                                : "bg-gray-50/50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-blue-900">Phương án {letter}</span>
                              <button
                                type="button"
                                onClick={() => setManualMcq({ ...manualMcq, correctAnswer: letter })}
                                className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
                                  isSelected
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                              >
                                {isSelected ? "✓ ĐÁP ÁN ĐÚNG" : "Chọn là đúng"}
                              </button>
                            </div>
                            <input
                              type="text"
                              value={manualMcq.options[idx] || ""}
                              onChange={(e) => {
                                const newOpts = [...manualMcq.options];
                                newOpts[idx] = e.target.value;
                                setManualMcq({ ...manualMcq, options: newOpts });
                              }}
                              className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-gray-800"
                              placeholder={`Nội dung ${letter}...`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Giải thích / Lời giải chi tiết:
                    </label>
                    <textarea
                      value={manualMcq.explanation || ""}
                      onChange={(e) => setManualMcq({ ...manualMcq, explanation: e.target.value })}
                      rows={2}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                      placeholder="Giải thích ngắn gọn lý do phương án này đúng..."
                    />
                  </div>
                </div>
              )}

              {questionType === "tf" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nội dung câu hỏi dẫn / tình huống:
                    </label>
                    <textarea
                      value={manualTf.question}
                      onChange={(e) => setManualTf({ ...manualTf, question: e.target.value })}
                      rows={2}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                    />
                    {renderImageUploader(manualTf.imageUrl, (url) => setManualTf({ ...manualTf, imageUrl: url }))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      4 Phát biểu (a, b, c, d) & Chọn Đúng/Sai:
                    </label>
                    <div className="space-y-2.5">
                      {manualTf.statements.map((st, idx) => (
                        <div
                          key={st.id}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 bg-gray-50/50"
                        >
                          <span className="font-bold text-blue-900 text-sm w-6">{st.id})</span>
                          <input
                            type="text"
                            value={st.text}
                            onChange={(e) => {
                              const newSt = [...manualTf.statements];
                              newSt[idx] = { ...st, text: e.target.value };
                              setManualTf({ ...manualTf, statements: newSt });
                            }}
                            className="flex-1 text-xs border border-gray-300 rounded p-1.5 bg-white text-gray-800"
                            placeholder={`Nội dung phát biểu ${st.id}...`}
                          />
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const newSt = [...manualTf.statements];
                                newSt[idx] = { ...st, isTrue: true };
                                setManualTf({ ...manualTf, statements: newSt });
                              }}
                              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                st.isTrue
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              ĐÚNG
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newSt = [...manualTf.statements];
                                newSt[idx] = { ...st, isTrue: false };
                                setManualTf({ ...manualTf, statements: newSt });
                              }}
                              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                !st.isTrue
                                  ? "bg-rose-600 text-white shadow-sm"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              SAI
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {questionType === "applied" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nội dung câu hỏi / Tình huống thực hành:
                    </label>
                    <textarea
                      value={manualApplied.question}
                      onChange={(e) => setManualApplied({ ...manualApplied, question: e.target.value })}
                      rows={2}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                    />
                    {renderImageUploader(manualApplied.imageUrl, (url) => setManualApplied({ ...manualApplied, imageUrl: url }))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Đáp án / Hướng dẫn giải chi tiết:
                    </label>
                    <textarea
                      value={manualApplied.answer}
                      onChange={(e) => setManualApplied({ ...manualApplied, answer: e.target.value })}
                      rows={4}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thang điểm chi tiết (Rubric):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newBreakdown = [
                            ...(manualApplied.pointsBreakdown || []),
                            { criteria: "Ý tiêu chí mới...", points: "0.5" }
                          ];
                          setManualApplied({ ...manualApplied, pointsBreakdown: newBreakdown });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm tiêu chí
                      </button>
                    </div>

                    <div className="space-y-2">
                      {manualApplied.pointsBreakdown?.map((pb, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pb.criteria}
                            onChange={(e) => {
                              const newBreakdown = [...(manualApplied.pointsBreakdown || [])];
                              newBreakdown[idx] = { ...pb, criteria: e.target.value };
                              setManualApplied({ ...manualApplied, pointsBreakdown: newBreakdown });
                            }}
                            className="flex-1 text-xs border border-gray-300 rounded p-1.5 text-gray-800"
                            placeholder="Mô tả tiêu chí..."
                          />
                          <input
                            type="text"
                            value={pb.points}
                            onChange={(e) => {
                              const newBreakdown = [...(manualApplied.pointsBreakdown || [])];
                              newBreakdown[idx] = { ...pb, points: e.target.value };
                              setManualApplied({ ...manualApplied, pointsBreakdown: newBreakdown });
                            }}
                            className="w-20 text-xs border border-gray-300 rounded p-1.5 text-center font-bold text-blue-900"
                            placeholder="0.5"
                          />
                          <span className="text-xs text-gray-500">điểm</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newBreakdown = manualApplied.pointsBreakdown?.filter((_, i) => i !== idx);
                              setManualApplied({ ...manualApplied, pointsBreakdown: newBreakdown });
                            }}
                            className="text-gray-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
          {activeMode === "manual" && (
            <button
              onClick={handleSaveManual}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi vào đề thi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
