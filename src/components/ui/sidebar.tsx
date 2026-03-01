"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- الثوابت الأساسية ---
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem"; // زدت الحجم قليلاً للتناسق البصري
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("يجب استخدام useSidebar داخل SidebarProvider.");
  }
  return context;
}

// --- مزود سياق الشريط الجانبي ---
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties}
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-slate-50 dark:has-[[data-variant=inset]]:bg-slate-950",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// --- المكون الرئيسي للشريط الجانبي ---
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-[var(--sidebar-width)] flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[var(--sidebar-width)] p-0 bg-white dark:bg-slate-900 [&>button]:hidden"
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile Sidebar Content</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden md:block text-slate-900 dark:text-slate-100"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* الفراغ التعويضي لمنع قفز المحتوى عند التثبيت */}
      <div
        className={cn(
          "relative h-full w-[var(--sidebar-width)] bg-transparent transition-[width] duration-300 ease-in-out",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-300 ease-in-out md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1.25rem)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] border-r dark:border-slate-800",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 group-data-[variant=floating]:rounded-xl group-data-[variant=floating]:border group-data-[variant=floating]:shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- بقية المكونات الفرعية (مختصرة للأداء) ---

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">تبديل القائمة الجانبية</span>
    </Button>
  );
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-right text-sm outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:text-blue-600 dark:hover:text-blue-400",
        outline: "border border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
      },
      size: {
        default: "h-9",
        sm: "h-8 text-xs",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// تصدير كافة المكونات المساعدة
export {
  Sidebar,
  SidebarContent: ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("flex-1 overflow-auto p-2", className)} {...props} />,
  SidebarFooter: ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("p-2 border-t dark:border-slate-800", className)} {...props} />,
  SidebarHeader: ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("p-2 border-b dark:border-slate-800", className)} {...props} />,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset: ({ className, ...props }: React.ComponentProps<"main">) => <main className={cn("relative flex min-h-svh flex-1 flex-col bg-white dark:bg-slate-950", className)} {...props} />,
  SidebarMenu: ({ className, ...props }: React.ComponentProps<"ul">) => <ul className={cn("flex flex-col gap-1", className)} {...props} />,
  SidebarMenuItem: ({ className, ...props }: React.ComponentProps<"li">) => <li className={cn("list-none", className)} {...props} />,
  SidebarMenuButton: ({ asChild, className, variant, size, ...props }: any) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(sidebarMenuButtonVariants({ variant, size }), className)} {...props} />;
  },
  useSidebar
};