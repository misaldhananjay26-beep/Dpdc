import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { googleSignIn } from '../../services/firebaseAuth';
import logoImg from '../../assets/logo.png';
import { sha256Hash, verifyAdminPassword } from '../../utils/crypto';

interface AdminLoginProps {
  onSuccess: (session: { email: string; token?: string }) => void;
  onBackToHome: () => void;
}

const AUTHORIZED_EMAIL = 'dhananjay@dpdc.admin';
const AUTHORIZED_GOOGLE_EMAIL = 'misaldhananjay26@gmail.com';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('dhananjay@dpdc.admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // One-time setup / change password state
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError('अनेक अयशस्वी प्रयत्नांमुळे खाते तात्पुरते लॉक केले आहे. कृपया १५ मिनिटांनंतर प्रयत्न करा.');
      return;
    }

    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    // Verify authorized administrator identity
    if (trimmedEmail !== AUTHORIZED_EMAIL) {
      setError('अनधिकृत ईमेल! केवळ अधिकृत मुख्य प्रशासकास प्रवेश अनुमती आहे.');
      StorageService.addAuditLog('Unknown', 'Unauthorized Login Attempt', `Attempted email: ${trimmedEmail}`);
      setIsLoading(false);
      return;
    }

    // Check password securely using salted SHA-256
    const storedHash = localStorage.getItem('dpdc_admin_pwd_hash_v2');
    const isValid = await verifyAdminPassword(password, storedHash);

    if (isValid) {
      setError(null);
      setFailedAttempts(0);
      const session = { loggedIn: true, email: trimmedEmail };
      StorageService.setAdminSession(session);
      onSuccess(session);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setIsLocked(true);
        setError('५ वेळा चुकीचा पासवर्ड प्रविष्ट केल्याने खाते १५ मिनिटांसाठी लॉक करण्यात आले आहे.');
      } else {
        setError(`चुकीचा पासवर्ड! शिल्लक प्रयत्न: ${5 - attempts}`);
      }
      StorageService.addAuditLog(trimmedEmail, 'Failed Login Attempt', `Attempt #${attempts}`);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (!res) return;

      const userEmail = res.user.email?.toLowerCase();
      // Enforce strict whitelist: only authorized admin owner or verified company domain
      if (
        userEmail === AUTHORIZED_GOOGLE_EMAIL.toLowerCase() ||
        userEmail?.endsWith('@dpdcskill.com')
      ) {
        const session = {
          email: userEmail,
          token: res.accessToken,
        };
        StorageService.setAdminSession({ loggedIn: true, email: session.email, token: session.token });
        onSuccess(session);
      } else {
        setError(`प्रवेश नाकारला! ${userEmail} हे अनधिकृत खाते आहे. केवळ मुख्य प्रशासक किंवा @dpdcskill.com ईमेल खात्यास परवानगी आहे.`);
        StorageService.addAuditLog(userEmail || 'Unknown', 'Unauthorized Google Login Attempt', 'Blocked by email whitelist');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      console.error('Google sign in error:', err);
      setError(msg.includes('popup-closed-by-user') ? 'लॉगिन रद्द केले.' : msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('पासवर्ड किमान ८ अक्षरांचा असावा.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('दोन्ही पासवर्ड जुळत नाहीत.');
      return;
    }

    const hashed = await sha256Hash(newPassword);
    localStorage.setItem('dpdc_admin_pwd_hash_v2', hashed);
    setSetupSuccess(true);
    setError(null);
    StorageService.addAuditLog(AUTHORIZED_EMAIL, 'Password Changed', 'Administrator password updated securely');
    setTimeout(() => {
      setShowPasswordSetup(false);
      setSetupSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070708] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-20">
        <button
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
            Private Executive Lead & Franchise Management Portal
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {showPasswordSetup ? (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div className="text-xs text-[#F5DE9E] font-semibold pb-1 border-b border-neutral-800">
              नवीन प्रशासक पासवर्ड सेट करा
            </div>

            {setupSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>पासवर्ड यशस्वीपणे अद्ययावत केला!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                नवीन पासवर्ड (New Password)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="किमान ८ अक्षरे"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                पासवर्ड पुन्हा प्रविष्ट करा (Confirm Password)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="पासवर्ड पुन्हा टाइप करा"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordSetup(false)}
                className="w-1/2 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-semibold text-gray-300"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="w-1/2 gold-gradient-btn py-2.5 rounded-xl text-xs font-bold"
              >
                जतन करा
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Authorized Admin Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                अधिकृत प्रशासक ईमेल (Admin Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dhananjay@dpdc.admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-300">
                  पासवर्ड (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordSetup(true)}
                  className="text-[11px] text-[#F5DE9E] hover:underline"
                >
                  पासवर्ड बदला?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="प्रशासक पासवर्ड प्रविष्ट करा"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Standard Login Submit */}
            <button
              type="submit"
              disabled={isLocked || isLoading}
              className="w-full gold-gradient-btn py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>प्रशासक लॉगिन (Login as Admin)</span>
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

            {/* Google Sign-In with Official Button Styling */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Sign in with Google (Sheets & Calendar)'}</span>
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-gray-400">
            सुरक्षित एन्क्रिप्शन • केवळ अधिकृत DPDC SKILL व्यवस्थापनासाठी राखीव
          </p>
        </div>
      </div>
    </div>
  );
};
