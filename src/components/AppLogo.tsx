import React from 'react';
import { Star, BookOpen } from "lucide-react";

export const AppLogo = ({ size = 32, className }: { size?: number; className?: string }) => {
  // Điều chỉnh độ dày nét vẽ theo kích thước logo để luôn sắc nét
  const sw = size < 40 ? 2 : 1.5;

  return (
    <div 
      className={`relative flex flex-col items-center justify-center rounded-full shadow-md shrink-0 overflow-hidden ${className || ''}`}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: '#da251d', // Đỏ cờ / Quốc huy
        border: `${Math.max(2, size * 0.08)}px solid #ffde00`, // Viền vàng kim
      }}
    >
      {/* Vòng vàng mỏng bên trong (inner ring) tạo cảm giác con dấu / huy hiệu */}
      <div 
        className="absolute rounded-full border border-[#ffde00]/40" 
        style={{ 
          inset: Math.max(1, size * 0.04) 
        }} 
      />
      
      {/* Ngôi sao vàng năm cánh */}
      <div className="absolute flex justify-center w-full" style={{ top: '18%' }}>
        <Star 
          color="#ffde00" 
          fill="#ffde00" 
          size={size * 0.38} 
          strokeWidth={1} 
        />
      </div>

      {/* Cuốn sách mở (Giáo dục / Khảo thí) */}
      <div className="absolute flex justify-center w-full" style={{ top: '55%' }}>
        <BookOpen 
          color="#ffde00" 
          size={size * 0.45} 
          strokeWidth={sw + 0.5} 
        />
      </div>
    </div>
  );
}
