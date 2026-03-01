import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// إنشاء نسخة جديدة من QueryClient لكل اختبار لضمان استقلالية البيانات
const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // تعطيل إعادة المحاولة لتسريع الفشل في الاختبارات
      },
    },
  });

/**
 * غلاف الاختبار الذكي: يوفر السياق اللازم للمكونات المختبرة
 * لمنع أخطاء الـ "Missing Provider".
 */
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* يمكن إضافة ThemeProvider أو NextIntlProvider هنا مستقبلاً */}
      <div id="test-root">
        {children}
      </div>
    </QueryClientProvider>
  );
};