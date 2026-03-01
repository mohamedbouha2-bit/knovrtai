// تحديث بسيط لـ Schema ليكون أكثر وضوحاً في الواجهة
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string()
    .min(8, 'يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص'),
  confirmPassword: z.string().min(1, 'يرجى تأكيد كلمة المرور')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ['confirmPassword']
});

// ... باقي المكون كما هو مع إضافة فئة Dark Mode لـ Card
<Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden"></Card>