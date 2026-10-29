import React, { useState } from "react";
import { Lock, X, Key, ShieldAlert, Phone, Sparkles, CheckCircle2, UserCheck, AlertCircle, Edit3, Eye, EyeOff, UserPlus, User, Building2 } from "lucide-react";
import { getDeviceId } from "../lib/device-id";
import { clientLogin, clientRegister, sanitizeUsername } from "../lib/client-auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (accountData: any) => void;
  pendingActionName?: string; // e.g. "Tải File Word đề thi"
  initialMode?: "login" | "register";
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingActionName = "Sử dụng tính năng Khảo thí",
  initialMode = "login"
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode || "login");
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  // Login Form States
  const [loginUsername, setLoginUsername] = useState(
    () => localStorage.getItem("khaothi_account_username") || localStorage.getItem("khaothi_account_name") || ""
  );
  const [code, setCode] = useState(
    () => localStorage.getItem("khaothi_account_password") || ""
  );
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form States
  const [regUsername, setRegUsername] = useState("");
  const [regCustomerName, setRegCustomerName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regNotes, setRegNotes] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUser = loginUsername.replace(/^@+/, "").trim();
    const cleanUser = sanitizeUsername(rawUser) || rawUser.toLowerCase();
    const cleanPass = code.trim();
    if (!cleanUser) {
      setErrorMessage("Vui lòng nhập Tên đăng nhập (viết liền không dấu như Gmail).");
      return;
    }
    if (!cleanPass) {
      setErrorMessage("Vui lòng nhập Mật khẩu.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const deviceId = getDeviceId();
      const data = await clientLogin(cleanUser, cleanPass, deviceId, { isExplicitLogin: true });

      if (!data || !data.success) {
        setErrorMessage(
          data?.error ||
          "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
        );
        setIsLoading(false);
        return;
      }

      const finalAccount = { ...data.account };

      // Save token & data to localStorage
      localStorage.setItem("khaothi_account_username", finalAccount.username || finalAccount.customerName || cleanUser);
      localStorage.setItem("khaothi_account_name", finalAccount.customerName || finalAccount.username || cleanUser);
      localStorage.setItem("khaothi_account_code", finalAccount.id);
      localStorage.setItem("khaothi_account_password", finalAccount.password || cleanPass);
      localStorage.setItem("khaothi_account_data", JSON.stringify(finalAccount));

      setSuccessMessage("✓ Đăng nhập hệ thống thành công!");
      setTimeout(() => {
        onLoginSuccess(finalAccount);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUser = regUsername.replace(/^@+/, "").trim();
    const cleanUser = sanitizeUsername(rawUser);
    const cleanName = regCustomerName.trim();
    const cleanPass = regPassword.trim();
    const cleanConfirm = regConfirmPassword.trim();

    if (!cleanUser) {
      setErrorMessage("Vui lòng nhập Tên đăng nhập (viết liền không dấu như Gmail).");
      return;
    }
    if (cleanUser.length < 3) {
      setErrorMessage("Tên đăng nhập phải có ít nhất 3 ký tự (chữ cái không dấu hoặc số).");
      return;
    }
    if (!cleanName) {
      setErrorMessage("Vui lòng nhập Họ tên hiển thị của Quý Thầy/Cô.");
      return;
    }
    if (!cleanPass) {
      setErrorMessage("Vui lòng nhập Mật khẩu.");
      return;
    }
    if (cleanPass.length < 4) {
      setErrorMessage("Mật khẩu phải có ít nhất 4 ký tự.");
      return;
    }
    if (cleanPass !== cleanConfirm) {
      setErrorMessage("Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại!");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const deviceId = getDeviceId();
      const res = await clientRegister(
        cleanUser,
        cleanPass,
        cleanName,
        regPhone.trim(),
        regNotes.trim(),
        deviceId
      );

      if (!res.success || !res.account) {
        setErrorMessage(res.error || "Không thể đăng ký tài khoản. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      const finalAccount = res.account;

      // Save token & data to localStorage
      localStorage.setItem("khaothi_account_username", finalAccount.username || cleanUser);
      localStorage.setItem("khaothi_account_name", finalAccount.customerName || cleanName);
      localStorage.setItem("khaothi_account_code", finalAccount.id);
      localStorage.setItem("khaothi_account_password", finalAccount.password || cleanPass);
      localStorage.setItem("khaothi_account_data", JSON.stringify(finalAccount));

      setSuccessMessage("🎉 TẠO TÀI KHOẢN THÀNH CÔNG! Đã tự động đăng nhập...");
      setTimeout(() => {
        onLoginSuccess(finalAccount);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err?.message || "Lỗi hệ thống khi đăng ký tài khoản. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-6">
        
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
              {mode === "login" ? <Lock className="w-5 h-5 text-blue-300" /> : <UserPlus className="w-5 h-5 text-emerald-300" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === "login" ? "Đăng nhập Hệ thống" : "Đăng ký Tài khoản Mới"}
              </h3>
              <p className="text-xs text-blue-200">
                Xác thực: <strong className="text-amber-300 font-semibold">{pendingActionName}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === "login"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === "register"
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng ký mới</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Mode 1: LOGIN FORM */}
          {mode === "login" && (
            <>
              {/* Note Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hướng dẫn đăng nhập:</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-700">
                  • Quý Thầy/Cô đăng nhập bằng <strong>Tên đăng nhập (viết liền không dấu như Gmail)</strong> và <strong>Mật khẩu</strong>.<br/>
                  • Chưa có tài khoản? Bấm nút <strong>"Đăng ký mới"</strong> bên trên để tạo tài khoản dùng thử ngay lập tức!
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* 1. Login Username Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    1. Tên đăng nhập (*): <span className="text-[10.5px] font-normal text-slate-500">(Viết liền không dấu như Gmail)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => {
                        setLoginUsername(e.target.value);
                        setErrorMessage(null);
                      }}
                      onBlur={() => {
                        if (loginUsername.trim()) {
                          setLoginUsername(sanitizeUsername(loginUsername));
                        }
                      }}
                      placeholder="VD: hoangkhoa123, admin..."
                      className="w-full pl-9 pr-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      autoFocus
                    />
                    <UserCheck className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* 2. Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    2. Mật khẩu (*):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Nhập mật khẩu của bạn..."
                      className="w-full pl-9 pr-10 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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

                {/* Success Display */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
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
            </>
          )}

          {/* Mode 2: REGISTER FORM */}
          {mode === "register" && (
            <>
              {/* Note Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đăng ký nhanh dùng thử miễn phí:</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-700">
                  • Tạo tài khoản mới <strong>miễn phí ngay lập tức</strong> với <strong>3 lượt tạo đề dùng thử</strong>.<br/>
                  • Quý Thầy/Cô có thể dán <strong>Gemini API Key cá nhân</strong> để biên soạn đề không giới hạn.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                {/* 1. Username Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    1. Tên đăng nhập (*): <span className="text-[10.5px] font-normal text-slate-500">(Viết liền không dấu như Gmail)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => {
                        setRegUsername(e.target.value);
                        setErrorMessage(null);
                      }}
                      onBlur={() => {
                        if (regUsername.trim()) {
                          setRegUsername(sanitizeUsername(regUsername));
                        }
                      }}
                      placeholder="VD: hoangkhoa123, cothao..."
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      autoFocus
                    />
                    <User className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* 2. Customer Name Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    2. Họ và tên hiển thị (*):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regCustomerName}
                      onChange={(e) => {
                        setRegCustomerName(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="VD: Thầy Hoàng Văn Khoa"
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <Edit3 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* 3. Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      3. Mật khẩu (*):
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Mật khẩu..."
                        className="w-full pl-8 pr-8 py-2 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      4. Nhập lại Mật khẩu (*):
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Xác nhận lại..."
                        className="w-full pl-8 pr-3 py-2 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* 4. Optional Phone & School */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Số điện thoại (tùy chọn):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="VD: 0989.982.818"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Trường / Đơn vị công tác:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regNotes}
                        onChange={(e) => setRegNotes(e.target.value)}
                        placeholder="VD: THCS Tân Loan"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {errorMessage && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1">
                    <div className="flex items-start gap-2 font-semibold">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="whitespace-pre-line leading-relaxed">{errorMessage}</div>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !regUsername.trim() || !regCustomerName.trim() || !regPassword.trim() || !regConfirmPassword.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang tạo tài khoản mới...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Đăng ký Tài khoản Mới</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Contact Admin Notice */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1.5">
            <p className="text-[11px] text-slate-500">Cần nâng cấp bản quyền theo năm hoặc hỗ trợ kỹ thuật?</p>
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
