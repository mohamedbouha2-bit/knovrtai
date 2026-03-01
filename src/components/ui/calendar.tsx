"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm",
        // معالجة ذكية للاتجاهات في الأيقونات
        "rtl:[&_.rdp-button_next>svg]:rotate-180 rtl:[&_.rdp-button_previous>svg]:rotate-180",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        ...defaultClassNames,
        months: "flex flex-col md:flex-row gap-8 relative",
        month: "space-y-4 w-full",
        nav: "flex items-center justify-between absolute w-full z-10 px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_caption: "flex justify-center pt-1 relative items-center h-9",
        caption_label: "text-sm font-bold text-slate-900 dark:text-slate-100",
        weekday: "text-slate-500 dark:text-slate-400 w-9 font-normal text-[0.8rem] mb-2",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        today: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-md",
        selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
        outside: "text-slate-400 opacity-50",
        disabled: "text-slate-400 opacity-50",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",
        range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-900 dark:aria-selected:bg-blue-900/20 dark:aria-selected:text-blue-200",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className="h-4 w-4" {...props} />;
          if (orientation === "right") return <ChevronRightIcon className="h-4 w-4" {...props} />;
          return <ChevronDownIcon className="h-4 w-4" {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors",
        modifiers.selected && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
        modifiers.today && !modifiers.selected && "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        className
      )}
      {...props}
    />
  );
}

export { Calendar };