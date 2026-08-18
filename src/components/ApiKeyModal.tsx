import React, { useState } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Sparkles, Check, X, ShieldCheck, AlertCircle, ExternalLink, Edit3, User } from "lucide-react";

export interface ApiKeyItem {
  id?: string;
  key: string;
  label?: string;
}

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeyItem[];
  onSave: (keys: ApiKeyItem[]) => void;
  accountName?: string;
  onOpenProfileModal?: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKeys,
  onSave,
  accountName,
  onOpenProfileModal
}: ApiKeyModalProps) {
  const [keyList, setKeyList] = useState<ApiKeyItem[]>(() => {
    if (apiKeys && apiKeys.length > 0) {
      return apiKeys.map((k, idx) => ({
        id: k.id || `key-${Date.now()}-${idx}`,
        key: k.key || "",
        label: k.label || `Key ${idx + 1}`
      }));
    }
    return [{ id: `key-${Date.now()}-0`, key: "", label: "Key 1 (Chính)" }];
  });

  // Re-sync keyList whenever modal opens with latest apiKeys
  React.useEffect(() => {
    if (isOpen) {
      if (apiKeys && apiKeys.length > 0) {
        setKeyList(
          apiKeys.map((k, idx) => ({
            id: k.id || `key-${Date.now()}-${idx}`,
            key: k.key || "",
            label: k.label || `Key ${idx + 1}`
          }))
        );
      } else {
        setKeyList([{ id: `key-${Date.now()}-0`, key: "", label: "Key 1 (Chính)" }]);
      }
    }
  }, [isOpen, apiKeys]);

  const [visibleKeys, setVisibleKeys] = useState<{ [id: string]: boolean }>({});

  if (!isOpen) return null;

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddKey = () => {
    const newIdx = keyList.length + 1;
    setKeyList([
      ...keyList,
      {
        id: `key-${Date.now()}-${newIdx}`,
        key: "",
        label: `Key ${newIdx} (Dự phòng)`
      }
    ]);
  };

  const handleRemoveKey = (id: string) => {
    if (keyList.length === 1) {
      setKeyList([{ id: `key-${Date.now()}-0`, key: "", label: "Key 1 (Chính)" }]);
      return;
    }
    setKeyList(keyList.filter((k) => k.id !== id));
  };

  const handleUpdateField = (id: string, field: keyof ApiKeyItem, value: string) => {
    setKeyList(
      keyList.map((k) => {
        if (k.id === id) {
          return { ...k, [field]: value };
        }
        return k;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validKeys = keyList.filter((k) => k.key.trim().length > 0);
    onSave(validKeys);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                Cài đặt API Key
                {accountName && (
                  <span className="text-[11px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-medium">
                    {accountName}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Quản lý danh sách Key & Tự động chuyển đổi khi hết hạn mức (Auto Failover)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Profile Name Bar */}
          {onOpenProfileModal && (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tên tài khoản: <strong className="text-slate-900">{accountName || "Chưa đặt tên"}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfileModal();
                }}
                className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-300 text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Edit3 className="w-3 h-3" />
                <span>Đổi tên hiển thị</span>
              </button>
            </div>
          )}

          {/* Failover Feature Explanation Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex gap-3 text-amber-900 text-xs leading-relaxed">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                Cơ chế tự động xoay vòng Key (Auto Failover):
              </p>
              <p className="text-amber-800">
                Khi Key chính vượt quá hạn mức (Quota Limit / 429 / Resource Exhausted), hệ thống sẽ
                <strong> lập tức chuyển sang Key tiếp theo</strong> trong danh sách mà không làm gián đoạn quá trình sinh đề thi.
              </p>
            </div>
          </div>

          {/* Admin Default Key Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex gap-3 text-emerald-900 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                Sử dụng Key hệ thống do Admin cấp:
              </p>
              <p className="text-emerald-800">
                Nếu bạn không lưu API Key cá nhân nào, hệ thống sẽ tự động sử dụng <strong>API Key mặc định của Admin</strong> để duy trì quá trình sinh đề thi.
              </p>
            </div>
          </div>

          {/* Key List Header */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Danh sách API Key khả dụng ({keyList.filter(k => k.key.trim().length > 0).length})</span>
            </span>

            <button
              type="button"
              onClick={handleAddKey}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Key mới</span>
            </button>
          </div>

          {/* API Key Items */}
          <div className="space-y-3.5">
            {keyList.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 relative group hover:border-blue-300 transition-colors"
              >
                {/* Top bar of Key Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.label || `Key ${index + 1}`}
                      onChange={(e) => handleUpdateField(item.id!, "label", e.target.value)}
                      placeholder="Tên đại diện Key (VD: Key 1 - Dự phòng)"
                      className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 rounded transition-all"
                    />
                  </div>

                  {keyList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKey(item.id!)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa Key này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* API Key Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Google Gemini API Key
                  </label>
                  <div className="relative">
                    <input
                      type={visibleKeys[item.id!] ? "text" : "password"}
                      value={item.key}
                      onChange={(e) => handleUpdateField(item.id!, "key", e.target.value)}
                      placeholder="Nhập API Key của bạn (AIzaSy...)"
                      className="w-full text-xs font-mono border border-slate-300 rounded-lg pl-3 pr-10 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(item.id!)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {visibleKeys[item.id!] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plus Add Button Footer */}
          <button
            type="button"
            onClick={handleAddKey}
            className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 text-blue-600 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm API Key dự phòng mới</span>
          </button>

          {/* AI Studio External Link */}
          <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
            <span>Bạn chưa có API Key? Lấy miễn phí từ Google AI Studio tại:</span>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>aistudio.google.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
