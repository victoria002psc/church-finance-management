import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface PortalGatewayProps {
  onSelectLevel1: () => void;
  onSelectLevel2: () => void;
  onSelectLevel3: () => void;
  onSelectLevel4: () => void;
  onSelectSignUp?: () => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({
  onSelectLevel1,
  onSelectLevel2,
  onSelectLevel3,
  onSelectLevel4,
  onSelectSignUp,
}) => {
  return (
    <div id="portal-gateway-root" className="min-h-screen bg-[#F7F5F0] text-[#171717] flex flex-col justify-between font-sans">
      
      {/* Top Header */}
      <header className="border-b border-[#30203D] bg-[#24152F] px-4 sm:px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#30203D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">
              Church Financial Management
            </h1>
            <p className="text-xs text-[#F4E7B5]/80 font-medium">
              Choose your login portal
            </p>
          </div>
        </div>

        {onSelectSignUp && (
          <button
            id="gateway-header-signup-btn"
            onClick={onSelectSignUp}
            className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Sign Up
          </button>
        )}
      </header>

      {/* Main Choice Access */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full">
        
        <div className="w-full bg-[#FFFDF8] border border-[#E7E2D8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#24152F] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold text-[#171717] tracking-tight">
              Church Financial Management
            </h2>
            <p className="text-xs text-[#5F6368] font-medium">
              Choose your login portal
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              id="gateway-card-level1"
              onClick={onSelectLevel1}
              className="w-full py-3.5 px-5 bg-[#FFFDF8] hover:bg-[#24152F] hover:text-white border border-[#E7E2D8] hover:border-[#D4AF37] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-[#171717] font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span>Level 1 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level2"
              onClick={onSelectLevel2}
              className="w-full py-3.5 px-5 bg-[#FFFDF8] hover:bg-[#24152F] hover:text-white border border-[#E7E2D8] hover:border-[#D4AF37] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-[#171717] font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span>Level 2 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level3"
              onClick={onSelectLevel3}
              className="w-full py-3.5 px-5 bg-[#FFFDF8] hover:bg-[#24152F] hover:text-white border border-[#E7E2D8] hover:border-[#D4AF37] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-[#171717] font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span>Level 3 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="gateway-card-level4"
              onClick={onSelectLevel4}
              className="w-full py-3.5 px-5 bg-[#FFFDF8] hover:bg-[#24152F] hover:text-white border border-[#E7E2D8] hover:border-[#D4AF37] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-between text-[#171717] font-semibold text-sm group"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span>Level 4 Login</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>

            {onSelectSignUp && (
              <div className="pt-2 text-center text-xs text-[#5F6368] border-t border-[#E7E2D8] font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  id="gateway-inline-signup-btn"
                  onClick={onSelectSignUp}
                  className="text-[#24152F] hover:text-[#D4AF37] font-semibold underline underline-offset-2 cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E2D8] bg-[#FFFDF8] py-4 text-center text-xs text-[#5F6368] font-medium">
        Church Financial Management Platform &bull; Authoritative Portals
      </footer>
    </div>
  );
};
