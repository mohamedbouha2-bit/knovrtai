'use client';

import React from 'react';
import { ThemeProvider } from "next-themes";
// يمكنك إضافة مستوردات السياقات الأخرى هنا لاحقاً
// import { AdminChangesProvider } from "@/context/AdminChangesContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    /* 1. مزود الثيمات لإدارة الوضع المظلم */
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      {/* يمكنك إضافة مزودات أخرى هنا مثل React Query أو Context API */}
      {children}
    </ThemeProvider>
  );
}