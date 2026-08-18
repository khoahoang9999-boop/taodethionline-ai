import React from "react";

export interface SignatureBlockProps {
  examDateLocation?: string;
  bghName?: string;
  bghSignature?: string | null;
  teacherHeadName?: string;
  teacherHeadSignature?: string | null;
  creatorName?: string;
  creatorSignature?: string | null;
}

export default function SignatureBlock({
  examDateLocation = "Hàm Yên, ngày 10 tháng 02 năm 2026",
  bghName,
  bghSignature,
  teacherHeadName,
  teacherHeadSignature,
  creatorName,
  creatorSignature,
}: SignatureBlockProps) {
  const activeRoles = [
    { title: "Duyệt của BGH", name: bghName?.trim(), signature: bghSignature },
    { title: "Duyệt tổ CM", name: teacherHeadName?.trim(), signature: teacherHeadSignature },
    { title: "Người ra đề", name: creatorName?.trim(), signature: creatorSignature },
  ].filter((r) => Boolean(r.name));

  if (activeRoles.length === 0) return null;

  return (
    <div className="mt-8 pt-4 border-t border-slate-200 text-black font-times print:break-inside-avoid">
      <div className="text-right italic text-[13px] mb-3 text-slate-800">
        {examDateLocation || "Hàm Yên, ngày 10 tháng 02 năm 2026"}
      </div>
      <div
        className="grid gap-4 text-center items-start"
        style={{
          gridTemplateColumns: `repeat(${activeRoles.length}, minmax(0, 1fr))`,
        }}
      >
        {activeRoles.map((role, idx) => (
          <div key={idx} className="flex flex-col items-center justify-between min-h-[120px]">
            <div className="font-bold text-[14px] text-slate-900 mb-1">{role.title}</div>
            <div className="my-2 flex-1 flex items-center justify-center min-h-[50px] w-full">
              {role.signature ? (
                <img
                  src={role.signature}
                  alt={`Chữ ký ${role.title}`}
                  className="max-h-16 max-w-[140px] object-contain mx-auto"
                />
              ) : (
                <div className="h-12"></div>
              )}
            </div>
            <div className="font-bold text-[14px] text-slate-900 mt-1">{role.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
