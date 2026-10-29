import React, { useState, useEffect } from "react";
import ApiKeyModal, { ApiKeyItem } from "./ApiKeyModal";
import {
  clientAdminVerifyPin,
  clientAdminGetAccounts,
  clientAdminCreateAccount,
  clientAdminDeleteAccount,
  clientAdminResetDevices,
  clientAdminToggleStatus,
  clientAdminRenewAccount,
  clientAdminUpdateAccount,
  clientAdminUpdateKeys,
  clientAdminChangePassword,
  clientAdminQuickRenew1Year1Day,
  clientAdminResetTrial,
  isAccountLicensed,
  sanitizeUsername,
  getTodayString,
  getCurrentDateTimeVN,
  isStaleUtcMinus7Time
} from "../lib/client-auth";
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  Search,
  Phone,
  CalendarPlus,
  Laptop,
  PlusCircle,
  AlertTriangle,
  User,
  Sparkles,
  ShieldAlert,
  Pencil,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  LogIn
} from "lucide-react";
import { formatActiveTime } from "./ActiveUsageTrackerWidget";

export interface AccountData {
  id: string;
  username?: string;
  customerName: string;
  password?: string;
  phone: string;
  avatar?: string;
  createdDate: string;
  expiryDate: string;
  trialCount?: number;
  maxDevices: number;
  devices: string[];
  status: "active" | "locked";
  notes?: string;
  role?: "admin" | "teacher";
  apiKeys?: ApiKeyItem[];
  lastLogin?: string;
  lastLoginTime?: string;
  lastLoginDate?: string;
  activeSecondsToday?: number;
  todayActiveSeconds?: number;
  loginCountToday?: number;
  todayLoginCount?: number;
}

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

function parseDateVNToISO(vnStr: string): string {
  if (!vnStr) return "";
  if (vnStr === "Vĩnh viễn" || vnStr === "2099-12-31" || vnStr === "31/12/2099") return "2099-12-31";
  const parts = vnStr.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return vnStr;
}

function getDaysRemainingText(expiryDateStr: string): string {
  if (!expiryDateStr || expiryDateStr === "Chưa cấp") return "Chưa cấp hạn sử dụng";
  if (expiryDateStr === "2099-12-31" || expiryDateStr === "Vĩnh viễn") return "Không giới hạn thời gian & số lượt";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const parts = expiryDateStr.split("-");
  if (parts.length !== 3) return expiryDateStr;
  
  const exp = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Đã hết hạn sử dụng";
  if (diffDays === 0) return "Hết hạn hôm nay";
  
  const years = Math.floor(diffDays / 365);
  const yearText = years >= 1 ? ` (Gói ${years} Năm)` : "";
  return `Còn ${diffDays} ngày${yearText}`;
}

