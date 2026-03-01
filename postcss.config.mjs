/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // المحرك الجديد لـ Tailwind CSS v4
    '@tailwindcss/postcss': {},
    // إضافة البادئات تلقائياً لدعم المتصفحات القديمة
    'autoprefixer': {},
  },
};

export default config;