import React, { useState } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Sparkles, Check, X, ShieldCheck, AlertCircle, ExternalLink, Edit3, User, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

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
  accountUsername?: string;
  requireKey?: boolean;
  onOpenProfileModal?: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKeys,
  onSave,
  accountName,
  accountUsername,
  requireKey = false,
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

  const [testingStatus, setTestingStatus] = useState<{
    [id: string]: { loading: boolean; ok?: boolean; message?: string };
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Re-sync keyList whenever modal opens with latest apiKeys
  React.useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
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

  const handleTestSingleKey = async (id: string, keyVal: string) => {
    if (!keyVal || !keyVal.trim()) {
      setTestingStatus((prev) => ({
        ...prev,
        [id]: { loading: false, ok: false, message: "Vui lòng nhập API Key trước khi kiểm tra." }
      }));
      return;
    }

    const cleanKey = keyVal
      .replace(/[\s"'`“”‘’\u200B-\u200D\uFEFF]/g, "")
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (cleanKey.length < 20) {
      setTestingStatus((prev) => ({
        ...prev,
        [id]: { loading: false, ok: false, message: "API Key quá ngắn hoặc không đúng định dạng (Key chuẩn của Google bắt đầu bằng 'AIzaSy...')." }
      }));
      return;
    }

    setTestingStatus((prev) => ({
      ...prev,
      [id]: { loading: true }
    }));

    // Step 1: Try server proxy endpoint /api/test-key
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cleanKey })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: true, message: data.message || "API Key hợp lệ và hoạt động tốt!" }
          }));
          return;
        } else {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: false, message: data.error || "API Key không hợp lệ hoặc không thể sử dụng." }
          }));
          return;
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (errorData && errorData.error) {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: false, message: errorData.error }
          }));
          return;
        }
      }
    } catch (serverErr) {
      console.warn("Server route /api/test-key unreachable or failed, falling back to direct Google AI API verification...", serverErr);
    }

    // Step 2: Direct Client-Side Fallback Verification via Google Generative Language API
    // (Bypasses server proxy issues when running on static hosts or Cloudflare Workers)
    try {
      const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`);
      const googleData = await googleRes.json();

      if (googleRes.ok && googleData && Array.isArray(googleData.models)) {
        setTestingStatus((prev) => ({
          ...prev,
          [id]: { loading: false, ok: true, message: "API Key hợp lệ và kết nối trực tiếp đến Google AI Studio thành công!" }
        }));
      } else {
        const errMsg = googleData?.error?.message || "";
        if (
          errMsg.includes("API_KEY_INVALID") ||
          errMsg.includes("API key not valid") ||
          errMsg.includes("pass a valid API key") ||
          errMsg.includes("API_KEY_NOT_FOUND")
        ) {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: false, message: "API Key không hợp lệ hoặc bị dán sai ký tự. Vui lòng lấy mã Key chuẩn tại aistudio.google.com/apikey." }
          }));
        } else if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: false, message: "API Key đúng định dạng nhưng đang tạm chạm giới hạn lượt gọi miễn phí (Quota 429). Vui lòng chờ ít phút hoặc nhập thêm Key dự phòng." }
          }));
        } else {
          setTestingStatus((prev) => ({
            ...prev,
            [id]: { loading: false, ok: false, message: errMsg ? `Không thể xác thực Key: ${errMsg}` : "Không thể kết nối máy chủ để kiểm tra Key." }
          }));
        }
      }
    } catch (clientErr) {
      setTestingStatus((prev) => ({
        ...prev,
        [id]: { loading: false, ok: false, message: "Lỗi kết nối mạng: Không thể kết nối tới Google AI Studio để kiểm tra Key." }
      }));
    }
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
    setSubmitError(null);
    // Reset test status when key value changes
    if (field === "key") {
      setTestingStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
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
    if (requireKey && validKeys.length === 0) {
      setSubmitError("Bắt buộc nhập API Key: Vui lòng dán ít nhất 01 Gemini API Key cá nhân (bắt đầu bằng AIza...) vào ô bên dưới trước khi lưu!");
      return;
    }
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
                Cài đặt API Key Cá Nhân
                {accountName && (
                  <span className="text-[11px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-medium">
                    {accountName}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>Model AI: <strong className="text-emerald-400 font-mono">gemini-3.1-flash-lite</strong></span>
                <span>•</span>
                <span>Tự động xoay vòng Key khi hết hạn mức</span>
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
          {/* Mandatory API Key Banner when teacher has no key */}
          {requireKey && keyList.filter((k) => k.key.trim().length > 0).length === 0 && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3.5 flex gap-3 text-rose-950 text-xs leading-relaxed shadow-2xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-900">
                  ⚠️ Yêu cầu bắt buộc: Vui lòng tự nhập Gemini API Key cá nhân!
                </p>
                <p className="text-rose-800">
                  Tài khoản của Quý Thầy/Cô hiện chưa có API Key. Vui lòng lấy mã Key miễn phí tại{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-rose-900 hover:text-blue-700"
                  >
                    aistudio.google.com/apikey
                  </a>{" "}
                  và dán vào ô bên dưới để bắt đầu biên soạn Ma trận & Đề kiểm tra.
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="bg-rose-100 border border-rose-300 text-rose-900 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Quick Profile Name Bar */}
          {onOpenProfileModal && (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Tên đăng nhập: <strong className="text-indigo-900">{accountUsername || accountName || "user"}</strong></span>
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
                <span>Hồ sơ tài khoản</span>
              </button>
            </div>
          )}

          {/* Failover Feature Explanation Banner */}
          <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-3.5 flex gap-3 text-emerald-950 text-xs leading-relaxed">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <span>Cấu hình AI:</span>
                <span className="font-mono bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded text-[11px]">gemini-3.1-flash-lite</span>
              </p>
              <p className="text-emerald-800">
                Hệ thống hoạt động duy nhất trên mô hình <strong>gemini-3.1-flash-lite</strong>. Khi Key chính chạm giới hạn (Quota Limit 429), hệ thống sẽ
                <strong> tự động chuyển ngay sang Key tiếp theo</strong> trong danh sách của Quý Thầy/Cô mà không làm gián đoạn việc tạo đề.
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
            {keyList.map((item, index) => {
              const testInfo = testingStatus[item.id!];
              return (
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

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestSingleKey(item.id!, item.key)}
                        disabled={testInfo?.loading || !item.key.trim()}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                          testInfo?.loading
                            ? "bg-slate-100 text-slate-400 border-slate-200"
                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${testInfo?.loading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                        <span>{testInfo?.loading ? "Đang thử..." : "Kiểm tra Key"}</span>
                      </button>

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
                        className={`w-full text-xs font-mono border rounded-lg pl-3 pr-10 py-2 bg-white text-slate-800 outline-none transition-all ${
                          testInfo?.ok === false
                            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : testInfo?.ok === true
                            ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
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

                  {/* Test Result Feedback Box */}
                  {testInfo && !testInfo.loading && (
                    <div
                      className={`text-[11px] rounded-lg p-2.5 flex items-start gap-2 ${
                        testInfo.ok
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border border-rose-200 text-rose-800"
                      }`}
                    >
                      {testInfo.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 leading-snug">
                        <p className="font-bold">{testInfo.ok ? "Hoạt động tốt" : "Không thể sử dụng"}</p>
                        <p className="text-[11px] opacity-90">{testInfo.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
