import React from "react";
import { 
  Building2, 
  Calendar, 
  BookOpen, 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  X, 
  Upload, 
  Check, 
  ArrowRight, 
  FileText, 
  Layers, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Clock,
  HelpCircle,
  PenTool,
  Image as ImageIcon
} from "lucide-react";
import { ScopeConfigData, getDefaultScopeForPeriod } from "./ScopeConfigModal";

interface ConfigTabProps {
  subject: string;
  setSubject: (val: string) => void;
  departmentName?: string;
  setDepartmentName?: (val: string) => void;
  schoolName: string;
  setSchoolName: (val: string) => void;
  examTime: string;
  setExamTime: (val: string) => void;
  schoolYear: string;
  setSchoolYear: (val: string) => void;
  grade: string;
  setGrade: (val: string) => void;
  period: string;
  setPeriod: (val: string) => void;
  examFormat: string;
  setExamFormat: (val: string) => void;
  scopeConfig: ScopeConfigData;
  setScopeConfig: React.Dispatch<React.SetStateAction<ScopeConfigData>>;
  setShowScopeModal: (show: boolean) => void;
  examCount?: number;
  handleExamCountChange?: (count: number) => void;
  variantCodes?: string[];
  isCustomCodesMode?: boolean;
  setIsCustomCodesMode?: (mode: boolean) => void;
  rawCodesInput?: string;
  handleApplyRawCodesInput?: (input: string) => void;
  handleUpdateSingleCode?: (index: number, newCode: string) => void;
  handleRemoveVariantCode?: (index: number) => void;
  handleAddVariantCode?: () => void;
  referenceFiles: { base64: string; mimeType: string; name: string }[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setShowTextbookModal: (show: boolean) => void;
  isConfigSaved: boolean;
  onSaveConfig: () => void;
  setIsConfigSaved: (saved: boolean) => void;
  currentUser?: any;
  onOpenProfileModal?: () => void;

  // Signature and Approval fields
  examDateLocation?: string;
  setExamDateLocation?: (val: string) => void;
  bghName?: string;
  setBghName?: (val: string) => void;
  teacherHeadName?: string;
  setTeacherHeadName?: (val: string) => void;
  creatorName?: string;
  setCreatorName?: (val: string) => void;
  bghSignature?: string | null;
  setBghSignature?: (val: string | null) => void;
  teacherHeadSignature?: string | null;
  setTeacherHeadSignature?: (val: string | null) => void;
  creatorSignature?: string | null;
  setCreatorSignature?: (val: string | null) => void;
}

export default function ConfigTab({
  subject,
  setSubject,
  departmentName = "XÃ HÀM YÊN",
  setDepartmentName,
  schoolName,
  setSchoolName,
  schoolYear,
  examTime,
  setExamTime,
  setSchoolYear,
  grade,
  setGrade,
  period,
  setPeriod,
  examFormat,
  setExamFormat,
  scopeConfig,
  setScopeConfig,
  setShowScopeModal,
  referenceFiles,
  handleFileUpload,
  handleRemoveFile,
  fileInputRef,
  setShowTextbookModal,
  isConfigSaved,
  onSaveConfig,
  setIsConfigSaved,
  currentUser,
  onOpenProfileModal,
  examDateLocation = "Hàm Yên, ngày 10 tháng 02 năm 2026",
  setExamDateLocation,
  bghName = "Lê Thị Phương Trình",
  setBghName,
  teacherHeadName = "Hoàng Hương Giang",
  setTeacherHeadName,
  creatorName = "Hoàng Văn Đình Khoa",
  setCreatorName,
  bghSignature = null,
  setBghSignature,
  teacherHeadSignature = null,
  setTeacherHeadSignature,
  creatorSignature = null,
  setCreatorSignature,
}: ConfigTabProps) {
  const isCuoiKy = period && period.includes("Cuối");

  const markDirty = () => {
    setIsConfigSaved(false);
  };

  const handleSignatureUpload = (role: 'bgh' | 'teacherHead' | 'creator', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      if (role === 'bgh' && setBghSignature) setBghSignature(base64);
      if (role === 'teacherHead' && setTeacherHeadSignature) setTeacherHeadSignature(base64);
      if (role === 'creator' && setCreatorSignature) setCreatorSignature(base64);
      markDirty();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-h-full flex flex-col">
      {/* KHỐI CỐ ĐỊNH (STICKY TOP): GỐC THAM CHIẾU, TẢI PPCT & LƯU CHUYỂN SANG TẠO ĐỀ */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white border-b border-indigo-700/80 shadow-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-2.5">
          {/* Header badges & text */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>GỐC THAM CHIẾU & ĐIỀU HƯỚNG</span>
              </div>
              {isConfigSaved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold shadow-xs">
                  <Check className="w-3 h-3" />
                  Đã lưu cấu hình
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold shadow-xs">
                  <Clock className="w-3 h-3 animate-pulse" />
                  Chưa lưu cấu hình
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-200 max-w-lg mx-auto">
              Tải tệp PPCT của nhà trường để AI tự động trích xuất bài học và lưu lại cấu hình
            </p>
          </div>

          {/* 2 Nút hành động chính */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg">
            {/* Nút 1: Chọn tệp PPCT */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border border-blue-400/40"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>{referenceFiles.length > 0 ? "Tải thêm tệp PPCT" : "Chọn tệp PPCT (.xlsx, .docx, .pdf)"}</span>
            </button>

            {/* Nút 2: Lưu & Chuyển sang Tạo đề */}
            <button
              type="button"
              onClick={onSaveConfig}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer border border-emerald-400/40"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Sang Tạo đề</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.doc,.pdf,.txt,.csv,.xlsx,.xls"
              className="hidden"
            />
          </div>

          {/* Danh sách tệp đính kèm nếu có */}
          {referenceFiles.length > 0 && (
            <div className="w-full pt-2 border-t border-indigo-800/60 text-left">
              <div className="text-[11px] font-semibold text-indigo-300 mb-1 flex items-center gap-1.5 justify-center">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Các tệp PPCT đã tải lên ({referenceFiles.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto">
                {referenceFiles.map((file, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200">
                    <span className="truncate max-w-xs" title={file.name}>📄 {file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveFile(idx);
                        markDirty();
                      }}
                      className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer transition-colors"
                      title="Xóa tệp"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NỘI DUNG CUỘN BÊN DƯỚI (CUỘN ĐẾN CHÂN MÉP KHỐI CỐ ĐỊNH LÀ ẨN ĐI) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 max-w-[1600px] mx-auto">
        {/* MỤC 1: THÔNG TIN ĐƠN VỊ, NĂM HỌC & KÝ DUYỆT ĐỀ (MỞ RỘNG TOÀN BỘ CHIỀU RỘNG) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-[13px] font-extrabold text-red-600 uppercase tracking-wide truncate">
                1. Thông tin Đơn vị, Năm học & Ký duyệt đề
              </h3>
              <p className="text-[11px] font-medium text-blue-600 truncate">
                Tiêu đề và chữ ký xuất hiện trên Ma trận, Bảng đặc tả, Đề thi và Hướng dẫn chấm
              </p>
            </div>
          </div>

          {/* HÀNG 1: THÔNG TIN CƠ BẢN (5 CỘT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_130px_110px_1.4fr] gap-3">
            {/* Đơn vị quản lý */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 flex items-center gap-1 truncate">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>XÃ / SỞ GD&ĐT <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => {
                  if (setDepartmentName) setDepartmentName(e.target.value);
                  markDirty();
                }}
                placeholder="VD: XÃ HÀM YÊN"
                className="w-full text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Tên trường THCS */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Tên trường THCS <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(e.target.value);
                  markDirty();
                }}
                placeholder="VD: THCS TÂN LOAN"
                className="w-full text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Năm học */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 flex items-center gap-1 truncate">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Năm học <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => {
                  setSchoolYear(e.target.value);
                  markDirty();
                }}
                placeholder="2026 - 2027"
                className="w-full text-xs font-bold text-center border border-slate-300 rounded-lg px-2 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Thời gian */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Thời gian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={examTime}
                onChange={(e) => {
                  setExamTime(e.target.value);
                  markDirty();
                }}
                placeholder="45 phút"
                className="w-full text-xs font-bold text-center border border-slate-300 rounded-lg px-2 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Địa điểm & Ngày ký */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Địa điểm & Ngày ký duyệt
              </label>
              <input
                type="text"
                value={examDateLocation}
                onChange={(e) => {
                  if (setExamDateLocation) setExamDateLocation(e.target.value);
                  markDirty();
                }}
                placeholder="Hàm Yên, ngày 10 tháng 02 năm 2026"
                className="w-full text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* HÀNG 2: THÔNG TIN KÝ DUYỆT (3 CHỨC DANH) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-blue-600" />
                <span>Chức danh & Chữ ký duyệt bài kiểm tra (3 người)</span>
              </span>
              <span className="text-[11px] text-slate-500 italic">
                * Nhập họ tên. Nếu để trống tên, chức danh đó sẽ tự ẩn nút tải chữ ký & không hiển thị ở phần ký duyệt.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Duyệt của BGH */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 space-y-2.5 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <label className="text-[11.5px] font-bold text-slate-900 truncate">
                    1. Duyệt của BGH
                  </label>
                  {Boolean(bghName?.trim()) && (
                    bghSignature ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold border border-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Đã có chữ ký</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold border border-rose-300 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Chưa có chữ ký</span>
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bghName || ""}
                    onChange={(e) => {
                      if (setBghName) setBghName(e.target.value);
                      markDirty();
                    }}
                    placeholder="VD: Lê Thị Phương Trình"
                    className="flex-1 min-w-0 text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />

                  {Boolean(bghName?.trim()) && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {bghSignature ? (
                        <div className="flex items-center gap-1">
                          <div className="h-8 w-10 border border-slate-300 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={bghSignature} alt="Chữ ký BGH" className="max-h-full max-w-full object-contain" />
                          </div>
                          <label className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer transition-all" title="Tải lại chữ ký">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload('bgh', e)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (setBghSignature) setBghSignature(null);
                              markDirty();
                            }}
                            title="Xóa chữ ký"
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg cursor-pointer transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1 px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>Tải chữ ký</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload('bgh', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Duyệt tổ CM */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 space-y-2.5 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <label className="text-[11.5px] font-bold text-slate-900 truncate">
                    2. Duyệt tổ CM
                  </label>
                  {Boolean(teacherHeadName?.trim()) && (
                    teacherHeadSignature ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold border border-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Đã có chữ ký</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold border border-rose-300 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Chưa có chữ ký</span>
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={teacherHeadName || ""}
                    onChange={(e) => {
                      if (setTeacherHeadName) setTeacherHeadName(e.target.value);
                      markDirty();
                    }}
                    placeholder="VD: Hoàng Hương Giang"
                    className="flex-1 min-w-0 text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />

                  {Boolean(teacherHeadName?.trim()) && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {teacherHeadSignature ? (
                        <div className="flex items-center gap-1">
                          <div className="h-8 w-10 border border-slate-300 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={teacherHeadSignature} alt="Chữ ký Tổ chuyên môn" className="max-h-full max-w-full object-contain" />
                          </div>
                          <label className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer transition-all" title="Tải lại chữ ký">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload('teacherHead', e)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (setTeacherHeadSignature) setTeacherHeadSignature(null);
                              markDirty();
                            }}
                            title="Xóa chữ ký"
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg cursor-pointer transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1 px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>Tải chữ ký</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload('teacherHead', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Người ra đề */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 space-y-2.5 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <label className="text-[11.5px] font-bold text-slate-900 truncate">
                    3. Người ra đề
                  </label>
                  {Boolean(creatorName?.trim()) && (
                    creatorSignature ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold border border-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Đã có chữ ký</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold border border-rose-300 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Chưa có chữ ký</span>
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={creatorName || ""}
                    onChange={(e) => {
                      if (setCreatorName) setCreatorName(e.target.value);
                      markDirty();
                    }}
                    placeholder="VD: Hoàng Văn Đình Khoa"
                    className="flex-1 min-w-0 text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />

                  {Boolean(creatorName?.trim()) && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {creatorSignature ? (
                        <div className="flex items-center gap-1">
                          <div className="h-8 w-10 border border-slate-300 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={creatorSignature} alt="Chữ ký Người ra đề" className="max-h-full max-w-full object-contain" />
                          </div>
                          <label className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer transition-all" title="Tải lại chữ ký">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload('creator', e)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (setCreatorSignature) setCreatorSignature(null);
                              markDirty();
                            }}
                            title="Xóa chữ ký"
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg cursor-pointer transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1 px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>Tải chữ ký</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload('creator', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MỤC 2: KHỐI LỚP & THỜI ĐIỂM KIỂM TRA (1 HÀNG TOÀN BỘ CHIỀU RỘNG) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-[13px] font-extrabold text-red-600 uppercase tracking-wide truncate">
                2. Khối lớp & Thời điểm kiểm tra
              </h3>
              <p className="text-[11px] font-medium text-blue-600 truncate">
                Thiết lập môn học, khối lớp, thời điểm và hình thức
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Môn học */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Môn học <span className="text-rose-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  const newSubject = e.target.value;
                  setSubject(newSubject);
                  setScopeConfig(getDefaultScopeForPeriod(newSubject, grade, period));
                  markDirty();
                }}
                className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="Tin học">Tin học</option>
                <option value="Toán học">Toán học</option>
              </select>
            </div>

            {/* 2. Lớp */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Khối lớp <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => {
                  const newGrade = e.target.value;
                  setGrade(newGrade);
                  if (scopeConfig?.mode === "default") {
                    setScopeConfig(getDefaultScopeForPeriod(subject, newGrade, period));
                  }
                  markDirty();
                }}
                className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer text-center"
              >
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
              </select>
            </div>

            {/* 3. Thời điểm kiểm tra */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Thời điểm kiểm tra <span className="text-rose-500">*</span>
              </label>
              <select
                value={period}
                onChange={(e) => {
                  const newPeriod = e.target.value;
                  setPeriod(newPeriod);
                  if (scopeConfig?.mode === "default") {
                    setScopeConfig(getDefaultScopeForPeriod(subject, grade, newPeriod));
                  }
                  markDirty();
                }}
                className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer truncate"
              >
                <option value="Giữa học kỳ I">Giữa học kỳ I</option>
                <option value="Cuối học kỳ I">Cuối học kỳ I</option>
                <option value="Giữa học kỳ II">Giữa học kỳ II</option>
                <option value="Cuối học kỳ II">Cuối học kỳ II</option>
              </select>
            </div>

            {/* 4. Hình thức Vận dụng */}
            <div>
              <label className="block text-[11.5px] font-bold text-slate-900 mb-1 truncate">
                Hình thức Vận dụng <span className="text-rose-500">*</span>
              </label>
              <select
                value={examFormat}
                onChange={(e) => {
                  setExamFormat(e.target.value);
                  markDirty();
                }}
                className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer truncate"
              >
                <option value="Tự luận">Tự luận (Bài tập)</option>
                <option value="Thực hành">Thực hành máy</option>
              </select>
            </div>
          </div>
        </div>

        {/* PHẦN 3: TÀI LIỆU THAM CHIẾU & KẾ HOẠCH DẠY HỌC */}
        <div className={`rounded-xl p-4 border shadow-xs space-y-3.5 transition-all ${
          scopeConfig.mode === "custom" 
            ? "bg-amber-50/40 border-amber-300" 
            : "bg-white border-slate-200"
        }`}>
          {/* Header Card 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                scopeConfig.mode === "custom" ? "bg-amber-100 text-amber-700" : "bg-red-50 text-red-600"
              }`}>
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-[13px] font-extrabold text-red-600 uppercase tracking-wide">
                  3. Tài liệu tham chiếu, SGK & Phạm vi bài dạy kiểm tra
                </h3>
                <p className="text-[11px] font-medium text-blue-600">
                  Tra cứu dữ liệu SGK KNTT, tinh chỉnh bài học và số tiết thực tế theo phân phối chương trình
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Nút tra cứu 4 SGK */}
              <button
                type="button"
                onClick={() => setShowTextbookModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Tra cứu 4 bộ SGK KNTT</span>
              </button>

              {scopeConfig.savedPpctName ? (
                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>Đã lưu: {scopeConfig.savedPpctName}</span>
                </span>
              ) : (
                <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                  scopeConfig.mode === "custom" 
                    ? "bg-amber-200 text-amber-900 border border-amber-300" 
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {scopeConfig.mode === "custom" ? "PPCT Tùy chỉnh (Thủ công)" : "Chuẩn GDPT 2018"}
                </span>
              )}
            </div>
          </div>

          {/* Bảng danh sách bài dạy & số tiết */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-3 text-xs">
            {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length === 0 &&
             (scopeConfig?.secondHalfLessons || []).filter(l => l.selected).length === 0 &&
             !scopeConfig?.quickNoteText ? (
              <div className="py-4 px-3.5 bg-amber-50/90 border border-amber-200 rounded-lg text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Chưa có dữ liệu Sách giáo khoa hoặc PPCT cho môn {subject} {grade}</span>
                </div>
                <p className="text-[11.5px] text-slate-600 max-w-md mx-auto leading-relaxed">
                  Hệ thống hiện tại tích hợp sẵn dữ liệu SGK chuẩn cho môn <strong>Tin học và Toán học (lớp 6-9)</strong>. Với môn <strong>{subject}</strong>, thầy/cô vui lòng:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-indigo-800 border border-indigo-200 rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3 h-3 text-indigo-600" />
                    <span>Tải tệp PPCT (.docx, .pdf)</span>
                  </button>
                  <span className="text-[11px] text-slate-400">hoặc</span>
                  <button
                    type="button"
                    onClick={() => setShowScopeModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Nhập nhanh bài học</span>
                  </button>
                </div>
              </div>
            ) : isCuoiKy ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Cột Nửa đầu học kỳ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                      1. Nửa đầu học kỳ (Mức 30% - 3,0 điểm):
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                      {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length} bài
                    </span>
                  </div>
                  {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length === 0 ? (
                    <p className="text-slate-500 italic text-[11px] pl-2 border-l-2 border-slate-300">
                      Chưa chọn bài nửa đầu kỳ
                    </p>
                  ) : (
                    <div className="border border-blue-200 rounded-md overflow-hidden bg-white max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead className="bg-blue-50/70 border-b border-blue-100 sticky top-0">
                          <tr>
                            <th className="py-1.5 px-2 font-semibold text-blue-800 text-center w-10 border-r border-blue-100/50">STT</th>
                            <th className="py-1.5 px-2 font-semibold text-blue-800">Tên bài học</th>
                            <th className="py-1.5 px-2 font-semibold text-blue-800 text-center w-14 border-l border-blue-100/50">Số tiết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).map((l, idx) => (
                            <tr key={l.id} className="hover:bg-blue-50/40">
                              <td className="py-1 px-2 text-center text-slate-500 border-r border-blue-50">{idx + 1}</td>
                              <td className="py-1 px-2 text-slate-800 font-medium">{l.name}</td>
                              <td className="py-1 px-2 text-center text-slate-700 font-semibold border-l border-blue-50">{l.periods || 2}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Cột Nửa sau học kỳ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                      2. Nửa sau học kỳ (Mức 70% - 7,0 điểm):
                    </span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold">
                      {(scopeConfig?.secondHalfLessons || []).filter(l => l.selected).length} bài
                    </span>
                  </div>
                  {(scopeConfig?.secondHalfLessons || []).filter(l => l.selected).length === 0 ? (
                    <p className="text-slate-500 italic text-[11px] pl-2 border-l-2 border-slate-300">
                      Chưa chọn bài nửa sau kỳ
                    </p>
                  ) : (
                    <div className="border border-indigo-200 rounded-md overflow-hidden bg-white max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead className="bg-indigo-50/70 border-b border-indigo-100 sticky top-0">
                          <tr>
                            <th className="py-1.5 px-2 font-semibold text-indigo-800 text-center w-10 border-r border-indigo-100/50">STT</th>
                            <th className="py-1.5 px-2 font-semibold text-indigo-800">Tên bài học</th>
                            <th className="py-1.5 px-2 font-semibold text-indigo-800 text-center w-14 border-l border-indigo-100/50">Số tiết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50">
                          {(scopeConfig?.secondHalfLessons || []).filter(l => l.selected).map((l, idx) => (
                            <tr key={l.id} className="hover:bg-indigo-50/40">
                              <td className="py-1 px-2 text-center text-slate-500 border-r border-indigo-50">{idx + 1}</td>
                              <td className="py-1 px-2 text-slate-800 font-medium">{l.name}</td>
                              <td className="py-1 px-2 text-center text-slate-700 font-semibold border-l border-indigo-50">{l.periods || 2}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                    Danh sách bài kiểm tra Giữa kỳ (100% - 10,0 điểm):
                  </span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                    {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length} bài được chọn
                  </span>
                </div>
                {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length === 0 ? (
                  <p className="text-slate-500 italic text-[11px] pl-2 border-l-2 border-slate-300">
                    Chưa chọn bài kiểm tra
                  </p>
                ) : (
                  <div className="border border-blue-200 rounded-md overflow-hidden bg-white max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead className="bg-blue-50/70 border-b border-blue-100 sticky top-0">
                        <tr>
                          <th className="py-1.5 px-2 font-semibold text-blue-800 text-center w-12 border-r border-blue-100/50">STT</th>
                          <th className="py-1.5 px-2 font-semibold text-blue-800">Tên bài học</th>
                          <th className="py-1.5 px-2 font-semibold text-blue-800 text-center w-16 border-l border-blue-100/50">Số tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {(scopeConfig?.firstHalfLessons || []).filter(l => l.selected).map((l, idx) => (
                          <tr key={l.id} className="hover:bg-blue-50/40">
                            <td className="py-1 px-2 text-center text-slate-500 border-r border-blue-50">{idx + 1}</td>
                            <td className="py-1 px-2 text-slate-800 font-medium">{l.name}</td>
                            <td className="py-1 px-2 text-center text-slate-700 font-semibold border-l border-blue-50">{l.periods || 2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {scopeConfig?.quickNoteText && (
              <div className="pt-2 border-t border-slate-100 text-amber-900 bg-amber-50/60 p-2 rounded text-[11px]">
                <strong>Ghi chú giáo viên:</strong> "{scopeConfig.quickNoteText}"
              </div>
            )}
          </div>

          {/* Scope Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowScopeModal(true)}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl cursor-pointer transition-all shadow-xs ${
                scopeConfig.mode === "custom"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{scopeConfig.mode === "custom" ? "Tùy chỉnh bài & Số tiết PPCT (Lưu vĩnh viễn)" : "Tạo & Quản lý PPCT thủ công (Tự chọn bài & Lưu vĩnh viễn)"}</span>
            </button>

            {scopeConfig.mode === "custom" && (
              <button
                type="button"
                onClick={() => {
                  setScopeConfig(getDefaultScopeForPeriod(subject, grade, period));
                  markDirty();
                }}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                title="Khôi phục phân phối chương trình mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
