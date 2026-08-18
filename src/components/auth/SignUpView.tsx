import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { RoleLevel, User } from '../../types.ts';
import { registerAccount } from '../../services/api.ts';

interface SignUpViewProps {
  initialRole?: RoleLevel;
  onSignUpSuccess?: (user: User, token?: string, state?: any) => void;
  onNavigateLogin: (role?: RoleLevel) => void;
  onNavigateGateway: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  initialRole = 'LEVEL_3',
  onSignUpSuccess,
  onNavigateLogin,
  onNavigateGateway,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleLevel>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerAccount({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: selectedRole,
        designation: 'Authorized User',
        phone: phone.trim(),
        assignedArea: 'Standard Jurisdiction',
      });

      if (response.success && response.user) {
        if (onSignUpSuccess) {
          onSignUpSuccess(response.user, response.token, response.state);
        } else {
          onNavigateLogin(selectedRole);
        }
      } else {
        setErrorMsg('Access request failed. Please verify your information.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="signup-screen" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div>
          <span className="font-bold text-slate-900 text-base tracking-tight">Church Financial Management</span>
          <span className="ml-2.5 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            REQUEST ACCESS
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="signup-back-to-gateway-btn"
            onClick={onNavigateGateway}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </button>
          <button
            id="signup-to-login-link"
            onClick={() => onNavigateLogin(selectedRole)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
          >
            Sign In &rarr;
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-slate-50/70 border-b border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Request Access
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Submit your credentials to request portal access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div id="signup-error-alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {/* Access Type Selection */}
            <div>
              <label htmlFor="signup-access-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Access Type
              </label>
              <select
                id="signup-access-type"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as RoleLevel)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer font-medium"
              >
                <option value="LEVEL_1">Level 1 Access</option>
                <option value="LEVEL_2">Level 2 Access</option>
                <option value="LEVEL_3">Level 3 Access</option>
                <option value="LEVEL_4">Level 4 Access</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="signup-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="signup-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="signup-phone-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="signup-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="signup-confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Already have an account */}
            <div className="text-center text-xs text-slate-500 pt-2 font-medium">
              Already have an authorized account?{' '}
              <button
                type="button"
                id="signup-switch-to-login-btn"
                onClick={() => onNavigateLogin(selectedRole)}
                className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 text-center text-xs text-slate-500 font-medium">
        Secure Access &bull; Authorized Users Only
      </footer>
    </div>
  );
};
