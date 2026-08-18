import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Search, 
  Check, 
  RotateCcw, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Loader2, 
  Layers, 
  ListChecks, 
  Copy, 
  HelpCircle,
  School,
  Calendar,
  Clock,
  BookMarked,
  Sliders,
  CheckSquare,
  Square,
  AlertCircle
} from "lucide-react";
import { ALL_TEXTBOOKS, Lesson } from "../data/textbooks";
import { ALL_MATH_TEXTBOOKS } from "../data/math";
import { exportStudyGuideToWord } from "../lib/docx-study-guide";
import { StudyGuideData } from "../lib/docx-generator";

interface StudyGuideTabProps {
  subject: string;
  setSubject: (val: string) => void;
  grade: string;
  setGrade: (val: string) => void;
  period: string;
  setPeriod: (val: string) => void;
  schoolName: string;
  setSchoolName: (val: string) => void;
  departmentName: string;
  setDepartmentName: (val: string) => void;
  schoolYear: string;
  setSchoolYear: (val: string) => void;
  userApiKeys: any[];
  currentUser: any;
  bghName?: string;
  teacherHeadName?: string;
  creatorName?: string;
}

function formatQuestionText(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 mt-0.5">
      {lines.map((line, lIdx) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={lIdx} className="leading-relaxed font-normal text-slate-800 text-xs">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-slate-950">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function StudyGuideTab({
  subject,
  setSubject,
  grade,
  setGrade,
  period,
  setPeriod,
  schoolName,
  setSchoolName,
  departmentName,
  setDepartmentName,
  schoolYear,
  setSchoolYear,
  userApiKeys,
  currentUser,
  bghName,
  teacherHeadName,
  creatorName
}: StudyGuideTabProps) {
  // Question Count Settings
  const isMath = subject.toLowerCase().trim().includes("toán");
  const [mcqCount, setMcqCount] = useState<number>(24);
  const [tfCount, setTfCount] = useState<number>(4);
  const [shortAnswerCount, setShortAnswerCount] = useState<number>(isMath ? 4 : 0);
  const [appliedCount, setAppliedCount] = useState<number>(6);

  // Lesson Repository Selection
  const [selectedLessonIds, setSelectedLessonIds] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [studyGuideData, setStudyGuideData] = useState<StudyGuideData | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Load Textbook Lessons based on Subject & Grade
  const getRepositoryTopics = () => {
    const isMathSub = subject.toLowerCase().trim().includes("toán");
    const tb = isMathSub
      ? (ALL_MATH_TEXTBOOKS[grade] || ALL_MATH_TEXTBOOKS["8"] || { topics: [] })
      : (ALL_TEXTBOOKS[grade] || ALL_TEXTBOOKS["8"] || { topics: [] });

    return tb?.topics || [];
  };

  const topics = getRepositoryTopics();

  // Expand all topics by default on load
  useEffect(() => {
    const topicIds = new Set(topics.map((t: any) => t.id));
    setExpandedTopics(topicIds);

    // Select all lessons by default
    const allIds = new Set<string>();
    topics.forEach((t: any) => {
      (t.lessons || []).forEach((l: Lesson) => allIds.add(l.id));
    });
    setSelectedLessonIds(allIds);
  }, [subject, grade]);

  // Adjust shortAnswerCount default when subject changes
  useEffect(() => {
    const math = subject.toLowerCase().trim().includes("toán");
    setShortAnswerCount(math ? 4 : 0);
  }, [subject]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const toggleLessonSelect = (lessonId: string) => {
    setSelectedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const toggleTopicSelectAll = (topic: any) => {
    const lessonIds = (topic.lessons || []).map((l: Lesson) => l.id);
    const allSelected = lessonIds.every((id: string) => selectedLessonIds.has(id));

    setSelectedLessonIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        lessonIds.forEach((id: string) => next.delete(id));
      } else {
        lessonIds.forEach((id: string) => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set<string>();
    topics.forEach((t: any) => {
      (t.lessons || []).forEach((l: Lesson) => allIds.add(l.id));
    });
    setSelectedLessonIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedLessonIds(new Set());
  };

  // Get selected lesson objects
  const getSelectedLessons = () => {
    const selected: { id: string; name: string; topicName: string; periods: number }[] = [];
    topics.forEach((t: any) => {
      (t.lessons || []).forEach((l: Lesson) => {
        if (selectedLessonIds.has(l.id)) {
          selected.push({
            id: l.id,
            name: l.name,
            topicName: t.name,
            periods: l.periods || 2
          });
        }
      });
    });
    return selected;
  };

  const selectedLessonsList = getSelectedLessons();
  const totalSelectedPeriods = selectedLessonsList.reduce((sum, item) => sum + (item.periods || 0), 0);

  // Trigger Study Guide Generation
  const handleGenerateStudyGuide = async () => {
    if (selectedLessonsList.length === 0) {
      setError("Vui lòng chọn ít nhất 1 bài học hoặc chương trong kho!");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-study-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          grade,
          period,
          schoolName: schoolName.trim() || "TRƯỜNG THCS TÂN LOAN",
          departmentName: departmentName.trim() || "XÃ HÀM YÊN",
          schoolYear: schoolYear.trim() || "2026 - 2027",
          selectedLessons: selectedLessonsList,
          mcqCount,
          tfCount,
          shortAnswerCount,
          appliedCount,
          userApiKeys,
          userCode: currentUser?.id
        })
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (responseText.includes("FUNCTION_INVOCATION_FAILED") || responseText.includes("server error") || responseText.includes("timeout") || responseText.includes("Timeout")) {
          throw new Error("Lỗi phản hồi máy chủ: Thời gian xử lý của AI vượt quá giới hạn phản hồi của hệ thống. Vui lòng thử lại hoặc giảm bớt số lượng bài học/câu hỏi cần tạo để tối ưu hóa tốc độ.");
        }
        throw new Error("Lỗi phản hồi máy chủ: Hệ thống đang bận hoặc gián đoạn kết nối. Vui lòng kiểm tra lại sau giây lát.");
      }

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Không thể khởi tạo Đề cương ôn tập.");
      }

      setStudyGuideData(data);
    } catch (err: any) {
      setError(err?.message || "Lỗi khi khởi tạo Đề cương ôn tập.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to Word
  const handleExportWord = async () => {
    if (!studyGuideData) return;
    try {
      await exportStudyGuideToWord(studyGuideData);
    } catch (err: any) {
      setError("Lỗi khi tải file Word: " + (err?.message || ""));
    }
  };

  // Copy Content to Clipboard
  const handleCopyContent = () => {
    if (!studyGuideData) return;
    let text = `${studyGuideData.title || "ĐỀ CƯƠNG ÔN TẬP"}\nMÔN: ${studyGuideData.subject} ${studyGuideData.grade} - ${studyGuideData.period}\nNĂM HỌC: ${studyGuideData.schoolYear}\n\n`;
    
    text += "PHẦN A. TÓM TẮT KIẾN THỨC TRỌNG TÂM\n";
    (studyGuideData.topics || []).forEach(t => {
      text += `- ${t.topic}${t.lessonName ? `: ${t.lessonName}` : ""}\n`;
      (t.summaryPoints || []).forEach(pt => text += `  + ${pt}\n`);
    });

    text += "\nPHẦN B. HỆ THỐNG CÂU HỎI BÀI TẬP\n";
    (studyGuideData.mcq || []).forEach((q, i) => {
      text += `Câu ${i + 1}. ${q.question}\n${(q.options || []).join("  ")}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0 space-y-6 relative">
      {/* Top Banner - Sticky */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md border-b border-emerald-900/50 relative overflow-hidden">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 py-2.5 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-wider shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Biên soạn Đề cương Ôn tập
            </div>
            <span className="hidden sm:inline text-xs font-bold text-emerald-100/90 whitespace-nowrap">
              Biên soạn độc lập chuẩn mực GDPT 2018
            </span>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleGenerateStudyGuide}
              disabled={isGenerating || selectedLessonsList.length === 0}
              className="py-1.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-400/30 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span className="animate-pulse">Đang tự động khởi tạo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Khởi tạo Đề cương Ôn tập ({selectedLessonsList.length} bài)</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 px-3 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[98%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Configuration & Repository Picker */}
        <div className="lg:col-span-4 space-y-4">
          {/* Section 1: General Info */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                1. Thông tin chung Đề cương
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Môn học</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Tin học">Tin học</option>
                  <option value="Toán học">Toán học</option>
                  <option value="KHTN">Khoa học tự nhiên</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Khối lớp</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Thời điểm kiểm tra</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Giữa Học Kỳ I">Giữa Học Kỳ I</option>
                  <option value="Cuối Học Kỳ I">Cuối Học Kỳ I</option>
                  <option value="Giữa Học Kỳ II">Giữa Học Kỳ II</option>
                  <option value="Cuối Học Kỳ II">Cuối Học Kỳ II</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Năm học</label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  placeholder="2026 - 2027"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Tên trường THCS</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  placeholder="TRƯỜNG THCS TÂN LOAN"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Phòng GD&ĐT</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full text-[11px] font-bold p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  placeholder="XÃ HÀM YÊN"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Question Quantities */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  2. Số lượng câu hỏi Ôn tập
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">(Gấp đôi đề kiểm tra)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Trắc nghiệm 4 phương án</label>
                <input
                  type="number"
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Math.max(4, Number(e.target.value)))}
                  className="w-full p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Trắc nghiệm Đúng - Sai</label>
                <input
                  type="number"
                  value={tfCount}
                  onChange={(e) => setTfCount(Math.max(0, Number(e.target.value)))}
                  className="w-full p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>

              {subject.toLowerCase().trim() === "tin học" ? (
                <div>
                  <label className="block font-semibold text-slate-400 mb-0.5">Trả lời ngắn (Môn Tin không dùng)</label>
                  <input
                    type="text"
                    disabled
                    value="Không áp dụng"
                    className="w-full p-1.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Trả lời ngắn (Toán/KHTN)</label>
                  <input
                    type="number"
                    value={shortAnswerCount}
                    onChange={(e) => setShortAnswerCount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Bài tập Vận dụng / Tự luận</label>
                <input
                  type="number"
                  value={appliedCount}
                  onChange={(e) => setAppliedCount(Math.max(1, Number(e.target.value)))}
                  className="w-full p-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Repository Picker */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  3. Chọn Bài / Chương ({subject} {grade})
                </h2>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Chọn tất cả
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-red-600 font-bold hover:underline"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Selected Summary Badge */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs">
              <span className="font-bold text-emerald-900 text-[11px]">
                Đã chọn: <span className="text-emerald-700 font-extrabold">{selectedLessonsList.length} bài học</span> ({totalSelectedPeriods} tiết)
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Kho GDPT 2018</span>
            </div>

            {/* Search Filter Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên bài học hoặc chương..."
                className="w-full text-xs pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Topics Tree List */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {topics.map((topic: any) => {
                const isExpanded = expandedTopics.has(topic.id);
                const topicLessons = topic.lessons || [];
                const filteredLessons = topicLessons.filter((l: Lesson) =>
                  l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  topic.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (searchQuery && filteredLessons.length === 0) return null;

                const allTopicSelected = topicLessons.length > 0 && topicLessons.every((l: Lesson) => selectedLessonIds.has(l.id));
                const someTopicSelected = topicLessons.some((l: Lesson) => selectedLessonIds.has(l.id));

                return (
                  <div key={topic.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                    <div className="flex items-center justify-between p-2 bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-800">
                      <div className="flex items-start gap-2 cursor-pointer flex-1 min-w-0" onClick={() => toggleTopicExpand(topic.id)}>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
                        <span className="whitespace-normal break-words leading-tight">{topic.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTopicSelectAll(topic)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors shrink-0 ml-2 ${
                          allTopicSelected
                            ? "bg-emerald-600 text-white"
                            : someTopicSelected
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {allTopicSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : null}
                        <span>{allTopicSelected ? "Đã chọn hết" : "Chọn chương"}</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-1.5 space-y-1 bg-white">
                        {filteredLessons.map((lesson: Lesson) => {
                          const isSelected = selectedLessonIds.has(lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => toggleLessonSelect(lesson.id)}
                              className={`flex items-start justify-between p-1.5 rounded-md border text-[11px] cursor-pointer transition-all ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold"
                                  : "border-slate-100 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="flex items-start gap-1.5 min-w-0">
                                {isSelected ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                                )}
                                <span className="whitespace-normal break-words leading-tight">{lesson.name}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-normal shrink-0 ml-2 mt-0.5">
                                {lesson.periods || 2} tiết
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Preview & Export */}
        <div className="lg:col-span-8 space-y-4">
          {studyGuideData ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Đề cương Ôn tập đã tạo thành công!
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Bao gồm {studyGuideData.topics?.length || 0} chủ đề & {studyGuideData.mcq?.length || 0} câu trắc nghiệm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copySuccess ? "Đã chép!" : "Sao chép"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportWord}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File Word (.docx)</span>
                  </button>
                </div>
              </div>

              {/* A4 Paper-like Document Preview Box */}
              <div 
                className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xl text-slate-900 text-xs leading-relaxed space-y-6 max-h-[700px] overflow-y-auto shadow-inner"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                {/* Official Header */}
                <div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-4 text-center font-bold">
                  <div>
                    <p className="uppercase text-[11px]">{studyGuideData.departmentName || "PHÒNG GD&ĐT"}</p>
                    <p className="uppercase text-[11px] text-emerald-950">{studyGuideData.schoolName || "TRƯỜNG THCS"}</p>
                  </div>
                  <div>
                    <p className="uppercase text-[11px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-[10px] underline">Độc lập - Tự do - Hạnh phúc</p>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-1">
                  <h2 className="text-base font-extrabold uppercase text-slate-900 tracking-wide">
                    {studyGuideData.title || `ĐỀ CƯƠNG ÔN TẬP KIỂM TRA ${studyGuideData.period.toUpperCase()}`}
                  </h2>
                  <p className="text-xs font-bold text-slate-800">
                    MÔN: {studyGuideData.subject.toUpperCase()} LỚP {studyGuideData.grade} - NĂM HỌC {studyGuideData.schoolYear}
                  </p>
                </div>

                {/* Section A: Theory Summaries */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1">
                    PHẦN A. TÓM TẮT KIẾN THỨC TRỌNG TÂM
                  </h3>
                  {(studyGuideData.topics || []).map((topic, idx) => (
                    <div key={idx} className="space-y-1 pl-2">
                      <p className="font-bold text-emerald-900">
                        • {topic.topic}{topic.lessonName ? `: ${topic.lessonName}` : ""}
                      </p>
                      <ul className="list-disc pl-6 space-y-0.5 text-slate-800">
                        {(topic.summaryPoints || []).map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Section B: Questions */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1">
                    PHẦN B. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP
                  </h3>

                  {studyGuideData.mcq && studyGuideData.mcq.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-bold text-slate-900">I. Trắc nghiệm 4 lựa chọn</p>
                      {studyGuideData.mcq.map((q, idx) => (
                        <div key={idx} className="space-y-1 pl-2">
                          <p className="font-bold">
                            <span className="text-blue-700">Câu {idx + 1}.</span> {q.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pl-4">
                            {(q.options || []).map((opt, oIdx) => (
                              <div key={oIdx}>{opt}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {studyGuideData.tf && studyGuideData.tf.length > 0 && (
                    <div className="space-y-4">
                      <p className="font-bold text-slate-900">II. Trắc nghiệm Đúng - Sai</p>
                      {studyGuideData.tf.map((q, idx) => (
                        <div key={idx} className="space-y-2 pl-2">
                          <p className="font-bold">
                            <span className="text-blue-700">Câu {idx + 1}.</span> {q.question}
                          </p>
                          <div className="pl-4 max-w-2xl">
                            <table className="w-full border-collapse border border-slate-400 text-xs">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-400 p-1 text-left font-bold w-3/4">Các phát biểu</th>
                                  <th className="border border-slate-400 p-1 text-center font-bold w-1/8">Đúng</th>
                                  <th className="border border-slate-400 p-1 text-center font-bold w-1/8">Sai</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(q.statements || []).map((st, sIdx) => (
                                  <tr key={sIdx} className="hover:bg-slate-50">
                                    <td className="border border-slate-400 p-1.5 font-normal">
                                      <span className="font-bold">{st.id})</span> {st.text}
                                    </td>
                                    <td className="border border-slate-400 p-1.5 text-center font-bold text-emerald-600">
                                      {st.isTrue ? "✓" : ""}
                                    </td>
                                    <td className="border border-slate-400 p-1.5 text-center font-bold text-rose-600">
                                      {!st.isTrue ? "✓" : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {studyGuideData.applied && studyGuideData.applied.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-bold text-slate-900">III. Bài tập Vận dụng & Tự luận</p>
                      {studyGuideData.applied.map((q, idx) => (
                        <div key={idx} className="pl-2">
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-blue-700 shrink-0 text-xs">Câu {idx + 1}.</span>
                            <div className="grow">
                              {formatQuestionText(q.question)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section C: Answers */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1">
                    PHẦN C. ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI CHI TIẾT
                  </h3>
                  
                  {studyGuideData.mcq && studyGuideData.mcq.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-bold text-slate-800 text-xs">I. Đáp án Trắc nghiệm nhiều lựa chọn</p>
                      
                      <div className="flex flex-wrap gap-1 max-w-xl text-[10px] border border-slate-300 rounded-md overflow-hidden bg-white">
                        {studyGuideData.mcq.map((q, qIdx) => (
                          <div key={qIdx} className="flex flex-col border-r border-b border-slate-200 min-w-[50px] grow">
                            <span className="bg-slate-50 p-1 text-center font-bold text-slate-500 border-b border-slate-200">Câu {qIdx + 1}</span>
                            <span className="p-1 text-center font-bold text-blue-700">{q.correctAnswer}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-1 pl-2 mt-2">
                        {studyGuideData.mcq.map((q, qIdx) => q.explanation && (
                          <p key={qIdx} className="text-xs text-slate-800 leading-relaxed font-normal">
                            <span className="font-bold text-blue-700">Câu {qIdx + 1} - Giải thích: </span>{q.explanation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {studyGuideData.tf && studyGuideData.tf.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="font-bold text-slate-800 text-xs">II. Đáp án Trắc nghiệm Đúng - Sai</p>
                      
                      <div className="max-w-2xl text-[11px] border border-slate-300 rounded-md overflow-hidden bg-white shadow-xs">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                              <th className="p-1.5 border-r border-slate-200 text-center w-16">Câu</th>
                              <th className="p-1.5 border-r border-slate-200 text-center w-12">Ý</th>
                              <th className="p-1.5 border-r border-slate-200 text-center w-24">Đáp án (Đ/S)</th>
                              <th className="p-1.5">Nội dung mệnh đề</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studyGuideData.tf.map((q, qIdx) => (
                              <React.Fragment key={qIdx}>
                                {(q.statements || []).map((st: any, sIdx: number) => (
                                  <tr key={st.id} className="border-b border-slate-150 hover:bg-slate-50/50">
                                    {sIdx === 0 && (
                                      <td 
                                        className="p-1.5 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50/30" 
                                        rowSpan={q.statements.length}
                                      >
                                        Câu {qIdx + 1}
                                      </td>
                                    )}
                                    <td className="p-1.5 border-r border-slate-200 text-center font-bold text-blue-700">
                                      {st.id})
                                    </td>
                                    <td className="p-1.5 border-r border-slate-200 text-center font-bold">
                                      <span className={st.isTrue ? "text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]" : "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px]"}>
                                        {st.isTrue ? "ĐÚNG" : "SAI"}
                                      </span>
                                    </td>
                                    <td className="p-1.5 text-slate-700">
                                      {st.text}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="space-y-1 pl-2 mt-2">
                        {studyGuideData.tf.map((q: any, qIdx) => q.explanation && (
                          <p key={qIdx} className="text-xs text-slate-800 leading-relaxed font-normal">
                            <span className="font-bold text-blue-700">Câu {qIdx + 1} - Giải thích: </span>{q.explanation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {studyGuideData.shortAnswer && studyGuideData.shortAnswer.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="font-bold text-slate-800 text-xs">III. Đáp án Trắc nghiệm trả lời ngắn</p>
                      
                      <div className="max-w-2xl text-[11px] border border-slate-300 rounded-md overflow-hidden bg-white shadow-xs">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                              <th className="p-1.5 border-r border-slate-200 text-center w-16">Câu</th>
                              <th className="p-1.5 border-r border-slate-200 text-left">Đáp án</th>
                              <th className="p-1.5 w-24 text-center">Đơn vị</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studyGuideData.shortAnswer.map((q, qIdx) => (
                              <tr key={qIdx} className="border-b border-slate-150 hover:bg-slate-50/50">
                                <td className="p-1.5 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50/30">
                                  Câu {qIdx + 1}
                                </td>
                                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-semibold pl-3">
                                  {q.answer}
                                </td>
                                <td className="p-1.5 text-center text-slate-600">
                                  {q.unit || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="space-y-1 pl-2 mt-2">
                        {studyGuideData.shortAnswer.map((q: any, qIdx) => q.explanation && (
                          <p key={qIdx} className="text-xs text-slate-800 leading-relaxed font-normal">
                            <span className="font-bold text-blue-700">Câu {qIdx + 1} - Giải thích: </span>{q.explanation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {studyGuideData.applied && studyGuideData.applied.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="font-bold text-slate-800 text-xs">
                        {studyGuideData.shortAnswer && studyGuideData.shortAnswer.length > 0 ? "IV" : "III"}. Bài tập vận dụng / Tự luận
                      </p>
                      
                      <div className="max-w-3xl text-[11px] border border-slate-300 rounded-md overflow-hidden bg-white shadow-xs">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-center">
                              <th className="p-2 border-r border-slate-200 w-16">Câu</th>
                              <th className="p-2 border-r border-slate-200 text-left">Nội dung đáp án</th>
                              <th className="p-2 w-16">Điểm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studyGuideData.applied.map((q, qIdx) => {
                              const breakdownLength = q.pointsBreakdown?.length || 0;
                              return (
                                <React.Fragment key={qIdx}>
                                  {/* Main row with the answer text */}
                                  <tr className="border-b border-slate-150 align-top hover:bg-slate-50/50">
                                    <td 
                                      className="p-2 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50/30" 
                                      rowSpan={1 + breakdownLength}
                                    >
                                      Câu {qIdx + 1}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-slate-800">
                                      {formatQuestionText(q.answer)}
                                    </td>
                                    <td className="p-2 text-center font-bold text-slate-700">
                                      1,00
                                    </td>
                                  </tr>
                                  {/* Breakdown rows if any */}
                                  {q.pointsBreakdown && q.pointsBreakdown.map((b, bIdx) => (
                                    <tr key={bIdx} className="border-b border-slate-150 align-top hover:bg-slate-50/50 text-[10px] italic text-slate-600">
                                      <td className="p-2 border-r border-slate-200">
                                        {b.criteria}
                                      </td>
                                      <td className="p-2 text-center font-semibold text-slate-500">
                                        {b.points}
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date line instead of signatures */}
                <div className="text-right text-[11px] italic text-slate-500 pt-4 border-t border-slate-200">
                  Hàm Yên, ngày ..... tháng ..... năm 202...
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4 my-auto">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-extrabold text-slate-800">
                  Chưa khởi tạo Đề cương
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hãy chọn các Bài học / Chương cụ thể bên cột trái và bấm nút <strong className="text-emerald-700">"Khởi tạo Đề cương Ôn tập"</strong> để xem trước và tải file Word (.docx).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
