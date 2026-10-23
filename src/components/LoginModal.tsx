import React, { useState } from "react";
import { Lock, X, Key, ShieldAlert, Phone, Sparkles, CheckCircle2, UserCheck, AlertCircle, Edit3 } from "lucide-react";
import { getDeviceId } from "../lib/device-id";
import { clientLogin, clientUpdateProfile } from "../lib/client-auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (accountData: any) => void;
  pendingActionName?: string; // e.g. "Tải File Word đề thi"
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingActionName = "Sử dụng tính năng Khảo thí"
}: LoginModalProps) {
  const [loginUsername, setLoginUsername] = useState(
    () => localStorage.getItem("khaothi_account_username") || localStorage.getItem("khaothi_account_name") || ""
  );
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem("khaothi_account_display_name") || ""
  );
  const [code, setCode] = useState(
    () => localStorage.getItem("khaothi_account_password") || localStorage.getItem("khaothi_account_code") || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      setErrorMessage("Vui lòng nhập Tên đăng nhập.");
      return;
    }
    if (!code.trim()) {
      setErrorMessage("Vui lòng nhập Mật khẩu.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const deviceId = getDeviceId();
      const data = await clientLogin(loginUsername.trim(), code.trim(), deviceId);

      if (!data || !data.success) {
        setErrorMessage(
          data?.error ||
          "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
        );
        setIsLoading(false);
        return;
      }

      let finalAccount = { ...data.account };

      // Nếu giáo viên có nhập Tên hiển thị riêng lúc đăng nhập thì cập nhật ngay Tên hiển thị
      if (displayName.trim() && displayName.trim() !== finalAccount.customerName) {
        try {
          const profRes = await clientUpdateProfile(
            finalAccount.id,
            deviceId,
            displayName.trim(),
            finalAccount.phone,
            finalAccount.notes,
            finalAccount.avatar,
            finalAccount.username || loginUsername.trim()
          );
          if (profRes && profRes.success && profRes.account) {
            finalAccount = { ...finalAccount, ...profRes.account };
          } else {
            finalAccount.customerName = displayName.trim();
          }
        } catch {
          finalAccount.customerName = displayName.trim();
        }
      }

      // Save token & data to localStorage
      localStorage.setItem("khaothi_account_username", finalAccount.username || loginUsername.trim());
      localStorage.setItem("khaothi_account_display_name", finalAccount.customerName || "");
      localStorage.setItem("khaothi_account_name", finalAccount.customerName || loginUsername.trim());
      localStorage.setItem("khaothi_account_code", finalAccount.id);
      localStorage.setItem("khaothi_account_password", code.trim());
      localStorage.setItem("khaothi_account_data", JSON.stringify(finalAccount));

      onLoginSuccess(finalAccount);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đăng nhập Hệ thống</h3>
              <p className="text-xs text-blue-200">Yêu cầu xác thực: <strong className="text-amber-300 font-semibold">{pendingActionName}</strong></p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Note Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Hướng dẫn đăng nhập:</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-700">
              • Quý Thầy/Cô đăng nhập bằng <strong>Tên đăng nhập</strong> và <strong>Mật khẩu</strong>.<br/>
              • Tài khoản chưa cấp hạn dùng được <strong>dùng thử 5 lần soạn đề</strong> miễn phí. Giáo viên vui lòng tự nhập <strong>Gemini API Key</strong> cá nhân nếu tài khoản chưa có Key.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* 1. Login Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>1. Tên đăng nhập (*):</span>
                <span className="text-[10.5px] text-indigo-600 font-medium">Dùng để xác thực</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Ví dụ: admin, cothao_tinhoc..."
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-indigo-950 bg-indigo-50/30 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                  autoFocus
                />
                <UserCheck className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* 2. Separate Display Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>2. Tên hiển thị riêng (Họ và tên giáo viên):</span>
                <span className="text-[10.5px] text-blue-600 font-medium">Hiện trên giao diện</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Ví dụ: Thầy Nguyễn Văn A (để trống giữ tên hiện tại)"
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Edit3 className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* 3. Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                3. Mật khẩu (*):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Nhập mật khẩu của bạn..."
                  className="w-full pl-9 pr-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10.5px] text-slate-500 italic">Nhập tên đăng nhập và mật khẩu được Admin cấp.</p>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 space-y-2">
                <div className="flex items-start gap-2 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="whitespace-pre-line leading-relaxed">{errorMessage}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !loginUsername.trim() || !code.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xác thực tài khoản...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Đăng nhập hệ thống</span>
                </>
              )}
            </button>
          </form>

          {/* Contact Admin Notice */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1.5">
            <p className="text-[11px] text-slate-500">Chưa có mã hoặc cần gia hạn / giải phóng thiết bị?</p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-700">
              <a href="tel:0989982818" className="text-emerald-700 hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" /> 0989.982.818
              </a>
              <span className="text-slate-300">•</span>
              <a href="https://zalo.me/0978468986" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                Zalo: 0978.468.986
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
