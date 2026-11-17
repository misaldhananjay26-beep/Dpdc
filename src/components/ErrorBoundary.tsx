import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full gold-card rounded-3xl p-6 sm:p-8 border border-red-500/40 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-xl font-black font-heading text-white">
              तांत्रिक अडचण आली आहे (Application Error)
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              डेटा लोड किंवा जतन करताना अडचण आली. कृपया पृष्ठ रिफ्रेश करून पुन्हा प्रयत्न करा.
            </p>
            <div className="p-3 rounded-xl bg-[#121215] border border-neutral-800 text-[11px] font-mono text-red-300 text-left break-words max-h-32 overflow-y-auto">
              {this.state.errorMessage}
            </div>
            <button
              onClick={this.handleReload}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुन्हा प्रयत्न करा (Reload)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
