"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// تعريف الأنماط - أضفت تباعداً بسيطاً لضمان عدم التصاق النص بالعناصر
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors",
  {
    variants: {
      variant: {
        default: "text-slate-900 dark:text-slate-100",
        error: "text-red-500 dark:text-red-400",
        muted: "text-slate-500 dark:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), "rtl:text-right cursor-default", className)}
    {...props}
  />
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }