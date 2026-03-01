import { useEventCallback } from "@/hooks/use-event-callback";
import { useEffect, useState } from "react";

export function AutoSaveChat({ chatText }: { chatText: string }) {
  // استخدام الخطاف لضمان أن المرجع ثابت دائماً
  const onSave = useEventCallback(() => {
    console.log("Saving latest content:", chatText);
    // تنفيذ طلب API للحفظ...
  });

  useEffect(() => {
    const timer = setInterval(() => {
      onSave(); // سيصل دائماً لأحدث قيمة لـ chatText
    }, 30000);

    return () => clearInterval(timer);
    // ميزة: لا نضع onSave هنا كـ Dependency لأن مرجعها ثابت!
    // وبذلك لا يتم إعادة تشغيل التايمر مع كل حرف يكتبه المستخدم.
  }, [onSave]);

  return <div>Auto-save is active.</div>;
}