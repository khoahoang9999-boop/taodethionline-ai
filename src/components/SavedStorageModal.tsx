import React, { useState, useEffect } from "react";
import {
  FolderArchive,
  FileText,
  BookOpen,
  Trash2,
  FolderOpen,
  Search,
  X,
  Download,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
  Printer
} from "lucide-react";
import { generateDocx } from "../lib/docx-generator";
import { exportStudyGuideToWord } from "../lib/docx-study-guide";

interface SavedStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onLoadExam: (exam: any) => void;
  onLoadStudyGuide: (guide: any) => void;
  defaultTab?: "exams" | "guides";
}

export function SavedStorageModal({
  isOpen,
  onClose,
  currentUser,
  onLoadExam,
  onLoadStudyGuide,
  defaultTab = "exams"
}: SavedStorageModalProps) {
  const [activeTab, setActiveTab] = useState<"exams" | "guides">(defaultTab);
  const [exams, setExams] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStorageData();
    }
  }, [isOpen, activeTab]);

  const fetchStorageData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "exams") {
        const res = await fetch("/api/exams/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userCode: currentUser?.id })
        });
        const data = await res.json();
        if (data.success) {
          setExams(data.exams || []);
        }
      } else {
        const res = await fetch("/api/study-guides/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userCode: currentUser?.id })
        });
        const data = await res.json();
        if (data.success) {
          setGuides(data.guides || []);
        }
      }
    } catch (e) {
      console.error("Fetch storage error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExam = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa hồ sơ đề thi đã lưu này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/exams/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setExams(prev => prev.filter(item => item.id !== id));
        setToastMessage("✓ Đã xóa hồ sơ đề thi khỏi kho lưu trữ.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteGuide = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa đề cương ôn tập đã lưu này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/study-guides/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setGuides(prev => prev.filter(item => item.id !== id));
        setToastMessage("✓ Đã xóa đề cương ôn tập khỏi kho lưu trữ.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportExamDocx = async (exam: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await generateDocx(exam);
    } catch (err: any) {
      alert("Lỗi khi tải file Word: " + (err?.message || ""));
    }
  };

  const handleExportGuideDocx = async (guide: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await exportStudyGuideToWord(guide);
    } catch (err: any) {
      alert("Lỗi khi tải file Word đề cương: " + (err?.message || ""));
    }
  };

  if (!isOpen) return null;

  const filteredExams = exams.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (item.subject || "").toLowerCase().includes(q) ||
      (item.schoolName || "").toLowerCase().includes(q) ||
      (item.period || "").toLowerCase().includes(q) ||
      (item.grade || "").toString().includes(q)
    );
  });

  const filteredGuides = guides.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (item.subject || "").toLowerCase().includes(q) ||
      (item.schoolName || "").toLowerCase().includes(q) ||
      (item.period || "").toLowerCase().includes(q) ||
      (item.grade || "").toString().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
              <FolderArchive className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                Kho Đề Thi & Đề Cương Đã Lưu
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-400/40">
                  Lưu trữ vĩnh viễn
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Lưu giữ trọn bộ Khung Ma trận, Bảng đặc tả, Đề thi hoán vị & Đề cương ôn tập
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("exams")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "exams"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-300/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Hồ Sơ Đề Thi Đã Lưu ({exams.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("guides")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "guides"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-300/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Đề Cương Ôn Tập Đã Lưu ({guides.length})</span>
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm môn, lớp, trường..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shrink-0 animate-in fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="p-0.5 hover:bg-emerald-700 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Đang tải danh sách lưu trữ...</p>
            </div>
          ) : activeTab === "exams" ? (
            filteredExams.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white border border-dashed border-slate-300 rounded-xl p-8 max-w-md mx-auto">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Chưa có hồ sơ đề thi nào được lưu</h4>
                <p className="text-xs text-slate-500">
                  Sau khi khởi tạo Ma trận & Đề thi, hãy bấm nút <strong className="text-blue-700">"Lưu Đề Thi"</strong> để lưu trữ lâu dài.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => {
                      onLoadExam(exam);
                      onClose();
                    }}
                    className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-4 transition-all space-y-3 cursor-pointer group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block uppercase">
                          {exam.subject} {exam.grade} - {exam.period}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {exam.title || `Hồ sơ kiểm tra ${exam.subject} ${exam.grade}`}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteExam(exam.id, e)}
                        disabled={deletingId === exam.id}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Xóa hồ sơ đề này"
                      >
                        {deletingId === exam.id ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{exam.schoolName || "TRƯỜNG THCS"}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mã đề: <b className="text-amber-700">{(exam.examVariants || []).map((v: any) => v.code).join(", ") || exam.code || "101"}</b></span>
                        <span className="text-slate-400">•</span>
                        <span>Thời gian: {exam.time || "45 phút"}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Lưu ngày: {new Date(exam.createdAt || Date.now()).toLocaleDateString("vi-VN")}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                        <FolderOpen className="w-3.5 h-3.5" />
                        Mở đề này
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleExportExamDocx(exam, e)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-md border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Tải Word
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredGuides.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white border border-dashed border-slate-300 rounded-xl p-8 max-w-md mx-auto">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Chưa có đề cương ôn tập nào được lưu</h4>
                <p className="text-xs text-slate-500">
                  Tại mục Đề cương ôn tập, hãy bấm nút <strong className="text-emerald-700">"Lưu Đề Cương"</strong> để lưu giữ vĩnh viễn.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => {
                      onLoadStudyGuide(guide);
                      onClose();
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md rounded-xl p-4 transition-all space-y-3 cursor-pointer group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block uppercase">
                          {guide.subject} {guide.grade} - {guide.period}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {guide.title || `Đề cương ôn tập ${guide.subject} ${guide.grade}`}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteGuide(guide.id, e)}
                        disabled={deletingId === guide.id}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Xóa đề cương này"
                      >
                        {deletingId === guide.id ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{guide.schoolName || "TRƯỜNG THCS"}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bao gồm: <b className="text-emerald-800">{(guide.topics || []).length} chủ đề, {(guide.mcq || []).length} trắc nghiệm</b></span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Lưu ngày: {new Date(guide.createdAt || Date.now()).toLocaleDateString("vi-VN")}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                        <FolderOpen className="w-3.5 h-3.5" />
                        Xem & Mở đề cương
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleExportGuideDocx(guide, e)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Tải Word
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
