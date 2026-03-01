enum CacheType {
  Local,
  Session
}

/**
 * فئة إدارة التخزين المؤقت: تسهل التعامل مع التخزين المحلي والجلسات
 * مع دعم تلقائي لتحويل الكائنات (Objects) والنصوص.
 */
class Cache {
  private storage: Storage;

  constructor(type: CacheType) {
    // التأكد من أن الكود يعمل في بيئة المتصفح فقط (Client-side)
    if (typeof window !== 'undefined') {
      this.storage = type === CacheType.Local ? window.localStorage : window.sessionStorage;
    } else {
      // Dummy storage للسيرفر لتجنب أخطاء SSR
      this.storage = {
        length: 0,
        clear: () => {},
        getItem: () => null,
        key: () => null,
        removeItem: () => {},
        setItem: () => {},
      };
    }
  }

  setCache(key: string, value: any): void {
    if (value !== undefined && value !== null) {
      try {
        this.storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Cache Error (set): ${key}`, error);
      }
    }
  }

  getCache<T>(key: string): T | null {
    try {
      const value = this.storage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
    } catch (error) {
      console.error(`Cache Error (get): ${key}`, error);
    }
    return null;
  }

  removeCache(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  /**
   * تحويل التخزين بالكامل إلى كائن JSON (مفيد لعمليات التصدير أو التشخيص)
   */
  toJSON(): string {
    const cacheData: { [key: string]: any } = {};
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        cacheData[key] = this.getCache(key);
      }
    }
    return JSON.stringify(cacheData, null, 2);
  }
}

// إنشاء نسخة مخصصة لبيانات الصفحة (Session)
const pageDataCache = new Cache(CacheType.Session);

export { Cache, CacheType };
export default pageDataCache;