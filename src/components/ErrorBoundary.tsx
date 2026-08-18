import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    errorMessage: ""
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || "Lỗi không xác định" };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  override componentDidMount() {
    // Only catch unhandled rejections for logging, don't crash UI for global errors
    window.addEventListener("unhandledrejection", this.handleRejection);
  }

  override componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.handleRejection);
  }

  // Removed handleGlobalError completely since it crashes the app on benign errors

  handleRejection = (event: PromiseRejectionEvent) => {
    const reasonStr = String(event.reason?.message || event.reason || "");
    if (reasonStr.toLowerCase().includes("websocket")) {
      // Ignore benign Vite HMR websocket disconnection errors in Cloud Run iframe sandbox
      return;
    }
    console.error("Caught unhandled rejection:", event.reason);
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="bg-slate-800 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Đã xảy ra lỗi hiển thị giao diện</h2>
            <p className="text-xs text-slate-400 mb-4">
              Hệ thống đã tự động ghi nhận lỗi:
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg text-left text-xs font-mono text-rose-300 mb-6 overflow-x-auto max-h-32 border border-slate-800">
              {this.state.errorMessage || "Lỗi giao diện"}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Tải lại trang web
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

