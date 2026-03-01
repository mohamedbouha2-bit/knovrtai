'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFrontendUserSession } from '@/tools/SessionContext';
import { Menu, X, Globe, Moon, Sun, Cpu } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locale, setLocale] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  // 1. مزامنة الحالة مع المكونات الأخرى (Sidebar/Footer)
  useEffect(() => {
    const syncState = () => {
      const session = getFrontendUserSession();
      if (session?.locale) setLocale(session.locale.toLowerCase());
      setDarkMode(localStorage.getItem('darkMode') === 'true');
    };

    syncState();
    window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 20));
    window.addEventListener('localeChange', syncState as EventListener);
    window.addEventListener('themeChange', syncState as EventListener);

    return () => {
      window.removeEventListener('scroll', () => {});
      window.removeEventListener('localeChange', syncState as EventListener);
      window.removeEventListener('themeChange', syncState as EventListener);
    };
  }, []);

  const isRTL = locale === 'ar';

  // 2. الروابط المترجمة
  const navLinks = useMemo(() => [
    { name: isRTL ? 'الرئيسية' : 'Home', href: '/seolandingpage' },
    { name: isRTL ? 'مساحة العمل' : 'Workspace', href: '/' },
    { name: isRTL ? 'الذكاء الهجين' : 'Hybrid AI', href: '/geminichatworkspacepage' },
    { name: isRTL ? 'الأسعار' : 'Pricing', href: '/paymentpage' },
  ], [isRTL]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? (darkMode ? 'bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800' : 'bg-white/80 backdrop-blur-md border-b border-slate-200')
          : 'bg-transparent'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            AutoCoder<span className="text-blue-600">.cc</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href 
                  ? 'text-blue-600' 
                  : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600')
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            onClick={() => window.dispatchEvent(new CustomEvent('themeChange', { detail: { darkMode: !darkMode } }))}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link 
            href="/backendloginpage"
            className="hidden sm:block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-20 left-0 right-0 p-6 border-b animate-in slide-in-from-top ${
          darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}