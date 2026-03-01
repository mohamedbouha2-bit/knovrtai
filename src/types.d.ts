import React from 'react';

/**
 * 1. تعريفات الأصول الثابتة (Static Assets)
 * تضمن عدم وجود خطأ عند استيراد الصور والملفات في ملفات .ts أو .tsx
 */
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

/**
 * 2. تعريفات ملفات التنسيق (Styling)
 * الفرق هنا أن الملفات العادية لا تعيد كائناً، بينما الـ Modules تعيده.
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

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

/**
 * 3. تعريفات JSX المخصصة
 * يسمح باستخدام Web Components أو عناصر HTML مخصصة دون اعتراض TypeScript.
 */
declare namespace JSX {
  interface IntrinsicElements {
    'custom-block': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

/**
 * 4. توسيع بيئة NodeJS (Environment Variables)
 * يوفر إكمالاً تلقائياً (Autocomplete) لـ process.env في VS Code.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_API_BASE_URL: string;
    readonly NEXT_PUBLIC_ENTITIES_URL: string;
    readonly NEXT_PUBLIC_PROJECT_ID: string;
    readonly NEXT_PUBLIC_FULL_TOKEN_KEY: string;
    readonly DATABASE_URL: string;
  }
}