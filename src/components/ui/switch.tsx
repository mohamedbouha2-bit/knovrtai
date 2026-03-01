"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * مكون المفتاح (Switch) - تم تحسينه ليكون أكثر بروزاً وسهولة في الاستخدام
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // الحاوية الأساسية: تغير اللون بناءً على الحالة (Checked/Unchecked)
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-800",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // الدائرة المتحركة (Thumb)
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-4"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };