import React, { useState } from 'react';
import { 
  Users, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ArrowLeft,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface Level4LoginProps {
  onLoginSuccess: () => void;
  onNavigateGateway?: () => void;
  onNavigateSignUp?: () => void;
}

export const Level4Login: React.FC<Level4LoginProps> = ({ 
  onLoginSuccess, 
  onNavigateGateway,
  onNavigateSignUp
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMsg('Please enter your email/username and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div id="level4-login-screen" className="min-h-screen bg-[#F7F3EA] text-[#241B2F] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="border-b border-[#3A2B49] bg-[#21152F] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold shadow-xs">
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">Level 4 Login</span>
        </div>

        {onNavigateGateway && (
          <button
            id="l4-back-to-gateway-btn"
            onClick={onNavigateGateway}
            className="text-xs text-[#D9D0E3] hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portals</span>
          </button>
        )}
      </header>

      {/* Main Login Form Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E5DED2] rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Card */}
          <div className="p-6 bg-[#21152F] text-white text-center border-b border-[#3A2B49]">
            <div className="w-12 h-12 rounded-2xl bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Users className="w-6 h-6 text-[#C9A227]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Level 4 Login
            </h1>
            <p className="text-xs text-[#D9D0E3] mt-1 font-medium">
              Enter your credentials to sign in to Level 4.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div id="l4-login-error-alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {/* Email / Username Input */}
            <div>
              <label htmlFor="l4-email-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="l4-email-input"
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="vikram.patel@gracechurch.org"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="l4-password-input" className="block text-xs font-semibold text-[#241B2F]">
                  Password
                </label>
                <button
                  type="button"
                  id="l4-forgot-password-link"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#21152F] hover:text-[#C9A227] font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="l4-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              id="l4-submit-login-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#21152F] hover:bg-[#2B1B3D] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Level 4</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </>
              )}
            </button>

            {/* Sign Up Navigation */}
            {onNavigateSignUp && (
              <div className="text-center text-xs text-[#62586B] pt-2 border-t border-[#E5DED2] font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  id="l4-signup-link"
                  onClick={onNavigateSignUp}
                  className="text-[#21152F] hover:text-[#C9A227] font-bold underline underline-offset-2 cursor-pointer inline-flex items-center space-x-1"
                >
                  <span>Sign Up / Register</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-[#21152F]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFDF8] border border-[#E5DED2] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-xl bg-[#21152F] text-[#C9A227] flex items-center justify-center mx-auto shadow-xs">
              <KeyRound className="w-5 h-5 text-[#C9A227]" />
            </div>
            <h3 className="font-bold text-base text-[#241B2F]">Reset Password</h3>
            <p className="text-xs text-[#62586B]">
              Please contact your Level 3 Department Supervisor to reset your credentials.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#21152F] hover:bg-[#2B1B3D] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5DED2] bg-[#FFFDF8] py-3.5 text-center text-xs text-[#62586B] font-medium">
        Level 4 Operations Workspace &bull; Church Financial Management Platform
      </footer>
    </div>
  );
};
