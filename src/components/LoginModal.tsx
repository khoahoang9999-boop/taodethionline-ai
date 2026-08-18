import React, { useState } from "react";
import { Lock, X, Key, ShieldAlert, Phone, Sparkles, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { getDeviceId } from "../lib/device-id";
import { clientLogin } from "../lib/client-auth";

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
  pendingActionName = "Tải File Hồ sơ Khảo thí"
}: LoginModalProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMessage("Vui lòng nhập Mã tài khoản được cấp.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const deviceId = getDeviceId();
      const data = await clientLogin(code.trim(), deviceId);

      if (!data || !data.success) {
        setErrorMessage(data?.error || "Mã tài khoản không hợp lệ hoặc đã bị khóa.");
        setIsLoading(false);
        return;
      }

      // Save token to localStorage
      localStorage.setItem("khaothi_account_code", data.account.id);
      localStorage.setItem("khaothi_account_data", JSON.stringify(data.account));

      onLoginSuccess(data.account);
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
              <h3 className="text-base font-bold text-white">Yêu cầu Đăng nhập Tài khoản</h3>
              <p className="text-xs text-blue-200">Để thực hiện: <strong className="text-amber-300 font-semibold">{pendingActionName}</strong></p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Note Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chính sách sử dụng tính năng:</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-700">
              Quý Thầy/Cô được tự do <strong>xem, cấu hình, soạn đề, đổi câu hỏi và xem ma trận đặc tả</strong>. Tính năng <strong>Tải file Word/PDF</strong> chỉ dành cho tài khoản đã được cấp phép.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mã tài khoản được cấp:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="Hãy nhập mã vào đây"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-bold tracking-wider text-blue-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase placeholder:normal-case placeholder:font-normal"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
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
              disabled={isLoading || !code.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xác thực tài khoản...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Đăng nhập</span>
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
