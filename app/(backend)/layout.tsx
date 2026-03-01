"use client";

import SidebarOriginal from "@/components/layout/backend/Sidebar";
import "@/index.css";
import BackendAuthGuard from "@/tools/BackendAuthGuard";
import Link from "next/link";
import { useState, useEffect, useRef, createContext, useContext, type ElementType } from "react";
const Sidebar = SidebarOriginal as ElementType;

// Global Admin Changes Context with Toast Support
interface AdminChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  saveChanges: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  locale: string;
  darkMode: boolean;
  direction: string;
}
export const AdminChangesContext = createContext<AdminChangesContextType>({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  saveChanges: async () => {},
  showToast: () => {},
  locale: 'en',
  darkMode: false,
  direction: 'ltr'
});
export const useAdminChanges = () => useContext(AdminChangesContext);
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({
  children
}: RootLayoutProps) {
  const [locale, setLocale] = useState("en");
  const [direction, setDirection] = useState("ltr");
  const [darkMode, setDarkMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }>>([]);
  const toastIdRef = useRef(0);
  useEffect(() => {
    // BACKEND ADMIN CONTEXT: Use separate localStorage keys to prevent conflicts with frontend user preferences
    const savedLocale = localStorage.getItem("backend_admin_locale") || "en";
    setLocale(savedLocale);
    setDirection(savedLocale === "ar" ? "rtl" : "ltr");

    const savedDarkMode = localStorage.getItem("backend_admin_dark_mode") === "true";
    setDarkMode(savedDarkMode);

    // Listen for admin-specific locale and dark mode changes across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "backend_admin_locale" && e.newValue) {
        setLocale(e.newValue);
        setDirection(e.newValue === "ar" ? "rtl" : "ltr");
      }
      if (e.key === "backend_admin_dark_mode" && e.newValue !== null) {
        setDarkMode(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update document attributes when locale/direction/darkMode changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = direction;
      // Apply consistent RTL font weight and alignment
      if (direction === "rtl") {
        document.documentElement.classList.add("rtl-admin");
      } else {
        document.documentElement.classList.remove("rtl-admin");
      }
      // Apply dark mode
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [locale, direction, darkMode]);

  // Toast notification handler
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Global save handler - updates PostgreSQL directly
  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Dispatch custom event that child pages can listen to
      const event = new CustomEvent("admin-save-changes");
      window.dispatchEvent(event);

      // Call backend API to persist changes to PostgreSQL
      const response = await fetch('/api/admin/settings/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          locale,
          darkMode
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      setHasUnsavedChanges(false);
      showToast(locale === 'ar' ? 'تم حفظ التغييرات بنجاح' : locale === 'fr' ? 'Modifications enregistrées avec succès' : 'Changes saved successfully', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast(locale === 'ar' ? 'فشل حفظ التغييرات' : locale === 'fr' ? 'Échec de l\'enregistrement' : 'Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  return <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        {/* SEO and Security Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* SSL and Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Sitemap Reference */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Canonical URL Support - Dynamic per page */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Schema.org Organization Markup for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Konvrt AI Platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "0",
            "highPrice": "120",
            "offerCount": "3"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1000"
          },
          "provider": {
            "@type": "Organization",
            "name": "Konvrt AI",
            "url": typeof window !== 'undefined' ? window.location.origin : ''
          }
        })
      }} />
        
        <style dangerouslySetInnerHTML={{
        __html: `
          * {
            font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          }
          .rtl-admin * {
            font-weight: 500 !important;
            text-align: ${direction === "rtl" ? "right" : "left"} !important;
          }
          .rtl-admin input, .rtl-admin textarea, .rtl-admin select {
            text-align: ${direction === "rtl" ? "right" : "left"} !important;
          }
          .dark {
            color-scheme: dark;
          }
          .dark body {
            background-color: #0f172a;
            color: #e2e8f0;
          }
          .dark header {
            background-color: #1e293b;
            border-color: #334155;
          }
          .dark main {
            background-color: #0f172a;
          }
          .dark footer {
            background-color: #1e293b;
            border-color: #334155;
          }
          .dark aside, .dark nav, .dark .sidebar {
            background-color: #1e293b;
            border-color: #334155;
            color: #e2e8f0;
          }
          .dark input, .dark textarea, .dark select {
            background-color: #334155;
            border-color: #475569;
            color: #e2e8f0;
          }
          .dark button:not(.bg-blue-600):not([class*="bg-"]) {
            background-color: #334155;
            color: #e2e8f0;
          }
          /* Settings page specific styles for grid sections */
          .settings-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          .settings-section {
            border-radius: 0.75rem;
            padding: 1.5rem;
            transition: all 0.2s;
          }
          .dark .settings-section {
            background-color: #1e293b;
            border: 1px solid #334155;
          }
          .settings-section:not(.dark *) {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          /* Locked feature icon alignment */
          .feature-locked-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            margin-inline-start: 0.5rem;
            vertical-align: middle;
          }
          .rtl-admin .feature-locked-icon {
            margin-inline-start: 0;
            margin-inline-end: 0.5rem;
          }
          /* Toast notification styles */
          .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            pointer-events: none;
          }
          .rtl-admin .toast-container {
            right: auto;
            left: 1rem;
          }
          .toast {
            pointer-events: auto;
            min-width: 300px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .toast.success {
            background-color: #10b981;
            color: white;
          }
          .toast.error {
            background-color: #ef4444;
            color: white;
          }
          .toast.info {
            background-color: #3b82f6;
            color: white;
          }
          .dark .toast {
            opacity: 0.95;
          }
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .rtl-admin .toast {
            animation: slideInRTL 0.3s ease-out;
          }
          @keyframes slideInRTL {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `
      }} />
      </head>
      <body className={`antialiased ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <BackendAuthGuard>
          
            <AdminChangesContext.Provider value={{
          hasUnsavedChanges,
          setHasUnsavedChanges,
          saveChanges,
          showToast,
          locale,
          darkMode,
          direction
        }}>

            {/* BACKEND ADMIN LAYOUT - STRICTLY SEPARATED FROM FRONTEND USER WORKSPACE */}
            <div className={`flex h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
              {/* Admin Sidebar - STRICTLY BACKEND NAVIGATION ONLY: No user workspace routes */}
              <div className="flex-shrink-0">
                <Sidebar darkMode={darkMode} locale={locale} direction={direction} />
              </div>
              <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
                {/* Gemini-style minimal header with top-right controls */}
                <header className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                  <div className="relative px-6 py-3">
                    {/* Top right controls: Dark Mode + Language Switcher */}
                    <div className="absolute top-3 right-6 flex items-center gap-3">
                      {/* Dark Mode Toggle */}
                      <button onClick={() => {
                      const newMode = !darkMode;
                      setDarkMode(newMode);
                      localStorage.setItem("backend_admin_dark_mode", String(newMode));
                      // Trigger storage event for cross-tab sync (backend admin only)
                      window.dispatchEvent(new StorageEvent("storage", {
                        key: "backend_admin_dark_mode",
                        newValue: String(newMode)
                      }));
                      // Trigger custom event for in-page components
                      window.dispatchEvent(new CustomEvent("backend-theme-changed", {
                        detail: {
                          darkMode: newMode
                        }
                      }));
                    }} className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`} aria-label="Toggle dark mode">
                        {darkMode ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                          </svg> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>}
                      </button>
                      
                      {/* Language Switcher */}
                      <select value={locale} onChange={e => {
                      const newLocale = e.target.value;
                      setLocale(newLocale);
                      setDirection(newLocale === "ar" ? "rtl" : "ltr");
                      localStorage.setItem("backend_admin_locale", newLocale);
                      window.dispatchEvent(new StorageEvent("storage", {
                        key: "backend_admin_locale",
                        newValue: newLocale
                      }));
                      // Trigger custom event for in-page components (backend admin only)
                      window.dispatchEvent(new CustomEvent("backend-locale-changed", {
                        detail: {
                          locale: newLocale,
                          direction: newLocale === "ar" ? "rtl" : "ltr"
                        }
                      }));
                    }} className={`
                            px-3 py-1.5 rounded-lg border transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            cursor-pointer text-sm
                            ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700' : 'bg-white border-gray-300 hover:bg-gray-50'}
                            ${direction === "rtl" ? "text-right font-medium" : "text-left"}
                          `}>
                          <option value="en">🇬🇧 EN</option>
                          <option value="ar">🇸🇦 AR</option>
                          <option value="fr">🇫🇷 FR</option>
                        </select>
                    </div>
                  </div>
                </header>
                
                {/* Gemini-style centered chat workspace area */}
                <main className={`flex flex-col items-center justify-start min-h-full pb-16 px-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="w-full max-w-4xl mx-auto">
                    {children}
                  </div>
                </main>
                
                {/* Gemini-style minimal footer - BACKEND ONLY: No links to frontend user workspace */}
                <footer className={`py-4 px-8 text-center text-xs border-t ${darkMode ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-white text-gray-500 border-gray-200'}`}>
                  <div className="flex justify-center items-center gap-4 flex-wrap">
                    <Link href="/admindashboardpage" className={`transition-colors duration-200 ${darkMode ? 'hover:text-slate-200' : 'hover:text-gray-700'}`}>
                      {locale === "ar" ? "لوحة التحكم" : locale === "fr" ? "Tableau de bord" : "Dashboard"}
                    </Link>
                    <span>•</span>
                    <Link href="/usermanagementpage" className={`transition-colors duration-200 ${darkMode ? 'hover:text-slate-200' : 'hover:text-gray-700'}`}>
                      {locale === "ar" ? "المستخدمون" : locale === "fr" ? "Utilisateurs" : "Users"}
                    </Link>
                    <span>•</span>
                    <Link href="/paymentsadminpage" className={`transition-colors duration-200 ${darkMode ? 'hover:text-slate-200' : 'hover:text-gray-700'}`}>
                      {locale === "ar" ? "المدفوعات" : locale === "fr" ? "Paiements" : "Payments"}
                    </Link>
                    <span>•</span>
                    <Link href="/settingspage" className={`transition-colors duration-200 ${darkMode ? 'hover:text-slate-200' : 'hover:text-gray-700'}`}>
                      {locale === "ar" ? "الإعدادات" : locale === "fr" ? "Paramètres" : "Settings"}
                    </Link>
                  </div>
                </footer>
              </div>

              {/* Toast Notification Container */}
              <div className="toast-container">
                {toasts.map((toast, index) => <div key={toast.id} className={`toast ${toast.type}`}>
                    {toast.type === 'success' && <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>}
                    {toast.type === 'error' && <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>}
                    {toast.type === 'info' && <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>}
                    <span className="flex-1">{toast.message}</span>
                  </div>)}
              </div>

              {/* Universal Floating Save Changes Button */}
              {hasUnsavedChanges && <div className={`fixed bottom-8 ${direction === "rtl" ? "left-8" : "right-8"} z-[100] animate-in slide-in-from-bottom-4`} style={{
              direction: direction as 'ltr' | 'rtl'
            }}>
                  <button onClick={saveChanges} disabled={isSaving} className={`
                      flex items-center gap-2 px-6 py-3 
                      bg-blue-600 hover:bg-blue-700 
                      text-white font-semibold rounded-lg shadow-lg 
                      transition-all duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${direction === "rtl" ? "font-medium" : ""}
                    `}>
                    {isSaving ? <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{locale === "ar" ? "جاري الحفظ..." : locale === "fr" ? "Enregistrement..." : "Saving..."}</span>
                      </> : <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{locale === "ar" ? "حفظ التغييرات" : locale === "fr" ? "Enregistrer les modifications" : "Save Changes"}</span>
                      </>}
                  </button>
                </div>}
            </div>
          </AdminChangesContext.Provider>
        </BackendAuthGuard>
      </body>
    </html>;
}
