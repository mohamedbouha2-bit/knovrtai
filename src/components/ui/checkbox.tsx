"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & 
  Pick<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange" | "onBlur">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  name,
  value,
  onChange,
  onBlur,
  onCheckedChange,
  checked,
  defaultChecked,
  ...props
}, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // ربط الـ ref الخارجي بالـ input المخفي لسهولة الوصول إليه في الـ Forms
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleCheckedChange = (state: CheckboxPrimitive.CheckedState) => {
    onCheckedChange?.(state);
    
    if (!inputRef.current) return;

    // تحديث الـ input المخفي برمجياً
    const isChecked = state === true;
    inputRef.current.checked = isChecked;
    inputRef.current.indeterminate = state === "indeterminate";

    // إطلاق حدث onChange يدوي لمحاكاة سلوك الـ Input الطبيعي
    if (onChange) {
      const syntheticEvent = {
        target: { ...inputRef.current, checked: isChecked, name, value },
        currentTarget: { ...inputRef.current, checked: isChecked, name, value }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "peer size-4 shrink-0 rounded-[4px] border border-slate-300 shadow-sm transition-all outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white",
          "data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:text-white",
          "dark:border-slate-700 dark:data-[state=checked]:bg-blue-500 dark:focus-visible:ring-blue-400",
          className
        )}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current"
        >
          {checked === "indeterminate" ? (
            <MinusIcon className="size-3 stroke-[3px]" />
          ) : (
            <CheckIcon className="size-3.5 stroke-[3px]" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {/* الـ Input المخفي لضمان عمل الـ Form Validation */}
      <input
        type="checkbox"
        ref={inputRef}
        name={name}
        value={value}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        checked={checked === true}
        readOnly
      />
    </>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };