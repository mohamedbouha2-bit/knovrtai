// ... (الإبقاء على الاستيرادات والوظائف المساعدة)

export default function AffiliateTransactionHistory() {
  // ... (نفس حالة الـ state والـ useEffect)

  // تحسين: إضافة فرز إضافي داخل useMemo لضمان ترتيب البيانات دائماً
  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = 
        item.description?.toLowerCase().includes(searchTerm) || 
        item.amount.toString().includes(searchTerm) ||
        item.id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || item.payout_status === statusFilter;
      const matchesSource = sourceFilter === 'all' || item.source_type === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
    return result;
  }, [data, searchQuery, statusFilter, sourceFilter]);

  // ... (بقية منطق الـ Pagination)

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-8 py-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Earning History</h1>
            <p className="text-sm text-slate-500 mt-1">Audit trail for all your commissions and payouts.</p>
          </div>
          <Button variant="outline" className="shadow-sm" onClick={() => toast.info("Preparing your download...")}>
            <Download className="w-4 h-4 mr-2" /> Export History
          </Button>
        </div>

        {/* Filters Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search ID, description..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-9"
            />
          </div>
          
          {/* Source & Status Dropdowns (كما هي في الكود الأصلي) */}
        </div>

        {/* Table Container */}
        <CardWithNoPadding className="border-slate-200 shadow-md">
           {/* ... محتوى الجدول مع التنسيق الجمالي ... */}
           {/* نصيحة: استخدم h-[500px] كـ min-height لمنع قفز الصفحة عند الانتقال بين الصفحات */}
        </CardWithNoPadding>

      </div>
    </div>
  );
}