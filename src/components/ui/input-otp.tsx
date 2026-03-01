"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * المكون الرئيسي لإدخال الرمز
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/**
 * تجميع خانات الإدخال في مجموعات
 */
function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

/**
 * الخانة الفردية للإدخال - تم تحسين التركيز والأنميشن
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-slate-200 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md dark:border-slate-800",
        "data-[active=true]:z-10 data-[active=true]:ring-2 data-[active=true]:ring-blue-600 data-[active=true]:border-blue-600",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-slate-950 duration-1000 dark:bg-slate-50" />
        </div>
      )}
    </div>
  );
}

/**
 * الفاصل بين مجموعات الأرقام
 */
function InputOTPSeparator({
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" className="px-1 text-slate-400" {...props}>
      <MinusIcon className="size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };