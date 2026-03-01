// استيراد المكون من مجلد src/components
import FrontendRegisterPage_SignupCard from "@/components/FrontendRegisterPage_SignupCard";

export default function Page() {
  return (
    // استدعاء المكون وتمرير اللغة المطلوبة (مثلاً العربية)
    <FrontendRegisterPage_SignupCard lang="ar" />
  );
}