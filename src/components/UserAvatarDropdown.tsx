import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  Edit3,
  KeyRound,
  Shield,
  Clock,
  Sparkles,
  ChevronDown,
  Phone,
  CheckCircle2,
  ExternalLink,
  Laptop
} from "lucide-react";
import { formatDateVN } from "../lib/client-auth";

interface UserAvatarDropdownProps {
  currentUser: any;
  isAdmin: boolean;
  userApiKeysCount: number;
  onOpenProfile: () => void;
  onOpenApiKey: () => void;
  onOpenAdminTab?: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

export default function UserAvatarDropdown({
  currentUser,
  isAdmin,
  userApiKeysCount,
  onOpenProfile,
  onOpenApiKey,
  onOpenAdminTab,
  onLogout,
  onLogin
}: UserAvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayName = currentUser?.customerName || currentUser?.id || "Khách (Chưa đăng nhập)";
  const userCode = currentUser?.id || "Chưa có mã";
  const initials = currentUser
    ? displayName
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((w: string) => w[0]?.toUpperCase())
        .join("") || userCode.slice(0, 2)
    : "👤";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button: Avatar + Display Name + Caret */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
          isOpen
            ? "bg-slate-800 border-blue-400 shadow-lg shadow-blue-900/30"
            : currentUser
            ? "bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600 shadow-md"
            : "bg-blue-950/80 hover:bg-blue-900/80 border-blue-500/40 text-blue-200 shadow-md"
        }`}
      >
        {/* Circular Avatar with Online/Offline Indicator */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shadow-inner overflow-hidden">
            {currentUser ? (
              <img 
                src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${userCode}&backgroundColor=c0aede,b6e3f4,ffdfbf`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-sm">👤</span>
            )}
          </div>
          {currentUser && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          )}
        </div>

        {/* User Name & Role */}
        <div className="flex flex-col text-left leading-tight hidden sm:flex max-w-[140px] md:max-w-[180px]">
          <div className="flex items-center gap-1">
            {isAdmin && (
              <span className="bg-amber-400 text-amber-950 font-black px-1 py-0.2 rounded text-[8px] uppercase tracking-wider shrink-0">
                Admin
              </span>
            )}
            <span className="truncate font-bold text-slate-100 text-xs">
              {displayName}
            </span>
          </div>
          {!currentUser && (
            <span className="text-[10px] text-slate-400 font-mono">
              Bấm để đăng nhập
            </span>
          )}
        </div>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      {/* Modern Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-[120] text-slate-800 animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden">
          {/* Menu Header / Profile Card */}
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                {currentUser ? (
                  <img 
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${userCode}&backgroundColor=c0aede,b6e3f4,ffdfbf`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">
                    {displayName}
                  </h4>
                  {isAdmin && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Admin
                    </span>
                  )}
                </div>
                {isAdmin ? (
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                    🌟 Tài khoản Quản trị cấp cao
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    Tài khoản Giáo viên
                  </p>
                )}
              </div>
            </div>

            {/* Subscription & Device stats if logged in */}
            {currentUser && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Hạn: <strong className="text-slate-800">{formatDateVN(currentUser.expiryDate)}</strong></span>
                </div>
                {!isAdmin && (
                  <div className="flex items-center gap-1 text-emerald-700">
                    <Laptop className="w-3 h-3 text-emerald-600" />
                    <span title="Số lượng thiết bị được phép đăng nhập">
                      Cho phép: <strong>{currentUser.maxDevices || 2} máy</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menu Items List */}
          <div className="py-1">
            {/* If not logged in: prominent login action */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
                className="w-full px-4 py-3 text-left text-xs font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 flex items-center gap-3 transition-colors cursor-pointer group border-b border-blue-100"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-blue-800 text-sm">Đăng nhập tài khoản</div>
                  <div className="text-[11px] text-blue-600 font-normal">Nhập mã kích hoạt của bạn để sử dụng đầy đủ tính năng</div>
                </div>
              </button>
            )}

            {/* 1. Hồ sơ của bạn / Đổi tên hiển thị */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (currentUser) {
                  onOpenProfile();
                } else {
                  onLogin();
                }
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-slate-800 font-bold group-hover:text-blue-700">Hồ sơ & Đổi tên hiển thị</div>
                <div className="text-[11px] text-slate-400 font-normal">Cập nhật họ tên giáo viên, trường học</div>
              </div>
            </button>

            {/* 2. Cài đặt API Key */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenApiKey();
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-slate-800 font-bold group-hover:text-amber-700 flex items-center justify-between">
                  <span>Cài đặt API Key (Gemini)</span>
                  {userApiKeysCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {userApiKeysCount} Key
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-normal">Tự động luân chuyển khi hết hạn mức</div>
              </div>
            </button>

            {/* 3. Admin Account Management (if admin) */}
            {isAdmin && onOpenAdminTab && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminTab();
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100/70 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 font-bold group-hover:text-purple-700">Quản trị Tài khoản (Admin)</div>
                  <div className="text-[11px] text-slate-400 font-normal">Cấp mã, gia hạn, tăng số lượng máy</div>
                </div>
              </button>
            )}

            {/* 4. Gia hạn & Hỗ trợ kỹ thuật */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-b border-slate-100 my-1 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Hỗ trợ / Gia hạn:</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-0.5">
                <a
                  href="tel:0989982818"
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  title="Gọi điện hỗ trợ"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>0989.982.818</span>
                </a>
                <span className="text-slate-300">•</span>
                <a
                  href="https://zalo.me/0978468986"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1"
                  title="Nhắn Zalo hỗ trợ"
                >
                  <span className="text-[10px] px-1 py-0.5 rounded bg-sky-100 text-sky-700 font-extrabold">Zalo</span>
                  <span>0978.468.986</span>
                </a>
              </div>
            </div>

            {/* 5. Đăng xuất (chỉ hiện khi đã đăng nhập) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/80 flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span>Đăng xuất tài khoản</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
