'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getbackend_admin_session } from '@/tools/SessionContext';

/**
 * مكون حماية لوحة التحكم. 
 * يضمن عدم ظهور المحتوى إلا للمسؤولين المسجلين.
 */
export default function BackendAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const session = getbackend_admin_session();
      
      if (!session?.token) {
        // حفظ المسار الحالي للعودة إليه لاحقاً
        const redirect = encodeURIComponent(pathname || '/backend/dashboard');
        router.replace(`/backendloginpage?redirect=${redirect}`);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // منع رندر المحتوى "children" إذا لم يتم التأكد من الهوية بعد
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-400 font-medium">
          جاري التحقق من الصلاحيات...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}