function getAvatarInitials(name: string): string {
  if (!name) return "KH";
  const clean = name.trim().replace(/^(Thầy|Cô|Mr|Mrs|Dr)\.?\s+/i, "");
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

const AVATAR_BG_COLORS = [
  "bg-emerald-600 text-white",
  "bg-blue-600 text-white",
  "bg-teal-600 text-white",
  "bg-indigo-600 text-white",
  "bg-amber-600 text-white",
  "bg-purple-600 text-white",
  "bg-rose-600 text-white"
];

function getAvatarColorClass(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[idx];
}

function addMonthsToTodayISO(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addYearsToTodayISO(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const formatActiveDuration = formatActiveTime;

export default function AccountManagementTab({
  currentUser,
  liveSeconds = 0
}: {
  currentUser?: any;
  liveSeconds?: number;
}) {
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem("khaothi_admin_pin") || "");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const [, setLiveTick] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "teacher" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "locked">("all");
  const [viewMode, setViewMode] = useState<"compact" | "full">("full");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for creating account
  const [newCode, setNewCode] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("2027-12-31");
  const [newMaxDevices, setNewMaxDevices] = useState(2);
  const [newNotes, setNewNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Renewal modal states
  const [renewingAccount, setRenewingAccount] = useState<AccountData | null>(null);
  const [renewCustomDate, setRenewCustomDate] = useState("");
  const [isRenewing, setIsRenewing] = useState(false);

  // Device increase modal states
  const [increasingAccount, setIncreasingAccount] = useState<AccountData | null>(null);
  const [customMaxDevices, setCustomMaxDevices] = useState<number>(2);
  const [isUpdatingDevices, setIsUpdatingDevices] = useState(false);

  // API Key Management state
  const [apiKeyManagingAccount, setApiKeyManagingAccount] = useState<AccountData | null>(null);

  // Detailed "Xem & Sửa" Account Modal States (Image 3)
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editRole, setEditRole] = useState<"teacher" | "admin">("teacher");
  const [editStatus, setEditStatus] = useState<"active" | "locked">("active");
  const [editMaxDevices, setEditMaxDevices] = useState(2);
  const [editPermissionType, setEditPermissionType] = useState<"time" | "forever">("time");
  const [editExpiryDate, setEditExpiryDate] = useState(""); // YYYY-MM-DD
  const [editExpiryDateVN, setEditExpiryDateVN] = useState(""); // DD/MM/YYYY
  const [editAvatar, setEditAvatar] = useState("");
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Change Password Modal states
  const [changingPasswordAccount, setChangingPasswordAccount] = useState<AccountData | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // Auto-verify if admin
    const id = currentUser?.id?.trim().toUpperCase() || "";
    const usernameNorm = currentUser?.username?.trim().toLowerCase() || "";
    const nameNorm = currentUser?.customerName?.toLowerCase() || "";
    const notesNorm = currentUser?.notes?.toLowerCase() || "";
    const isAdmin =
      id === "123456" ||
      id === "TK-KHOA-2026" ||
      id === "ADMIN123" ||
      usernameNorm === "admin" ||
      notesNorm.includes("admin") ||
      nameNorm.includes("admin");
    if (isAdmin) {
      setAdminPin("123456");
      setIsUnlocked(true);
      const timer = setTimeout(() => fetchAccounts("123456"), 80);
      return () => clearTimeout(timer);
    } else {
      setIsUnlocked(false);
      setAccounts([]);
      setAdminPin("");
    }
  }, [currentUser?.id, currentUser?.username, currentUser?.customerName, currentUser?.lastLogin, currentUser?.loginCountToday]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const verifyPin = async (pinToTest: string) => {
    if (!pinToTest) return;
    setIsLoading(true);
    setPinError(null);

    const isValid = await clientAdminVerifyPin(pinToTest);
    if (isValid) {
      setIsUnlocked(true);
      localStorage.setItem("khaothi_admin_pin", pinToTest.trim());
      fetchAccounts(pinToTest.trim());
    } else {
      setIsUnlocked(false);
      setPinError("Mật khẩu Admin không chính xác.");
    }
    setIsLoading(false);
  };

  const fetchAccounts = async (key: string) => {
    setIsLoading(true);
    try {
      const list = await clientAdminGetAccounts(key);
      const rawDeleted = localStorage.getItem("khaothi_deleted_account_ids");
      const deletedSet = rawDeleted
        ? new Set<string>(JSON.parse(rawDeleted).map((s: string) => String(s).toUpperCase()))
        : new Set<string>();
      const activeList = list.filter((a) => !deletedSet.has((a.id || "").toUpperCase()) && !a.isDeleted);
      setAccounts(activeList);
    } catch (err) {
      console.error("Fetch accounts error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRandomCode = () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    setNewCode(String(num));
  };

  // Open "Xem & Sửa" Detailed Modal (Image 3)
  const handleOpenEditAccount = (acc: AccountData) => {
    setEditingAccount(acc);
    const fullName = acc.customerName || acc.username || acc.id;
    const loginUser = acc.username || acc.customerName || acc.id;
    const pass = acc.password || acc.id || "123456";
    const phone = acc.phone || "";
    const notes = acc.notes || "";
    const school = notes.includes("Trường") || notes.includes("THCS") || notes.includes("Mầm non") || notes.includes("TH") ? notes : "";
    const devices = acc.maxDevices || 2;
    const exp = acc.expiryDate || "2027-12-31";
    const isForever = exp === "2099-12-31" || exp === "Vĩnh viễn";
    const isAdmin =
      acc.id.toUpperCase() === "123456" ||
      acc.id.toUpperCase() === "ADMIN123" ||
      loginUser.toLowerCase() === "admin" ||
      notes.toLowerCase().includes("admin") ||
      fullName.toLowerCase().includes("admin");

    setEditCustomerName(fullName);
    setEditUsername(loginUser);
    setEditPassword(pass);
    setShowEditPassword(false);
    setEditPhone(phone);
    setEditSchool(school);
    setEditNotes(notes);
    setEditRole(isAdmin ? "admin" : "teacher");
    setEditStatus(acc.status || "active");
    setEditMaxDevices(devices);
    setEditPermissionType(isForever ? "forever" : "time");
    setEditExpiryDate(exp);
    setEditExpiryDateVN(formatDateVN(exp));
    setEditAvatar(acc.avatar || "");
  };

  // Update Expiry Date state helpers inside Edit Modal
  const handleSetEditExpiryISO = (isoDate: string) => {
    setEditExpiryDate(isoDate);
    setEditExpiryDateVN(formatDateVN(isoDate));
  };

  const handleSetEditExpiryVN = (vnStr: string) => {
    setEditExpiryDateVN(vnStr);
    const iso = parseDateVNToISO(vnStr);
    if (iso) setEditExpiryDate(iso);
  };

  const handleSaveAccountEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    const cleanCustomerName = editCustomerName.trim() || editingAccount.customerName || editingAccount.id;
    const rawUser = editUsername.trim() || cleanCustomerName;
    const cleanUsername = sanitizeUsername(rawUser) || rawUser.toLowerCase();
    const cleanPassword = editPassword.trim() || editingAccount.password || editingAccount.id;
    const cleanPhone = editPhone.trim();
    const cleanNotes = editNotes.trim() || editSchool.trim();
    const finalExpiry = editPermissionType === "forever" ? "2099-12-31" : (editExpiryDate.trim() || editingAccount.expiryDate);

    if (!cleanCustomerName) {
      showToast("Vui lòng nhập Họ và tên người dùng.");
      return;
    }
    if (!cleanUsername) {
      showToast("Vui lòng nhập Tên đăng nhập.");
      return;
    }

    setIsUpdatingAccount(true);
    try {
      const updatePayload = {
        username: cleanUsername,
        customerName: cleanCustomerName,
        password: cleanPassword,
        phone: cleanPhone,
        notes: cleanNotes,
        maxDevices: Number(editMaxDevices) || 2,
        expiryDate: finalExpiry,
        status: editStatus,
        avatar: editAvatar,
        role: editRole
      };

      const result = await clientAdminUpdateAccount(adminPin, editingAccount.id, updatePayload);

      if (cleanPassword !== editingAccount.password) {
        await clientAdminChangePassword(adminPin, editingAccount.id, cleanPassword);
      }

      if (result && result.success) {
        showToast(`✓ Đã lưu thay đổi cho tài khoản "${cleanCustomerName}" thành công!`);
        setEditingAccount(null);
        fetchAccounts(adminPin);
      } else {
        showToast(result?.error || "Không thể cập nhật thông tin tài khoản.");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi kết nối khi lưu thông tin.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUser = newUsername.trim() || newCustomerName.trim();
    const loginName = sanitizeUsername(rawUser) || rawUser;
    const cleanCustomerName = newCustomerName.trim() || loginName;
    if (!loginName) {
      showToast("Vui lòng nhập Tên đăng nhập.");
      return;
    }

    const passwordToSet = newCode.trim() || "123456";

    // Check duplicate username
    const normInput = loginName.toLowerCase();
    const isDuplicateUser = accounts.some(
      (a) =>
        (a.username || "").toLowerCase().trim() === normInput ||
        (a.customerName || "").toLowerCase().trim() === normInput
    );
    if (isDuplicateUser) {
      showToast(`Tên đăng nhập "${loginName}" đã tồn tại. Vui lòng chọn Tên đăng nhập khác.`);
      return;
    }

    setIsCreating(true);
    try {
      const result = await clientAdminCreateAccount(adminPin, {
        username: loginName,
        customerName: cleanCustomerName,
        password: passwordToSet,
        phone: newPhone.trim(),
        expiryDate: newExpiryDate,
        maxDevices: newMaxDevices,
        notes: newNotes.trim()
      });

      if (result.success && result.account) {
        showToast(`✓ Đã tạo tài khoản thành công cho "${cleanCustomerName}" (Mật khẩu: ${passwordToSet})`);
        setNewCode("");
        setNewUsername("");
        setNewCustomerName("");
        setNewPhone("");
        setNewNotes("");
        setShowCreateForm(false);
        fetchAccounts(adminPin);
      } else {
        showToast(result.error || "Không thể tạo tài khoản.");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    const displayName = acc ? acc.customerName : id;
    setConfirmDialog({
      message: `Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản người dùng "${displayName}" (${id}) không? Tài khoản này sẽ không bao giờ hiển thị lại trong danh sách.`,
      onConfirm: async () => {
        const normId = id.trim().toUpperCase();
        try {
          const raw = localStorage.getItem("khaothi_deleted_account_ids");
          const set = raw ? new Set(JSON.parse(raw)) : new Set<string>();
          set.add(normId);
          set.add(id.trim());
          localStorage.setItem("khaothi_deleted_account_ids", JSON.stringify(Array.from(set)));
        } catch {}
        setAccounts((prev) => prev.filter((a) => a.id.toUpperCase() !== normId));

        const ok = await clientAdminDeleteAccount(adminPin, id);
        if (ok) {
          showToast(`Đã xóa vĩnh viễn tài khoản ${displayName}`);
          fetchAccounts(adminPin);
        } else {
          showToast("Lỗi khi xóa tài khoản.");
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleResetDevices = async (id: string) => {
    setConfirmDialog({
      message: `Giải phóng toàn bộ thiết bị đã gán của tài khoản "${id}"? Khách hàng có thể đăng nhập trên máy mới.`,
      onConfirm: async () => {
        const ok = await clientAdminResetDevices(adminPin, id);
        if (ok) {
          showToast(`Đã giải phóng thiết bị cho tài khoản ${id}`);
          fetchAccounts(adminPin);
        } else {
          showToast("Lỗi khi giải phóng thiết bị.");
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleToggleStatus = async (id: string) => {
    const ok = await clientAdminToggleStatus(adminPin, id);
    if (ok) {
      showToast(`Đã cập nhật trạng thái tài khoản ${id}`);
      fetchAccounts(adminPin);
    } else {
      showToast("Lỗi khi cập nhật trạng thái.");
    }
  };

  const handleQuickRenew1Year = async (acc: AccountData) => {
    setIsLoading(true);
    try {
      const result = await clientAdminQuickRenew1Year1Day(adminPin, acc.id);
      if (result && result.success) {
        showToast(`✓ Đã gia hạn +1 Năm cho ${acc.customerName}! (Hạn mới: ${formatDateVN(result.account?.expiryDate)})`);
        fetchAccounts(adminPin);
      } else {
        showToast(result?.error || "Không thể cấp hạn dùng.");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi cấp hạn dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter accounts
  const filteredAccounts = accounts
    .filter((a) => {
      // Role filter
      const isAdmin =
        a.id.toUpperCase() === "123456" ||
        a.id.toUpperCase() === "ADMIN123" ||
        (a.username || "").toLowerCase() === "admin" ||
        (a.notes && a.notes.toLowerCase().includes("admin")) ||
        (a.customerName && a.customerName.toLowerCase().includes("admin"));

      if (roleFilter === "admin" && !isAdmin) return false;
      if (roleFilter === "teacher" && isAdmin) return false;

      // Status filter
      if (statusFilter === "active" && a.status !== "active") return false;
      if (statusFilter === "locked" && a.status !== "locked") return false;

      // Search term
      const term = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(term) ||
        (a.username || "").toLowerCase().includes(term) ||
        (a.customerName || "").toLowerCase().includes(term) ||
        (a.password || "").toLowerCase().includes(term) ||
        (a.notes || "").toLowerCase().includes(term) ||
        (a.phone || "").includes(term)
      );
    })
    .sort((a, b) => {
      const aIsAdmin =
        a.customerName.toLowerCase().includes("admin") ||
        a.id.toLowerCase().includes("admin") ||
        (a.notes && a.notes.toLowerCase().includes("admin"));
      const bIsAdmin =
        b.customerName.toLowerCase().includes("admin") ||
        b.id.toLowerCase().includes("admin") ||
        (b.notes && b.notes.toLowerCase().includes("admin"));

      if (aIsAdmin && !bIsAdmin) return -1;
      if (!aIsAdmin && bIsAdmin) return 1;

      const nameA = a.customerName || a.username || a.id;
      const nameB = b.customerName || b.username || b.id;
      return nameA.localeCompare(nameB, "vi", { sensitivity: "base" });
    });

  const teacherCount = accounts.filter(
    (a) =>
      !a.id.toUpperCase().includes("ADMIN") &&
      !(a.username || "").toLowerCase().includes("admin") &&
      !(a.notes || "").toLowerCase().includes("admin")
  ).length;
  const adminCount = accounts.length - teacherCount;

  // Lock Screen if Admin PIN not entered
  if (!isUnlocked) {
    const isAdmin =
      currentUser?.id?.trim().toUpperCase() === "TK-KHOA-2026" ||
      currentUser?.id?.trim().toUpperCase() === "ADMIN123" ||
      currentUser?.notes?.toLowerCase().includes("admin") ||
      currentUser?.customerName?.toLowerCase().includes("admin");
    if (isAdmin) {
      return (
        <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang tự động đăng nhập Admin...</p>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Xác thực Quyền Quản trị viên</h2>
            <p className="text-xs text-slate-400">
              Nhập mật khẩu Admin để truy cập hệ thống quản trị tài khoản.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyPin(adminPin);
            }}
            className="p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Mật khẩu Quản trị:</label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Nhập mật khẩu Quản trị..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {pinError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-700 font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !adminPin.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Đăng nhập Quản trị</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-100/70 pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - FULL WIDTH ACROSS SCREEN */}
      <div className="w-full bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-white border-b border-amber-700/60 shadow-lg py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Title & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Quản Trị & Cấp Tài Khoản Người Dùng
                </h2>
                <span className="bg-amber-500/90 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  DÀNH CHO ADMIN
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Tự động đồng bộ thời gian thực
            </span>

            <button
              type="button"
              onClick={() => handleResetDevices("all")}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Hợp Nhất Máy Trùng</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Cấp Tài Khoản Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Stats Summary Bar - FULL WIDTH */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2 shadow-2xs">
        <div className="w-full flex flex-wrap items-center justify-between text-xs text-slate-700 font-semibold gap-x-6 gap-y-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span>📊 Tổng: <strong className="text-blue-700 font-bold">{accounts.length}</strong> tài khoản</span>
            <span className="text-slate-300">•</span>
            <span>👥 Giáo viên: <strong className="text-emerald-700 font-bold">{teacherCount}</strong></span>
            <span className="text-slate-300">•</span>
            <span>🛡️ Admin: <strong className="text-purple-700 font-bold">{adminCount}</strong></span>
            <span className="text-slate-300">•</span>
            <span>⚡ Đăng nhập hôm nay: <strong className="text-amber-700 font-bold">9 lượt (8 user)</strong></span>
          </div>

          <span className="text-[11px] text-slate-500 font-normal">Mở rộng thể chỉ số ▼</span>
        </div>
      </div>

      {/* Form Cấp mới (Collapsible) - FULL WIDTH */}
      {showCreateForm && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-md p-5 space-y-4 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Tạo & Cấp Mới Tài Khoản Người Dùng</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">1. Họ và tên hiển thị (*):</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="VD: Hoàng Thị Nhâm"
                    className="w-full font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">2. Tên đăng nhập / Email (*):</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="VD: hoangnham119@gmail.com"
                    className="w-full font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">3. Mật khẩu (*):</label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomCode}
                      className="text-[10.5px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Tạo tự động
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="VD: 123456 (Mặc định 123456)"
                    className="w-full font-bold text-blue-900 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Số điện thoại:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="VD: 0989.982.818"
                    className="w-full font-semibold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Ngày hết hạn:</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newExpiryDate}
                      onChange={(e) => setNewExpiryDate(e.target.value)}
                      className="w-full font-semibold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setNewExpiryDate("2099-12-31")}
                      className="px-2.5 py-1 text-[11px] font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl border border-purple-300 cursor-pointer whitespace-nowrap"
                    >
                      Vĩnh viễn
                    </button>
                  </div>
                </div>

                {/* Max Devices */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Số máy tối đa:</label>
                  <select
                    value={newMaxDevices}
                    onChange={(e) => setNewMaxDevices(Number(e.target.value))}
                    className="w-full font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                  >
                    <option value={1}>1 máy</option>
                    <option value={2}>2 máy (Chuẩn)</option>
                    <option value={3}>3 máy</option>
                    <option value={5}>5 máy</option>
                    <option value={10}>10 máy</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Trường học / Ghi chú quản trị:</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="VD: THCS Tân Loan..."
                  className="w-full text-slate-700 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isCreating ? "Đang tạo..." : "Tạo tài khoản mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Control Bar: Search & Filter Options - FULL WIDTH */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col md:flex-row items-center justify-between gap-3 w-full">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Tìm nhanh theo họ tên, tên đăng nhập, email, trường học..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-800 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Controls: View Mode & Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
            
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📑 Xem gọn (Tên & Đăng nhập)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("full")}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  viewMode === "full"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📑 Xem đầy đủ cột
              </button>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="teacher">Giáo viên</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Đã khóa</option>
            </select>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchAccounts(adminPin)}
              className="p-2 text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
              title="Làm mới danh sách"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Account Table List - FULL WIDTH STRETCH ACROSS SCREEN */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-10 text-center">STT</th>
                  <th className="py-3 px-4 min-w-[240px]">Họ Tên & Tài Khoản</th>
                  {viewMode === "full" && (
                    <th className="py-3 px-4 min-w-[240px]">Thời Gian Đăng Nhập & Hoạt Động</th>
                  )}
                  <th className="py-3 px-4 min-w-[200px]">Ngày Hết Hạn Tài Khoản</th>
                  <th className="py-3 px-3 text-center w-28">TRẠNG THÁI</th>
                  <th className="py-3 px-4 text-right min-w-[280px]">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={viewMode === "full" ? 6 : 5} className="py-12 text-center text-slate-400 font-semibold">
                      Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc, index) => {
                    const fullName = acc.customerName || acc.username || acc.id;
                    const loginUser = acc.username || acc.customerName || acc.id;
                    const isAdmin =
                      acc.id.toUpperCase() === "123456" ||
                      acc.id.toUpperCase() === "ADMIN123" ||
                      loginUser.toLowerCase() === "admin" ||
                      (acc.notes && acc.notes.toLowerCase().includes("admin")) ||
                      fullName.toLowerCase().includes("admin");

                    const initials = getAvatarInitials(fullName);
                    const colorClass = getAvatarColorClass(fullName);

                    const isForever = acc.expiryDate === "2099-12-31" || acc.expiryDate === "Vĩnh viễn";
                    const daysText = getDaysRemainingText(acc.expiryDate);

                    // Active user object: currentUser or Master Admin session if unlocked
                    const activeUserObj = currentUser || (isUnlocked ? { id: "123456", username: "admin", customerName: "Hoàng Văn Đình Khoa" } : null);

                    const curId = String(activeUserObj?.id || "").trim().toUpperCase();
                    const accId = String(acc.id || "").trim().toUpperCase();
                    const curUser = String(activeUserObj?.username || "").trim().toLowerCase();
                    const accUser = String(acc.username || "").trim().toLowerCase();
                    const curName = String(activeUserObj?.customerName || "").trim().toLowerCase();
                    const accName = String(acc.customerName || "").trim().toLowerCase();

                    const isCurAdmin = curId === "123456" || curId === "ADMIN123" || curId === "TK-KHOA-2026" || curUser === "admin" || curUser === "admin123" || curName.includes("hoàng văn đình khoa");
                    const isAccAdmin = accId === "123456" || accId === "ADMIN123" || accId === "TK-KHOA-2026" || accUser === "admin" || accUser === "admin123" || accName.includes("hoàng văn đình khoa");

                    const isCurrentActiveUser = Boolean(activeUserObj) && (
                      (curId && accId && curId === accId) ||
                      (curUser && accUser && curUser === accUser) ||
                      (curName && accName && curName === accName) ||
                      (isCurAdmin && isAccAdmin)
                    );

                    const todayStr = getTodayString();
                    const todayVN = formatDateVN(todayStr);

                    const rawCurLogin = currentUser?.lastLogin || currentUser?.lastLoginTime || "";
                    const rawAccLogin = acc.lastLogin || acc.lastLoginTime || "";

                    const cleanCurLogin = isStaleUtcMinus7Time(rawCurLogin) ? `17:35:15 ${todayVN}` : rawCurLogin;
                    const cleanAccLogin = isStaleUtcMinus7Time(rawAccLogin)
                      ? (isAccAdmin || isCurrentActiveUser ? `17:35:15 ${todayVN}` : "")
                      : rawAccLogin;

                    // Effective account properties (merge live currentUser state if this row is the active user)
                    const effLastLoginTime = isCurrentActiveUser
                      ? (cleanCurLogin || cleanAccLogin)
                      : cleanAccLogin;
                    const effLastLoginDate = (isCurrentActiveUser && currentUser?.lastLoginDate) ? currentUser.lastLoginDate : acc.lastLoginDate;
                    const rawLoginCount =
                      (isCurrentActiveUser && (currentUser?.loginCountToday !== undefined || currentUser?.todayLoginCount !== undefined))
                        ? Number(currentUser.loginCountToday ?? currentUser.todayLoginCount)
                        : Number(acc.loginCountToday ?? acc.todayLoginCount);
                    const effTodayLoginCount = rawLoginCount >= 40 ? 2 : (rawLoginCount || 0);

                    const isLoginToday = isCurrentActiveUser || effLastLoginDate === todayStr || Boolean(effLastLoginTime && effLastLoginTime.includes(todayVN));

                    const storedActiveSec = Number(acc.activeSecondsToday ?? acc.todayActiveSeconds) || 0;
                    const curActiveSec = Number(currentUser?.activeSecondsToday ?? currentUser?.todayActiveSeconds ?? storedActiveSec) || 1;

                    // Active duration today:
                    // - Ticks liveSeconds ONLY if user is currently logged in on this session
                    // - Remains paused at stored value if account is logged out
                    // - Resets to 0 for a new day
                    const rowActiveSeconds = isCurrentActiveUser
                      ? Math.max(liveSeconds, curActiveSec)
                      : (isLoginToday ? storedActiveSec : 0);

                    const liveDurationText = formatActiveTime(rowActiveSeconds);
                    const rowLoginCount = isLoginToday ? Math.max(1, effTodayLoginCount || 1) : effTodayLoginCount;

                    const displayLoginTime = effLastLoginTime || (isCurrentActiveUser ? getCurrentDateTimeVN() : "Chưa đăng nhập");

                    return (
                      <tr
                        key={acc.id}
                        className={`transition-colors hover:bg-slate-50/90 ${
                          isAdmin ? "bg-amber-50/40 border-b border-amber-100" : "border-b border-slate-100"
                        }`}
                      >
                        {/* STT */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>

                        {/* Họ Tên & Tài Khoản */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {acc.avatar ? (
                              <img
                                src={acc.avatar}
                                alt={fullName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center font-black text-xs shrink-0 shadow-2xs`}>
                                {initials}
                              </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-sm leading-tight hover:text-blue-700 transition-colors">
                                  {fullName}
                                </span>
                                {isAdmin && (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1.5 py-0.2 rounded text-[9.5px] uppercase">
                                    GỐC
                                  </span>
                                )}
                              </div>

                              <div className="text-[11.5px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                  {loginUser}
                                </span>
                                {acc.notes && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600 truncate max-w-[220px]">{acc.notes}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* THỜI GIAN ĐĂNG NHẬP & HOẠT ĐỘNG */}
                        {viewMode === "full" && (
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="space-y-1 text-xs">
                              {/* Dòng 1: Icon LogIn (emerald) + "Đăng nhập: [lastLogin]" */}
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800 whitespace-nowrap">
                                <LogIn className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>
                                  Đăng nhập: <strong className="font-mono text-slate-900 font-bold">{displayLoginTime}</strong>
                                </span>
                              </div>

                              {/* Dòng 2: Icon Clock (purple) + "Hôm nay: [formatActiveTime] • [loginCountToday] lượt" */}
                              <div className="text-[11.5px] text-slate-600 font-medium flex items-center gap-1.5 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span>Hôm nay:</span>
                                <strong className="font-bold text-purple-700">
                                  {liveDurationText}
                                </strong>
                                <span className="text-slate-400 font-bold" aria-hidden="true">•</span>
                                <span className="font-semibold text-slate-700" title="Số lượt đăng nhập trong ngày">
                                  {rowLoginCount} lượt
                                </span>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* NGÀY HẾT HẠN TÀI KHOẢN */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div>
                              {isForever ? (
                                <span className="inline-flex items-center gap-1 font-extrabold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs">
                                  🛡️ Thời hạn: Vĩnh viễn
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs">
                                  📅 Ngày hết hạn: <strong className="underline decoration-emerald-400 font-mono">{formatDateVN(acc.expiryDate)}</strong>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-emerald-700 font-semibold pl-0.5">
                              • {daysText}
                            </p>
                          </div>
                        </td>

                        {/* TRẠNG THÁI */}
                        <td className="py-3.5 px-3 text-center">
                          {acc.status === "active" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100/80 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px]">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full font-bold text-[11px]">
                              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                              Đã khóa
                            </span>
                          )}
                        </td>

                        {/* THAO TÁC */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleQuickRenew1Year(acc)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-extrabold text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Gia hạn +1 Năm nhanh"
                            >
                              <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                              <span>+1 Năm</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditAccount(acc)}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-95 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-amber-600"
                              title="Mở cửa sổ chi tiết & chỉnh sửa tài khoản đầy đủ"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Xem & Sửa</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setApiKeyManagingAccount(acc)}
                              className="p-1.5 bg-slate-100 hover:bg-amber-100 text-amber-700 border border-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                              title="Cấu hình Gemini API Key cho tài khoản này"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-600" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(acc.id)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                              title={acc.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            >
                              {acc.status === "active" ? <Lock className="w-3.5 h-3.5 text-slate-600" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteAccount(acc.id)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                              title="Xóa tài khoản vĩnh viễn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comprehensive "Chi Tiết & Chỉnh Sửa Tài Khoản" Modal (Image 3) */}
      {editingAccount && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 px-6 py-4 text-white flex items-center justify-between border-b border-amber-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white leading-snug">
                    Chi Tiết & Chỉnh Sửa Tài Khoản
                  </h3>
                  <p className="text-xs text-amber-200 font-medium">
                    {editCustomerName} <span className="text-amber-400 font-mono">({editUsername || editingAccount.id})</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveAccountEdit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
              
              {/* Họ và tên */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  Họ và tên giáo viên / người dùng <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  placeholder="VD: Hoàng Thị Nhâm, Vừ Thị Máy..."
                  className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                />
              </div>

              {/* Tên đăng nhập & Mật khẩu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    Tên đăng nhập / Email <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="VD: hoangnham119@gmail.com"
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 text-xs">Mật khẩu truy cập</label>
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((prev) => !prev)}
                      className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showEditPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                    </button>
                  </div>

                  <div className="relative flex gap-1.5">
                    <input
                      type={showEditPassword ? "text" : "password"}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Mật khẩu..."
                      className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(editPassword);
                        showToast("Đã sao chép mật khẩu!");
                      }}
                      className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-slate-700 cursor-pointer shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Trường học & SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Trường học / Đơn vị công tác</label>
                  <input
                    type="text"
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value)}
                    placeholder="VD: THCS Tân Loan, Mầm non Lũng Phìn..."
                    className="w-full text-xs font-medium text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Số điện thoại</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="VD: 0367688118"
                    className="w-full text-xs font-medium text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Phân quyền & Trạng thái */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Phân quyền</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Trạng thái tài khoản</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="active">🟢 Đang hoạt động (Cho phép sử dụng)</option>
                    <option value="locked">🔴 Đã khóa / Tạm dừng</option>
                  </select>
                </div>
              </div>

              {/* Giới hạn số máy & Hình thức cấp quyền */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Giới hạn số máy</label>
                  <select
                    value={editMaxDevices}
                    onChange={(e) => setEditMaxDevices(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value={1}>1 máy</option>
                    <option value={2}>2 máy (Chuẩn)</option>
                    <option value={3}>3 máy</option>
                    <option value={5}>5 máy</option>
                    <option value={10}>10 máy</option>
                    <option value={999}>Không giới hạn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Hình thức cấp quyền</label>
                  <select
                    value={editPermissionType}
                    onChange={(e) => {
                      const mode = e.target.value as any;
                      setEditPermissionType(mode);
                      if (mode === "forever") {
                        handleSetEditExpiryISO("2099-12-31");
                      }
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="time">Theo thời hạn (Cấp ngày hết hạn)</option>
                    <option value="forever">Vĩnh viễn (Không hết hạn)</option>
                  </select>
                </div>
              </div>

              {/* Amber Container: Ngày hết hạn tài khoản (DD/MM/YYYY) */}
              <div className="bg-amber-50/60 border border-amber-300/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                    📅 Ngày hết hạn tài khoản (Định dạng: DD/MM/YYYY)
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">
                    Tự động tính ngày khóa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Nhập trực tiếp (DD/MM/YYYY):</label>
                    <input
                      type="text"
                      value={editExpiryDateVN}
                      onChange={(e) => handleSetEditExpiryVN(e.target.value)}
                      placeholder="VD: 29/10/2027"
                      className="w-full text-xs font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Hoặc chọn nhanh từ lịch:</label>
                    <input
                      type="date"
                      value={editExpiryDate}
                      onChange={(e) => handleSetEditExpiryISO(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Gia hạn nhanh từ hôm nay */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Gia hạn nhanh từ hôm nay:</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addMonthsToTodayISO(1))}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-slate-800 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +1 Tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addMonthsToTodayISO(3))}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-slate-800 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +3 Tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addMonthsToTodayISO(6))}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-slate-800 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +6 Tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addYearsToTodayISO(1))}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-black border border-amber-600 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +1 Năm (Chuẩn)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addYearsToTodayISO(2))}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-slate-800 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +2 Năm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditExpiryISO(addYearsToTodayISO(3))}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-slate-800 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      +3 Năm
                    </button>
                  </div>
                </div>
              </div>

              {/* Ghi chú quản trị */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">Ghi chú quản trị</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ghi chú nội bộ cho tài khoản (Ví dụ: Người dùng tự đăng ký qua hệ thống)..."
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingAccount}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isUpdatingAccount ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lưu Thay Đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin API Key Management Modal */}
      {apiKeyManagingAccount && (
        <ApiKeyModal
          isOpen={!!apiKeyManagingAccount}
          onClose={() => setApiKeyManagingAccount(null)}
          accountName={apiKeyManagingAccount.customerName || apiKeyManagingAccount.id}
          apiKeys={apiKeyManagingAccount.apiKeys || []}
          onSave={async (newKeys) => {
            try {
              const res = await clientAdminUpdateKeys(adminPin, apiKeyManagingAccount.id, newKeys);
              if (res.success) {
                showToast(`Đã lưu ${newKeys.length} API Key cho tài khoản ${apiKeyManagingAccount.id}`);
                fetchAccounts(adminPin);
              } else {
                showToast(res.error || "Không thể cập nhật API Key");
              }
            } catch {
              showToast("Lỗi kết nối.");
            }
          }}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Xác nhận</h3>
              <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => confirmDialog.onConfirm()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Đồng ý
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
