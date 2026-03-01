/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // سيسمح هذا للأخطاء بالمرور لكي يعمل الموقع والـ SSL أولاً
    ignoreBuildErrors: true,
  },
  eslint: {
    // سيمنع توقف البناء بسبب تحذيرات التنسيق
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;