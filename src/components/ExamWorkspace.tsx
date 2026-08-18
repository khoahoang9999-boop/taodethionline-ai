import React from "react";
import { AppLogo } from "./AppLogo";
import {
  FileText,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  ListOrdered,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Lock,
  ArrowLeft,
  ArrowRight,
  Settings,
  Check,
  Plus,
  X,
  KeyRound
} from "lucide-react";
import MatrixView from "./MatrixView";
import SpecificationView from "./SpecificationView";
import ExamPaperView from "./ExamPaperView";
import AnswerKeyView from "./AnswerKeyView";
import { ScopeConfigData } from "./ScopeConfigModal";

interface ExamWorkspaceProps {
  generationStep?: number;
  subject: string;
  departmentName?: string;
  schoolName: string;
  examTime: string;
  schoolYear: string;
  grade: string;
  period: string;
  examFormat: string;
  scopeConfig: ScopeConfigData;
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
  examCount: number;
  handleExamCountChange: (count: number) => void;
  variantCodes: string[];
  isCustomCodesMode: boolean;
  setIsCustomCodesMode: (mode: boolean) => void;
  rawCodesInput: string;
  handleApplyRawCodesInput: (input: string) => void;
  handleUpdateSingleCode: (index: number, newCode: string) => void;
  handleRemoveVariantCode: (index: number) => void;
  handleAddVariantCode: () => void;
  activeVariantCode: string;
  setActiveVariantCode: (code: string) => void;
  activeTab: "all" | "matrix" | "spec" | "exam" | "answers";
  setActiveTab: (tab: "all" | "matrix" | "spec" | "exam" | "answers") => void;
  testData: any;
  isLoading: boolean;
  loadingMessage?: string;
  isSequentialGenerating: boolean;
  generatingVariantCode: string | null;
  sequentialProgress: { current: number; total: number; code: string } | null;
  error: string;
  setError: (err: string) => void;
  isConfigSaved: boolean;
  onSwitchToConfigTab: () => void;
  onGenerate: () => void;
  onSequentialGenerateAll: () => void;
  onGenerateSingleVariant: (code: string) => void;
  onCancelGeneration?: () => void;
  onUpdateMcqAnswer?: (questionId: number, newAnswer: string) => void;
  onToggleTfStatement?: (questionId: number, statementId: string) => void;
  onOpenQuestionEditor?: (questionId: number, questionType: "mcq" | "tf" | "applied" | "shortAnswer", questionData: any) => void;
  onOpenApiKeyModal?: () => void;
}

