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
        setErrorMsg('Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="signup-screen" className="min-h-screen bg-[#F7F3EA] text-[#241B2F] flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <header className="border-b border-[#3A2B49] bg-[#21152F] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">Church Financial Management</span>
            <span className="ml-2.5 px-2 py-0.5 text-[10px] font-bold bg-[#C9A227] text-[#21152F] rounded-full">
              REGISTRATION
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="signup-back-to-gateway-btn"
            onClick={onNavigateGateway}
            className="text-xs text-[#D9D0E3] hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portals</span>
          </button>
          <button
            id="signup-to-login-link"
            onClick={() => onNavigateLogin(selectedRole)}
            className="text-xs text-[#C9A227] hover:text-[#D8B44A] font-semibold transition-colors cursor-pointer"
          >
            Sign In &rarr;
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E5DED2] rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-[#21152F] text-white text-center border-b border-[#3A2B49]">
            <div className="w-12 h-12 rounded-2xl bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#C9A227]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-[#D9D0E3] mt-1 font-medium">
              Enter your details to register and access your dashboard.
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
              <label htmlFor="signup-access-type" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                Account Level
              </label>
              <select
                id="signup-access-type"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as RoleLevel)}
                className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] focus:outline-none focus:border-[#C9A227] transition-colors cursor-pointer font-medium"
              >
                <option value="LEVEL_1">Level 1 (Executive Oversight)</option>
                <option value="LEVEL_2">Level 2 (Financial Control)</option>
                <option value="LEVEL_3">Level 3 (Department Management)</option>
                <option value="LEVEL_4">Level 4 (Field Operations)</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="signup-name-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@church.org"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="signup-phone-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="signup-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="signup-password-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    className="w-full pl-8 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password-input" className="block text-xs font-semibold text-[#241B2F] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#817684]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="signup-confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="w-full pl-8 pr-3 py-2 bg-[#FFFDF8] border border-[#E5DED2] rounded-xl text-xs text-[#241B2F] placeholder-[#817684] focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#21152F] hover:bg-[#2B1B3D] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </>
              )}
            </button>

            {/* Already have an account */}
            <div className="text-center text-xs text-[#62586B] pt-2 border-t border-[#E5DED2] font-medium">
              Already have an account?{' '}
              <button
                type="button"
                id="signup-switch-to-login-btn"
                onClick={() => onNavigateLogin(selectedRole)}
                className="text-[#21152F] hover:text-[#C9A227] font-semibold underline underline-offset-2 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DED2] bg-[#FFFDF8] py-3.5 text-center text-xs text-[#62586B] font-medium">
        Church Financial Management Platform &bull; Secure User Registration
      </footer>
    </div>
  );
};
