import React, { useState, useEffect } from "react";
import { 
  X, 
  Check, 
  Plus, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Info, 
  Sliders, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Save,
  Trash2,
  FolderOpen,
  ArrowRightLeft,
  Search,
  Download,
  Upload,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Edit3
} from "lucide-react";
import { ALL_TEXTBOOKS, Lesson } from "../data/textbooks";
import { ALL_MATH_TEXTBOOKS } from "../data/math";
import { 
  SavedPpctRecord, 
  fetchAllSavedPpct, 
  savePpctPermanently, 
  deleteSavedPpct, 
  getAllSubjectCatalogLessons,
  exportPpctAsJson
} from "../lib/ppctClient";
import { parsePpctLessonsFromExcel, extractSmartTextFromExcel } from "../lib/excel-parser";

export interface CustomLessonConfig {
  id: string;
  lessonNumber: string;
  name: string;
  topicId: string;
  topicName: string;
  periods: number;
  selected: boolean;
  halfGroup: "firstHalf" | "secondHalf";
}

export interface ScopeConfigData {
  mode: "default" | "custom";
  firstHalfLessons: CustomLessonConfig[];
  secondHalfLessons: CustomLessonConfig[];
  quickNoteText?: string;
  savedPpctName?: string;
  savedPpctId?: string;
}

interface ScopeConfigModalProps {
  subject?: string;
  isOpen: boolean;
  onClose: () => void;
  grade: string;
  period: string;
  scopeConfig: ScopeConfigData;
  onSaveScope: (newConfig: ScopeConfigData) => void;
}

