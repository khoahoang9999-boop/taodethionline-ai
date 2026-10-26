import React, { useState, useEffect, useRef } from "react";
import {
  User,
  X,
  Check,
  ShieldCheck,
  Phone,
  Calendar,
  Laptop,
  Sparkles,
  Key,
  AlertCircle,
  Edit3,
  Camera,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  CheckCircle2
} from "lucide-react";
import { getDeviceId } from "../lib/device-id";
import { clientUpdateProfile } from "../lib/client-auth";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdateSuccess: (updatedAccount: any) => void;
  onOpenApiKeyModal?: () => void;
}

const AVATAR_PRESETS = [
  { id: "teacher-m1", label: "Thầy giáo", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=TeacherMale1&backgroundColor=c0aede" },
  { id: "teacher-f1", label: "Cô giáo", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=TeacherFemale1&backgroundColor=ffdfbf" },
  { id: "teacher-m2", label: "Thầy Toán", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=ProfMath&backgroundColor=b6e3f4" },
  { id: "teacher-f2", label: "Cô Khoa học", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=TeacherScience&backgroundColor=ffd5dc" },
  { id: "teacher-f3", label: "Cô Tiếng Anh", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=EnglishTeacher&backgroundColor=d1d4f9" },
  { id: "teacher-m3", label: "Thầy Tin học", url: "https://api.dicebear.com/7.x/bottts/svg?seed=TechTeacher&backgroundColor=b6e3f4" },
  { id: "scholar-1", label: "Nhà giáo", url: "https://api.dicebear.com/7.x/personas/svg?seed=ScholarPro&backgroundColor=d1d4f9" },
  { id: "scholar-2", label: "Giáo sư", url: "https://api.dicebear.com/7.x/personas/svg?seed=Professor&backgroundColor=c0aede" },
  { id: "smart-1", label: "Tri thức", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=SmartEducator&backgroundColor=c0aede" },
  { id: "smile-1", label: "Thân thiện", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=FriendlyEducator&backgroundColor=d1d4f9" },
  { id: "mentor-1", label: "Chuyên gia", url: "https://api.dicebear.com/7.x/personas/svg?seed=MasterMentor&backgroundColor=ffd5dc" },
  { id: "admin-1", label: "Quản trị", url: "https://api.dicebear.com/7.x/bottts/svg?seed=MasterAdmin&backgroundColor=ffdfbf" },
  { id: "creative-1", label: "Sáng tạo", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=CreativeTeacher&backgroundColor=ffdfbf" },
  { id: "energetic-1", label: "Nhiệt huyết", url: "https://api.dicebear.com/7.x/personas/svg?seed=DynamicEducator&backgroundColor=b6e3f4" },
  { id: "calm-1", label: "Hiền hậu", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=KindTeacher&backgroundColor=c0aede" }
];

function formatDateVN(dateStr?: string): string {
  if (!dateStr) return "---";
  if (dateStr === "2099-12-31" || dateStr === "vinh-vien" || dateStr === "Vĩnh viễn") return "Vĩnh viễn";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
  onOpenApiKeyModal
}: UserProfileModalProps) {
  const [username, setUsername] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarMode, setAvatarMode] = useState<"preset" | "url" | "upload">("preset");
  const [showPresets, setShowPresets] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute active user account safely
  const activeAccount = currentUser || null;

  useEffect(() => {
    if (isOpen) {
      const currentName = activeAccount?.username || activeAccount?.customerName || activeAccount?.id || "";
      setUsername(currentName);
      setCustomerName(currentName);
      setPhone(activeAccount?.phone || "");
      setNotes(activeAccount?.notes || "");
      setAvatar(activeAccount?.avatar || "");
      setCustomUrlInput(activeAccount?.avatar?.startsWith("http") ? activeAccount.avatar : "");
      setShowPresets(false);
      setShowUrlField(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, activeAccount?.username, activeAccount?.id, activeAccount?.customerName, activeAccount?.phone, activeAccount?.notes, activeAccount?.avatar]);

  if (!isOpen) return null;

  const isAdmin =
    activeAccount?.id?.trim().toUpperCase() === "TK-KHOA-2026" ||
    activeAccount?.id?.trim().toUpperCase() === "ADMIN123" ||
    activeAccount?.notes?.toLowerCase().includes("admin") ||
    activeAccount?.customerName?.toLowerCase().includes("admin");

  const defaultAvatar = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(activeAccount?.id || activeAccount?.customerName || "user")}&backgroundColor=c0aede,b6e3f4,ffdfbf`;
  const currentAvatarDisplay = avatar || defaultAvatar;

  // Handle local image upload with high-performance resizing to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WebP...).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Kích thước file ảnh quá lớn (tối đa 8MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 256x256 max using canvas to keep payload small and fast (~25KB)
        const canvas = document.createElement("canvas");
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setAvatar(dataUrl);
          setErrorMessage(null);
          setSuccessMessage("✓ Đã tải ảnh lên thành công. Bấm 'Lưu thay đổi' để hoàn tất!");
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleApplyCustomUrl = () => {
    const url = customUrlInput.trim();
    if (!url) {
      setErrorMessage("Vui lòng nhập đường dẫn ảnh hợp lệ.");
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:image")) {
      setErrorMessage("Đường dẫn phải bắt đầu bằng http:// hoặc https://");
      return;
    }
    setAvatar(url);
    setErrorMessage(null);
    setSuccessMessage("✓ Đã áp dụng link ảnh!");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleRandomizeAvatar = () => {
    const seeds = ["Teacher", "Professor", "Math", "Science", "Educator", "Doctor", "Mentor", "Genius", "Writer", "Coder", "Master", "Leader"];
    const styles = ["lorelei", "personas", "avataaars", "bottts"];
    const randomSeed = `${seeds[Math.floor(Math.random() * seeds.length)]}_${Math.floor(Math.random() * 9999)}`;
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const bgColors = ["c0aede", "b6e3f4", "ffdfbf", "d1d4f9", "ffd5dc"];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const newUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}&backgroundColor=${randomBg}`;
    setAvatar(newUrl);
    setErrorMessage(null);
    setSuccessMessage("✓ Đã tạo Avatar ngẫu nhiên mới!");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleResetAvatar = () => {
    setAvatar("");
    setCustomUrlInput("");
    setSuccessMessage("✓ Đã đặt lại về ảnh mặc định!");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount || !activeAccount.id) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản trước khi cập nhật!");
      return;
    }
    const cleanName = username.trim() || customerName.trim();
    if (!cleanName) {
      setErrorMessage("Vui lòng nhập Tên đăng nhập.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const deviceId = getDeviceId();
      const accountId = activeAccount.id;
      
      const result = await clientUpdateProfile(
        accountId,
        deviceId,
        cleanName,
        phone.trim(),
        notes.trim(),
        avatar,
        cleanName
      );

      if (result.success && result.account) {
        setSuccessMessage("✓ Đã cập nhật thông tin tài khoản thành công!");
        onUpdateSuccess(result.account);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        // Still save locally for immediate UI update even if offline
        const localUpdated = {
          ...activeAccount,
          username: cleanName,
          customerName: cleanName,
          phone: phone.trim(),
          notes: notes.trim(),
          avatar: avatar
        };
        localStorage.setItem("khaothi_account_data", JSON.stringify(localUpdated));
        if (avatar) localStorage.setItem("khaothi_account_avatar", avatar);
        onUpdateSuccess(localUpdated);
        setSuccessMessage("✓ Đã lưu thông tin và ảnh đại diện!");
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch {
      const localUpdated = {
        ...activeAccount,
        username: cleanName,
        customerName: cleanName,
        phone: phone.trim(),
        notes: notes.trim(),
        avatar: avatar
      };
      localStorage.setItem("khaothi_account_data", JSON.stringify(localUpdated));
      if (avatar) localStorage.setItem("khaothi_account_avatar", avatar);
      onUpdateSuccess(localUpdated);
      setSuccessMessage("✓ Đã cập nhật thông tin và ảnh đại diện!");
      setTimeout(() => {
        onClose();
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-8"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shadow-inner">
              <User className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Hồ sơ & Đổi Avatar</h3>
                {isAdmin && (
                  <span className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                    Quản trị
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200">
                Tài khoản: <span className="font-semibold text-amber-300">{activeAccount?.customerName || activeAccount?.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Avatar Customization Section */}
          <div className="bg-gradient-to-b from-blue-50/70 to-indigo-50/40 border border-blue-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Ảnh đại diện (Avatar):</span>
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={handleResetAvatar}
                  className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Đặt lại về ảnh mặc định"
                >
                  <Trash2 className="w-3 h-3" /> Đặt lại mặc định
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar Preview with Camera badge */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 rounded-full border-2 border-blue-500/80 shadow-md bg-white p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={currentAvatarDisplay}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-md transition-all cursor-pointer border-2 border-white"
                  title="Tải ảnh từ máy tính hoặc điện thoại"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar Action Buttons */}
              <div className="flex-1 space-y-2">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh lên</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomizeAvatar}
                    className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Tạo ảnh ngẫu nhiên"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ngẫu nhiên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPresets((prev) => !prev);
                      setShowUrlField(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      showPresets
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-blue-600/10 hover:bg-blue-600/20 text-blue-900 border border-blue-300/60"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showPresets ? "Ẩn mẫu" : "Mẫu Thầy/Cô"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlField((prev) => !prev);
                      setShowPresets(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      showUrlField
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-900 border border-indigo-300/60"
                    }`}
                    title="Dán link ảnh từ Web hoặc Google Drive"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Link ảnh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom URL Input Field */}
            {showUrlField && (
              <div className="pt-2 border-t border-indigo-200/60 space-y-1.5 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-indigo-600" />
                  Dán đường dẫn ảnh từ mạng (URL):
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://... (link ảnh .jpg, .png, WebP)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}

            {/* Presets Gallery Drawer */}
            {showPresets && (
              <div className="pt-2 border-t border-blue-200/60 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">
                    Chọn ảnh đại diện mẫu phù hợp:
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold">15 mẫu đẹp</span>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-44 overflow-y-auto p-1.5 bg-white/90 rounded-xl border border-blue-100 shadow-inner">
                  {AVATAR_PRESETS.map((p) => {
                    const isSelected = avatar === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setAvatar(p.url);
                          setErrorMessage(null);
                          setSuccessMessage(`✓ Đã chọn Avatar: ${p.label}`);
                          setTimeout(() => setSuccessMessage(null), 2500);
                        }}
                        className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-100 ring-2 ring-blue-600 shadow-sm"
                            : "hover:bg-slate-100"
                        }`}
                        title={p.label}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-white"
                        />
                        <span className="text-[9.5px] font-bold text-slate-700 truncate max-w-[54px]">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Account Overview Cards */}
          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-500" /> Tên đăng nhập:
              </span>
              <span className="font-bold text-indigo-900 truncate block text-[11.5px]">
                @{activeAccount?.username || activeAccount?.id}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Hạn sử dụng:
              </span>
              <span className="font-bold text-slate-800 text-[11.5px]">
                {formatDateVN(activeAccount?.expiryDate)}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Laptop className="w-3 h-3 text-slate-400" /> Cho phép:
              </span>
              <span className="font-bold text-slate-800 text-[11.5px]">
                {activeAccount?.maxDevices || 2} máy
              </span>
            </div>
          </div>

          {/* Username Input (Tên đăng nhập) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Tên đăng nhập (*):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setCustomerName(e.target.value);
              }}
              placeholder="Nhập tên đăng nhập..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
              autoFocus
            />
          </div>

          {/* School / Unit / Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Đơn vị công tác / Trường học:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: THCS & THPT Chu Văn An"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Phone Input (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Số điện thoại liên hệ (tùy chọn):
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0989.982.818"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Success / Error Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick API Key Trigger */}
          {onOpenApiKeyModal && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenApiKeyModal();
                }}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Quản lý danh sách Gemini API Key cá nhân</span>
              </button>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang lưu...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
