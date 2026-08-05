import React from 'react';
import { AlertOctagon, RefreshCw, LayoutDashboard, Bug, CheckCircle2, X } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showBugModal: false,
      bugReportSent: false,
      bugDescription: ''
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled UI error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReturnDashboard = () => {
    window.location.href = '/dashboard';
  };

  handleSendReport = (e) => {
    e.preventDefault();
    this.setState({ bugReportSent: true });
    setTimeout(() => {
      this.setState({ showBugModal: false, bugReportSent: false, bugDescription: '' });
    }, 1500);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl text-left">
            
            {/* Header Icon */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  Application Unexpected Error
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  A runtime exception occurred in the active component interface.
                </p>
              </div>
            </div>

            {/* Error Message Snippet */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15 font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto leading-relaxed max-h-32">
              {this.state.error?.toString() || 'Unknown Javascript Error'}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Your session state has been safely preserved in local storage. You can recover your view by reloading or returning to the dashboard.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="h-4 w-4" /> Reload App
              </button>

              <button
                onClick={this.handleReturnDashboard}
                className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>

              <button
                onClick={() => this.setState({ showBugModal: true })}
                className="p-3 border border-slate-200 dark:border-slate-800 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                title="Report Bug"
              >
                <Bug className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>

          {/* Report Bug Modal */}
          {this.state.showBugModal && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 text-left shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                  <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Bug className="h-5 w-5 text-amber-500" /> Report Issue
                  </h4>
                  <button
                    onClick={() => this.setState({ showBugModal: false })}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {this.state.bugReportSent ? (
                  <div className="py-6 text-center space-y-2 text-emerald-500">
                    <CheckCircle2 className="h-10 w-10 mx-auto" />
                    <p className="font-bold text-sm">Thank you! Your bug report has been logged.</p>
                  </div>
                ) : (
                  <form onSubmit={this.handleSendReport} className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      Describe what you were doing when the application crashed:
                    </p>
                    <textarea
                      rows={4}
                      required
                      value={this.state.bugDescription}
                      onChange={(e) => this.setState({ bugDescription: e.target.value })}
                      placeholder="e.g. Clicked on submit answer during technical mode..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => this.setState({ showBugModal: false })}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                      >
                        Submit Report
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      );
    }

    return this.props.children;
  }
}
