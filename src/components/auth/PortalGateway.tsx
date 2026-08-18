import React from 'react';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

interface PortalGatewayProps {
  onSelectLevel1: () => void;
  onSelectLevel2: () => void;
  onSelectLevel3: () => void;
  onSelectLevel4: () => void;
  onSelectSignUp: () => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({
  onSelectLevel1,
  onSelectLevel2,
  onSelectLevel3,
  onSelectLevel4,
  onSelectSignUp,
}) => {
  return (
    <div id="portal-gateway-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="font-bold text-slate-900 text-base tracking-tight">
            Church Financial Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Secure Financial Management Portal
          </p>
        </div>

        <button
          id="gateway-header-signup-btn"
          onClick={onSelectSignUp}
          className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Request Access</span>
        </button>
      </header>

      {/* Main Choice Access */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full">
        
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Secure Financial Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to your authorized account.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              id="gateway-card-level1"
              onClick={onSelectLevel1}
              className="w-full py-3.5 px-5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-500 rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-slate-800 font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Level 1 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level2"
              onClick={onSelectLevel2}
              className="w-full py-3.5 px-5 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-slate-800 font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Level 2 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level3"
              onClick={onSelectLevel3}
              className="w-full py-3.5 px-5 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-500 rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-slate-800 font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Level 3 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level4"
              onClick={onSelectLevel4}
              className="w-full py-3.5 px-5 bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-500 rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-slate-800 font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span>Level 4 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              id="gateway-footer-signup-btn"
              onClick={onSelectSignUp}
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
            >
              Request Access &rarr;
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 text-center text-xs text-slate-500 font-medium">
        Secure Access &bull; Authorized Users Only
      </footer>
    </div>
  );
};
