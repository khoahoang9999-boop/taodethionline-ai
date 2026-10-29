import React from "react";
import { LogIn, Clock } from "lucide-react";

export interface ActiveUsageTrackerWidgetProps {
  lastLogin?: string;
  lastLoginTime?: string;
  activeSecondsToday: number;
  loginCountToday: number;
  showTitle?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Định dạng thời gian hoạt động theo chuẩn:
 * - Dưới 60 giây -> hiển thị "X giây" (VD: "4 giây")
 * - Từ 1 đến 59 phút -> hiển thị "X phút Y giây" hoặc "X phút"
 * - Trên 1 giờ -> hiển thị "X giờ Y phút"
 */
export function formatActiveTime(seconds: number): string {
  const totalSec = Math.max(0, Math.floor(Number(seconds) || 0));
  if (totalSec < 60) {
    return `${totalSec} giây`;
  }
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins < 60) {
    return secs > 0 ? `${mins} phút ${secs} giây` : `${mins} phút`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours} giờ ${remMins} phút` : `${hours} giờ`;
}

export const formatActiveDuration = formatActiveTime;

/**
 * Khối theo dõi "Thời Gian Đăng Nhập & Hoạt Động"
 */
export default function ActiveUsageTrackerWidget({
  lastLogin,
  lastLoginTime,
  activeSecondsToday = 0,
  loginCountToday = 1,
  showTitle = true,
  compact = false,
  className = ""
}: ActiveUsageTrackerWidgetProps) {
  const displayLastLogin = lastLogin || lastLoginTime || "---";
  const formattedActiveTime = formatActiveTime(activeSecondsToday);
  const displayLoginCount = Math.max(1, Number(loginCountToday) || 1);

  if (compact) {
    return (
      <div className={`space-y-1 text-xs ${className}`}>
        {/* Dòng 1: Icon LogIn (emerald) + "Đăng nhập: [lastLogin]" */}
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 whitespace-nowrap">
          <LogIn className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Đăng nhập: <strong className="font-mono text-slate-900 font-bold">{displayLastLogin}</strong>
          </span>
        </div>

        {/* Dòng 2: Icon Clock (purple) + "Hôm nay: [formatActiveTime] • [loginCountToday] lượt" */}
        <div className="text-[11.5px] text-slate-600 font-medium flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Hôm nay:</span>
          <strong className="font-bold text-purple-700">
            {formattedActiveTime}
          </strong>
          <span className="text-slate-400 font-bold" aria-hidden="true">•</span>
          <span className="font-semibold text-slate-700">
            {displayLoginCount} lượt
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 space-y-2 text-xs ${className}`}>
      {showTitle && (
        <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-200/70 pb-1.5">
          Thời Gian Đăng Nhập &amp; Hoạt Động
        </div>
      )}

      {/* Dòng 1 (Lịch sử đăng nhập) */}
      <div className="flex items-center gap-2 text-slate-700">
        <LogIn className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-medium">
          Đăng nhập: <strong className="font-mono text-slate-900 font-bold">{displayLastLogin}</strong>
        </span>
      </div>

      {/* Dòng 2 (Thời gian hoạt động trong ngày) */}
      <div className="flex items-center gap-2 text-slate-700">
        <Clock className="w-4 h-4 text-purple-600 shrink-0" />
        <div className="flex items-center gap-1.5 flex-wrap font-medium">
          <span>Hôm nay:</span>
          <strong className="font-bold text-purple-700">
            {formattedActiveTime}
          </strong>
          <span className="text-slate-400 font-bold" aria-hidden="true">•</span>
          <span className="font-bold text-slate-800">
            {displayLoginCount} lượt
          </span>
        </div>
      </div>
    </div>
  );
}
