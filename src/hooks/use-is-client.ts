"use client";

import { useEffect, useState } from "react"

/**
 * خطاف مخصص للتحقق مما إذا كان المكون يتم تشغيله على المتصفح (Client) أم الخادم (Server).
 * مفيد جداً لتجنب أخطاء الـ Hydration في Next.js.
 */
export function useIsClient(): boolean {
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    // بمجرد تشغيل useEffect، نحن متأكدون أننا على المتصفح
    setClient(true)
  }, [])

  return isClient
}