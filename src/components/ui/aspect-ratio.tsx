"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

/**
 * مكون AspectRatio للحفاظ على أبعاد العناصر (مثل الصور والفيديو)
 * ومنع قفز المحتوى (Layout Shift) أثناء التحميل.
 */
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    data-slot="aspect-ratio"
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
));

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };