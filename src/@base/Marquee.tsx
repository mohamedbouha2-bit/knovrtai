'use client';
import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // السرعة بالثواني
  direction?: 'left' | 'right';
  className?: string;
  play?: boolean;
  pauseOnHover?: boolean;
  gap?: number; // إضافة مسافة بين العناصر
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 20, // سرعة متوسطة أفضل من 10
  direction = 'left',
  className = '',
  play = true,
  pauseOnHover = true,
  gap = 20,
}) => {
  return (
    <div className={`group overflow-hidden flex flex-row relative ${className}`}>
      {/* تعريف الأنيميشن داخلياً لضمان العمل في أي مشروع */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>

      <div
        className="animate-marquee"
        style={{
          gap: `${gap}px`,
          animationName: direction === 'left' ? 'marquee-left' : 'marquee-right',
          animationDuration: `${speed}s`,
          animationPlayState: play ? 'running' : 'paused',
          // تفعيل التوقف عند الحوم (Hover) باستخدام CSS
          animationDirection: direction === 'left' ? 'normal' : 'normal',
        }}
        // الربط البرمجي للتوقف عند الحوم
        onMouseEnter={(e) => pauseOnHover && (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => pauseOnHover && (e.currentTarget.style.animationPlayState = 'running')}
      >
        {/* نكرر العناصر مرتين على الأقل لضمان تأثير الحركة اللانهائية */}
        <div className="flex flex-row shrink-0" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex flex-row shrink-0" style={{ gap: `${gap}px` }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;