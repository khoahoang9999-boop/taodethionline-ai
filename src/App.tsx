/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { formatVietnameseError } from "./lib/error-formatter";
import { generateDocx } from "./lib/docx-generator";
import { exportStudyGuideToWord } from "./lib/docx-study-guide";
import { 
  FileText, 
  Loader2, 
  Download, 
  AlertCircle, 
  Upload, 
  X, 
  Building2, 
  Calendar,
  Layers,
  CheckCircle2, 
  ListOrdered, 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock,
  BookOpen, 
  ShieldCheck, 
  CheckCheck, 
  Sliders, 
  RotateCcw,
  Lock,
  Unlock,
  Settings,
  AlertTriangle,
  ArrowLeft,
  Home,
  User,
  Phone,
  KeyRound,
  LogOut,
  Users,
  Edit3,
  Pencil
} from "lucide-react";
import MatrixView from "./components/MatrixView";
import SpecificationView from "./components/SpecificationView";
import ExamPaperView from "./components/ExamPaperView";
import AnswerKeyView from "./components/AnswerKeyView";
import QuestionEditModal from "./components/QuestionEditModal";
import ScopeConfigModal, { ScopeConfigData, getDefaultScopeForPeriod } from "./components/ScopeConfigModal";
import ConfigTab from "./components/ConfigTab";
import ExamWorkspace from "./components/ExamWorkspace";
import AccountManagementTab from "./components/AccountManagementTab";
import { StudyGuideTab } from "./components/StudyGuideTab";
import LoginModal from "./components/LoginModal";
import ApiKeyModal, { ApiKeyItem } from "./components/ApiKeyModal";
import UserProfileModal from "./components/UserProfileModal";
import UserAvatarDropdown from "./components/UserAvatarDropdown";
import { getDeviceId } from "./lib/device-id";
import { clientVerify, clientAdminUpdateKeys } from "./lib/client-auth";
import { AppLogo } from "./components/AppLogo";
import { TEXTBOOK_GRADE_6, TEXTBOOK_GRADE_7, TEXTBOOK_GRADE_8, TEXTBOOK_GRADE_9 } from "./data/textbooks";
import { ALL_MATH_TEXTBOOKS } from "./data/math";

