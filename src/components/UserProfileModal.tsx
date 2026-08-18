import React, { useState, useEffect } from "react";
import { User, X, Check, ShieldCheck, Phone, Calendar, Laptop, Sparkles, Key, AlertCircle, Edit3 } from "lucide-react";
import { getDeviceId } from "../lib/device-id";
import { clientUpdateProfile } from "../lib/client-auth";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdateSuccess: (updatedAccount: any) => void;
  onOpenApiKeyModal?: () => void;
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

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
  onOpenApiKeyModal
}: UserProfileModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute active user account safely
  const activeAccount = currentUser || (() => {
    try {
      const raw = localStorage.getItem("khaothi_account_data");
      if (raw) return JSON.parse(raw);
      const code = localStorage.getItem("khaothi_account_code");
      if (code) {
        const normalized = code.trim().toUpperCase();
        return {
          id: normalized,
          customerName: normalized === "ADMIN123" ? "Admin Master" : `Tài khoản (${normalized})`,
          expiryDate: "2099-12-31",
          maxDevices: normalized === "1111" ? 8 : 2,
          devices: []
        };
      }
    } catch {}
    return {
      id: "GUEST",
      customerName: "Khách (Chưa đăng nhập)",
      expiryDate: "---",
      maxDevices: 1,
      devices: []
    };
  })();

  useEffect(() => {
    if (isOpen) {
      setCustomerName(activeAccount?.customerName || "");
      setPhone(activeAccount?.phone || "");
      setNotes(activeAccount?.notes || "");
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, activeAccount?.customerName, activeAccount?.phone, activeAccount?.notes]);

  if (!isOpen) return null;

  const isAdmin =
    activeAccount?.id?.trim().toUpperCase() === "TK-KHOA-2026" ||
    activeAccount?.id?.trim().toUpperCase() === "ADMIN123" ||
    activeAccount?.notes?.toLowerCase().includes("admin") ||
    activeAccount?.customerName?.toLowerCase().includes("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage("Vui lòng nhập tên hiển thị.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const deviceId = getDeviceId();
      const accountId = activeAccount?.id || localStorage.getItem("khaothi_account_code") || "1111";
      
      const result = await clientUpdateProfile(
        accountId,
        deviceId,
        customerName.trim(),
        phone.trim(),
        notes.trim()
      );

      if (result.success && result.account) {
        setSuccessMessage("Đã cập nhật thông tin thành công!");
        onUpdateSuccess(result.account);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Still save locally for immediate UI update even if offline
        const localUpdated = {
          ...activeAccount,
          customerName: customerName.trim(),
          phone: phone.trim(),
          notes: notes.trim()
        };
        localStorage.setItem("khaothi_account_data", JSON.stringify(localUpdated));
        onUpdateSuccess(localUpdated);
        setSuccessMessage("Đã lưu tên hiển thị!");
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      const localUpdated = {
        ...activeAccount,
        customerName: customerName.trim(),
        phone: phone.trim(),
        notes: notes.trim()
      };
      localStorage.setItem("khaothi_account_data", JSON.stringify(localUpdated));
      onUpdateSuccess(localUpdated);
      setSuccessMessage("Đã cập nhật tên hiển thị!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
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
                <h3 className="text-base font-bold text-white">Thông tin Tài khoản</h3>
                {isAdmin && (
                  <span className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                    Quản trị
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200">
                Mã tài khoản: <span className="font-mono font-bold text-amber-300">{activeAccount?.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Account Overview Cards */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Hạn sử dụng:
              </span>
              <span className="font-bold text-slate-800">
                {formatDateVN(activeAccount?.expiryDate)}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Laptop className="w-3 h-3 text-slate-400" /> Cho phép:
              </span>
              <span className="font-bold text-slate-800">
                {activeAccount?.maxDevices || 2} máy
              </span>
            </div>
          </div>

          {/* Customer Name Input (Free Edit) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                Tên hiển thị / Họ tên giáo viên:
              </span>
              <span className="text-[10.5px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Tùy ý đổi tên</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ví dụ: Thầy Khoa"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
              autoFocus
            />
            <p className="text-[11px] text-slate-500">
              Tên này sẽ hiển thị trên góc trên thanh công cụ và các thông báo của hệ thống.
            </p>
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
