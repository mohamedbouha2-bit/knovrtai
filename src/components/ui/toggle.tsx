"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف المتغيرات التصميمية للمكون باستخدام CVA
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
        outline: "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8 text-xs",
        lg: "h-10 px-4 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      // تصحيح: تمرير الـ className خارج دالة الفيربانتس لضمان الأولوية
      className={cn(
        toggleVariants({ variant, size }),
        // تنسيق الحالة النشطة ليكون متوافقاً مع هوية Konvrt AI الزرقاء
        "data-[state=on]:bg-blue-600 data-[state=on]:text-white dark:data-[state=on]:bg-blue-700",
        className
      )}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };