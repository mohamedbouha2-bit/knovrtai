/**
 * تعريفات TypeScript العالمية للمشروع.
 * تضمن هذه التعريفات تعرف المحرر على الملفات غير البرمجية والمتغيرات العالمية.
 */

// 1. دعم عناصر HTML المخصصة
declare namespace JSX {
  interface IntrinsicElements {
    'custom-block': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// 2. تعريفات ملفات الوسائط والصور
declare module '*.svg' { const content: string; export default content; }
declare module '*.png' { const content: string; export default content; }
declare module '*.jpg' { const content: string; export default content; }
declare module '*.jpeg' { const content: string; export default content; }
declare module '*.gif' { const content: string; export default content; }
declare module '*.webp' { const content: string; export default content; }
declare module '*.ico' { const content: string; export default content; }
declare module '*.bmp' { const content: string; export default content; }

// إضافات مفيدة للخطوط والرسوم المتحركة
declare module '*.woff';
declare module '*.woff2';
declare module '*.json';

// 3. دعم CSS Modules لجميع أنواع المنسقات
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 4. تعزيز أمان متغيرات البيئة في Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_API_BASE_URL: string;
    readonly NEXT_PUBLIC_BASE_PATH?: string;
    readonly NEXT_PUBLIC_PROJECT_ID?: string;
    readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
    readonly DATABASE_URL: string;
    readonly NEXT_PUBLIC_ENTITIES_URL?: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}