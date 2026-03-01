// ... (الواردات والأنواع تبقى كما هي)

export default function PaymentsAdminPage_TransactionManager() {
  // ... (الحالات والوظائف الأساسية)

  // تحسين دالة التنسيق المالي
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const handleRefundSubmit = async (data: RefundFormValues) => {
    if (!selectedTx) return;
    
    // استخدام toast للتنبيه أثناء المعالجة
    const loadingToast = toast.loading("Processing refund...");

    try {
      const updatePayload = {
        where: { id: selectedTx.id },
        data: { 
          status: 'refunded' as const,
          updated_at: new Date()
          // ملاحظة: يفضل عدم إعادة إرسال البيانات الثابتة مثل الـ userId إلا إذا كان الـ API يتطلب ذلك
        }
      };

      if (selectedTx.type === 'subscription') {
        await entities.subscription_order.Update(updatePayload as any);
      } else {
        await entities.credit_order.Update(updatePayload as any);
      }

      toast.success(`Transaction #${selectedTx.id} refunded successfully`, { id: loadingToast });
      setIsRefundOpen(false);
      reset();
      fetchData(); 
    } catch (e) {
      toast.error("Refund failed. Technical error occurred.", { id: loadingToast });
    }
  };

  // ... (بقية منطق المكون)

  return (
    <section className="w-full min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-6 py-10 space-y-8">
        
        {/* Header & Stats Summary (Optional Addition) */}
        {/*  */}
        
        {/* ... (الجزء العلوي من الواجهة) */}

        <TableBody>
          {loading ? (
             // الهيكل العظمي (Skeleton) المحسن
             Array.from({ length: 5 }).map((_, i) => (
               <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
             ))
          ) : filteredTransactions.map((tx) => (
            <TableRow key={`${tx.type}-${tx.id}`} className="group hover:bg-slate-50/80 transition-colors">
              <TableCell className="font-mono text-xs text-slate-400">#{tx.id}</TableCell>
              
              {/* عرض المستخدم بشكل محسن */}
              <TableCell>
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleUserClick(tx.userId)}
                >
                  <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                    <AvatarImage src={tx.user?.avatar_url || ''} />
                    <AvatarFallback>{tx.user?.first_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col max-w-[150px]">
                    <span className="text-sm font-semibold truncate text-slate-900">
                      {tx.user?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-slate-500 truncate">{tx.user?.email}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-600">
                  {tx.productName}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-slate-600">
                {format(tx.date, 'MMM dd, yyyy')}
              </TableCell>

              <TableCell className="font-bold text-slate-900">
                {formatAmount(tx.amount, tx.currency)}
              </TableCell>

              <TableCell>
                {getStatusBadge(tx.status)}
              </TableCell>

              <TableCell className="text-right">
                {/* قائمة الإجراءات */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* ... (بقية المكونات: Sheet, Dialog) */}
      </div>
    </section>
  );
}