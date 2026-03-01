import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

/**
 * 
 * 1. محاكاة الـ Routing في Next.js
 * تضمن هذه المحاكاة أن المكونات التي تعتمد على الروابط أو التنقل لن تفشل أثناء الاختبار.
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

/**
 * 2. محاكاة مكون الصورة (next/image)
 * مهم جداً لأن مكون الصورة الأصلي في Next.js يتطلب معالجة خاصة على السيرفر.
 */
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { ...props, priority: undefined });
  },
}));

/**
 * 3. محاكاة الخطوط (next/font)
 * نستخدم الـ Proxy هنا لجعل أي استدعاء لأي خط يعيد "className" وهمية.
 */
vi.mock('next/font/google', () => {
  const createFont = (fontName: string) => () => ({
    className: `${fontName.toLowerCase()}-font`,
    variable: `--font-${fontName.toLowerCase()}`,
    style: { fontFamily: fontName },
  });

  return new Proxy({}, {
    get: (_target, prop) => typeof prop === 'string' ? createFont(prop) : undefined,
  });
});

/**
 * 4. محاكاة Framer Motion
 * تحويل الحركات المعقدة إلى عناصر <div> بسيطة لتجنب أخطاء الـ DOM في بيئة الاختبار.
 */
vi.mock('framer-motion', () => {
  const MockMotionComponent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    ({ children, ...rest }, ref) => React.createElement('div', { ref, ...rest }, children)
  );
  MockMotionComponent.displayName = 'MockMotionComponent';

  const motion = new Proxy({}, { get: () => MockMotionComponent });

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useScroll: () => ({ scrollYProgress: { get: () => 0 }, scrollY: { get: () => 0 } }),
    useTransform: (v: any) => v,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useInView: () => true,
  };
});

/**
 * 5. محاكاة التوافق مع الشاشات (matchMedia)
 * ضروري لمكتبات UI مثل Ant Design و Framer Motion.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});