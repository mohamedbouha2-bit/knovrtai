"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const BeamingBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // حركة عشوائية للدوائر الملونة لإعطاء تأثير الـ Mesh
    const blobs = containerRef.current.querySelectorAll(".blob");
    blobs.forEach((blob) => {
      gsap.to(blob, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
      {/* دائرة ضوئية بنفسجية */}
      <div className="blob absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
      
      {/* دائرة ضوئية زرقاء */}
      <div className="blob absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
      
      {/* توهج مركزي خفيف */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)]" />
      
      {/* تأثير النقاط (Grid Dots) لمظهر تقني */}
      <div className="absolute inset-0 opacity-[0.15]" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
    </div>
  );
};