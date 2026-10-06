import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Civic Portal Caught Error:', error, errorInfo);
  }

  private handleResetApp = () => {
    try {
      localStorage.removeItem('bmc_saved_complaints');
      localStorage.removeItem('bmc_citizen_user');
      localStorage.removeItem('bmc_officer_user');
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-none p-6 shadow-md border border-slate-300 text-center space-y-4">
            <div className="w-16 h-16 rounded-none bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-black shadow-xs">
              BMC
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                बृहन्मुंबई महानगरपालिका मदत कक्ष
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                ॲप रीलोड करत आहे. तांत्रिक अडचण असल्यास कृपया खालील बटणावर क्लिक करा.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-sm font-bold shadow-xs cursor-pointer transition-colors"
              >
                🔄 पुन्हा लोड करा (Reload App)
              </button>
              <button
                onClick={this.handleResetApp}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-none text-xs font-semibold cursor-pointer transition-colors"
              >
                🧹 स्थानिक डेटा साफ करून रीस्टार्ट करा (Reset Cache & Restart)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
