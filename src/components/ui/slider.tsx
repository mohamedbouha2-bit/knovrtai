"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/**
 * مكون الشريط المنزلق - تم تحسينه لدعم القيم المفردة والمزدوجة (Range)
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // حساب عدد المقابض (Thumbs) بناءً على القيم الممررة
  const initialValues = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return defaultValue;
    return [value ?? defaultValue ?? min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {/* المسار الخلفي (Track) */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-slate-100 dark:bg-slate-800 relative grow overflow-hidden rounded-full",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        {/* المنطقة المحددة (Range) */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-blue-600 absolute",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>

      {/* إنشاء المقابض (Thumbs) ديناميكياً */}
      {initialValues.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className={cn(
            "block size-4 shrink-0 rounded-full border-2 border-blue-600 bg-white shadow-md transition-all",
            "hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20",
            "disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-950"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };