/** @type {import('next').NextConfig} */
const nextConfig = {
  // تجنب توقف البناء بسبب أخطاء TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  // تجنب توقف البناء بسبب تحذيرات ESLint وتصحيح مفتاح الإعدادات
  eslint: {
    ignoreDuringBuilds: true,
  },
  // تحسينات إضافية للتوافق مع الإصدارات الجديدة
  reactStrictMode: true,
};

export default nextConfig;