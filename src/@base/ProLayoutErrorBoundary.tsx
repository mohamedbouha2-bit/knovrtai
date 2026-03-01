import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Alert, Button, Result } from 'antd'; // استخدام Result يعطي مظهرًا أكثر احترافية
import { useNavigate } from "react-router-dom";
import GRoud404SVG from '../assets/GRoud404SVG.svg';

// واجهة معلومات الخطأ المحسنة
interface CustomErrorInfo {
  error: Error;
  errorInfo?: ErrorInfo;
  timestamp: number;
  url: string;
  userAgent: string;
  stack?: string;
  sourceLocation?: any;
  errorType: 'react' | 'javascript' | 'promise' | 'resource';
  errorInfoComponentStack?: string | null;
}

interface CustomErrorBoundaryState {
  hasError: boolean;
  errorInfo: CustomErrorInfo | null;
  isLoading: boolean;
}

// دالة التأكد من قابلية التسلسل (Serialization) لضمان عدم فشل postMessage
const ensureSerializable = (data: any): any => {
  try {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (value instanceof Error) {
        return { name: value.name, message: value.message, stack: value.stack };
      }
      return value;
    }));
  } catch {
    return { message: "Unserializable Error Data" };
  }
};

class CustomProLayoutErrorBoundary extends Component<{
  children: ReactNode;
  onError?: (error: CustomErrorInfo) => void;
  navigate?: (path: string) => void;
}, CustomErrorBoundaryState> {

  state: CustomErrorBoundaryState = {
    hasError: false,
    errorInfo: null,
    isLoading: false
  };

  static getDerivedStateFromError(error: Error): Partial<CustomErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const fullErrorInfo: CustomErrorInfo = {
      error,
      errorInfo,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      stack: error.stack,
      sourceLocation: this.extractSourceLocation(error),
      errorType: 'react',
      errorInfoComponentStack: errorInfo.componentStack,
    };

    this.setState({ errorInfo: fullErrorInfo });
    if (this.props.onError) this.props.onError(fullErrorInfo);
    
    // إرسال التقرير تلقائياً عند حدوث الخطأ (اختياري)
    this.reportError(fullErrorInfo);
  }

  private extractSourceLocation(error: Error): any {
    const stack = error.stack;
    if (!stack) return null;
    const lines = stack.split('\n');
    // البحث عن أول سطر يشير لملف المشروع وتجاهل ملفات node_modules
    const projectLine = lines.find(line => line.includes('src/') && !line.includes('node_modules'));
    if (projectLine) {
      const match = projectLine.match(/(https?:\/\/.*?):(\d+):(\d+)/);
      if (match) return { file: match[1], line: match[2], col: match[3] };
    }
    return null;
  }

  private reportError = (info: CustomErrorInfo) => {
    const logData = ensureSerializable({ type: 'FRONTEND_ERROR', ...info });
    try {
      window.parent.postMessage(logData, '*');
    } catch (e) {
      console.error("Failed to report error", e);
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-2xl w-full text-center animate-fade-in">
            <img src={GRoud404SVG} alt="Error" className="w-64 h-64 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">عفواً، حدث خطأ تقني</h1>
            <p className="text-gray-500 mb-8">لقد واجه التطبيق مشكلة غير متوقعة. تم تسجيل تفاصيل الخطأ للمراجعة.</p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                type="primary" 
                danger 
                size="large"
                onClick={() => window.location.reload()}
              >
                إعادة تحميل الصفحة
              </Button>
              <Button 
                size="large"
                onClick={() => this.props.navigate?.('/')}
              >
                العودة للرئيسية
              </Button>
            </div>

            {/* عرض تفاصيل تقنية للمطورين في بيئة التطوير فقط */}
            {process.env.NODE_ENV === 'development' && (
               <details className="mt-8 text-left bg-gray-100 p-4 rounded overflow-auto max-h-64">
                 <summary className="cursor-pointer text-red-600 font-mono">Technical Details (Dev Only)</summary>
                 <pre className="text-xs mt-2">{this.state.errorInfo?.stack}</pre>
               </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrapper لاستخدام الـ Hooks مع Class Component
const ProLayoutErrorBoundaryWrapper: React.FC<any> = (props) => {
  const navigate = useNavigate();
  return <CustomProLayoutErrorBoundary {...props} navigate={navigate} />;
};

export default ProLayoutErrorBoundaryWrapper;