import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
// التأكد من أن الملف المتبقي اسمه fonts.ts
import { sansArabic, headerFont } from './fonts';

export const metadata: Metadata = {
  title: "AutoCoder.cc",
  description: "تطبيق متطور",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${sansArabic.variable} ${headerFont.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}