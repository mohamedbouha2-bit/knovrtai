import type { Entities } from "../../server/entities.type"
import { toast } from "sonner";

type EntityMethod = {
  [key: string]: (...args: any[]) => Promise<any>;
};

/**
 * محرك البروكسي للكيانات: يحول استدعاءات الدوال الأمامية إلى طلبات API خلفية تلقائياً.
 */
class EntitiesProxy {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_ENTITIES_URL || "/api/entities") {
    this.baseUrl = baseUrl;
  }

  public getProxy(): Entities {
    return new Proxy({} as Entities, {
      get: (_, entity: keyof Entities) => {
        return this.createEntityProxy(entity.toString());
      }
    });
  }

  private createEntityProxy(entity: string): EntityMethod {
    return new Proxy({} as EntityMethod, {
      get: (_, method: string) => {
        return (...args: any[]) => this.executeRequest(entity, method, args);
      }
    });
  }

  // معالجة البيانات المعقدة قبل الإرسال (Serialization)
  private serializeData(data: any): any {
    if (typeof data === "bigint") {
      return { __type: "BigInt", value: data.toString() };
    }

    if (data instanceof Date) {
      const offset = -data.getTimezoneOffset();
      return {
        __type: 'Date',
        value: data.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: offset
      };
    }

    if (Array.isArray(data)) return data.map((a) => this.serializeData(a));

    if (data && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, this.serializeData(v)])
      );
    }

    return data;
  }

  // إعادة بناء البيانات بعد الاستلام (Deserialization)
  private deserializeData(data: any): any {
    if (data?.__type === 'Date') return new Date(data.value);
    if (data?.__type === "BigInt") return BigInt(data.value);

    if (Array.isArray(data)) return data.map((a) => this.deserializeData(a));

    if (data && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, this.deserializeData(v)])
      );
    }

    return data;
  }

  private async executeRequest<T>(
    entity: string,
    method: string,
    args: any[]
  ): Promise<T> {
    try {
      const serializedArgs = this.serializeData(args);
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity, method, args: serializedArgs })
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const result = await response.json();

      if (!result.success) {
        toast.error(result?.message || result?.error || 'Request failed');
        throw new Error(result.error || 'Request failed');
      }

      // بعد التحديث، نقوم بجلب النسخة الأحدث من الكيان لضمان مزامنة الواجهة
      if (method === "Update" && args[0]?.where) {
        return await this.executeRequest(entity, "Get", [args[0].where]);
      }

      return this.deserializeData(result.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[EntitiesProxy] ${entity}.${method} Failed:`, errorMessage);
      throw error;
    }
  }
}

export const entities = new EntitiesProxy().getProxy();