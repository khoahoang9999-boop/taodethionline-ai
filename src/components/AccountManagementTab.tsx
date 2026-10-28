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
  clientAdminSetExpiry,
  clientAdminResetTrial,
  isAccountLicensed,
  sanitizeUsername
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
  Calendar,
  CalendarPlus,
  Laptop,
  PlusCircle,
  AlertTriangle,
  User,
  Sparkles,
  ShieldAlert,
  Info,
  Edit3,
  Pencil,
  Save,
  X,
  Zap
} from "lucide-react";

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
  apiKeys?: ApiKeyItem[];
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

export default function AccountManagementTab({ currentUser }: { currentUser?: any }) {
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem("khaothi_admin_pin") || "");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // ... (other state variables)
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Renewal states
  const [renewingAccount, setRenewingAccount] = useState<AccountData | null>(null);
  const [renewCustomDate, setRenewCustomDate] = useState("");
  const [isRenewing, setIsRenewing] = useState(false);

  // Increase Devices states
  const [increasingAccount, setIncreasingAccount] = useState<AccountData | null>(null);
  const [customMaxDevices, setCustomMaxDevices] = useState<number>(2);
  const [isUpdatingDevices, setIsUpdatingDevices] = useState(false);

  // API Key Management state for Admin
  const [apiKeyManagingAccount, setApiKeyManagingAccount] = useState<AccountData | null>(null);

  // Edit Account Info (Username, Customer Name, Phone, MaxDevices, etc.)
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editMaxDevices, setEditMaxDevices] = useState(2);
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Change Password Modal states
  const [changingPasswordAccount, setChangingPasswordAccount] = useState<AccountData | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleOpenChangePassword = (acc: AccountData) => {
    setChangingPasswordAccount(acc);
    setNewPasswordInput(acc.password || acc.id);
  };

  const handleSaveChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPasswordAccount) return;
    const cleanPass = newPasswordInput.trim();
    if (!cleanPass) {
      showToast("Mật khẩu mới không được để trống.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await clientAdminChangePassword(adminPin, changingPasswordAccount.id, cleanPass);
      if (result && result.success) {
        showToast(`✓ Đã đổi mật khẩu cho tài khoản "${changingPasswordAccount.customerName}" thành công!`);
        setChangingPasswordAccount(null);
        setNewPasswordInput("");
        fetchAccounts(adminPin);
      } else {
        showToast(result?.error || "Không thể đổi mật khẩu.");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi đổi mật khẩu.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleQuickRenew1Year1Day = async (acc: AccountData) => {
    setIsLoading(true);
    try {
      const result = await clientAdminQuickRenew1Year1Day(adminPin, acc.id);
      if (result && result.success) {
        showToast(`✓ Đã cấp hạn dùng 1 năm + 1 ngày cho ${acc.customerName}! (Hạn mới: ${formatDateVN(result.account?.expiryDate)})`);
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

  const handleResetTrial = async (acc: AccountData) => {
    setIsLoading(true);
    try {
      const result = await clientAdminResetTrial(adminPin, acc.id);
      if (result && result.success) {
        showToast(`✓ Đã đặt lại lượt dùng thử về 0/5 cho ${acc.customerName}!`);
        fetchAccounts(adminPin);
      } else {
        showToast(result?.error || "Không thể đặt lại lượt dùng thử.");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi đặt lại lượt dùng thử.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditAccount = (acc: AccountData) => {
    setEditingAccount(acc);
    setEditUsername(acc.username || acc.customerName || "");
    setEditCustomerName(acc.customerName || acc.username || "");
    setEditPhone(acc.phone || "");
    setEditNotes(acc.notes || "");
    setEditMaxDevices(acc.maxDevices || 2);
    setEditExpiryDate(acc.expiryDate || "2027-12-31");
    setEditAvatar(acc.avatar || "");
  };

  const handleSaveAccountEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    const rawEdit = editUsername.trim() || editCustomerName.trim();
    const cleanUsername = sanitizeUsername(rawEdit) || rawEdit;
    const cleanCustomerName = editCustomerName.trim() || cleanUsername;
    if (!cleanUsername) {
      showToast("Tên đăng nhập không được để trống.");
      return;
    }

    setIsUpdatingAccount(true);
    try {
      const result = await clientAdminUpdateAccount(adminPin, editingAccount.id, {
        username: cleanUsername,
        customerName: cleanCustomerName,
        phone: editPhone.trim(),
        notes: editNotes.trim(),
        maxDevices: Number(editMaxDevices) || 2,
        expiryDate: editExpiryDate.trim() || editingAccount.expiryDate,
        avatar: editAvatar
      });

      if (result && result.success) {
        showToast(`Đã cập nhật tài khoản "${cleanUsername}" thành công!`);
        setEditingAccount(null);
        fetchAccounts(adminPin);
      } else {
        showToast(result?.error || "Không thể cập nhật thông tin tài khoản.");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi lưu thông tin.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  useEffect(() => {
    // Auto-verify if admin
    const id = currentUser?.id?.trim().toUpperCase() || "";
    const usernameNorm = currentUser?.username?.trim().toLowerCase() || "";
    const nameNorm = currentUser?.customerName?.toLowerCase() || "";
    const notesNorm = currentUser?.notes?.toLowerCase() || "";
    const isAdmin = id === "TK-KHOA-2026" || id === "ADMIN123" || usernameNorm === "admin" || notesNorm.includes("admin") || nameNorm.includes("admin");
    if (isAdmin) {
      setAdminPin("123456");
      if (!isUnlocked) {
        setIsUnlocked(true);
        setTimeout(() => fetchAccounts("123456"), 100);
      }
    } else {
      setIsUnlocked(false);
      setAccounts([]);
      setAdminPin("");
    }
  }, [currentUser?.id, currentUser?.username, currentUser?.customerName, isUnlocked]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      const deletedSet = rawDeleted ? new Set<string>(JSON.parse(rawDeleted).map((s: string) => String(s).toUpperCase())) : new Set<string>();
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUser = newUsername.trim() || newCustomerName.trim();
    const loginName = sanitizeUsername(rawUser) || rawUser;
    if (!loginName) {
      showToast("Vui lòng nhập Tên đăng nhập (viết liền không dấu như Gmail).");
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
        customerName: loginName,
        password: passwordToSet,
        phone: newPhone.trim(),
        expiryDate: newExpiryDate,
        maxDevices: newMaxDevices,
        notes: newNotes.trim()
      });

      if (result.success && result.account) {
        showToast(`✓ Đã tạo tài khoản thành công (Tên đăng nhập: ${loginName}, Mật khẩu: ${passwordToSet})`);
        setNewCode("");
        setNewUsername("");
        setNewCustomerName("");
        setNewPhone("");
        setNewNotes("");
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
    return;
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
    return;
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

  const handleCopyZaloNotice = (acc: AccountData) => {
    const pass = acc.password || acc.id;
    const user = acc.username || acc.customerName;
    const text = `THÔNG BÁO CẤP TÀI KHOẢN KHẢO THÍ GDPT 2018\n--------------------------------------------\n• Tên đăng nhập: ${user}\n• Mật khẩu: ${pass}\n• Hạn sử dụng: ${formatDateVN(acc.expiryDate)}\n• Số thiết bị tối đa: ${acc.maxDevices} máy\n--------------------------------------------\nĐịa chỉ ứng dụng: https://taodethionline-ai.vercel.app/`;

    navigator.clipboard.writeText(text);
    setCopiedCode(acc.id);
    showToast(`Đã sao chép tin nhắn cấp tài khoản cho ${user}`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleRenewAccount = async (id: string, years: number = 1, customExpiryDate?: string) => {
    setIsRenewing(true);
    try {
      const result = await clientAdminRenewAccount(adminPin, id, years, customExpiryDate);
      if (result.success && result.account) {
        const newDateFormatted = formatDateVN(result.account.expiryDate);
        showToast(`Đã gia hạn thành công tài khoản "${id}" đến ${newDateFormatted}`);
        fetchAccounts(adminPin);
        if (renewingAccount && renewingAccount.id === id) {
          setRenewingAccount(result.account);
        }
      } else {
        showToast(result.error || "Lỗi khi gia hạn tài khoản.");
      }
    } catch {
      showToast("Lỗi kết nối.");
    } finally {
      setIsRenewing(false);
    }
  };

  const handleCopyRenewNotice = (acc: AccountData) => {
    const text = `THÔNG BÁO GIA HẠN TÀI KHOẢN KHẢO THÍ GDPT 2018\n--------------------------------------------\nKính gửi: ${acc.customerName}\n• Hạn sử dụng mới: ${formatDateVN(acc.expiryDate)}\n• Trạng thái: Đã gia hạn thành công\n--------------------------------------------\nĐịa chỉ ứng dụng: https://taodethionline-ai.vercel.app/`;
    navigator.clipboard.writeText(text);
    showToast("Đã sao chép tin nhắn Zalo gia hạn thành công!");
  };

  const handleUpdateMaxDevices = async (id: string, newMaxDevices: number) => {
    if (newMaxDevices < 1) return;
    setIsUpdatingDevices(true);
    try {
      const result = await clientAdminUpdateAccount(adminPin, id, { maxDevices: newMaxDevices });
      if (result.success && result.account) {
        showToast(`Đã nâng hạn mức thiết bị cho tài khoản "${id}" lên ${newMaxDevices} máy.`);
        fetchAccounts(adminPin);
        if (increasingAccount && increasingAccount.id === id) {
          setIncreasingAccount(result.account);
          setCustomMaxDevices(result.account.maxDevices);
        }
      } else {
        showToast(result.error || "Lỗi khi cập nhật số máy.");
      }
    } catch {
      showToast("Lỗi kết nối.");
    } finally {
      setIsUpdatingDevices(false);
    }
  };

  const handleCopyIncreaseNotice = (acc: AccountData) => {
    const text = `THÔNG BÁO TĂNG SỐ LƯỢNG MÁY SỬ DỤNG KHẢO THÍ GDPT 2018\n--------------------------------------------\nKính gửi: ${acc.customerName}\n• Số thiết bị tối đa mới: ${acc.maxDevices} máy\n• Trạng thái: Đã nâng hạn mức thiết bị thành công\n--------------------------------------------\nĐịa chỉ ứng dụng: https://taodethionline-ai.vercel.app/`;
    navigator.clipboard.writeText(text);
    showToast("Đã sao chép tin nhắn Zalo thông báo tăng số máy!");
  };

  // Filter and Sort accounts: Admin on top, rest sorted alphabetically A -> Z
  const filteredAccounts = accounts
    .filter(
      (a) =>
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.password || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.notes || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone.includes(searchTerm)
    )
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

      // Both admin or both normal: sort alphabetically A to Z by Customer Name
      const nameA = a.customerName || a.id;
      const nameB = b.customerName || b.id;
      return nameA.localeCompare(nameB, "vi", { sensitivity: "base" });
    });

  // Lock Screen if Admin PIN not entered
  if (!isUnlocked) {
    const isAdmin = currentUser?.id?.trim().toUpperCase() === "TK-KHOA-2026" || currentUser?.id?.trim().toUpperCase() === "ADMIN123" || currentUser?.notes?.toLowerCase().includes("admin") || currentUser?.customerName?.toLowerCase().includes("admin");
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
    <div className="w-full min-h-full flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Cố định toàn chiều ngang (Sticky Bar) */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white border-b border-indigo-700/80 shadow-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30 text-blue-300 text-xs font-semibold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hệ thống Quản trị Quyền Cấp phép</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">Quản trị Tài khoản Khách hàng</h2>
            <p className="text-xs text-blue-200">
              Tạo mã đăng nhập, quy định tối đa 2 máy/tài khoản, giải phóng thiết bị và gán API Key riêng.
            </p>
          </div>
        </div>
      </div>

      {/* Nội dung cuộn bên dưới (cuộn đến chân mép là ẩn đi) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6 max-w-7xl mx-auto">
        {/* Grid: Create Form + Overview Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Cấp Mới Tài Khoản Khách Hàng</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Chính sách: Tối đa 2 máy/tài khoản
            </span>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username (Tên đăng nhập) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  1. Tên đăng nhập (*):
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setNewCustomerName(e.target.value);
                  }}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Account Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">2. Mật khẩu đăng nhập (*):</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[10.5px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Tạo mật khẩu tự động
                  </button>
                </div>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="VD: 123456 (để trống sẽ là 123456)"
                  className="w-full text-xs font-bold text-blue-900 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số điện thoại / Zalo:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="VD: 0989982818"
                  className="w-full text-xs font-semibold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ngày hết hạn sử dụng:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setNewExpiryDate("2099-12-31")}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 cursor-pointer whitespace-nowrap"
                  >
                    Vĩnh viễn
                  </button>
                </div>
              </div>

              {/* Max Devices */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số máy cho phép tối đa:</label>
                <select
                  value={newMaxDevices}
                  onChange={(e) => setNewMaxDevices(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value={1}>1 máy</option>
                  <option value={2}>2 máy (Khuyên dùng chuẩn)</option>
                  <option value={3}>3 máy</option>
                  <option value={5}>5 máy</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ghi chú thêm:</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ghi chú đợt thanh toán..."
                  className="w-full text-xs text-slate-700 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isCreating ? "Đang tạo tài khoản..." : "Tạo tài khoản mới"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Stats Summary */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Thống kê cấp phép hệ thống
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Tổng tài khoản</span>
                <span className="text-xl font-black text-blue-400">{accounts.length}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Đang hoạt động</span>
                <span className="text-xl font-black text-emerald-400">
                  {accounts.filter((a) => a.status === "active").length}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Thiết bị đang gán</span>
                <span className="text-xs text-slate-300 font-bold">
                  {accounts.reduce((acc, a) => acc + (a.devices?.length || 0), 0)} máy đã kích hoạt
                </span>
              </div>
              <Laptop className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-amber-300">💡 Lưu ý thiết bị máy thứ 3:</p>
            <p className="leading-relaxed">
              Mỗi mã mặc định gán đúng 2 máy. Khi người dùng sang máy thứ 3, hệ thống sẽ báo lỗi. Nếu khách đổi máy, thầy/cô chỉ cần bấm nút <strong>"Giải phóng máy"</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Account Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Danh sách Tài khoản đã cấp phép ({filteredAccounts.length})</h3>
            <p className="text-xs text-slate-500">Quản trị trạng thái, xóa tài khoản hoặc giải phóng máy</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên khách, SĐT..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <button
              type="button"
              onClick={() => fetchAccounts(adminPin)}
              className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
              title="Làm mới danh sách"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Mật Khẩu / Mã TK</th>
                <th className="py-2.5 px-3">Tên Đăng Nhập / Tên Khách / SĐT</th>
                <th className="py-2.5 px-3">Hạn Sử Dụng / Cấp Nhanh</th>
                <th className="py-2.5 px-3 text-center">Chế Độ & Lượt Dùng</th>
                <th className="py-2.5 px-3 text-center">Đã Đăng Ký Máy</th>
                <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                <th className="py-2.5 px-3 text-right">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const deviceCount = acc.devices?.length || 0;
                  const isFull = deviceCount >= acc.maxDevices;
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const isExpired = acc.expiryDate && acc.expiryDate !== "2099-12-31" && acc.expiryDate < todayStr;
                  const isLicensed = isAccountLicensed(acc.expiryDate);
                  const trialCount = acc.trialCount || 0;

                  return (
                    <tr
                      key={acc.id}
                      className={`transition-colors ${
                        acc.customerName.toLowerCase().includes("admin") ||
                        acc.id.toLowerCase().includes("admin") ||
                        (acc.notes && acc.notes.toLowerCase().includes("admin"))
                          ? "bg-amber-50/60 hover:bg-amber-100/70 border-b border-amber-200/60"
                          : "hover:bg-slate-50/80 border-b border-slate-100"
                      }`}
                    >
                      {/* Password / ID */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg text-xs">
                              {acc.password || acc.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenChangePassword(acc)}
                              className="p-1 hover:bg-indigo-50 text-indigo-600 rounded cursor-pointer transition-colors"
                              title="Cấp / Đổi Mật khẩu cho tài khoản này"
                            >
                              <Key className="w-3.5 h-3.5 text-indigo-600" />
                            </button>
                            {(acc.customerName.toLowerCase().includes("admin") ||
                              acc.id.toLowerCase().includes("admin") ||
                              (acc.notes && acc.notes.toLowerCase().includes("admin"))) && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300/80 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                            <span>Mật khẩu</span>
                            {acc.id && <span className="text-slate-400 font-mono text-[9.5px]">(Mã: {acc.id})</span>}
                          </div>
                        </div>
                      </td>

                      {/* Username, Avatar & Phone */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                            <img
                              src={acc.avatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(acc.id || acc.username || acc.customerName)}&backgroundColor=c0aede,b6e3f4,ffdfbf`}
                              alt={acc.username || acc.customerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 group">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide shrink-0">Tên ĐN:</span>
                              <span className="font-bold text-slate-900 bg-blue-50/90 text-blue-900 border border-blue-200/80 px-2 py-0.5 rounded-md text-xs font-mono inline-flex items-center gap-1 shadow-2xs">
                                <User className="w-3 h-3 text-blue-600 shrink-0" />
                                <span className="truncate max-w-[140px]">{acc.username || acc.customerName || acc.id}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenEditAccount(acc)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer shrink-0"
                                title="Chỉnh sửa tên đăng nhập / Avatar"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                              </button>
                            </div>
                            <div className="text-[11px] font-medium text-slate-600 flex items-center gap-2 flex-wrap">
                              {acc.customerName && acc.customerName !== acc.username && (
                                <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                                  Khách: {acc.customerName}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-slate-500">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{acc.phone || "Chưa nhập SĐT"}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Expiry Date & Quick +1 year +1 day */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          <div>
                            {isExpired ? (
                              <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md text-[10.5px]">
                                <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>Hết hạn: {formatDateVN(acc.expiryDate)}</span>
                              </span>
                            ) : isLicensed ? (
                              <span
                                className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                                  acc.expiryDate === "2099-12-31"
                                    ? "bg-purple-50 text-purple-700 font-bold border border-purple-200"
                                    : "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                }`}
                              >
                                {formatDateVN(acc.expiryDate)}
                              </span>
                            ) : (
                              <span className="text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[10.5px] font-medium">
                                Chưa cấp hạn
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuickRenew1Year1Day(acc)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-md cursor-pointer transition-colors shadow-xs"
                            title="Cấp nhanh 1 năm và 1 ngày, lập tức mở khóa không giới hạn"
                          >
                            <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                            <span>+1 năm + 1 ngày</span>
                          </button>
                        </div>
                      </td>

                      {/* Trial vs Licensed Mode */}
                      <td className="py-3 px-3 text-center">
                        {isLicensed ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10.5px]">
                            👑 Bản quyền
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10.5px] ${
                              trialCount >= 5
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}>
                              {trialCount >= 5 ? "🔒 Khóa (5/5)" : `⏳ ${trialCount}/5 lượt`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleResetTrial(acc)}
                              className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                              title="Đặt lại số lượt dùng thử về 0/5"
                            >
                              Đặt lại 0/5
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Device Count */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              isFull
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : deviceCount > 0
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            <Laptop className="w-3 h-3" />
                            <span>
                              {acc.maxDevices} máy
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIncreasingAccount(acc);
                              setCustomMaxDevices(acc.maxDevices);
                            }}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition-colors"
                            title="Tăng / Thay đổi số máy tối đa"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {acc.status === "active" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10.5px]">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10.5px]">
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Password */}
                          <button
                            type="button"
                            onClick={() => handleOpenChangePassword(acc)}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg font-bold text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            title="Đổi mật khẩu / Mã tài khoản"
                          >
                            <Key className="w-3 h-3 text-indigo-600" />
                            <span>Đổi MK</span>
                          </button>

                          {/* Edit Customer Name & Info */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditAccount(acc)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-bold text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            title="Đổi tên hiển thị / Sửa thông tin tài khoản"
                          >
                            <Pencil className="w-3 h-3 text-blue-600" />
                            <span>Sửa tên</span>
                          </button>

                          {/* Copy Zalo Notice */}
                          <button
                            type="button"
                            onClick={() => handleCopyZaloNotice(acc)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            title="Sao chép tin nhắn Zalo cấp mã"
                          >
                            {copiedCode === acc.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* API Key Management */}
                          <button
                            type="button"
                            onClick={() => setApiKeyManagingAccount(acc)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg font-bold text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            title="Cấu hình API Key cho tài khoản này"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            <span>{acc.apiKeys && acc.apiKeys.length > 0 ? `${acc.apiKeys.length} Key` : "+ Key"}</span>
                          </button>

                          {/* Renew Account */}
                          <button
                            type="button"
                            onClick={() => {
                              setRenewingAccount(acc);
                              setRenewCustomDate(acc.expiryDate === "2099-12-31" ? "" : acc.expiryDate);
                            }}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            title="Gia hạn thời gian sử dụng (+1 năm, +2 năm hoặc vĩnh viễn)"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Gia hạn</span>
                          </button>

                          {/* Reset Devices */}
                          <button
                            type="button"
                            onClick={() => handleResetDevices(acc.id)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            title="Xóa danh sách máy đã đăng ký để khách đổi máy mới"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Giải phóng máy</span>
                          </button>

                          {/* Toggle Lock */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(acc.id)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              acc.status === "active"
                                ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={acc.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {acc.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Xóa tài khoản vĩnh viễn"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Renewal Modal */}
      {renewingAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Gia Hạn Sử Dụng Tài Khoản</h3>
                  <p className="text-[11px] text-slate-500 font-mono font-semibold">Mã: {renewingAccount.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRenewingAccount(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Account Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-800">{renewingAccount.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn sử dụng hiện tại:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {formatDateVN(renewingAccount.expiryDate)}
                  </span>
                </div>
              </div>

              {/* Quick Renewal Options */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Chọn gia hạn nhanh:</label>

                {/* Quick 1 year + 1 day button */}
                <button
                  type="button"
                  disabled={isRenewing}
                  onClick={() => {
                    handleQuickRenew1Year1Day(renewingAccount);
                    setRenewingAccount(null);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>⚡ Cấp nhanh 1 năm + 1 ngày (Mở khóa không giới hạn)</span>
                </button>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isRenewing}
                    onClick={() => handleRenewAccount(renewingAccount.id, 1)}
                    className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>+1 Năm</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRenewing}
                    onClick={() => handleRenewAccount(renewingAccount.id, 2)}
                    className="py-2 px-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>+2 Năm</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRenewing}
                    onClick={() => handleRenewAccount(renewingAccount.id, 1, "2099-12-31")}
                    className="py-2 px-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Vĩnh Viễn</span>
                  </button>
                </div>
              </div>

              {/* Custom Expiry Date */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block">Hoặc chọn ngày hết hạn cụ thể:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={renewCustomDate}
                    onChange={(e) => setRenewCustomDate(e.target.value)}
                    className="flex-1 text-xs font-semibold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    disabled={isRenewing || !renewCustomDate}
                    onClick={() => handleRenewAccount(renewingAccount.id, 1, renewCustomDate)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50 text-xs"
                  >
                    Lưu ngày này
                  </button>
                </div>
              </div>

              {/* Copy Zalo Notice Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyRenewNotice(renewingAccount)}
                  className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  <span>Sao chép tin nhắn Zalo gia hạn gửi khách hàng</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setRenewingAccount(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Increase Devices Modal */}
      {increasingAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tăng Số Lượng Thiết Bị Cho Phép</h3>
                  <p className="text-[11px] text-slate-500 font-mono font-semibold">Mã: {increasingAccount.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIncreasingAccount(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Account Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-800">{increasingAccount.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trạng thái thiết bị:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {(increasingAccount.devices?.length || 0)} / {increasingAccount.maxDevices} máy
                  </span>
                </div>
              </div>

              {/* Quick Add Options */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Chọn tăng nhanh hạn mức:</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    disabled={isUpdatingDevices}
                    onClick={() => handleUpdateMaxDevices(increasingAccount.id, increasingAccount.maxDevices + 1)}
                    className="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+1 Máy</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingDevices}
                    onClick={() => handleUpdateMaxDevices(increasingAccount.id, increasingAccount.maxDevices + 2)}
                    className="py-2.5 px-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+2 Máy</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingDevices}
                    onClick={() => handleUpdateMaxDevices(increasingAccount.id, 5)}
                    className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <Laptop className="w-4 h-4" />
                    <span>5 Máy</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingDevices}
                    onClick={() => handleUpdateMaxDevices(increasingAccount.id, 10)}
                    className="py-2.5 px-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 text-[11px]"
                  >
                    <Laptop className="w-4 h-4" />
                    <span>10 Máy</span>
                  </button>
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block">Hoặc nhập số máy tối đa cụ thể:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customMaxDevices}
                    onChange={(e) => setCustomMaxDevices(parseInt(e.target.value) || 1)}
                    className="flex-1 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    disabled={isUpdatingDevices || customMaxDevices < 1}
                    onClick={() => handleUpdateMaxDevices(increasingAccount.id, customMaxDevices)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50 text-xs"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>

              {/* Copy Zalo Notice Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyIncreaseNotice(increasingAccount)}
                  className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  <span>Sao chép tin nhắn Zalo tăng số máy gửi khách hàng</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIncreasingAccount(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Account Info & Display Name Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Chỉnh sửa Thông tin Tài khoản</h3>
                  <p className="text-xs text-slate-500">
                    Mã tài khoản: <strong className="font-mono text-blue-600">{editingAccount.id}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccountEdit} className="space-y-4">
              {/* Avatar Preview & Quick Edit */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-white shrink-0 shadow-sm">
                  <img
                    src={editAvatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(editingAccount.id || editCustomerName)}&backgroundColor=c0aede,b6e3f4,ffdfbf`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Ảnh đại diện (Avatar):</label>
                    {editAvatar && (
                      <button
                        type="button"
                        onClick={() => setEditAvatar("")}
                        className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                      >
                        Đặt lại mặc định
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Dán link ảnh hoặc để trống để dùng mẫu..."
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Username (Tên đăng nhập) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tên đăng nhập (*):
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => {
                    setEditUsername(e.target.value);
                    setEditCustomerName(e.target.value);
                  }}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Phone & Max Devices in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Số điện thoại:</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Ví dụ: 0989.982.818"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Số máy tối đa (thiết bị):</label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={editMaxDevices}
                    onChange={(e) => setEditMaxDevices(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Hạn sử dụng:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditExpiryDate("2026-12-31")}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                    >
                      Hết 2026
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditExpiryDate("2027-12-31")}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                    >
                      Hết 2027
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditExpiryDate("2099-12-31")}
                      className="text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-200 px-1.5 py-0.5 rounded font-bold cursor-pointer"
                    >
                      Vĩnh viễn
                    </button>
                  </div>
                </label>
                <input
                  type="date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Ghi chú quản lý:</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ghi chú nội bộ cho tài khoản..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingAccount}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isUpdatingAccount ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu thông tin</span>
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

      {/* Change Password Modal */}
      {changingPasswordAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Cấp / Đổi Mật Khẩu</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">{changingPasswordAccount.customerName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangingPasswordAccount(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChangePassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mật khẩu mới (Mã tài khoản mới):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value.toUpperCase())}
                    placeholder="Nhập mật khẩu mới..."
                    className="flex-1 text-xs font-bold text-blue-900 border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const num = Math.floor(1000 + Math.random() * 9000);
                      setNewPasswordInput(`TK-TINHOC-${num}`);
                    }}
                    className="px-2.5 py-1 text-[10.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 cursor-pointer"
                  >
                    Ngẫu nhiên
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-500 italic">Mã tức là Mật khẩu người dùng dùng để đăng nhập.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChangingPasswordAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword || !newPasswordInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isChangingPassword ? "Đang lưu..." : "Lưu mật khẩu mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
    </div>
  );
}
