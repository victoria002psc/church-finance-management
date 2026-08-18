import React, { useState } from 'react';
import { 
  Crown, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { User, L1DashboardData } from '../../types.ts';
import { loginLevel1User } from '../../services/api.ts';

interface Level1LoginProps {
  onLoginSuccess: (user: User, state?: L1DashboardData) => void;
  onNavigateGateway?: () => void;
  onNavigateSignUp?: () => void;
}

export const Level1Login: React.FC<Level1LoginProps> = ({ 
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
    try {
      const response = await loginLevel1User({
        emailOrUsername: emailOrUsername.trim(),
        password: password.trim(),
      });

      if (response.success && response.user) {
        onLoginSuccess(response.user, response.state);
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email/username and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="level1-login-screen" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Level 1 Governance</span>
            <span className="ml-2.5 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              LEVEL 1 PORTAL
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {onNavigateSignUp && (
            <button
              id="l1-to-signup-header-btn"
              onClick={onNavigateSignUp}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 transition-colors cursor-pointer font-semibold"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          )}

          {onNavigateGateway && (
            <button
              id="l1-back-to-gateway-btn"
              onClick={onNavigateGateway}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portals</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Card */}
          <div className="p-6 bg-slate-50/70 border-b border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Crown className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Level 1 Login
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to your authorized Level 1 account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div id="l1-login-error-alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            {/* Email / Username Input */}
            <div>
              <label htmlFor="l1-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Level 1 Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="l1-email-input"
                  type="text"
                  autoComplete="username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  placeholder="bishop@gracechurch.org or username"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="l1-password-input" className="block text-xs font-semibold text-slate-700">
                  Security Password
                </label>
                <button
                  type="button"
                  id="l1-forgot-password-link"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="l1-password-input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono transition-colors"
                  placeholder="Enter your security password"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="l1-submit-login-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Level 1</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Sign Up Option */}
            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 font-medium">
              Don't have a Level 1 account?{' '}
              {onNavigateSignUp && (
                <button
                  type="button"
                  id="l1-inline-signup-btn"
                  onClick={onNavigateSignUp}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 cursor-pointer ml-1"
                >
                  Request Access
                </button>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="pt-1 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Secure Fiduciary Access Layer</span>
            </div>
          </form>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Password Recovery</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Level 1 password resets can be requested by contacting your system administrator.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1 font-medium">
              <div><span className="text-slate-800 font-semibold">Administrator Desk:</span> admin@gracechurch.org</div>
              <div><span className="text-slate-800 font-semibold">Security Desk:</span> +91 98450 00001</div>
            </div>
            <button
              id="close-l1-forgot-modal-btn"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 text-center text-xs text-slate-500 font-medium">
        Church Financial Management Platform &bull; Authorized Access Only
      </footer>
    </div>
  );
};