export function getDefaultScopeForPeriod(subject: string, grade: string, period: string): ScopeConfigData {
  const isCuoiKy = period.includes("Cuối");
  const isHk1 = period.includes("I") && !period.includes("II");

  if (subject !== "Tin học" && subject !== "Toán học") {
    return {
      mode: "default",
      firstHalfLessons: [],
      secondHalfLessons: [],
      quickNoteText: ""
    };
  }

  const tb = subject.toLowerCase().trim().includes("toán")
    ? (ALL_MATH_TEXTBOOKS[grade] || ALL_MATH_TEXTBOOKS["6"] || { topics: [] })
    : (ALL_TEXTBOOKS[grade] || ALL_TEXTBOOKS["6"] || { topics: [] });

  const allLessons: Lesson[] = [];
  if (tb && Array.isArray(tb.topics)) {
    tb.topics.forEach(t => {
      if (Array.isArray(t.lessons)) {
        t.lessons.forEach(l => allLessons.push(l));
      }
    });
  }

  const firstHalfList: CustomLessonConfig[] = [];
  const secondHalfList: CustomLessonConfig[] = [];

  allLessons.forEach((lesson) => {
    const lNumStr = lesson.name.toLowerCase();
    const tName = lesson.topicName.toLowerCase();
    let isFirstHalf = false;
    let isSecondHalf = false;
    let defaultPeriods = lesson.periods || 2;

    const checkBài = (nums: number[]) => nums.some(n => new RegExp(`\\bbài ${n}[a-z]?\\.`, 'i').test(lNumStr));
    const checkCĐ = (nums: number[]) => nums.some(n => new RegExp(`\\b(chủ đề|chương) ${n}\\b`, 'i').test(tName));

    if (subject.toLowerCase().trim().includes("toán")) {
      if (isHk1) {
        if (grade === "6") {
          // HK1 Toán 6: Chương 1, 2, 4 là nửa đầu; Chương 3, 5 là nửa sau
          if (checkCĐ([1, 2, 4]) || checkBài([1,2,3,4,5,6,7,8,9,10,11,12,13,19,20,21])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else if (grade === "7") {
          // HK1 Toán 7: Giữa HK1 gồm Chương 1, 2, 3; Cuối HK1 gồm Chương 4, 5
          if (checkCĐ([1, 2, 3])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else if (grade === "8") {
          // HK1 Toán 8: Chương 1, 2, 3 là nửa đầu; Chương 4, 5 là nửa sau
          if (checkCĐ([1, 2, 3]) || checkBài([1,2,3,4,5,6,7])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else {
          // HK1 Toán 9: Chương 1, 2, 4 là nửa đầu; Chương 3, 5 là nửa sau
          if (checkCĐ([1, 2, 4]) || checkBài([1,2,3,4,7,8])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        }
      } else {
        // HK2 Toán
        if (grade === "6") {
          if (checkCĐ([6, 8]) || checkBài([24,25,26,27,28,33,34,35])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else if (grade === "7") {
          // HK2 Toán 7: Giữa HK2 gồm Chương 6, 8 và một phần Chương 7, Chương 9 (Bài 20-25, 29-33)
          // Để đơn giản, ta gán Chương 6, 7, 8 cho nửa đầu; Chương 9, 10 cho nửa sau,
          // hoặc cụ thể các bài.
          if (checkCĐ([6, 8]) || checkBài([20,21,22,23,24,25,29,30,31,32,33])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else if (grade === "8") {
          if (checkCĐ([6, 7]) || checkBài([11,12,13,14,16])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        } else {
          // HK2 Toán 9
          if (checkCĐ([6]) || checkBài([11,12,15])) {
            isFirstHalf = true;
          } else {
            isSecondHalf = true;
          }
        }
      }
    } else {
      // Môn Tin học
      if (isHk1) {
        if (grade === "8") {
          if (checkBài([1,2,3,4]) || checkCĐ([1,2,3])) {
            isFirstHalf = true;
          } else if (checkBài([5,6,7,8]) || checkCĐ([4])) {
            isSecondHalf = true;
          }
        } else if (grade === "7") {
          if (checkBài([1,2,3,4]) || checkCĐ([1,2,3])) {
            isFirstHalf = true;
          } else if (checkBài([5,6,7,8,9]) || checkCĐ([4])) {
            isSecondHalf = true;
          }
        } else if (grade === "6") {
          if (checkBài([1,2,3,4,5]) || checkCĐ([1,2])) {
            isFirstHalf = true;
          } else if (checkBài([6,7,8]) || checkCĐ([3])) {
            isSecondHalf = true;
          }
        } else {
          // Grade 9
          if (checkBài([1,2,3,4,5]) || checkCĐ([1,2,3])) {
            isFirstHalf = true;
          } else if (checkBài([6,7,8,9,10]) || checkCĐ([4])) {
            isSecondHalf = true;
          }
        }
      } else {
        // HK2 Tin học
        if (grade === "8") {
          if (checkBài([9,10,11,12])) {
            isFirstHalf = true;
          } else if (checkBài([13,14,15,16])) {
            isSecondHalf = true;
          }
        } else if (grade === "7") {
          if (checkBài([10,11,12])) {
            isFirstHalf = true;
          } else if (checkBài([13,14,15,16])) {
            isSecondHalf = true;
          }
        } else if (grade === "6") {
          if (checkBài([9,10,11,12])) {
            isFirstHalf = true;
          } else if (checkBài([13,14,15,16,17])) {
            isSecondHalf = true;
          }
        } else {
          if (checkBài([11,12])) {
            isFirstHalf = true;
          } else if (checkBài([13,14,15,16])) {
            isSecondHalf = true;
          }
        }
      }
    }

    if (!isCuoiKy) {
      // Giữa kì: firstHalf list contains active lessons
      if (isFirstHalf) {
        firstHalfList.push({
          id: lesson.id,
          lessonNumber: lesson.lessonNumber,
          name: lesson.name,
          topicId: lesson.topicId,
          topicName: lesson.topicName,
          periods: defaultPeriods,
          selected: true,
          halfGroup: "firstHalf"
        });
      }
    } else {
      // Cuối kì: both firstHalf (30%) and secondHalf (70%)
      if (isFirstHalf) {
        firstHalfList.push({
          id: lesson.id,
          lessonNumber: lesson.lessonNumber,
          name: lesson.name,
          topicId: lesson.topicId,
          topicName: lesson.topicName,
          periods: defaultPeriods,
          selected: true,
          halfGroup: "firstHalf"
        });
      }
      if (isSecondHalf) {
        secondHalfList.push({
          id: lesson.id,
          lessonNumber: lesson.lessonNumber,
          name: lesson.name,
          topicId: lesson.topicId,
          topicName: lesson.topicName,
          periods: defaultPeriods,
          selected: true,
          halfGroup: "secondHalf"
        });
      }
    }
  });

  return {
    mode: "default",
    firstHalfLessons: firstHalfList,
    secondHalfLessons: secondHalfList,
    quickNoteText: ""
  };
}

export default function ScopeConfigModal({
  subject = "Tin học",
  isOpen,
  onClose,
  grade,
  period,
  scopeConfig,
  onSaveScope
}: ScopeConfigModalProps) {
  const isCuoiKy = period.includes("Cuối");

  const [mode, setMode] = useState<"default" | "custom">(scopeConfig.mode || "default");
  const [firstHalf, setFirstHalf] = useState<CustomLessonConfig[]>([]);
  const [secondHalf, setSecondHalf] = useState<CustomLessonConfig[]>([]);
  const [quickInputText, setQuickInputText] = useState<string>("");
  const [currentPpctName, setCurrentPpctName] = useState<string>(scopeConfig.savedPpctName || "");
  const [currentPpctId, setCurrentPpctId] = useState<string>(scopeConfig.savedPpctId || "");

  // Tabs: "interactive" (Checklist), "quickText" (Text input), "library" (Saved PPCT Presets)
  const [activeTab, setActiveTab] = useState<"interactive" | "quickText" | "library">("interactive");

  // Catalog Browser Modal / Drawer state
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [catalogTargetGroup, setCatalogTargetGroup] = useState<"first" | "second">("first");

  // Custom Lesson Modal state
  const [showCustomLessonModal, setShowCustomLessonModal] = useState<boolean>(false);
  const [customLessonName, setCustomLessonName] = useState<string>("");
  const [customLessonTopic, setCustomLessonTopic] = useState<string>("");
  const [customLessonPeriods, setCustomLessonPeriods] = useState<number>(2);
  const [customLessonTargetGroup, setCustomLessonTargetGroup] = useState<"first" | "second">("first");

  // Save As Permanent Modal state
  const [showSavePresetModal, setShowSavePresetModal] = useState<boolean>(false);
  const [savePresetName, setSavePresetName] = useState<string>("");
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>("");

  // Saved PPCT Library List
  const [savedPresets, setSavedPresets] = useState<SavedPpctRecord[]>([]);
  const [loadingPresets, setLoadingPresets] = useState<boolean>(false);

  // Sync state when opened or grade/period/subject changed
  useEffect(() => {
    if (isOpen) {
      setMode(scopeConfig.mode || "default");
      const isMath = subject.toLowerCase().trim().includes("toán");
      const hasMismatchedLessons = scopeConfig.firstHalfLessons?.some(l => 
        isMath ? l.topicName?.toLowerCase().includes("chủ đề") : l.topicName?.toLowerCase().includes("chương")
      );
      if (scopeConfig.firstHalfLessons && scopeConfig.firstHalfLessons.length > 0 && !hasMismatchedLessons) {
        setFirstHalf(JSON.parse(JSON.stringify(scopeConfig.firstHalfLessons)));
        setSecondHalf(JSON.parse(JSON.stringify(scopeConfig.secondHalfLessons || [])));
      } else {
        const def = getDefaultScopeForPeriod(subject, grade, period);
        setFirstHalf(def.firstHalfLessons);
        setSecondHalf(def.secondHalfLessons);
      }
      setQuickInputText(scopeConfig.quickNoteText || "");
      setCurrentPpctName(scopeConfig.savedPpctName || "");
      setCurrentPpctId(scopeConfig.savedPpctId || "");
      loadSavedPresets();
    }
  }, [isOpen, grade, period, scopeConfig, subject]);

  const loadSavedPresets = async () => {
    setLoadingPresets(true);
    try {
      const list = await fetchAllSavedPpct({ subject, grade });
      setSavedPresets(list);
    } catch (e) {
      console.error("Error loading saved PPCTs:", e);
    } finally {
      setLoadingPresets(false);
    }
  };

  if (!isOpen) return null;

  // Helpers to update lessons
  const handleToggleLesson = (listType: "first" | "second", id: string) => {
    setMode("custom");
    if (listType === "first") {
      setFirstHalf(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
    } else {
      setSecondHalf(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
    }
  };

  const handlePeriodChange = (listType: "first" | "second", id: string, delta: number) => {
    setMode("custom");
    const updater = (list: CustomLessonConfig[]) => list.map(l => {
      if (l.id === id) {
        const nextP = Math.max(1, Math.min(20, (l.periods || 1) + delta));
        return { ...l, periods: nextP };
      }
      return l;
    });

    if (listType === "first") {
      setFirstHalf(updater);
    } else {
      setSecondHalf(updater);
    }
  };

  const handleSetPeriodDirect = (listType: "first" | "second", id: string, val: number) => {
    setMode("custom");
    const valid = Math.max(1, Math.min(20, Math.floor(val) || 1));
    const updater = (list: CustomLessonConfig[]) => list.map(l => l.id === id ? { ...l, periods: valid } : l);
    if (listType === "first") setFirstHalf(updater);
    else setSecondHalf(updater);
  };

  const handleRemoveLesson = (listType: "first" | "second", id: string) => {
    setMode("custom");
    if (listType === "first") {
      setFirstHalf(prev => prev.filter(l => l.id !== id));
    } else {
      setSecondHalf(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleMoveLessonToOtherGroup = (fromGroup: "first" | "second", item: CustomLessonConfig) => {
    setMode("custom");
    if (fromGroup === "first") {
      setFirstHalf(prev => prev.filter(l => l.id !== item.id));
      const movedItem: CustomLessonConfig = {
        ...item,
        halfGroup: "secondHalf",
        id: item.id.replace("_first", "") + "_second"
      };
      if (!secondHalf.some(l => l.name === item.name)) {
        setSecondHalf(prev => [...prev, movedItem]);
      }
    } else {
      setSecondHalf(prev => prev.filter(l => l.id !== item.id));
      const movedItem: CustomLessonConfig = {
        ...item,
        halfGroup: "firstHalf",
        id: item.id.replace("_second", "") + "_first"
      };
      if (!firstHalf.some(l => l.name === item.name)) {
        setFirstHalf(prev => [...prev, movedItem]);
      }
    }
  };

  const handleResetToStandard = () => {
    const def = getDefaultScopeForPeriod(subject, grade, period);
    setMode("default");
    setFirstHalf(def.firstHalfLessons);
    setSecondHalf(def.secondHalfLessons);
    setQuickInputText("");
    setCurrentPpctName("");
    setCurrentPpctId("");
  };

  const handleSelectAll = (listType: "first" | "second", selectState: boolean) => {
    setMode("custom");
    if (listType === "first") {
      setFirstHalf(prev => prev.map(l => ({ ...l, selected: selectState })));
    } else {
      setSecondHalf(prev => prev.map(l => ({ ...l, selected: selectState })));
    }
  };

  // Add lesson from Catalog
  const handleAddLessonFromCatalog = (lesson: Lesson, targetGroup: "first" | "second", defaultPeriods: number = 2) => {
    setMode("custom");
    const newItem: CustomLessonConfig = {
      id: `${lesson.id}_${targetGroup}_${Date.now().toString().slice(-4)}`,
      lessonNumber: lesson.lessonNumber || "Bài học",
      name: lesson.name,
      topicId: lesson.topicId,
      topicName: lesson.topicName,
      periods: defaultPeriods,
      selected: true,
      halfGroup: targetGroup === "first" ? "firstHalf" : "secondHalf"
    };

    if (targetGroup === "first") {
      if (!firstHalf.some(l => l.name === lesson.name)) {
        setFirstHalf(prev => [...prev, newItem]);
      }
    } else {
      if (!secondHalf.some(l => l.name === lesson.name)) {
        setSecondHalf(prev => [...prev, newItem]);
      }
    }
  };

  // Add custom typed lesson
  const handleCreateCustomLesson = () => {
    if (!customLessonName.trim()) return;
    setMode("custom");
    const newItem: CustomLessonConfig = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      lessonNumber: "Bài bổ sung",
      name: customLessonName.trim(),
      topicId: "custom",
      topicName: customLessonTopic.trim() || `Chuyên đề / Ôn tập môn ${subject}`,
      periods: Math.max(1, customLessonPeriods || 1),
      selected: true,
      halfGroup: customLessonTargetGroup === "first" ? "firstHalf" : "secondHalf"
    };

    if (customLessonTargetGroup === "first") {
      setFirstHalf(prev => [...prev, newItem]);
    } else {
      setSecondHalf(prev => [...prev, newItem]);
    }

    setCustomLessonName("");
    setCustomLessonTopic("");
    setCustomLessonPeriods(2);
    setShowCustomLessonModal(false);
  };

  // Save current PPCT permanently
  const handleOpenSavePresetModal = () => {
    const defaultName = currentPpctName || `PPCT ${subject} ${grade} - ${period} (${new Date().toLocaleDateString("vi-VN")})`;
    setSavePresetName(defaultName);
    setShowSavePresetModal(true);
  };

  const handleConfirmSavePreset = async () => {
    if (!savePresetName.trim()) return;
    const record: SavedPpctRecord = {
      id: currentPpctId || `ppct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: savePresetName.trim(),
      subject,
      grade,
      period,
      isPermanent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scopeConfig: {
        mode: "custom",
        firstHalfLessons: firstHalf,
        secondHalfLessons: secondHalf,
        quickNoteText: quickInputText
      }
    };

    const saved = await savePpctPermanently(record);
    setCurrentPpctName(saved.name);
    setCurrentPpctId(saved.id);
    setMode("custom");
    setShowSavePresetModal(false);
    setSaveSuccessNotice(`Đã lưu vĩnh viễn bản PPCT "${saved.name}" lên ứng dụng thành công!`);
    loadSavedPresets();
    setTimeout(() => setSaveSuccessNotice(""), 4000);
  };

  // Apply a saved preset
  const handleApplyPreset = (preset: SavedPpctRecord) => {
    setMode("custom");
    if (preset.scopeConfig) {
      setFirstHalf(JSON.parse(JSON.stringify(preset.scopeConfig.firstHalfLessons || [])));
      setSecondHalf(JSON.parse(JSON.stringify(preset.scopeConfig.secondHalfLessons || [])));
      setQuickInputText(preset.scopeConfig.quickNoteText || "");
    }
    setCurrentPpctName(preset.name);
    setCurrentPpctId(preset.id);
    setActiveTab("interactive");
    setSaveSuccessNotice(`Đã nạp bản PPCT "${preset.name}".`);
    setTimeout(() => setSaveSuccessNotice(""), 3000);
  };

  // Delete a saved preset
  const handleDeletePreset = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản PPCT "${name}" khỏi danh sách lưu vĩnh viễn?`)) {
      await deleteSavedPpct(id);
      if (currentPpctId === id) {
        setCurrentPpctId("");
        setCurrentPpctName("");
      }
      loadSavedPresets();
    }
  };

  // Handle JSON Import
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.scopeConfig) {
          const saved = await savePpctPermanently({
            ...parsed,
            id: `ppct_import_${Date.now()}`,
            name: parsed.name ? `${parsed.name} (Nhập)` : `PPCT Nhập ${subject} ${grade}`
          });
          handleApplyPreset(saved);
          loadSavedPresets();
        } else {
          alert("File JSON không đúng định dạng cấu hình PPCT.");
        }
      } catch (err) {
        alert("Không thể đọc file JSON. Vui lòng kiểm tra lại.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Handle Excel (.xlsx / .xls) Smart Import
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        if (!buffer) return;

        const parseRes = parsePpctLessonsFromExcel(buffer, subject, grade);

        if (parseRes.totalLessons === 0) {
          alert("Không nhận diện được danh sách bài học trong file Excel. Vui lòng kiểm tra lại cấu trúc cột trong file.");
          return;
        }

        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const newPresetName = `PPCT Excel: ${fileNameWithoutExt} (${parseRes.totalLessons} bài - ${parseRes.totalPeriods} tiết)`;

        const saved = await savePpctPermanently({
          name: newPresetName,
          subject: parseRes.detectedSubject || subject,
          grade: parseRes.detectedGrade || grade,
          period: period,
          schoolYear: "2026 - 2027",
          id: `ppct_excel_imp_${Date.now()}`,
          scopeConfig: {
            mode: "custom",
            firstHalfLessons: parseRes.firstHalfLessons,
            secondHalfLessons: parseRes.secondHalfLessons,
            savedPpctName: newPresetName
          }
        });

        handleApplyPreset(saved);
        loadSavedPresets();
        setActiveTab("interactive");
        alert(`Đã nhận diện và trích xuất thành công ${parseRes.totalLessons} bài học (${parseRes.totalPeriods} tiết) từ file Excel ${file.name}!`);
      } catch (err) {
        console.error("Lỗi import Excel:", err);
        alert("Có lỗi khi đọc và phân tích file Excel. Vui lòng kiểm tra định dạng file.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSaveAndApply = () => {
    onSaveScope({
      mode,
      firstHalfLessons: firstHalf,
      secondHalfLessons: secondHalf,
      quickNoteText: quickInputText,
      savedPpctName: currentPpctName,
      savedPpctId: currentPpctId
    });
    onClose();
  };

  const selectedFirstCount = firstHalf.filter(l => l.selected).length;
  const totalFirstPeriods = firstHalf.filter(l => l.selected).reduce((sum, l) => sum + (l.periods || 1), 0);

  const selectedSecondCount = secondHalf.filter(l => l.selected).length;
  const totalSecondPeriods = secondHalf.filter(l => l.selected).reduce((sum, l) => sum + (l.periods || 1), 0);

  const catalogTopics = getAllSubjectCatalogLessons(subject, grade);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#0f172a] text-white px-5 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-100">
                  Tạo & Quản lý Phân phối chương trình (PPCT)
                </h3>
                <span className="text-[11px] bg-blue-500/20 text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {subject} {grade} • {period}
                </span>
                {currentPpctName && (
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    <span>Đang dùng: {currentPpctName}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tự do chọn bài trong Phụ lục môn học, điền số tiết và lưu vĩnh viễn trên ứng dụng để sử dụng mọi lúc.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-emerald-900 text-xs font-semibold flex items-center justify-between shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSaveSuccessNotice("")}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sub-Header Actions & Tabs */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Mode Switchers */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setMode("default");
                const def = getDefaultScopeForPeriod(subject, grade, period);
                setFirstHalf(def.firstHalfLessons);
                setSecondHalf(def.secondHalfLessons);
                setCurrentPpctName("");
                setCurrentPpctId("");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "default"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuẩn GDPT 2018 (Mặc định)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("custom")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "custom"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>PPCT Tùy chỉnh (Thủ công)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenSavePresetModal}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Lưu bản phân phối chương trình này vào kho vĩnh viễn"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu PPCT vĩnh viễn</span>
            </button>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex items-center text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("interactive")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "interactive" ? "bg-blue-100 text-blue-900 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Danh sách bài</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "library" ? "bg-blue-100 text-blue-900 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Kho PPCT đã lưu ({savedPresets.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quickText")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "quickText" ? "bg-blue-100 text-blue-900 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Nhập nhanh text</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetToStandard}
              className="text-slate-600 hover:text-blue-700 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Đặt lại theo phân phối chương trình mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          
          {/* TAB 1: SAVED PPCT LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>Kho Phân phối chương trình đã lưu vĩnh viễn</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Các bản PPCT do thầy/cô đã tạo và lưu trên hệ thống cho môn <strong>{subject} {grade}</strong>. Dùng vĩnh viễn trên mọi thiết bị.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập từ file Excel (.xlsx)</span>
                    <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} className="hidden" />
                  </label>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập từ JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>
              </div>

              {loadingPresets ? (
                <div className="py-10 text-center text-xs text-slate-500">Đang tải danh sách PPCT...</div>
              ) : savedPresets.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Chưa có bản PPCT nào được lưu vĩnh viễn cho môn {subject} {grade}</p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Thầy/cô hãy quay lại tab <strong>"Danh sách bài"</strong>, tự chọn các bài học trong Phụ lục, điền số tiết và bấm nút <strong>"Lưu PPCT vĩnh viễn"</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("interactive")}
                    className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo bản PPCT mới ngay</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedPresets.map((preset) => {
                    const firstCount = (preset.scopeConfig?.firstHalfLessons || []).filter(l => l.selected).length;
                    const secondCount = (preset.scopeConfig?.secondHalfLessons || []).filter(l => l.selected).length;
                    const totalLessons = firstCount + secondCount;
                    const totalP = (preset.scopeConfig?.firstHalfLessons || []).filter(l => l.selected).reduce((s, l) => s + (l.periods || 1), 0) +
                                   (preset.scopeConfig?.secondHalfLessons || []).filter(l => l.selected).reduce((s, l) => s + (l.periods || 1), 0);
                    const isSelected = currentPpctId === preset.id;

                    return (
                      <div
                        key={preset.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{preset.name}</h5>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
                              {preset.period}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Gồm <strong>{totalLessons} bài học</strong> • Tổng <strong>{totalP} tiết</strong>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Cập nhật: {new Date(preset.updatedAt || preset.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => exportPpctAsJson(preset)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 rounded bg-slate-100 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Tải về file JSON dự phòng"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePreset(preset.id, preset.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-100 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa bản PPCT này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isSelected ? "Đang áp dụng" : "Nạp bản này"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUICK TEXT MODE */}
          {activeTab === "quickText" && (
            <div className="space-y-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div>
                <label className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Nhập nhanh danh sách bài học & số tiết:</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Thầy/cô có thể gõ hoặc dán nội dung phân phối thực tế. Ví dụ: <br />
                  <span className="font-medium text-blue-950 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                    {isCuoiKy 
                      ? "Nửa đầu kỳ: Bài 1 số tiết 2, Bài 4 số tiết 1. Nửa cuối kỳ: Bài 5 (2 tiết), Bài 6 (2 tiết), Bài 7 (1 tiết), Bài 8a (2 tiết)"
                      : "Giữa kỳ: Bài 1 (2 tiết), Bài 2 (1 tiết), Bài 4 (2 tiết)"}
                  </span>
                </p>
                <textarea
                  value={quickInputText}
                  onChange={(e) => {
                    setQuickInputText(e.target.value);
                    setMode("custom");
                  }}
                  rows={6}
                  placeholder={
                    isCuoiKy
                      ? "Ví dụ:\n- Nửa đầu kỳ (30%): Bài 1 (2 tiết), Bài 4 (1 tiết)\n- Nửa cuối kỳ (70%): Bài 5 (2 tiết), Bài 6 (2 tiết), Bài 7 (1 tiết), Bài 8a (2 tiết)"
                      : "Ví dụ:\n- Bài 1 (2 tiết)\n- Bài 2 (1 tiết)\n- Bài 4 (2 tiết)"
                  }
                  className="w-full text-xs font-mono p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none leading-relaxed bg-slate-50/50"
                />
              </div>
              <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Nội dung ghi chú này sẽ được chuyển trực tiếp vào AI để định hướng chính xác kiến thức và số tiết trong Ma trận và Đề thi.</span>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE CHECKLIST MODE */}
          {activeTab === "interactive" && (
            <div className="space-y-4">
              
              {/* Action Toolbar to Add Lessons */}
              <div className="bg-white border border-blue-200/80 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Thêm bài vào PPCT:</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogTargetGroup("first");
                      setShowCatalogModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>➕ Chọn bài từ Phụ lục SGK</span>
                  </button>

                  <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>📥 Nhập từ file Excel PPCT (.xlsx)</span>
                    <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomLessonTargetGroup("first");
                      setShowCustomLessonModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Tự gõ bài mới / Chuyên đề</span>
                  </button>
                </div>
              </div>

              {/* Scope Columns */}
              {!isCuoiKy ? (
                /* GIỮA KỲ: 1 Column (100%) */
                <div className="border border-blue-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-200" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Danh sách bài thi Giữa kỳ (100% thời lượng)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-blue-900/90 px-2.5 py-1 rounded-md font-bold border border-blue-400/30">
                        Đã chọn: {selectedFirstCount} bài ({totalFirstPeriods} tiết)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectAll("first", true)}
                        className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Chọn hết
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAll("first", false)}
                        className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Bỏ hết
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 max-h-[52vh] overflow-y-auto">
                    {firstHalf.length === 0 ? (
                      <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-blue-200 rounded-xl space-y-3">
                        <AlertCircle className="w-8 h-8 text-blue-500 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-xs text-slate-800 font-bold">Chưa có bài học nào trong danh sách kiểm tra Giữa kỳ</p>
                          <p className="text-[11.5px] text-slate-600 max-w-md mx-auto">
                            Thầy/cô vui lòng bấm nút <strong>"➕ Chọn bài từ Phụ lục SGK"</strong> ở trên để tự chọn bất kỳ bài học nào hoặc tự gõ bài mới.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCatalogTargetGroup("first");
                            setShowCatalogModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Mở Phụ lục bài học SGK {subject} {grade}</span>
                        </button>
                      </div>
                    ) : (
                      firstHalf.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            lesson.selected
                              ? "bg-blue-50/70 border-blue-300 text-blue-950 shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={lesson.selected}
                              onChange={() => handleToggleLesson("first", lesson.id)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">
                                {lesson.name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {lesson.topicName}
                              </p>
                            </div>
                          </label>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Number of periods stepper */}
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                              <span className="text-[10.5px] text-slate-500 font-medium">Số tiết:</span>
                              <button
                                type="button"
                                disabled={!lesson.selected || lesson.periods <= 1}
                                onClick={() => handlePeriodChange("first", lesson.id, -1)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 cursor-pointer"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                disabled={!lesson.selected}
                                value={lesson.periods || 1}
                                onChange={(e) => handleSetPeriodDirect("first", lesson.id, parseInt(e.target.value) || 1)}
                                className="w-8 text-center text-xs font-bold text-blue-900 outline-none"
                              />
                              <button
                                type="button"
                                disabled={!lesson.selected || lesson.periods >= 20}
                                onClick={() => handlePeriodChange("first", lesson.id, 1)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 cursor-pointer"
                              >
                                +
                              </button>
                              <span className="text-[10.5px] text-slate-500">tiết</span>
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson("first", lesson.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa bài này khỏi danh sách"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* CUỐI KỲ: 2 Columns (30% Nửa đầu & 70% Nửa cuối) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Column 1: Nửa đầu kỳ (30%) */}
                  <div className="border border-blue-300 rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 flex-wrap gap-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-400/30 text-blue-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-blue-300/30">
                            30% THỜI LƯỢNG
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wide">
                            Nửa đầu học kỳ
                          </span>
                        </div>
                        <p className="text-[10px] text-blue-200 mt-0.5">
                          Từ đầu năm đến mốc Giữa kì
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold bg-blue-900/90 px-2 py-0.5 rounded block">
                          {selectedFirstCount} bài ({totalFirstPeriods}t)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCatalogTargetGroup("first");
                            setShowCatalogModal(true);
                          }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold cursor-pointer"
                          title="Thêm bài vào Nửa đầu kỳ"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2 max-h-[46vh] overflow-y-auto flex-1">
                      {firstHalf.length === 0 ? (
                        <div className="text-center py-6 px-3 bg-slate-50 border border-dashed border-blue-200 rounded-xl space-y-1.5">
                          <AlertCircle className="w-5 h-5 text-blue-500 mx-auto" />
                          <p className="text-xs text-slate-700 font-bold">Chưa có bài nửa đầu kỳ</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCatalogTargetGroup("first");
                              setShowCatalogModal(true);
                            }}
                            className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            ➕ Chọn bài từ Phụ lục
                          </button>
                        </div>
                      ) : (
                        firstHalf.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                              lesson.selected
                                ? "bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={lesson.selected}
                                onChange={() => handleToggleLesson("first", lesson.id)}
                                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {lesson.name}
                                </p>
                                <p className="text-[9.5px] text-slate-500 truncate">
                                  {lesson.topicName}
                                </p>
                              </div>
                            </label>

                            <div className="flex items-center gap-1 shrink-0">
                              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                                <button
                                  type="button"
                                  disabled={!lesson.selected || lesson.periods <= 1}
                                  onClick={() => handlePeriodChange("first", lesson.id, -1)}
                                  className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 text-slate-700 font-bold text-[10px] disabled:opacity-30 cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  max={20}
                                  disabled={!lesson.selected}
                                  value={lesson.periods || 1}
                                  onChange={(e) => handleSetPeriodDirect("first", lesson.id, parseInt(e.target.value) || 1)}
                                  className="w-6 text-center text-xs font-bold text-blue-900 outline-none"
                                />
                                <button
                                  type="button"
                                  disabled={!lesson.selected || lesson.periods >= 20}
                                  onClick={() => handlePeriodChange("first", lesson.id, 1)}
                                  className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 text-slate-700 font-bold text-[10px] disabled:opacity-30 cursor-pointer"
                                >
                                  +
                                </button>
                                <span className="text-[10px] text-slate-500">tiết</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleMoveLessonToOtherGroup("first", lesson)}
                                className="p-1 text-slate-400 hover:text-emerald-700 rounded bg-slate-100 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Chuyển sang Nửa sau kỳ (70%)"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveLesson("first", lesson.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded bg-slate-100 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa bài"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Nửa cuối kỳ (70%) */}
                  <div className="border border-emerald-300 rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col">
                    <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 flex-wrap gap-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-400/30 text-emerald-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300/30">
                            70% THỜI LƯỢNG
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wide">
                            Nửa cuối học kỳ
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-200 mt-0.5">
                          Sau mốc Giữa kì đến Cuối kì
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold bg-emerald-900/90 px-2 py-0.5 rounded block">
                          {selectedSecondCount} bài ({totalSecondPeriods}t)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCatalogTargetGroup("second");
                            setShowCatalogModal(true);
                          }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold cursor-pointer"
                          title="Thêm bài vào Nửa sau kỳ"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2 max-h-[46vh] overflow-y-auto flex-1">
                      {secondHalf.length === 0 ? (
                        <div className="text-center py-6 px-3 bg-slate-50 border border-dashed border-emerald-200 rounded-xl space-y-1.5">
                          <AlertCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                          <p className="text-xs text-slate-700 font-bold">Chưa có bài nửa sau kỳ</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCatalogTargetGroup("second");
                              setShowCatalogModal(true);
                            }}
                            className="text-[11px] text-emerald-600 font-bold hover:underline cursor-pointer"
                          >
                            ➕ Chọn bài từ Phụ lục
                          </button>
                        </div>
                      ) : (
                        secondHalf.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                              lesson.selected
                                ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={lesson.selected}
                                onChange={() => handleToggleLesson("second", lesson.id)}
                                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {lesson.name}
                                </p>
                                <p className="text-[9.5px] text-slate-500 truncate">
                                  {lesson.topicName}
                                </p>
                              </div>
                            </label>

                            <div className="flex items-center gap-1 shrink-0">
                              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                                <button
                                  type="button"
                                  disabled={!lesson.selected || lesson.periods <= 1}
                                  onClick={() => handlePeriodChange("second", lesson.id, -1)}
                                  className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 text-slate-700 font-bold text-[10px] disabled:opacity-30 cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  max={20}
                                  disabled={!lesson.selected}
                                  value={lesson.periods || 1}
                                  onChange={(e) => handleSetPeriodDirect("second", lesson.id, parseInt(e.target.value) || 1)}
                                  className="w-6 text-center text-xs font-bold text-emerald-900 outline-none"
                                />
                                <button
                                  type="button"
                                  disabled={!lesson.selected || lesson.periods >= 20}
                                  onClick={() => handlePeriodChange("second", lesson.id, 1)}
                                  className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 text-slate-700 font-bold text-[10px] disabled:opacity-30 cursor-pointer"
                                >
                                  +
                                </button>
                                <span className="text-[10px] text-slate-500">tiết</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleMoveLessonToOtherGroup("second", lesson)}
                                className="p-1 text-slate-400 hover:text-blue-700 rounded bg-slate-100 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Chuyển sang Nửa đầu kỳ (30%)"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveLesson("second", lesson.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded bg-slate-100 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa bài"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {mode === "custom" ? (
              <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>
                  Đang dùng PPCT Tùy chỉnh ({selectedFirstCount + selectedSecondCount} bài, {totalFirstPeriods + totalSecondPeriods} tiết)
                </span>
              </span>
            ) : (
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Áp dụng phân bổ chuẩn GDPT 2018 (SGK Kết nối tri thức)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng cấu hình này</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: BROWSE CATALOG FROM TEXTBOOK APPENDIX */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-300" />
                <div>
                  <h4 className="text-sm font-bold">Phụ lục Toàn bộ bài học SGK {subject} {grade}</h4>
                  <p className="text-xs text-blue-200">Chọn bài bất kỳ để đưa vào {catalogTargetGroup === "first" ? (isCuoiKy ? "Nửa đầu kỳ (30%)" : "Bài kiểm tra Giữa kỳ") : "Nửa sau kỳ (70%)"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Tìm kiếm bài theo số bài, tên bài, chương..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              {isCuoiKy && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-500 font-medium">Đích đến:</span>
                  <select
                    value={catalogTargetGroup}
                    onChange={(e) => setCatalogTargetGroup(e.target.value as any)}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-blue-900 outline-none"
                  >
                    <option value="first">Nửa đầu kỳ (30%)</option>
                    <option value="second">Nửa sau kỳ (70%)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Catalog Lesson List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4 max-h-[60vh]">
              {catalogTopics.map((topic) => {
                const filteredLessons = (topic.lessons || []).filter(l => {
                  if (!catalogSearch.trim()) return true;
                  const q = catalogSearch.toLowerCase();
                  return l.name.toLowerCase().includes(q) || topic.topicName.toLowerCase().includes(q);
                });

                if (filteredLessons.length === 0) return null;

                return (
                  <div key={topic.topicId || topic.topicName} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>{topic.topicName}</span>
                      <span className="text-[10.5px] text-slate-500 font-normal">{filteredLessons.length} bài</span>
                    </div>

                    <div className="divide-y divide-slate-100 p-1">
                      {filteredLessons.map((lesson) => {
                        const inFirst = firstHalf.some(l => l.name === lesson.name);
                        const inSecond = secondHalf.some(l => l.name === lesson.name);

                        return (
                          <div key={lesson.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-blue-50/40 rounded-lg transition-colors">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800">{lesson.name}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {lesson.learningOutcomes?.recognition?.[0] || lesson.keyConcepts?.join(", ") || "Chuẩn GDPT 2018"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {lesson.periods || 2} tiết
                              </span>

                              {!isCuoiKy ? (
                                <button
                                  type="button"
                                  onClick={() => handleAddLessonFromCatalog(lesson, "first", lesson.periods || 2)}
                                  disabled={inFirst}
                                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    inFirst
                                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                                >
                                  {inFirst ? "Đã có" : "➕ Thêm vào"}
                                </button>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAddLessonFromCatalog(lesson, "first", lesson.periods || 2)}
                                    disabled={inFirst}
                                    className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                                      inFirst
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                    title="Thêm vào Nửa đầu kỳ"
                                  >
                                    {inFirst ? "✓ Nửa đầu" : "+ Nửa đầu"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleAddLessonFromCatalog(lesson, "second", lesson.periods || 2)}
                                    disabled={inSecond}
                                    className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                                      inSecond
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    }`}
                                    title="Thêm vào Nửa sau kỳ"
                                  >
                                    {inSecond ? "✓ Nửa sau" : "+ Nửa sau"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CUSTOM TYPED LESSON */}
      {showCustomLessonModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Tự thêm bài học / Chuyên đề tùy chỉnh</span>
              </h4>
              <button onClick={() => setShowCustomLessonModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Tên bài học hoặc chuyên đề:</label>
                <input
                  type="text"
                  value={customLessonName}
                  onChange={(e) => setCustomLessonName(e.target.value)}
                  placeholder="Ví dụ: Ôn tập chương I và hình học thực hành"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Tên chương / chủ đề (tùy chọn):</label>
                <input
                  type="text"
                  value={customLessonTopic}
                  onChange={(e) => setCustomLessonTopic(e.target.value)}
                  placeholder="Ví dụ: Chương I. Số tự nhiên hoặc Chuyên đề trường"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Số tiết dạy:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={customLessonPeriods}
                    onChange={(e) => setCustomLessonPeriods(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-bold text-blue-900"
                  />
                </div>

                {isCuoiKy && (
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Phân vào kỳ:</label>
                    <select
                      value={customLessonTargetGroup}
                      onChange={(e) => setCustomLessonTargetGroup(e.target.value as any)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                    >
                      <option value="first">Nửa đầu kỳ (30%)</option>
                      <option value="second">Nửa sau kỳ (70%)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomLessonModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateCustomLesson}
                disabled={!customLessonName.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Thêm bài vào danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SAVE PRESET PERMANENTLY */}
      {showSavePresetModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-800 text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-300" />
                <span>Lưu Phân phối chương trình vĩnh viễn</span>
              </h4>
              <button onClick={() => setShowSavePresetModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Đặt tên bản PPCT:</label>
                <input
                  type="text"
                  value={savePresetName}
                  onChange={(e) => setSavePresetName(e.target.value)}
                  placeholder="Ví dụ: PPCT Toán 7 - HK1 - THCS Chu Văn An"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-semibold text-slate-800"
                />
              </div>

              <div className="text-[11px] text-slate-600 bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1">
                <p className="font-bold text-emerald-900">Thông tin lưu trữ vĩnh viễn:</p>
                <p>• Môn học: <strong>{subject} {grade}</strong> ({period})</p>
                <p>• Số bài học đã chọn: <strong>{selectedFirstCount + selectedSecondCount} bài</strong></p>
                <p>• Tổng số tiết: <strong>{totalFirstPeriods + totalSecondPeriods} tiết</strong></p>
                <p className="text-emerald-700 pt-1">Bản PPCT này sẽ được lưu trữ vĩnh viễn trên tài khoản và máy chủ ứng dụng.</p>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSavePresetModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmSavePreset}
                disabled={!savePresetName.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Xác nhận Lưu vĩnh viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