export default function App() {
  // Main Workflow Tabs: "config" | "study-guide" | "generate" | "accounts"
  const [mainTab, setMainTab] = useState<"config" | "study-guide" | "generate" | "accounts">("config");
  const [isConfigSaved, setIsConfigSaved] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // User Auth & Protected Download Guard State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("khaothi_account_data");
      if (raw) return JSON.parse(raw);
      const savedCode = localStorage.getItem("khaothi_account_code");
      if (savedCode) {
        const normalized = savedCode.trim().toUpperCase();
        return {
          id: normalized,
          customerName: normalized === "ADMIN123" ? "Admin Master" : `Tài khoản (${normalized})`,
          expiryDate: "2099-12-31",
          maxDevices: normalized === "1111" ? 8 : 2,
          devices: [],
          status: "active"
        };
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<{ name: string; fn: () => void } | null>(null);

  // User API Keys State (supports multiple Keys for failover)
  const [userApiKeys, setUserApiKeys] = useState<ApiKeyItem[]>(() => {
    try {
      const raw = localStorage.getItem("khaothi_user_api_keys");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const savedInitialConfig = (() => {
    try {
      const raw = localStorage.getItem("khaothi_last_saved_config");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();

  const [departmentName, setDepartmentName] = useState(() => {
    return savedInitialConfig?.departmentName || localStorage.getItem("khaothi_department_name") || "XÃ HÀM YÊN";
  });
  const [schoolName, setSchoolName] = useState(() => savedInitialConfig?.schoolName || "TRƯỜNG THCS TÂN LOAN");
  const [examTime, setExamTime] = useState(() => savedInitialConfig?.examTime || "45 phút");
  const [schoolYear, setSchoolYear] = useState(() => savedInitialConfig?.schoolYear || "2026 - 2027");
  const [subject, setSubject] = useState(() => savedInitialConfig?.subject || "Tin học");
  const [grade, setGrade] = useState(() => savedInitialConfig?.grade || "6");
  const [period, setPeriod] = useState(() => savedInitialConfig?.period || "Giữa học kỳ I");
  const [examFormat, setExamFormat] = useState(() => savedInitialConfig?.examFormat || "Tự luận");

  // Approval Signature States
  const [examDateLocation, setExamDateLocation] = useState(() => {
    return savedInitialConfig?.examDateLocation || localStorage.getItem("khaothi_exam_date_location") || "Hàm Yên, ngày 10 tháng 02 năm 2026";
  });
  const [bghName, setBghName] = useState(() => {
    return savedInitialConfig?.bghName || localStorage.getItem("khaothi_bgh_name") || "Lê Thị Phương Trình";
  });
  const [teacherHeadName, setTeacherHeadName] = useState(() => {
    return savedInitialConfig?.teacherHeadName || localStorage.getItem("khaothi_teacher_head_name") || "Hoàng Hương Giang";
  });
  const [creatorName, setCreatorName] = useState(() => {
    return savedInitialConfig?.creatorName || localStorage.getItem("khaothi_creator_name") || "Hoàng Văn Đình Khoa";
  });
  const [bghSignature, setBghSignature] = useState<string | null>(() => {
    return savedInitialConfig?.bghSignature || localStorage.getItem("khaothi_bgh_signature") || null;
  });
  const [teacherHeadSignature, setTeacherHeadSignature] = useState<string | null>(() => {
    return savedInitialConfig?.teacherHeadSignature || localStorage.getItem("khaothi_teacher_head_signature") || null;
  });
  const [creatorSignature, setCreatorSignature] = useState<string | null>(() => {
    return savedInitialConfig?.creatorSignature || localStorage.getItem("khaothi_creator_signature") || null;
  });

  const [referenceFiles, setReferenceFiles] = useState<{ base64: string; mimeType: string; name: string }[]>([]);

  // Manual Scope Configuration State
  const [scopeConfig, setScopeConfig] = useState<ScopeConfigData>(() => {
    if (savedInitialConfig?.scopeConfig) {
      return savedInitialConfig.scopeConfig;
    }
    return getDefaultScopeForPeriod("Tin học", "6", "Giữa học kỳ I");
  });
  const [showScopeModal, setShowScopeModal] = useState<boolean>(false);
  
  // Multi-exam codes state
  const [examCount, setExamCount] = useState<number>(2);
  const [variantCodes, setVariantCodes] = useState<string[]>(["101", "102"]);
  const [activeVariantCode, setActiveVariantCode] = useState<string>("101");
  const [generatingVariantCode, setGeneratingVariantCode] = useState<string | null>(null);
  const [isSequentialGenerating, setIsSequentialGenerating] = useState(false);
  const [sequentialProgress, setSequentialProgress] = useState<{ current: number; total: number; code: string } | null>(null);
  const [isCustomCodesMode, setIsCustomCodesMode] = useState(false);
  const [rawCodesInput, setRawCodesInput] = useState("101, 102");

  const [activeTab, setActiveTab] = useState<"all" | "matrix" | "spec" | "exam" | "answers">("all");
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const [isGeneratingStudyGuide, setIsGeneratingStudyGuide] = useState(false);
  const [testData, setTestData] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPauseRef = useRef<boolean>(false);

  // Question editing & AI regeneration modal state
  const [editingQuestion, setEditingQuestion] = useState<{
    isOpen: boolean;
    questionId: number;
    questionType: "mcq" | "tf" | "applied" | "shortAnswer";
    questionData: any;
    variantCode: string;
  } | null>(null);

  // Official SGK Viewer modal state
  const [showTextbookModal, setShowTextbookModal] = useState<boolean>(false);
  const [selectedSgkGrade, setSelectedSgkGrade] = useState<string>("6");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser?.id?.trim().toUpperCase() === "TK-KHOA-2026" ||
    currentUser?.id?.trim().toUpperCase() === "ADMIN123" ||
    currentUser?.notes?.toLowerCase()?.includes("admin") ||
    currentUser?.customerName?.toLowerCase()?.includes("admin");

  // Sync userApiKeys with currentUser or local storage & clear key errors for Admin
  React.useEffect(() => {
    if (currentUser?.apiKeys && Array.isArray(currentUser.apiKeys) && currentUser.apiKeys.length > 0) {
      setUserApiKeys(currentUser.apiKeys);
      localStorage.setItem("khaothi_user_api_keys", JSON.stringify(currentUser.apiKeys));
    }
    // Admin account uses 3-mode keys automatically, immediately clear any key prompt status
    if (isAdmin) {
      setError("");
      setIsApiKeyModalOpen(false);
    }
  }, [currentUser, isAdmin]);

  // Auto-verify saved session on mount
  React.useEffect(() => {
    const savedCode = localStorage.getItem("khaothi_account_code");
    if (savedCode) {
      const devId = getDeviceId();
      clientVerify(savedCode, devId)
        .then((data) => {
          if (data && data.success && data.account) {
            setCurrentUser(data.account);
            localStorage.setItem("khaothi_account_data", JSON.stringify(data.account));
          } else {
            setCurrentUser(null);
            localStorage.removeItem("khaothi_account_code");
            localStorage.removeItem("khaothi_account_data");
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("khaothi_account_code");
    localStorage.removeItem("khaothi_account_data");
  };

  const executeProtectedDownload = async (actionName: string, downloadFn: () => void) => {
    const savedCode = localStorage.getItem("khaothi_account_code");
    if (savedCode) {
      const devId = getDeviceId();
      try {
        const data = await clientVerify(savedCode, devId);
        if (data && data.success && data.account) {
          setCurrentUser(data.account);
          localStorage.setItem("khaothi_account_data", JSON.stringify(data.account));
          downloadFn();
          return;
        } else {
          setCurrentUser(null);
          localStorage.removeItem("khaothi_account_code");
          localStorage.removeItem("khaothi_account_data");
          console.log(data?.error || "Tài khoản của bạn đã bị xóa hoặc không còn hiệu lực. Trừ khi Admin tạo lại.");
          setPendingDownloadAction({ name: actionName, fn: downloadFn });
          setIsLoginModalOpen(true);
          return;
        }
      } catch {
        if (currentUser) {
          downloadFn();
          return;
        }
      }
    }
    setPendingDownloadAction({ name: actionName, fn: downloadFn });
    setIsLoginModalOpen(true);
  };

  const pauseGeneration = () => {
    isPauseRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const cancelGeneration = () => {
    isPauseRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Sync answer handlers across the whole application
  const handleUpdateMcqAnswer = (questionId: number, newAnswer: string) => {
    setTestData((prev: any) => {
      if (!prev) return prev;
      const updatedVariants = (prev.examVariants || []).map((variant: any) => {
        if (variant.code === activeVariantCode) {
          const updatedMcq = (variant.mcq || []).map((q: any) => {
            if (q.id === questionId) {
              return { ...q, correctAnswer: newAnswer };
            }
            return q;
          });
          return { ...variant, mcq: updatedMcq };
        }
        return variant;
      });

      const updatedRootMcq = (prev.mcq || []).map((q: any) => {
        if (q.id === questionId && (activeVariantCode === prev.code || activeVariantCode === prev.examVariants?.[0]?.code)) {
          return { ...q, correctAnswer: newAnswer };
        }
        return q;
      });

      return {
        ...prev,
        mcq: updatedRootMcq,
        examVariants: updatedVariants,
      };
    });
  };

  const handleToggleTfStatement = (questionId: number, statementId: string) => {
    setTestData((prev: any) => {
      if (!prev) return prev;
      const updatedVariants = (prev.examVariants || []).map((variant: any) => {
        if (variant.code === activeVariantCode) {
          const updatedTf = (variant.tf || []).map((q: any) => {
            if (q.id === questionId) {
              const updatedStatements = (q.statements || []).map((st: any) => {
                if (st.id === statementId) {
                  return { ...st, isTrue: !st.isTrue };
                }
                return st;
              });
              return { ...q, statements: updatedStatements };
            }
            return q;
          });
          return { ...variant, tf: updatedTf };
        }
        return variant;
      });

      const updatedRootTf = (prev.tf || []).map((q: any) => {
        if (q.id === questionId && (activeVariantCode === prev.code || activeVariantCode === prev.examVariants?.[0]?.code)) {
          const updatedStatements = (q.statements || []).map((st: any) => {
            if (st.id === statementId) {
              return { ...st, isTrue: !st.isTrue };
            }
            return st;
          });
          return { ...q, statements: updatedStatements };
        }
        return q;
      });

      return {
        ...prev,
        tf: updatedRootTf,
        examVariants: updatedVariants,
      };
    });
  };

  const handleOpenQuestionEditor = (questionId: number, questionType: "mcq" | "tf" | "applied" | "shortAnswer", questionData: any) => {
    setEditingQuestion({
      isOpen: true,
      questionId,
      questionType,
      questionData,
      variantCode: activeVariantCode,
    });
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    if (!editingQuestion) return;
    const { questionId, questionType, variantCode } = editingQuestion;

    setTestData((prev: any) => {
      if (!prev) return prev;
      const updatedVariants = (prev.examVariants || []).map((variant: any) => {
        if (variant.code === variantCode) {
          let updatedMcq = variant.mcq;
          let updatedTf = variant.tf;
          let updatedApplied = variant.applied;

          if (questionType === "mcq") {
            updatedMcq = (variant.mcq || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
          } else if (questionType === "tf") {
            updatedTf = (variant.tf || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
          } else if (questionType === "applied") {
            updatedApplied = (variant.applied || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
          }

          return {
            ...variant,
            mcq: updatedMcq,
            tf: updatedTf,
            applied: updatedApplied,
          };
        }
        return variant;
      });

      let updatedRootMcq = prev.mcq;
      let updatedRootTf = prev.tf;
      let updatedRootApplied = prev.applied;
      let updatedRootShortAnswer = prev.shortAnswer;

      if (variantCode === (prev.code || prev.examVariants?.[0]?.code)) {
        if (questionType === "mcq") {
          updatedRootMcq = (prev.mcq || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
        } else if (questionType === "tf") {
          updatedRootTf = (prev.tf || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
        } else if (questionType === "applied") {
          updatedRootApplied = (prev.applied || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
        } else if (questionType === "shortAnswer") {
          updatedRootShortAnswer = (prev.shortAnswer || []).map((q: any) => (q.id === questionId ? updatedQuestion : q));
        }
      }

      return {
        ...prev,
        mcq: updatedRootMcq,
        tf: updatedRootTf,
        shortAnswer: updatedRootShortAnswer,
        applied: updatedRootApplied,
        examVariants: updatedVariants,
      };
    });
  };

  const handleExamCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(20, Math.floor(count) || 1));
    setExamCount(validCount);
    let newCodes: string[] = [];
    if (validCount <= variantCodes.length) {
      newCodes = variantCodes.slice(0, validCount);
    } else {
      const existing = [...variantCodes];
      while (existing.length < validCount) {
        const nextNum = existing.length > 0 ? Math.max(...existing.map(c => Number(c) || 100)) + 1 : 101;
        existing.push(String(nextNum));
      }
      newCodes = existing;
    }
    setVariantCodes(newCodes);
    setRawCodesInput(newCodes.join(", "));
    if (!newCodes.includes(activeVariantCode)) {
      setActiveVariantCode(newCodes[0]);
    }
  };

  const handleAddVariantCode = () => {
    const nextCodeNum = variantCodes.length > 0 ? Math.max(...variantCodes.map(c => Number(c) || 100)) + 1 : 101;
    const nextCode = String(nextCodeNum);
    const updated = [...variantCodes, nextCode];
    setVariantCodes(updated);
    setExamCount(updated.length);
    setRawCodesInput(updated.join(", "));
    setActiveVariantCode(nextCode);
  };

  const handleRemoveVariantCode = (index: number) => {
    if (variantCodes.length <= 1) return;
    const removedCode = variantCodes[index];
    const updated = variantCodes.filter((_, i) => i !== index);
    setVariantCodes(updated);
    setExamCount(updated.length);
    setRawCodesInput(updated.join(", "));
    if (activeVariantCode === removedCode) {
      setActiveVariantCode(updated[0]);
    }
  };

  const handleUpdateSingleCode = (index: number, newCode: string) => {
    const trimmed = newCode.trim();
    if (!trimmed) return;
    const oldCode = variantCodes[index];
    const updated = [...variantCodes];
    updated[index] = trimmed;
    setVariantCodes(updated);
    setRawCodesInput(updated.join(", "));
    if (activeVariantCode === oldCode) {
      setActiveVariantCode(trimmed);
    }
  };

  const handleApplyRawCodesInput = (text: string) => {
    setRawCodesInput(text);
    const parts = text
      .split(/[,\s]+/)
      .map(c => c.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      // deduplicate while preserving order
      const uniqueCodes = Array.from(new Set(parts));
      setVariantCodes(uniqueCodes);
      setExamCount(uniqueCodes.length);
      if (!uniqueCodes.includes(activeVariantCode)) {
        setActiveVariantCode(uniqueCodes[0]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file: File) => {
      // 50MB limit per file
      if (file.size > 50 * 1024 * 1024) {
         setError(`File ${file.name} quá lớn. Vui lòng tải lên file nhỏ hơn 50MB.`);
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setReferenceFiles(prev => [...prev, { base64, mimeType: file.type || "application/octet-stream", name: file.name }]);
      };
      reader.readAsArrayBuffer(file);
    });
    
    // Clear input so same file can be uploaded again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
    setIsConfigSaved(false);
  };

  // Save Config handler for Tab 1
  const handleSaveConfig = () => {
    if (!schoolName.trim()) {
      setError("Vui lòng nhập tên trường THCS!");
      return;
    }
    if (!schoolYear.trim()) {
      setError("Vui lòng nhập năm học!");
      return;
    }
    setError("");
    setIsConfigSaved(true);

    try {
      localStorage.setItem("khaothi_department_name", departmentName);
      localStorage.setItem("khaothi_exam_date_location", examDateLocation);
      localStorage.setItem("khaothi_bgh_name", bghName);
      localStorage.setItem("khaothi_teacher_head_name", teacherHeadName);
      localStorage.setItem("khaothi_creator_name", creatorName);
      if (bghSignature) localStorage.setItem("khaothi_bgh_signature", bghSignature);
      else localStorage.removeItem("khaothi_bgh_signature");
      if (teacherHeadSignature) localStorage.setItem("khaothi_teacher_head_signature", teacherHeadSignature);
      else localStorage.removeItem("khaothi_teacher_head_signature");
      if (creatorSignature) localStorage.setItem("khaothi_creator_signature", creatorSignature);
      else localStorage.removeItem("khaothi_creator_signature");

      localStorage.setItem("khaothi_last_saved_config", JSON.stringify({
        subject,
        grade,
        period,
        examFormat,
        schoolName,
        examTime,
        departmentName,
        schoolYear,
        scopeConfig,
        examDateLocation,
        bghName,
        teacherHeadName,
        creatorName,
        bghSignature,
        teacherHeadSignature,
        creatorSignature
      }));
    } catch {}

    setSaveToast(`✓ Đã lưu cấu hình bài kiểm tra ${subject} ${grade} (${period}) thành công! Đang chuyển sang Tab Tạo đề...`);
    
    setTimeout(() => {
      setMainTab("generate");
    }, 400);

    setTimeout(() => {
      setSaveToast(null);
    }, 4500);
  };

  // Step 1 & 2: Generate Matrix and Specification separately
  const handleGenerate = async () => {
    if (!isConfigSaved) {
      setError("Cấu hình chưa được lưu. Vui lòng chuyển sang mục Cấu hình và nhấn 'Lưu cấu hình & Chuyển sang Tạo đề' để tiếp tục.");
      return;
    }
    setIsLoading(true);
    setError("");
    setTestData(null);

    const firstCode = variantCodes[0] || "101";
    setActiveVariantCode(firstCode);

    abortControllerRef.current = new AbortController();
    try {
      const payload = {
        subject, 
        grade, 
        period, 
        examFormat, 
        examCode: firstCode,
        schoolName: schoolName.trim() || "TRƯỜNG THCS TÂN LOAN", 
        examTime: examTime.trim() || "45 phút",
        schoolYear: schoolYear.trim() || "2026 - 2027", 
        referenceFiles,
        scopeConfig,
        userApiKeys,
        userCode: currentUser?.id
      };

      // BƯỚC 1: Khởi tạo Khung ma trận
      setGenerationStep(1);
      setLoadingMessage("Bước 1/4: Đang lập Khung ma trận kiểm tra chuẩn Bộ GD&ĐT...");

      const matrixRes = await fetch("/api/generate-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current?.signal,
      });

      const matrixText = await matrixRes.text();
      let matrixData: any = null;
      try {
        matrixData = JSON.parse(matrixText);
      } catch {
        if (matrixText.includes("FUNCTION_INVOCATION_FAILED") || matrixText.includes("server error") || matrixText.includes("timeout") || matrixText.includes("Timeout")) {
          throw new Error("Lỗi phản hồi máy chủ: Thời gian xử lý ma trận của AI vượt quá giới hạn phản hồi của hệ thống. Vui lòng thử lại hoặc giảm bớt số lượng bài học cần kiểm tra.");
        }
        if (matrixText.includes("<!doctype html") || matrixText.includes("<html")) {
          throw new Error("Hệ thống máy chủ hoặc AI đang bận trong giây lát. Vui lòng thử lại.");
        }
        throw new Error("Lỗi phản hồi dữ liệu Khung ma trận từ hệ thống. Vui lòng thử lại.");
      }

      if (!matrixRes.ok || matrixData?.error) {
        let errMsg = matrixData?.error || "Không thể khởi tạo Khung ma trận";
        if (typeof errMsg === "string") {
          try {
            const parsed = JSON.parse(errMsg);
            errMsg = parsed?.error?.message || parsed?.message || errMsg;
          } catch {
            // keep string
          }
        }
        if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
          errMsg = "Mô hình AI đang có lưu lượng truy cập cao. Vui lòng thử lại ngay.";
        }
        throw new Error(errMsg);
      }

      // BƯỚC 2: Khởi tạo Bảng đặc tả dựa trên Khung ma trận
      setGenerationStep(2);
      setLoadingMessage("Bước 2/4: Đang lập Bảng đặc tả 3 mức độ tư duy chi tiết...");

      const specRes = await fetch("/api/generate-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, matrix: matrixData.matrix }),
        signal: abortControllerRef.current?.signal,
      });

      const specText = await specRes.text();
      let specData: any = null;
      try {
        specData = JSON.parse(specText);
      } catch {
        if (specText.includes("FUNCTION_INVOCATION_FAILED") || specText.includes("server error") || specText.includes("timeout") || specText.includes("Timeout")) {
          throw new Error("Lỗi phản hồi máy chủ: Thời gian xử lý bảng đặc tả của AI vượt quá giới hạn phản hồi của hệ thống. Vui lòng thử lại hoặc giảm bớt số lượng bài học cần kiểm tra.");
        }
        if (specText.includes("<!doctype html") || specText.includes("<html")) {
          throw new Error("Hệ thống máy chủ hoặc AI đang bận trong giây lát. Vui lòng thử lại.");
        }
        throw new Error("Lỗi phản hồi dữ liệu Bảng đặc tả từ hệ thống. Vui lòng thử lại.");
      }

      if (!specRes.ok || specData?.error) {
        let errMsg = specData?.error || "Không thể khởi tạo Bảng đặc tả";
        if (typeof errMsg === "string") {
          try {
            const parsed = JSON.parse(errMsg);
            errMsg = parsed?.error?.message || parsed?.message || errMsg;
          } catch {
            // keep string
          }
        }
        if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
          errMsg = "Mô hình AI đang có lưu lượng truy cập cao. Vui lòng thử lại ngay.";
        }
        throw new Error(errMsg);
      }

      const combinedData = {
        ...matrixData,
        specification: specData.specification || [],
        departmentName: departmentName.trim() || "XÃ HÀM YÊN",
        schoolName: schoolName.trim() || "TRƯỜNG THCS TÂN LOAN",
        time: examTime.trim() || "45 phút",
        schoolYear: schoolYear.trim() || "2026 - 2027",
        code: firstCode,
        examVariants: []
      };

      setTestData(combinedData);

      // BƯỚC 3 & 4: Biên soạn Đề kiểm tra & Đáp án theo từng phần
      setLoadingMessage(`Bước 3 & 4/4: Đang biên soạn Đề kiểm tra (Mã ${firstCode}) cùng Đáp án & Hướng dẫn chấm...`);
      await handleGenerateSingleVariant(firstCode, combinedData);
      setActiveTab("all");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError(isPauseRef.current ? "Đã tạm dừng tiến trình tạo đề." : "Tiến trình tạo đề đã bị hủy.");
      } else {
        setError(formatVietnameseError(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a single variant code using the existing matrix and specification part-by-part
  const handleGenerateSingleVariant = async (codeToGen: string, customBaseData?: any): Promise<boolean> => {
    const activeData = customBaseData || testData;
    if (!activeData || !activeData.matrix || !activeData.specification) {
      setError("Vui lòng tạo Khung ma trận và Bảng đặc tả trước.");
      return false;
    }

    setGeneratingVariantCode(codeToGen);
    setGenerationStep(3);
    setError("");

    const isMath = subject.toLowerCase().trim().includes("toán");
    const basePayload = {
      subject,
      grade: grade || activeData.grade,
      period: period || activeData.period,
      examFormat: examFormat || activeData.examFormat,
      schoolName: schoolName.trim() || activeData.schoolName || "TRƯỜNG THCS TÂN LOAN",
      examTime: examTime.trim() || activeData.time || "45 phút",
      schoolYear: schoolYear.trim() || activeData.schoolYear || "2026 - 2027",
      matrix: activeData.matrix,
      specification: activeData.specification,
      examCode: codeToGen,
      referenceFiles,
      userApiKeys,
      userCode: currentUser?.id
    };

    abortControllerRef.current = new AbortController();
    try {
      const parseSafeResponse = async (res: Response, defaultErrMsg: string) => {
        const text = await res.text();
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          if (text.includes("<!doctype html") || text.includes("<html")) {
            throw new Error("Hệ thống máy chủ tạm thời bị ngắt kết nối. Vui lòng bấm thử lại.");
          }
          if (text && text.length < 300 && !text.includes("{")) {
            throw new Error(text);
          }
          throw new Error(`${defaultErrMsg}: Dữ liệu AI trả về không đúng định dạng.`);
        }

        if (!res.ok || data?.error) {
          let errMsg = data?.error || defaultErrMsg;
          if (typeof errMsg === "object") {
            errMsg = errMsg.message || JSON.stringify(errMsg);
          }
          if (typeof errMsg === "string" && (errMsg.includes("503") || errMsg.includes("UNAVAILABLE"))) {
            errMsg = "Mô hình AI đang quá tải lượt truy cập. Vui lòng bấm 'Thử lại' trong giây lát.";
          }
          throw new Error(errMsg);
        }

        return data;
      };

      // Step 1: Part 1 - MCQ (12 câu)
      setLoadingMessage(`Đang biên soạn Mã đề ${codeToGen} — Phần 1: Trắc nghiệm 12 câu...`);
      const res1 = await fetch("/api/generate-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basePayload, part: "part1" }),
        signal: abortControllerRef.current?.signal,
      });
      const data1 = await parseSafeResponse(res1, `Lỗi tạo Phần 1 cho Mã đề ${codeToGen}`);

      // Step 2: Part 2 - TF
      setLoadingMessage(`Đang biên soạn Mã đề ${codeToGen} — Phần 2: Trắc nghiệm đúng - sai...`);
      const res2 = await fetch("/api/generate-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basePayload, part: "part2" }),
        signal: abortControllerRef.current?.signal,
      });
      const data2 = await parseSafeResponse(res2, `Lỗi tạo Phần 2 cho Mã đề ${codeToGen}`);

      // Step 3: Part 3 - Short Answer (chỉ áp dụng cho môn Toán)
      let data3 = { shortAnswer: [] };
      if (isMath) {
        setLoadingMessage(`Đang biên soạn Mã đề ${codeToGen} — Phần 3: Trắc nghiệm trả lời ngắn...`);
        const res3 = await fetch("/api/generate-variant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, part: "part3" }),
          signal: abortControllerRef.current?.signal,
        });
        data3 = await parseSafeResponse(res3, `Lỗi tạo Phần 3 cho Mã đề ${codeToGen}`);
      }

      // Step 4: Part 4 - Applied / Tự luận
      setLoadingMessage(`Đang hoàn thiện Mã đề ${codeToGen} — Phần B: Tự luận & Hướng dẫn chấm...`);
      const res4 = await fetch("/api/generate-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basePayload, part: "part4" }),
        signal: abortControllerRef.current?.signal,
      });
      const data4 = await parseSafeResponse(res4, `Lỗi tạo Phần B cho Mã đề ${codeToGen}`);

      const newVariant = {
        code: codeToGen,
        title: `ĐỀ KIỂM TRA ${period.toUpperCase()} - MÔN ${subject.toUpperCase()} ${grade} - MÃ ĐỀ ${codeToGen}`,
        mcq: data1.mcq || [],
        tf: data2.tf || [],
        shortAnswer: data3.shortAnswer || [],
        applied: data4.applied || [],
      };

      setTestData((prev: any) => {
        if (!prev) return prev;
        const currentVariants = prev.examVariants ? [...prev.examVariants] : [];
        const existingIdx = currentVariants.findIndex((v: any) => v.code === codeToGen);
        if (existingIdx >= 0) {
          currentVariants[existingIdx] = newVariant;
        } else {
          currentVariants.push(newVariant);
        }
        return {
          ...prev,
          examVariants: currentVariants
        };
      });

      setActiveVariantCode(codeToGen);
      setGenerationStep(5);
      return true;
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError(isPauseRef.current ? "Đã tạm dừng tiến trình tạo đề." : "Tiến trình tạo đề đã bị hủy.");
      } else {
        setError(formatVietnameseError(err));
      }
      return false;
    } finally {
      setGeneratingVariantCode(null);
    }
  };

  // Sequential generation of all remaining codes one-by-one
  const handleSequentialGenerateAll = async () => {
    if (!testData) return;
    setIsSequentialGenerating(true);
    setError("");

    const currentVariants = testData.examVariants || [];
    const generatedCodes = new Set(currentVariants.map((v: any) => v.code));
    const pendingCodes = variantCodes.filter(c => !generatedCodes.has(c));

    if (pendingCodes.length === 0) {
      setIsSequentialGenerating(false);
      return;
    }

    for (let i = 0; i < pendingCodes.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }
      const code = pendingCodes[i];
      setSequentialProgress({ current: i + 1, total: pendingCodes.length, code });
      const success = await handleGenerateSingleVariant(code);
      if (!success) {
        // Stop on error so teacher can retry that specific code
        break;
      }
      // Small pause between variants for smooth UI and stability
      await new Promise(res => setTimeout(res, 600));
    }

    setIsSequentialGenerating(false);
    setSequentialProgress(null);
  };

  const handleDownloadAll = () => {
    executeProtectedDownload("Tải File Word Trọn bộ Mã đề", async () => {
      if (testData) {
        try {
          const dataToExport = {
            ...testData,
            subject: subject || testData.subject || "Tin học",
            grade: grade || testData.grade || "8",
            period: period || testData.period || "Giữa học kỳ I",
            examFormat: examFormat || testData.examFormat || "Tự luận",
            endContent: testData.endContent,
            departmentName: departmentName.trim() || "XÃ HÀM YÊN",
            schoolName: schoolName.trim() || "TRƯỜNG THCS TÂN LOAN",
            time: examTime.trim() || "45 phút",
            schoolYear: schoolYear.trim() || "2026 - 2027",
            examDateLocation,
            bghName,
            teacherHeadName,
            creatorName,
            bghSignature,
            teacherHeadSignature,
            creatorSignature,
          };
          await generateDocx(dataToExport);
        } catch (err: any) {
          setError(err?.message || "Lỗi khi xuất tệp Word.");
        }
      }
    });
  };

  const handleDownloadSingleVariant = (code: string) => {
    executeProtectedDownload(`Tải File Word Mã đề ${code}`, async () => {
      if (testData) {
        try {
          const dataToExport = {
            ...testData,
            grade: grade || testData.grade || "8",
            period: period || testData.period || "Giữa học kỳ I",
            examFormat: examFormat || testData.examFormat || "Tự luận",
            endContent: testData.endContent,
            departmentName: departmentName.trim() || "XÃ HÀM YÊN",
            schoolName: schoolName.trim() || "TRƯỜNG THCS TÂN LOAN",
            time: examTime.trim() || "45 phút",
            schoolYear: schoolYear.trim() || "2026 - 2027",
            examDateLocation,
            bghName,
            teacherHeadName,
            creatorName,
            bghSignature,
            teacherHeadSignature,
            creatorSignature,
          };
          await generateDocx(dataToExport, code);
        } catch (err: any) {
          setError(err?.message || `Lỗi khi xuất tệp Word mã đề ${code}.`);
        }
      }
    });
  };

  const handlePrint = () => {
    executeProtectedDownload("In / Lưu Dạng PDF Hồ sơ Khảo thí", () => {
      window.print();
    });
  };

  const handleGenerateStudyGuide = async () => {
    executeProtectedDownload("Tạo và Tải File Đề Cương Ôn Tập", async () => {
      if (!testData || !testData.matrix) {
        setError("Vui lòng tạo đề thi trước khi tạo đề cương ôn tập.");
        return;
      }

      setIsGeneratingStudyGuide(true);
      setError("");

      try {
        const response = await fetch("/api/generate-study-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            grade: grade || testData.grade,
            period: period || testData.period,
            examFormat: examFormat || testData.examFormat,
            schoolName: schoolName.trim() || testData.schoolName || "TRƯỜNG THCS TÂN LOAN",
          examTime: examTime.trim() || testData.time || "45 phút",
            departmentName: departmentName.trim() || testData.departmentName || "XÃ HÀM YÊN",
            schoolYear: schoolYear.trim() || testData.schoolYear || "2026 - 2027",
            matrix: testData.matrix,
            specification: testData.specification,
            currentVariant: testData.examVariants?.[0] || testData,
            referenceFiles,
            userApiKeys,
            userCode: currentUser?.id
          })
        });

        const responseText = await response.text();
        let studyGuideData: any = null;
        try {
          studyGuideData = JSON.parse(responseText);
        } catch {
          if (responseText.includes("FUNCTION_INVOCATION_FAILED") || responseText.includes("server error") || responseText.includes("timeout") || responseText.includes("Timeout")) {
            throw new Error("Lỗi phản hồi: Thời gian xử lý của AI vượt quá giới hạn phản hồi tối đa của hệ thống. Vui lòng thử lại hoặc giảm bớt số câu hỏi cần tạo.");
          }
          throw new Error("Lỗi phản hồi: Hệ thống máy chủ đang bận hoặc gián đoạn kết nối. Vui lòng kiểm tra lại sau giây lát.");
        }

        if (!response.ok || studyGuideData?.error) {
          throw new Error(studyGuideData?.error || "Không thể tạo Đề cương ôn tập.");
        }

        await exportStudyGuideToWord(studyGuideData);
      } catch (err: any) {
        setError(err?.message || "Lỗi khi tạo và xuất Đề cương ôn tập.");
      } finally {
        setIsGeneratingStudyGuide(false);
      }
    });
  };

  // Helper to get active variant data
  const getActiveVariant = () => {
    if (!testData) return null;
    const variants = testData.examVariants || [];
    const found = variants.find((v: any) => v.code === activeVariantCode);
    if (found) return found;
    if (variants.length > 0) return variants[0];
    return {
      code: activeVariantCode || "101",
      title: testData.title,
      mcq: testData.mcq || [],
      tf: testData.tf || [],
      shortAnswer: testData.shortAnswer || [],
      applied: testData.applied || []
    };
  };

  const currentVariant = getActiveVariant();
  const isCurrentVariantGenerated = testData?.examVariants?.some((v: any) => v.code === activeVariantCode);

  return (
    <div className="h-screen min-h-screen bg-[#f1f5f9] font-sans flex flex-col overflow-hidden text-slate-800">
      {/* Header Navigation - Sticky/Fixed at top in a single unified compact row */}
      <header className="bg-[#0f172a] text-white shadow-md shrink-0 border-b border-slate-700 sticky top-0 z-50">
        <div className="px-3 sm:px-5 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5">
          {/* 1. Left: Brand & Info */}
          <div className="flex items-center gap-2.5 shrink-0">
            <AppLogo size={28} />
            <div>
              <h1 className="text-xs sm:text-sm font-bold leading-tight uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                Chuyên Gia Khảo Thí AI
                <span className="text-[9.5px] bg-blue-500/30 text-blue-300 font-semibold px-1.5 py-0.2 rounded border border-blue-400/30">
                  GDPT 2018
                </span>
              </h1>
              <div className="hidden sm:flex flex-wrap items-center gap-x-2 text-[10.5px] text-slate-300">
                <span><span className="text-slate-400">Tác giả:</span> <strong className="text-slate-200 font-semibold">Hoàng Văn Đình Khoa</strong></span>
                <span className="text-slate-500">•</span>
                <a href="tel:0989982818" className="text-emerald-400 hover:underline hover:text-emerald-300 transition-colors inline-flex items-center gap-1 font-medium">
                  <span>ĐT:</span> <strong>0989.982.818</strong>
                </a>
                <span className="text-slate-500">•</span>
                <a href="https://zalo.me/0978468986" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline hover:text-sky-300 transition-colors inline-flex items-center gap-1 font-medium">
                  <span>Zalo:</span> <strong>0978.468.986</strong>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Center: Navigation Tabs (Integrated into header) */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner order-3 lg:order-2 mx-auto lg:mx-0">
            <button
              type="button"
              onClick={() => setMainTab("config")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mainTab === "config"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Cấu hình</span>
              {isConfigSaved ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đã lưu cấu hình"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Chưa lưu cấu hình"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMainTab("generate")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mainTab === "generate"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tạo đề & Hồ sơ</span>
              {!isConfigSaved ? (
                <span className="text-[9px] bg-slate-900/80 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  Khóa
                </span>
              ) : testData ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đã tạo hồ sơ"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-400" title="Sẵn sàng tạo đề"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMainTab("study-guide")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mainTab === "study-guide"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đề cương ôn tập</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setMainTab("accounts")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mainTab === "accounts"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-300" />
                <span>Quản trị TK</span>
              </button>
            )}
          </div>

          {/* 3. Right: Export Actions, API Key Button & User Profile Dropdown */}
          <div className="flex items-center gap-2 shrink-0 order-2 lg:order-3 ml-auto lg:ml-0">
            {/* Export buttons when inside generate tab */}
            {mainTab === "generate" && testData && !isLoading && (
              <div className="flex items-center gap-1.5">
                {variantCodes.length > 1 && (
                  <button
                    onClick={() => handleDownloadSingleVariant(activeVariantCode)}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 text-blue-200 border border-slate-600 shadow-xs cursor-pointer"
                    title={`Xuất riêng file Word cho Mã đề ${activeVariantCode}`}
                  >
                    <Download className="w-3 h-3" />
                    <span>Mã {activeVariantCode}</span>
                  </button>
                )}

                <button
                  onClick={handleGenerateStudyGuide}
                  disabled={isGeneratingStudyGuide}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 text-white shadow hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Tạo Đề cương ôn tập cho học sinh dựa trên cấu trúc đề"
                >
                  {isGeneratingStudyGuide ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isGeneratingStudyGuide ? "Đang tạo..." : "Tạo Đề cương"}</span>
                </button>

                <button
                  onClick={handleDownloadAll}
                  className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 text-white shadow hover:shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {testData.examVariants && testData.examVariants.length > 1
                      ? `Xuất toàn bộ (${testData.examVariants.length} Mã)`
                      : "Xuất Word"}
                  </span>
                </button>
              </div>
            )}

            {/* API Key Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/40 shadow-xs"
              title="Quản lý danh sách Gemini API Key"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">API Key</span>
              {userApiKeys.length > 0 ? (
                <span className="bg-amber-500/30 text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full border border-amber-400/40 font-extrabold">
                  {userApiKeys.length} Key
                </span>
              ) : (
                <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full">
                  Thêm +
                </span>
              )}
            </button>

            {/* User Avatar & Dropdown Menu */}
            <UserAvatarDropdown
              currentUser={currentUser}
              isAdmin={isAdmin}
              userApiKeysCount={userApiKeys.length}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenApiKey={() => setIsApiKeyModalOpen(true)}
              onOpenAdminTab={isAdmin ? () => setMainTab("accounts") : undefined}
              onLogout={handleLogout}
              onLogin={() => setIsLoginModalOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300 z-30">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="p-1 hover:bg-emerald-700 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container: Home, Config, or Exam Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {mainTab === "config" ? (
          <div className="flex-1 overflow-y-auto bg-slate-100">
            <ConfigTab
              subject={subject}
              setSubject={setSubject}
              departmentName={departmentName}
              setDepartmentName={(val) => {
                setDepartmentName(val);
                localStorage.setItem("khaothi_department_name", val);
              }}
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              examTime={examTime}
              setExamTime={setExamTime}
              schoolYear={schoolYear}
              setSchoolYear={setSchoolYear}
              grade={grade}
              setGrade={setGrade}
              period={period}
              setPeriod={setPeriod}
              examFormat={examFormat}
              setExamFormat={setExamFormat}
              scopeConfig={scopeConfig}
              setScopeConfig={setScopeConfig}
              setShowScopeModal={setShowScopeModal}
              examCount={examCount}
              handleExamCountChange={handleExamCountChange}
              variantCodes={variantCodes}
              isCustomCodesMode={isCustomCodesMode}
              setIsCustomCodesMode={setIsCustomCodesMode}
              rawCodesInput={rawCodesInput}
              handleApplyRawCodesInput={handleApplyRawCodesInput}
              handleUpdateSingleCode={handleUpdateSingleCode}
              handleRemoveVariantCode={handleRemoveVariantCode}
              handleAddVariantCode={handleAddVariantCode}
              referenceFiles={referenceFiles}
              handleFileUpload={handleFileUpload}
              handleRemoveFile={handleRemoveFile}
              fileInputRef={fileInputRef}
              setShowTextbookModal={setShowTextbookModal}
              isConfigSaved={isConfigSaved}
              setIsConfigSaved={setIsConfigSaved}
              onSaveConfig={handleSaveConfig}
              currentUser={currentUser}
              onOpenProfileModal={() => {
                if (!currentUser) setIsLoginModalOpen(true);
                else setIsProfileModalOpen(true);
              }}
              examDateLocation={examDateLocation}
              setExamDateLocation={setExamDateLocation}
              bghName={bghName}
              setBghName={setBghName}
              teacherHeadName={teacherHeadName}
              setTeacherHeadName={setTeacherHeadName}
              creatorName={creatorName}
              setCreatorName={setCreatorName}
              bghSignature={bghSignature}
              setBghSignature={setBghSignature}
              teacherHeadSignature={teacherHeadSignature}
              setTeacherHeadSignature={setTeacherHeadSignature}
              creatorSignature={creatorSignature}
              setCreatorSignature={setCreatorSignature}
            />
          </div>
        ) : mainTab === "study-guide" ? (
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-100">
            <StudyGuideTab
              subject={subject}
              setSubject={setSubject}
              grade={grade}
              setGrade={setGrade}
              period={period}
              setPeriod={setPeriod}
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              departmentName={departmentName}
              setDepartmentName={setDepartmentName}
              schoolYear={schoolYear}
              setSchoolYear={setSchoolYear}
              userApiKeys={userApiKeys}
              currentUser={currentUser}
              bghName={bghName}
              teacherHeadName={teacherHeadName}
              creatorName={creatorName}
            />
          </div>
        ) : mainTab === "accounts" ? (
          <div className="flex-1 overflow-y-auto bg-slate-100">
            <AccountManagementTab currentUser={currentUser} />
          </div>
        ) : (
          <ExamWorkspace
            subject={subject}
            departmentName={departmentName}
            schoolName={schoolName}
            examTime={examTime}
            schoolYear={schoolYear}
            grade={grade}
            period={period}
            examFormat={examFormat}
            scopeConfig={scopeConfig}
            examDateLocation={examDateLocation}
            bghName={bghName}
            teacherHeadName={teacherHeadName}
            creatorName={creatorName}
            bghSignature={bghSignature}
            teacherHeadSignature={teacherHeadSignature}
            creatorSignature={creatorSignature}
            examCount={examCount}
            handleExamCountChange={handleExamCountChange}
            variantCodes={variantCodes}
            isCustomCodesMode={isCustomCodesMode}
            setIsCustomCodesMode={setIsCustomCodesMode}
            rawCodesInput={rawCodesInput}
            handleApplyRawCodesInput={handleApplyRawCodesInput}
            handleUpdateSingleCode={handleUpdateSingleCode}
            handleRemoveVariantCode={handleRemoveVariantCode}
            handleAddVariantCode={handleAddVariantCode}
            activeVariantCode={activeVariantCode}
            setActiveVariantCode={setActiveVariantCode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            generationStep={generationStep}
            testData={testData}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            isSequentialGenerating={isSequentialGenerating}
            generatingVariantCode={generatingVariantCode}
            sequentialProgress={sequentialProgress}
            error={error}
            setError={setError}
            isConfigSaved={isConfigSaved}
            onSwitchToConfigTab={() => setMainTab("config")}
            onGenerate={handleGenerate}
            onSequentialGenerateAll={handleSequentialGenerateAll}
            onGenerateSingleVariant={handleGenerateSingleVariant}
            onUpdateMcqAnswer={handleUpdateMcqAnswer}
            onToggleTfStatement={handleToggleTfStatement}
            onOpenQuestionEditor={handleOpenQuestionEditor}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onCancelGeneration={cancelGeneration}
            />
        )}
      </div>

      {/* Question Edit & AI Regeneration Modal */}
      {editingQuestion?.isOpen && (
        <QuestionEditModal
          isOpen={editingQuestion.isOpen}
          onClose={() => setEditingQuestion(null)}
          variantCode={editingQuestion.variantCode}
          questionId={editingQuestion.questionId}
          questionType={editingQuestion.questionType}
          questionData={editingQuestion.questionData}
          grade={grade}
          period={period}
          examFormat={examFormat}
          referenceFiles={referenceFiles}
          matrix={testData?.matrix}
          specification={testData?.specification}
          onSaveQuestion={handleSaveQuestion}
        />
      )}

      {/* Official SGK Knowledge Base Modal */}
      {showTextbookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    Kho Lưu Trữ SGK Tin Học Cố Định (Chính Thống)
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-400/40">
                      GDPT 2018
                    </span>
                  </h3>
                  <p className="text-xs text-blue-200">
                    Lưu trữ vĩnh viễn các bộ SGK Toán học, Tin học (từ lớp 6 đến lớp 9) (Kết nối tri thức) - Chống sai lệch và kiến thức trôi nổi trên mạng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTextbookModal(false)}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grade Selector */}
            {(subject === "Tin học" || subject?.toLowerCase().trim().includes("toán")) && (
              <div className="flex border-b border-gray-200 bg-gray-50 px-6 shrink-0 gap-2 py-2">
                {[
                  { g: "6", data: subject?.toLowerCase().trim().includes("toán") ? ALL_MATH_TEXTBOOKS["6"] : TEXTBOOK_GRADE_6 },
                  { g: "7", data: subject?.toLowerCase().trim().includes("toán") ? ALL_MATH_TEXTBOOKS["7"] : TEXTBOOK_GRADE_7 },
                  { g: "8", data: subject?.toLowerCase().trim().includes("toán") ? ALL_MATH_TEXTBOOKS["8"] : TEXTBOOK_GRADE_8 },
                  { g: "9", data: subject?.toLowerCase().trim().includes("toán") ? ALL_MATH_TEXTBOOKS["9"] : TEXTBOOK_GRADE_9 },
                ].map(({ g, data }) => (
                  <button
                    key={g}
                    onClick={() => setSelectedSgkGrade(g)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedSgkGrade === g
                        ? "bg-blue-700 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    SGK {subject} {g} ({data.topics.length} {subject?.toLowerCase().trim().includes("toán") ? "Chương" : "Chủ đề"})
                  </button>
                ))}
              </div>
            )}

            {/* Content List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {subject !== "Tin học" && subject !== "Toán học" ? (
                <div className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-800">
                      Chưa có dữ liệu Sách giáo khoa cho môn {subject}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hiện tại hệ thống đã tích hợp sẵn cơ sở dữ liệu số hóa 100% chuẩn SGK cho môn <strong>Tin học và Toán học (lớp 6, 7, 8, 9 - Bộ sách Kết nối tri thức)</strong>. 
                      Dữ liệu SGK số hóa cho môn <strong>{subject}</strong> đang được tiếp tục cập nhật.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 text-left space-y-2">
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      💡 Hướng dẫn tạo đề thi môn {subject}:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11.5px] text-slate-600">
                      <li>Tại màn hình <strong>Cấu hình</strong>: Thầy/cô vui lòng tải lên tệp Kế hoạch giáo dục / PPCT môn {subject} (.docx, .pdf) ở <strong>Mục số 3</strong>.</li>
                      <li>Hoặc sử dụng tính năng <strong>Tùy chỉnh bài & số tiết</strong> -&gt; <strong>Nhập nhanh văn bản</strong> để nhập các bài học cần kiểm tra.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                (() => {
                  const currentBook = subject?.toLowerCase().trim().includes("toán")
                    ? (ALL_MATH_TEXTBOOKS[selectedSgkGrade] || ALL_MATH_TEXTBOOKS["6"])
                    : (selectedSgkGrade === "6" 
                      ? TEXTBOOK_GRADE_6 
                      : selectedSgkGrade === "7" 
                      ? TEXTBOOK_GRADE_7 
                      : selectedSgkGrade === "8" 
                      ? TEXTBOOK_GRADE_8 
                      : TEXTBOOK_GRADE_9);

                return (
                  <div className="space-y-4">
                    <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg text-xs text-blue-900 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-blue-950">{currentBook.title}</p>
                        <p className="text-blue-700">{currentBook.description} • Bộ sách: <b>{currentBook.bookSeries}</b></p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Đã nạp vào Prompt AI
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentBook.topics.map((topic, tIdx) => (
                        <div key={topic.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-2xs">
                          <h4 className="text-xs font-bold text-blue-900 border-b border-gray-100 pb-1.5 mb-2">
                            {topic.name}
                          </h4>
                          <div className="space-y-2 pl-2">
                            {topic.lessons.map((lesson) => (
                              <div key={lesson.id} className="text-xs bg-gray-50/70 p-2 rounded border border-gray-100 space-y-1">
                                <div className="flex justify-between items-center font-semibold text-gray-800">
                                  <span>{lesson.name}</span>
                                </div>
                                <div className="text-[11px] text-gray-600 space-y-0.5">
                                  <p><span className="font-semibold text-blue-800">• Nhận biết:</span> {lesson.learningOutcomes.recognition.join("; ")}</p>
                                  <p><span className="font-semibold text-indigo-800">• Thông hiểu:</span> {lesson.learningOutcomes.understanding.join("; ")}</p>
                                  <p><span className="font-semibold text-emerald-800">• Vận dụng:</span> {lesson.learningOutcomes.application.join("; ")}</p>
                                </div>
                                <div className="flex gap-1 flex-wrap pt-0.5">
                                  {lesson.keyConcepts.map((kc, kIdx) => (
                                    <span key={kIdx} className="bg-white border border-gray-200 text-gray-700 text-[10px] px-1.5 py-0.2 rounded">
                                      #{kc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
                })()
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={() => setShowTextbookModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scope Configuration Modal */}
      <ScopeConfigModal
        isOpen={showScopeModal}
        onClose={() => setShowScopeModal(false)}
        subject={subject}
        grade={grade}
        period={period}
        scopeConfig={scopeConfig}
        onSaveScope={(newConfig) => setScopeConfig(newConfig)}
      />

      {/* Login Modal for Protected Downloads */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        pendingActionName={pendingDownloadAction?.name || "Tải File Hồ sơ Khảo thí"}
        onLoginSuccess={(accData) => {
          setCurrentUser(accData);
          setError("");
          setIsApiKeyModalOpen(false);
          if (pendingDownloadAction?.fn) {
            pendingDownloadAction.fn();
            setPendingDownloadAction(null);
          }
        }}
      />

      {/* User Profile & Display Name Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateSuccess={(updatedAccount) => {
          setCurrentUser(updatedAccount);
          localStorage.setItem("khaothi_account_data", JSON.stringify(updatedAccount));
          setSaveToast(`Đã cập nhật tên hiển thị thành: "${updatedAccount.customerName}"`);
          setTimeout(() => setSaveToast(null), 3500);
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* User API Key Settings Modal (Auto Sync to Account) */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        accountName={currentUser?.customerName || currentUser?.id}
        apiKeys={userApiKeys}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onSave={async (newKeys) => {
          setUserApiKeys(newKeys);
          localStorage.setItem("khaothi_user_api_keys", JSON.stringify(newKeys));
          setError(""); // Disappear error banner immediately upon saving Key

          const savedCode = localStorage.getItem("khaothi_account_code");
          if (savedCode) {
            try {
              await clientAdminUpdateKeys("", savedCode, newKeys);
              const updatedUser = { ...currentUser, apiKeys: newKeys };
              setCurrentUser(updatedUser);
              localStorage.setItem("khaothi_account_data", JSON.stringify(updatedUser));
            } catch (err) {
              console.warn("Không thể lưu Key:", err);
            }
          }
          setSaveToast(`Đã lưu ${newKeys.length} API Key thành công!`);
          setTimeout(() => setSaveToast(null), 3500);
        }}
      />
    </div>
  );
}
