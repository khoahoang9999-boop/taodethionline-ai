/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Code, Download, Copy, Check, Eye, ChevronDown, ChevronUp } from "lucide-react";

interface MathFigureDisplayProps {
  svg?: string;
  tikz?: string;
  python?: string;
  description?: string;
  questionId?: number;
  compact?: boolean;
}

export default function MathFigureDisplay({
  svg,
  tikz,
  python,
  description,
  questionId,
  compact = false
}: MathFigureDisplayProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "tikz" | "python">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!svg && !tikz && !python) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hinh-ve-cau-${questionId || "toan"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-indigo-300 transition-colors">
      {/* Header Bar */}
      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Hình vẽ {questionId ? `Câu ${questionId}` : "Toán học"}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2 py-1 rounded-md transition-colors ${activeTab === "preview" ? "bg-white text-blue-700 font-semibold shadow-xs" : "hover:bg-slate-200 text-slate-600"}`}
            title="Xem hình vẽ trực quan"
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Hình
          </button>

          {tikz && (
            <button
              type="button"
              onClick={() => setActiveTab("tikz")}
              className={`px-2 py-1 rounded-md transition-colors ${activeTab === "tikz" ? "bg-white text-blue-700 font-semibold shadow-xs" : "hover:bg-slate-200 text-slate-600"}`}
              title="Xem mã TikZ (LaTeX)"
            >
              <Code className="w-3.5 h-3.5 inline mr-1" />
              TikZ
            </button>
          )}

          {python && (
            <button
              type="button"
              onClick={() => setActiveTab("python")}
              className={`px-2 py-1 rounded-md transition-colors ${activeTab === "python" ? "bg-white text-blue-700 font-semibold shadow-xs" : "hover:bg-slate-200 text-slate-600"}`}
              title="Xem mã Python Matplotlib"
            >
              <Code className="w-3.5 h-3.5 inline mr-1" />
              Python
            </button>
          )}

          {svg && (
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-600 ml-1"
              title="Tải ảnh SVG về máy"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 bg-slate-50/40">
        {activeTab === "preview" && svg && (
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-full flex items-center justify-center p-2 bg-white rounded-lg border border-slate-100 min-h-[120px]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            {description && (
              <p className="text-[11px] text-slate-500 italic mt-1.5 text-center">
                {description}
              </p>
            )}
          </div>
        )}

        {activeTab === "tikz" && tikz && (
          <div className="relative">
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-500">
              <span>Mã TikZ (LaTeX chuẩn Word / Overleaf):</span>
              <button
                type="button"
                onClick={() => handleCopy(tikz, "tikz")}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100"
              >
                {copiedType === "tikz" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép mã TikZ</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
              {tikz}
            </pre>
          </div>
        )}

        {activeTab === "python" && python && (
          <div className="relative">
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-500">
              <span>Mã Python (Matplotlib):</span>
              <button
                type="button"
                onClick={() => handleCopy(python, "python")}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100"
              >
                {copiedType === "python" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép mã Python</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 text-sky-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
              {python}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
