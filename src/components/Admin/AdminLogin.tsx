import React, { useState } from 'react';
import {
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  emailPasswordSignIn,
  googleSignIn,
  sendAdminPasswordReset,
  mapFirebaseAuthError,
  isAuthorizedAdminEmail,
  logoutAdmin,
} from '../../services/firebaseAuth';
import logoImg from '../../assets/logo.png';

interface AdminLoginProps {
  onSuccess: (session: { email: string; token?: string }) => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // Firebase Password Reset view
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await emailPasswordSignIn(email, password);
      onSuccess({ email: user.email || email.trim().toLowerCase() });
    } catch (err: unknown) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (!res) return;

      const userEmail = res.user.email?.toLowerCase();
      if (isAuthorizedAdminEmail(userEmail)) {
        onSuccess({
          email: userEmail || '',
          token: res.accessToken,
        });
      } else {
        await logoutAdmin();
        setError(
          `प्रवेश नाकारला! ${userEmail} हे अनधिकृत खाते आहे. केवळ मुख्य प्रशासक किंवा @dpdcskill.com ईमेल खात्यास परवानगी आहे.`
        );
      }
    } catch (err: unknown) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSent(false);
    if (!resetEmail.trim()) {
      setError('कृपया आपला प्रशासक ईमेल प्रविष्ट करा.');
      return;
    }

    setIsLoading(true);
    try {
      await sendAdminPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err: unknown) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white px-3.5 py-2 rounded-xl bg-[#141416] border border-neutral-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>वेबसाइटवर परत जा (Back to Website)</span>
        </button>
      </div>

      <div className="w-full max-w-md gold-card rounded-3xl p-6 sm:p-8 relative z-10 border border-[#D4AF37]/40 shadow-2xl">
        {/* Top gold highlight line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full p-[2px] bg-gradient-to-br from-[#D4AF37] via-[#F5DE9E] to-[#AA820A] shadow-[0_0_25px_rgba(212,175,55,0.35)] mb-3 overflow-hidden">
            <img src={logoImg} alt="DPDC SKILL Logo" className="w-full h-full object-cover rounded-full bg-black" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
            DPDC SKILL • प्रशासक प्रवेश
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Firebase Protected Executive Lead & Franchise Portal
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleSendPasswordReset} className="space-y-4">
            <div className="text-xs text-[#F5DE9E] font-semibold pb-1 border-b border-neutral-800">
              पासवर्ड रीसेट लिंक पाठवा (Firebase Password Reset)
            </div>

            {resetSent && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवली आहे. कृपया इनबॉक्स किंवा स्पॅम फोल्डर तपासा.
                </span>
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-gray-300 mb-1">
                नोंदणीकृत प्रशासक ईमेल (Admin Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@dpdcskill.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError(null);
                  setResetSent(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-semibold text-gray-300 cursor-pointer"
              >
                परत जा (Back)
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 gold-gradient-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'पाठवत आहे...' : 'लिंक पाठवा'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Authorized Admin Email */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-300 mb-1">
                अधिकृत प्रशासक ईमेल (Admin Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dpdcskill.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="admin-password" className="text-xs font-semibold text-gray-300">
                  पासवर्ड (Password)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setError(null);
                  }}
                  className="text-[11px] text-[#F5DE9E] hover:underline cursor-pointer"
                >
                  पासवर्ड विसरलात?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="प्रशासक पासवर्ड प्रविष्ट करा"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Standard Firebase Email/Password Login Submit */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full gold-gradient-btn py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'प्रमाणीकरण सुरू आहे...' : 'प्रशासक लॉगिन (Login as Admin)'}</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#121215] px-2 text-gray-400 font-bold">
                  किंवा Google द्वारे लॉगिन करा
                </span>
              </div>
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Sign in with Google (Admin & Sheets)'}</span>
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-gray-400">
            Firebase Authentication द्वारे संरक्षित • केवळ अधिकृत DPDC SKILL व्यवस्थापनासाठी राखीव
          </p>
        </div>
      </div>
    </div>
  );
};
