import React, { ReactNode } from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

interface CarouselProps {
  autoplay?: boolean;
  wrapAround?: boolean;
  withoutControls?: boolean;
  slidesToShow?: number; // عدد الشرائح في الشاشات الكبيرة
  speed?: number;
  children: ReactNode;
  cellSpacing?: number; // المسافة بين الصور بالبكسل
}

const Carousel: React.FC<CarouselProps> = ({
  autoplay = true,
  wrapAround = true,
  withoutControls = true,
  slidesToShow = 2,
  speed = 800,
  cellSpacing = 20, // قيمة افتراضية للمسافة
  children,
}) => {
  const images = React.Children.toArray(children);

  return (
    <div className="carousel-wrapper" style={{ padding: `0 ${cellSpacing / 2}px` }}>
      <ResponsiveCarousel
        autoPlay={autoplay}
        centerMode={true}
        // تعديل النسبة المئوية لتأخذ الحسبان عدد الشرائح المطلوبة
        centerSlidePercentage={100 / slidesToShow} 
        infiniteLoop={wrapAround}
        showArrows={!withoutControls}
        showStatus={false}
        showThumbs={false}
        dynamicHeight={false} // يفضل false لتوحيد حجم السلايدر
        emulateTouch={true}
        stopOnHover={true}
        interval={4000}
        transitionTime={speed}
        swipeable={true}
        className="main-carousel"
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{ padding: `0 ${cellSpacing / 2}px` }} // إضافة المسافات هنا
            className="carousel-item relative group w-full h-[20rem] md:h-[35rem] overflow-hidden rounded-2xl md:rounded-3xl"
          >
            {/* تأمين عرض الصورة بالكامل داخل الحاوية */}
            <div className="w-full h-full object-cover">
               {image}
            </div>
          </div>
        ))}
      </ResponsiveCarousel>

      {/* تنسيق مخصص لإخفاء النقاط الافتراضية إذا أردت تصميم أنظف */}
      <style>{`
        .carousel .control-dots { margin-bottom: -20px; }
        .carousel .slide { background: transparent !important; }
      `}</style>
    </div>
  );
};

export default Carousel;