export default function ExamWorkspace({
  generationStep = 0,
  subject,
  departmentName = "XÃ HÀM YÊN",
  schoolName,
  examTime,
  schoolYear,
  grade,
  period,
  examFormat,
  scopeConfig,
  examDateLocation,
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
  examCount,
  handleExamCountChange,
  variantCodes,
  isCustomCodesMode,
  setIsCustomCodesMode,
  rawCodesInput,
  handleApplyRawCodesInput,
  handleUpdateSingleCode,
  handleRemoveVariantCode,
  handleAddVariantCode,
  activeVariantCode,
  setActiveVariantCode,
  activeTab,
  setActiveTab,
  testData,
  isLoading,
  loadingMessage,
  isSequentialGenerating,
  generatingVariantCode,
  sequentialProgress,
  error,
  setError,
  isConfigSaved,
  onSwitchToConfigTab,
  onGenerate,
  onSequentialGenerateAll,
  onGenerateSingleVariant,
  onCancelGeneration,
  onUpdateMcqAnswer,
  onToggleTfStatement,
  onOpenQuestionEditor,
  onOpenApiKeyModal,
}: ExamWorkspaceProps) {
  // If config is NOT saved: Lock screen
  if (!isConfigSaved) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-100/90 overflow-y-auto">
        <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Cần lưu cấu hình trước khi tạo đề
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              Tính năng Tạo đề đang tạm khóa
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Để hồ sơ khảo thí (Ma trận, Bảng đặc tả, Đề thi, Đáp án) được tạo chính xác theo đúng Trường học, Khối lớp, Thời điểm kiểm tra và Phạm vi phân phối bài học của bạn, vui lòng hoàn tất và nhấn <strong className="text-emerald-700">"Lưu cấu hình"</strong> tại mục Cấu hình.
            </p>
          </div>

          {/* Summary of current unsaved config */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-1.5 text-slate-700">
            <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Thông tin đang thiết lập:</span>
            </div>
            <p>• Trường: <b>{schoolName || "Chưa nhập"}</b></p>
            <p>• Thời gian: <b>{examTime || "45 phút"}</b></p>
            <p>• Năm học: <b>{schoolYear || "Chưa nhập"}</b></p>
            <p>• Khối lớp & Thời điểm: <b>{subject} {grade} - {period}</b></p>
            <p>• Số lượng mã đề: <b>{variantCodes.length} mã đề ({variantCodes.join(", ")})</b></p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={onSwitchToConfigTab}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Cấu hình để Lưu</span>
            </button>

            <button
              type="button"
              disabled={true}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Nút tạo đề đã bị vô hiệu hóa (Chưa lưu cấu hình)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = testData?.examVariants?.find((v: any) => v.code === activeVariantCode) || testData?.examVariants?.[0] || testData;
  const isCurrentVariantGenerated = Boolean(testData?.examVariants?.some((v: any) => v.code === activeVariantCode && (v.mcq?.length > 0 || v.applied?.length > 0)));

  return (
    <div className="flex flex-1 overflow-hidden flex-col w-full">
      {/* Active Configuration Summary Banner */}
      <div className="bg-slate-900 text-white px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Cấu hình đã lưu
          </span>
          <span className="text-slate-300 font-semibold">{schoolName}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-semibold">{examTime}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">{schoolYear}</span>
          <span className="text-slate-500">•</span>
          <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-400/30">
            {subject} {grade} - {period}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Hình thức: <b>{examFormat}</b></span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium">
            {variantCodes.length} mã đề: <b className="text-amber-300">{variantCodes.join(", ")}</b>
          </span>
          <span className="text-slate-500">•</span>
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${
            scopeConfig.mode === "custom" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" : "bg-slate-800 text-slate-300"
          }`}>
            {scopeConfig.mode === "custom" ? "Phạm vi: Tùy chỉnh GV" : "Phạm vi: Chuẩn GDPT 2018"}
          </span>
        </div>

        <button
          type="button"
          onClick={onSwitchToConfigTab}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-blue-400" />
          <span>Chỉnh sửa cấu hình</span>
        </button>
      </div>

      {/* Workspace Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar when testData exists or while generating */}
        {(testData || isLoading || isSequentialGenerating || generatingVariantCode) && (
          <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto shadow-xs">
            {/* Section 1: Cấu trúc hồ sơ Navigation */}
            <div className="p-4 border-b border-slate-100">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 block">
                1. CẤU TRÚC HỒ SƠ KHẢO THÍ
              </label>
              <ul className="space-y-1 text-xs font-medium">
                <li>
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer ${
                      activeTab === "all"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>📑 Toàn bộ hồ sơ liên tục</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("matrix")}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer ${
                      activeTab === "matrix"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[13px] min-w-0">
                      {testData?.matrix && testData.matrix.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-100" />
                      ) : isLoading && generationStep === 1 ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activeTab === "matrix" ? "text-white" : "text-slate-400"}`} />
                      )}
                      <span className="truncate">
                        {isLoading && generationStep === 1 ? (
                          <span className="text-blue-700 font-bold animate-pulse">1. Đang tạo Khung ma trận...</span>
                        ) : (
                          <span>1. Khung ma trận chuẩn Bộ GD&ĐT</span>
                        )}
                      </span>
                    </span>
                    {testData?.matrix && testData.matrix.length > 0 ? (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-0.5 ${
                        activeTab === "matrix" ? "bg-blue-700 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Xong
                      </span>
                    ) : isLoading && generationStep === 1 ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold shrink-0 animate-pulse">
                        Đang tạo...
                      </span>
                    ) : null}
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("spec")}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer ${
                      activeTab === "spec"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[13px] min-w-0">
                      {testData?.specification && testData.specification.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-100" />
                      ) : isLoading && generationStep === 2 ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <ListOrdered className={`w-4 h-4 shrink-0 ${activeTab === "spec" ? "text-white" : "text-slate-400"}`} />
                      )}
                      <span className="truncate">
                        {isLoading && generationStep === 2 ? (
                          <span className="text-blue-700 font-bold animate-pulse">2. Đang tạo Bảng đặc tả...</span>
                        ) : (
                          <span>2. Bảng đặc tả đề kiểm tra</span>
                        )}
                      </span>
                    </span>
                    {testData?.specification && testData.specification.length > 0 ? (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-0.5 ${
                        activeTab === "spec" ? "bg-blue-700 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Xong
                      </span>
                    ) : isLoading && generationStep === 2 ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold shrink-0 animate-pulse">
                        Đang tạo...
                      </span>
                    ) : null}
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("exam")}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer ${
                      activeTab === "exam"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[13px] min-w-0">
                      {isCurrentVariantGenerated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-100" />
                      ) : (isLoading || generatingVariantCode) && generationStep === 3 ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <FileText className={`w-4 h-4 shrink-0 ${activeTab === "exam" ? "text-white" : "text-slate-400"}`} />
                      )}
                      <span className="truncate">
                        {(isLoading || generatingVariantCode) && generationStep === 3 ? (
                          <span className="text-blue-700 font-bold animate-pulse">3. Đang soạn Đề thi...</span>
                        ) : (
                          <span>3. Đề kiểm tra (Mã {activeVariantCode})</span>
                        )}
                      </span>
                    </span>
                    {isCurrentVariantGenerated ? (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-0.5 ${
                        activeTab === "exam" ? "bg-blue-700 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Xong
                      </span>
                    ) : (isLoading || generatingVariantCode) && generationStep === 3 ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold shrink-0 animate-pulse">
                        Đang tạo...
                      </span>
                    ) : null}
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("answers")}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left cursor-pointer ${
                      activeTab === "answers"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[13px] min-w-0">
                      {isCurrentVariantGenerated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-100" />
                      ) : (isLoading || generatingVariantCode) && generationStep === 4 ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeTab === "answers" ? "text-white" : "text-slate-400"}`} />
                      )}
                      <span className="truncate">
                        {(isLoading || generatingVariantCode) && generationStep === 4 ? (
                          <span className="text-blue-700 font-bold animate-pulse">4. Đang tạo Đáp án...</span>
                        ) : (
                          <span>4. Đáp án & Hướng dẫn chấm</span>
                        )}
                      </span>
                    </span>
                    {isCurrentVariantGenerated ? (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-0.5 ${
                        activeTab === "answers" ? "bg-blue-700 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Xong
                      </span>
                    ) : (isLoading || generatingVariantCode) && generationStep === 4 ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold shrink-0 animate-pulse">
                        Đang tạo...
                      </span>
                    ) : null}
                  </button>
                </li>
              </ul>
            </div>

            {/* Section 2: Multi-Code Status & Sequential Trigger */}
            {variantCodes.length > 1 && (
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Trạng thái các mã đề
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {(testData?.examVariants || []).length}/{variantCodes.length} đã tạo
                  </span>
                </div>

                <div className="space-y-1.5">
                  {variantCodes.map((code) => {
                    const isDone = testData?.examVariants?.some((v: any) => v.code === code);
                    const isGenerating = generatingVariantCode === code;
                    const isActive = activeVariantCode === code;

                    return (
                      <div
                        key={code}
                        onClick={() => setActiveVariantCode(code)}
                        className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-all ${
                          isActive
                            ? "border-blue-500 bg-blue-50/60 shadow-xs"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="font-bold text-slate-800">Mã đề {code}</span>
                        </div>

                        {isGenerating ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Đang tạo...
                          </span>
                        ) : isDone ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onGenerateSingleVariant(code);
                            }}
                            className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 p-1 hover:bg-slate-100 rounded cursor-pointer"
                            title="Tạo lại mã đề này"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Tạo lại
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onGenerateSingleVariant(code);
                            }}
                            disabled={isLoading || isSequentialGenerating || generatingVariantCode !== null}
                            className="text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            ⚡ Tạo ngay
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sequential Generate Button */}
                {(testData?.examVariants?.length || 0) < variantCodes.length && (
                  <>
                  <button
                    onClick={onSequentialGenerateAll}
                    disabled={isSequentialGenerating || generatingVariantCode !== null}
                    className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-md shadow flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isSequentialGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          Đang tạo Mã {sequentialProgress?.code} ({sequentialProgress?.current}/{sequentialProgress?.total})...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{(testData?.examVariants?.length || 0) > 1 ? "Tiếp tục tạo các mã đề còn lại" : "Tự động tạo lần lượt mã đề còn lại"}</span>
                      </>
                    )}
                  </button>
                  {isSequentialGenerating && onCancelGeneration && (
                    <button onClick={onCancelGeneration} className="w-full mt-2 py-1.5 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold rounded-md shadow flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      Dừng tiến trình
                    </button>
                  )}
                  </>
                )}
              </div>
            )}

            {/* Section 3: Ratio bar with clear distinct color differentiation */}
            {(() => {
              const isMathSubject = subject.toLowerCase().trim().includes("toán");
              const matrix = testData?.matrix || [];
              let nbPts = 4.0;
              let thPts = 3.0;
              let vdPts = 3.0;

              if (matrix.length > 0) {
                const totalMcqNb = matrix.reduce((sum: number, r: any) => sum + (Number(r.mcq_nb) || 0), 0);
                const totalMcqTh = matrix.reduce((sum: number, r: any) => sum + (Number(r.mcq_th) || 0), 0);
                const totalMcqVd = matrix.reduce((sum: number, r: any) => sum + (Number(r.mcq_vd) || 0), 0);

                const totalTfNb = matrix.reduce((sum: number, r: any) => sum + (Number(r.tf_nb) || 0), 0);
                const totalTfTh = matrix.reduce((sum: number, r: any) => sum + (Number(r.tf_th) || 0), 0);
                const totalTfVd = matrix.reduce((sum: number, r: any) => sum + (Number(r.tf_vd) || 0), 0);

                const totalSaNb = matrix.reduce((sum: number, r: any) => sum + (Number(r.sa_nb) || 0), 0);
                const totalSaTh = matrix.reduce((sum: number, r: any) => sum + (Number(r.sa_th) || 0), 0);
                const totalSaVd = matrix.reduce((sum: number, r: any) => sum + (Number(r.sa_vd) || 0), 0);

                const totalTlNb = matrix.reduce((sum: number, r: any) => sum + (Number(r.tl_nb) || 0), 0);
                const totalTlTh = matrix.reduce((sum: number, r: any) => sum + (Number(r.tl_th) || 0), 0);
                const totalTlVd = matrix.reduce((sum: number, r: any) => sum + (Number(r.tl_vd) || 0), 0);

                const calcNb = totalMcqNb * 0.25 + totalTfNb * 0.25 + (isMathSubject ? totalSaNb * 0.5 : 0) + totalTlNb * 1.0;
                const calcTh = totalMcqTh * 0.25 + totalTfTh * 0.25 + (isMathSubject ? totalSaTh * 0.5 : 0) + (isMathSubject ? (totalTlTh > 0 ? totalTlTh * 1.0 : 1.0) : totalTlTh * 1.0);
                const calcVd = totalMcqVd * 0.25 + totalTfVd * 0.25 + (isMathSubject ? totalSaVd * 0.5 : 0) + (totalTlVd > 0 ? totalTlVd * 1.0 : (isMathSubject ? 2.0 : 3.0));

                if (calcNb > 0 || calcTh > 0 || calcVd > 0) {
                  nbPts = Number(calcNb.toFixed(1));
                  thPts = Number(calcTh.toFixed(1));
                  vdPts = Number(calcVd.toFixed(1));
                }
              }

              const totalPts = nbPts + thPts + vdPts || 10;
              const nbPct = Math.round((nbPts / totalPts) * 100);
              const thPct = Math.round((thPts / totalPts) * 100);
              const vdPct = 100 - nbPct - thPct;

              return (
                <div className="p-4 border-b border-slate-100 space-y-2.5 bg-slate-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-yellow-500 rounded-xs"></span>
                      <span>Tỷ lệ điểm định dạng</span>
                    </span>
                    <span className="font-extrabold text-[13px] tracking-tight">
                      <span className="text-yellow-600">{nbPct}%</span>
                      <span className="text-slate-400 mx-1">-</span>
                      <span className="text-blue-600">{thPct}%</span>
                      <span className="text-slate-400 mx-1">-</span>
                      <span className="text-red-600">{vdPct}%</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex shadow-inner">
                    <div className="bg-yellow-500 h-full transition-all" style={{ width: `${nbPct}%` }} title={`Nhận biết (Vàng): ${nbPct}% (${nbPts}đ)`} />
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${thPct}%` }} title={`Thông hiểu (Xanh): ${thPct}% (${thPts}đ)`} />
                    <div className="bg-red-600 h-full transition-all" style={{ width: `${vdPct}%` }} title={`Vận dụng (Đỏ): ${vdPct}% (${vdPts}đ)`} />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10.5px] pt-0.5 font-bold">
                    <div className="flex items-center bg-yellow-50 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 truncate" title={`Nhận biết: ${nbPts}đ (${nbPct}%)`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1 shrink-0" />
                      <span className="truncate">NB: {nbPts}đ ({nbPct}%)</span>
                    </div>
                    <div className="flex items-center bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 truncate" title={`Thông hiểu: ${thPts}đ (${thPct}%)`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1 shrink-0" />
                      <span className="truncate">TH: {thPts}đ ({thPct}%)</span>
                    </div>
                    <div className="flex items-center bg-red-50 text-red-800 px-1.5 py-0.5 rounded border border-red-200 truncate" title={`Vận dụng: ${vdPts}đ (${vdPct}%)`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1 shrink-0" />
                      <span className="truncate">VD: {vdPts}đ ({vdPct}%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Section 4: Re-generate Action */}
            <div className="p-4 mt-auto">
              <button
                onClick={onGenerate}
                disabled={isLoading || isSequentialGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white text-xs font-bold rounded-lg shadow transition-all disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-300" />
                <span>Tạo lại bộ hồ sơ từ đầu</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-200/60 p-3 sm:p-5 lg:p-6 flex flex-col items-center">
          {/* Error Banner */}
          {error && (
            <div className="w-full mb-6 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-400 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-rose-200">
                  <AlertCircle className="w-6 h-6 text-rose-600 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                      {error.toLowerCase().includes("cấu hình") ? "Yêu cầu cấu hình" : error.toLowerCase().includes("key") ? "Cảnh báo API Key" : "Thông báo"}
                    </h4>
                    {(error.toLowerCase().includes("key") || error.toLowerCase().includes("api")) && (
                      <span className="bg-rose-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider animate-bounce">
                        API Key
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rose-900 font-semibold leading-relaxed">{error}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                {onOpenApiKeyModal && (
                  <button
                    type="button"
                    onClick={onOpenApiKeyModal}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500"
                  >
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>Mở cửa sổ Nhập API Key</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-100/80 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  title="Đóng thông báo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Ready to Generate State (When no testData yet) */}
          {!testData && !isLoading && (
            <div className="max-w-3xl w-full my-auto text-center space-y-4 bg-white p-6 md:p-8 rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 relative">
              <div className="absolute top-6 left-6 hidden sm:block">
                <AppLogo size={42} />
              </div>

              <div className="space-y-1.5 flex flex-col items-center">
                <span className="inline-block mb-1 text-[11px] font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Cấu hình đã sẵn sàng
                </span>
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900">
                  Khởi tạo Bộ Hồ Sơ Khảo Thí Chuẩn GDPT 2018
                </h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-2xl text-center">
                  Hệ thống AI sẽ tự động phân tích phân phối bài học của <b className="text-blue-900 font-bold">{schoolName}</b> và biên soạn trọn bộ tài liệu khảo thí chuyên nghiệp:
                </p>
              </div>

              {/* Checklist of generated artifacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-2xl mx-auto mt-2">
                <div className="flex items-center gap-2.5 bg-blue-50/50 p-3 rounded-lg border border-blue-200/60 text-xs font-bold text-blue-900 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>1. Khung ma trận chuẩn Bộ GD&ĐT</span>
                </div>
                <div className="flex items-center gap-2.5 bg-blue-50/50 p-3 rounded-lg border border-blue-200/60 text-xs font-bold text-blue-900 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>2. Bảng đặc tả 3 mức độ tư duy</span>
                </div>
                <div className="flex items-center gap-2.5 bg-blue-50/50 p-3 rounded-lg border border-blue-200/60 text-xs font-bold text-blue-900 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>3. Đề kiểm tra hoán vị {variantCodes.length} mã đề</span>
                </div>
                <div className="flex items-center gap-2.5 bg-blue-50/50 p-3 rounded-lg border border-blue-200/60 text-xs font-bold text-blue-900 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>4. Tạo Đáp án & Hướng dẫn chấm chi tiết 10đ</span>
                </div>
              </div>

              {/* CARD THIẾT LẬP SỐ LƯỢNG MÃ ĐỀ THI */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 rounded-xl p-4 text-left max-w-md mx-auto space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2.5 border-b border-indigo-100/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-indigo-950 uppercase tracking-wide">Thiết lập Số lượng Mã đề thi</h4>
                      <p className="text-[11px] font-medium text-indigo-700/80">Mỗi mã đề hoán vị chung ma trận & đặc tả chuẩn</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full shadow-sm">
                    {variantCodes.length} mã đề
                  </span>
                </div>

                {/* Stepper + Preset buttons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden flex-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleExamCountChange(examCount - 1)}
                        disabled={examCount <= 1}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-30 cursor-pointer text-xs transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={examCount}
                        onChange={(e) => handleExamCountChange(parseInt(e.target.value) || 1)}
                        className="w-full text-center text-xs font-bold text-blue-900 py-2 focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleExamCountChange(examCount + 1)}
                        disabled={examCount >= 20}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-30 cursor-pointer text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleExamCountChange(count)}
                          className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            examCount === count
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {count} đề
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Codes Tag Input / Editable Tags */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Danh sách Tên Mã đề:</span>
                      <button
                        type="button"
                        onClick={() => setIsCustomCodesMode(!isCustomCodesMode)}
                        className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        {isCustomCodesMode ? "Xem dạng thẻ" : "Nhập hàng loạt"}
                      </button>
                    </div>

                    {isCustomCodesMode ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={rawCodesInput}
                          onChange={(e) => handleApplyRawCodesInput(e.target.value)}
                          placeholder="VD: 101, 102, 103, 104..."
                          className="w-full text-xs font-semibold text-blue-900 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-[10.5px] text-slate-400">Cách nhau bằng dấu phẩy hoặc khoảng trắng.</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {variantCodes.map((code, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-lg px-2 py-1 shadow-2xs"
                          >
                            <input
                              type="text"
                              value={code}
                              onChange={(e) => handleUpdateSingleCode(idx, e.target.value)}
                              className="w-12 text-center text-xs font-bold text-blue-900 bg-transparent focus:outline-none focus:bg-blue-50 rounded"
                            />
                            {variantCodes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantCode(idx)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                                title={`Xóa mã đề ${code}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddVariantCode}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-2.5 py-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm mã</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-sm font-bold rounded-xl shadow-xl hover:shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>⚡ Khởi tạo Ma trận & Bảng đặc tả</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-md w-full my-auto text-center space-y-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800">
                  {loadingMessage || `Đang biên soạn Hồ sơ Khảo thí ${subject} ${grade}...`}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {loadingMessage ? "Hệ thống đang thực hiện theo quy trình 2 bước để đảm bảo tính ổn định và không bị gián đoạn." : `AI đang tính toán phân phối số tiết, ánh xạ chuẩn đầu ra SGK Kết nối tri thức, lập Khung ma trận chuẩn Bộ GD&ĐT và soạn thảo đề kiểm tra mã ${variantCodes[0]}.`}
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4" />
              </div>
              {onCancelGeneration && (
                <button onClick={onCancelGeneration} className="mt-4 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold rounded-lg transition-colors">
                  Hủy tiến trình
                </button>
              )}
            </div>
          )}

          {/* Document Display Views (When testData exists) - Expanded to full width */}
          {testData && !isLoading && (
            <div className="w-full space-y-6 pb-16">
              {/* Top Toolbar for Active Code Selection */}
              {variantCodes.length > 1 && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Đang hiển thị:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {variantCodes.map((code) => {
                        const isGenerated = testData.examVariants?.some((v: any) => v.code === code);
                        return (
                          <button
                            key={code}
                            onClick={() => setActiveVariantCode(code)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              activeVariantCode === code
                                ? "bg-blue-600 text-white shadow-xs"
                                : isGenerated
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-amber-50 text-amber-800 border border-amber-300"
                            }`}
                          >
                            <span>Mã {code}</span>
                            {isGenerated ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <span className="text-[10px] text-amber-600">(chưa tạo)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {testData.examVariants?.length < variantCodes.length && (
                      <button
                        onClick={onSequentialGenerateAll}
                        disabled={isSequentialGenerating || generatingVariantCode !== null}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{testData.examVariants?.length > 1 ? "Tiếp tục tạo" : "Tạo tự động"} {variantCodes.length - testData.examVariants.length} mã còn lại</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 1. KHUNG MA TRẬN */}
              {(activeTab === "all" || activeTab === "matrix") && (
                <div className="space-y-4 w-full">
                  <div 
                    className="bg-white shadow-xl rounded-sm p-6 md:p-10 border border-slate-200 text-black w-full overflow-x-auto exam-preview-document font-times"
                    style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
                  >
                    <MatrixView
                      subject={subject}
                      matrix={testData.matrix}
                      departmentName={departmentName}
                      schoolName={schoolName}
                      schoolYear={schoolYear}
                      grade={grade}
                      period={period}
                      examFormat={examFormat}
                      time={testData.time || "45 phút"}
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
              )}

              {/* 2. BẢNG ĐẶC TẢ */}
              {(activeTab === "all" || activeTab === "spec") && (
                <div className="space-y-4 w-full">
                  <div 
                    className="bg-white shadow-xl rounded-sm p-6 md:p-10 border border-slate-200 text-black w-full overflow-x-auto exam-preview-document font-times"
                    style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
                  >
                    <SpecificationView
                      subject={subject}
                      specification={testData.specification}
                      departmentName={departmentName}
                      schoolName={schoolName}
                      schoolYear={schoolYear}
                      grade={grade}
                      period={period}
                      examFormat={examFormat}
                      time={testData.time || "45 phút"}
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
              )}

              {/* 3. ĐỀ KIỂM TRA */}
              {(activeTab === "all" || activeTab === "exam") && (
                <div className="space-y-4 w-full">
                  {!isCurrentVariantGenerated ? (
                    <div className="bg-white shadow-xl rounded-xl p-8 border border-amber-200 text-center space-y-4 max-w-lg mx-auto">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Mã đề {activeVariantCode} chưa được khởi tạo
                      </h4>
                      <p className="text-xs text-slate-600">
                        Đề thi mã {activeVariantCode} sẽ được AI tự động hoán vị thứ tự câu hỏi và đổi thứ tự đáp án theo đúng khung Ma trận và Bảng đặc tả.
                      </p>
                      <button
                        type="button"
                        onClick={() => onGenerateSingleVariant(activeVariantCode)}
                        disabled={generatingVariantCode !== null}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 cursor-pointer mx-auto"
                      >
                        {generatingVariantCode === activeVariantCode ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang soạn Mã đề {activeVariantCode}...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>⚡ Tạo ngay Mã đề {activeVariantCode}</span>
                          </>
                        )}
                      </button>
                      {generatingVariantCode === activeVariantCode && onCancelGeneration && (
                        <button onClick={onCancelGeneration} className="mt-4 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-600 text-xs font-bold rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer mx-auto transition-colors">
                          Hủy tiến trình
                        </button>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="bg-white shadow-xl rounded-sm p-6 md:p-10 border border-slate-200 text-black w-full overflow-x-auto exam-preview-document font-times"
                      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
                    >
                      <ExamPaperView
                        title={currentVariant?.title || `ĐỀ KIỂM TRA MÔN ${subject.toUpperCase()} ${grade}`}
                        time={testData.time || "45 phút"}
                        departmentName={departmentName}
                        schoolName={schoolName}
                        schoolYear={schoolYear}
                        examCode={activeVariantCode}
                        mcq={currentVariant?.mcq}
                        tf={currentVariant?.tf}
                        shortAnswer={currentVariant?.shortAnswer}
                        applied={currentVariant?.applied}
                        examFormat={examFormat}
                        onOpenQuestionEditor={onOpenQuestionEditor}
                        examDateLocation={examDateLocation}
                        bghName={bghName}
                        bghSignature={bghSignature}
                        teacherHeadName={teacherHeadName}
                        teacherHeadSignature={teacherHeadSignature}
                        creatorName={creatorName}
                        creatorSignature={creatorSignature}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 4. ĐÁP ÁN & HƯỚNG DẪN CHẤM */}
              {(activeTab === "all" || activeTab === "answers") && (
                <div className="space-y-4 w-full">
                  {isCurrentVariantGenerated && (
                    <div 
                      className="bg-white shadow-xl rounded-sm p-6 md:p-10 border border-slate-200 text-black w-full overflow-x-auto exam-preview-document font-times"
                      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
                    >
                      <AnswerKeyView
                        title={currentVariant?.title || `ĐỀ KIỂM TRA MÔN ${subject.toUpperCase()} ${grade}`}
                        departmentName={departmentName}
                        schoolName={schoolName}
                        schoolYear={schoolYear}
                        grade={grade}
                        period={period}
                        examCode={activeVariantCode}
                        mcq={currentVariant?.mcq}
                        tf={currentVariant?.tf}
                        shortAnswer={currentVariant?.shortAnswer}
                        applied={currentVariant?.applied}
                        examFormat={examFormat}
                        onUpdateMcqAnswer={onUpdateMcqAnswer}
                        onToggleTfStatement={onToggleTfStatement}
                        onOpenQuestionEditor={onOpenQuestionEditor}
                        examDateLocation={examDateLocation}
                        bghName={bghName}
                        bghSignature={bghSignature}
                        teacherHeadName={teacherHeadName}
                        teacherHeadSignature={teacherHeadSignature}
                        creatorName={creatorName}
                        creatorSignature={creatorSignature}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
