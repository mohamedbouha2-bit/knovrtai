'use client';

import Link from 'next/link';
import { getFrontendUserSession } from '@/tools/SessionContext';
import { useEffect, useState, useMemo } from 'react';
import { Twitter, Linkedin, Github, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  const [locale, setLocale] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // دالة لتحديث الحالة محلياً
    const updateStates = () => {
      const session = getFrontendUserSession();
      if (session?.locale) setLocale(session.locale.toLowerCase());
      
      const darkMode = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkMode);
    };

    updateStates();

    // الاستماع للتغييرات الخارجية
    window.addEventListener('storage', updateStates);
    window.addEventListener('darkModeChange', updateStates);
    window.addEventListener('localeChange', updateStates);

    return () => {
      window.removeEventListener('storage', updateStates);
      window.removeEventListener('darkModeChange', updateStates);
      window.removeEventListener('localeChange', updateStates);
    };
  }, []);

  const isRTL = locale === 'ar';
  
  // استخدام useMemo لتحسين الأداء عند إعادة الريندر
  const t = useMemo(() => {
    const translations = { /* ... نفس كائن الترجمة الخاص بك ... */ };
    return translations[locale as keyof typeof translations] || translations.en;
  }, [locale]);

  const footerSections = [
    {
      title: t.platformHeader,
      links: [
        { label: t.mainLinks.home, href: '/seolandingpage' },
        { label: t.mainLinks.workspace, href: '/' },
        { label: t.mainLinks.aiChat, href: '/geminichatworkspacepage' },
        { label: t.mainLinks.pricing, href: '/paymentpage' },
      ]
    },
    {
      title: t.legalHeader,
      links: [
        { label: t.legalLinks.privacy, href: '/privacypolicypage' },
        { label: t.legalLinks.terms, href: '/termsofservicepage' },
        { label: t.legalLinks.upgrades, href: '/paymentpage' },
      ]
    }
  ];

  return (
    <footer className={`relative w-full transition-all duration-300 border-t ${
      isDark ? 'bg-[#121212] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Konvrt AI',
          url: 'https://konvrt.ai',
          logo: 'https://konvrt.ai/logo.png',
          sameAs: socialLinks.map(s => s.href)
        })
      }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.platformTitle}
            </h3>
            <p className="text-sm leading-relaxed max-w-sm">
              {t.platformDesc}
            </p>
            <div className="flex gap-4 pt-2">
               <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
               <a href="#" className="hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
               <a href="#" className="hover:text-slate-400 transition-colors"><Github size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="md:col-span-3">
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 ${isDark ? 'text-gray-300' : 'text-slate-900'}`}>
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-blue-500 transition-colors flex items-center gap-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact/Newsletter Column */}
          <div className="md:col-span-2">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 ${isDark ? 'text-gray-300' : 'text-slate-900'}`}>
              {t.connectHeader}
            </h4>
            <a href="mailto:support@konvrt.ai" className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline">
              <Mail size={16} /> support@konvrt.ai
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/10 text-center text-xs opacity-60">
          <p>© {currentYear} {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}