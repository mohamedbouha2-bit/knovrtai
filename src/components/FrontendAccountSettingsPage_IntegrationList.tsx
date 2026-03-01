// أضف هذه الحالة داخل المكون
const [processingId, setProcessingId] = useState<string | null>(null);

// تحديث وظيفة handleToggle
const handleToggle = async (integration: IntegrationItem) => {
  if (integration.status === 'connected') {
    setDisconnectTarget(integration);
  } else {
    setProcessingId(integration.id); // بدء التحميل للعنصر المحدد
    try {
      toast.info(`Redirecting to ${integration.name}...`);
      // محاكاة الاتصال
      await new Promise(r => setTimeout(r, 1000));
      
      const session = getfrontend_user_session();
      if (!session?.userId) return;

      const newConnection = await entities.oauth_connection.Create({
        user_id: parseInt(session.userId),
        provider: integration.provider,
        provider_id: `id_${Math.random().toString(36).substr(2, 9)}`,
        connected_email: session.email || 'user@example.com',
        connection_status: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      if (newConnection) {
        setIntegrations(prev => prev.map(item => item.id === integration.id ? {
          ...item,
          status: 'connected',
          connectionId: newConnection.id,
          connectedEmail: newConnection.connected_email
        } : item));
        toast.success(`Connected to ${integration.name}`);
      }
    } catch (error) {
      toast.error('Connection failed');
    } finally {
      setProcessingId(null); // إنهاء التحميل
    }
  }
};