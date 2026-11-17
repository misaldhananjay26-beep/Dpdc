import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

const AUTHORIZED_ADMIN_EMAILS = ['misaldhananjay26@gmail.com'];

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return (
    AUTHORIZED_ADMIN_EMAILS.includes(lower) ||
    lower.endsWith('@dpdcskill.com')
  );
}

let cachedAccessToken: string | null = null;

export const subscribeToAuthChanges = (
  onAuthUser: (user: User | null, googleAccessToken: string | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (!user) {
      cachedAccessToken = null;
    }
    onAuthUser(user, cachedAccessToken);
  });
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || '');
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  const msg = error instanceof Error ? error.message : String(error);

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found'
  ) {
    return 'ईमेल किंवा पासवर्ड चुकीचा आहे. कृपया पुन्हा तपासा. (Invalid email or password.)';
  }
  if (code === 'auth/invalid-email') {
    return 'कृपया वैध ईमेल पत्ता प्रविष्ट करा. (Invalid email address.)';
  }
  if (code === 'auth/too-many-requests') {
    return 'अनेक अयशस्वी प्रयत्नांमुळे खाते तात्पुरते ब्लॉक केले आहे. कृपया थोड्या वेळाने प्रयत्न करा.';
  }
  if (code === 'auth/user-disabled') {
    return 'हे प्रशासक खाते अक्षम (Disabled) करण्यात आले आहे.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Firebase Console मध्ये Email/Password Sign-In अद्याप सुरू (Enable) केलेले नाही. कृपया Firebase Console > Authentication > Sign-in method मध्ये Email/Password सुरू करा किंवा Google ने लॉगिन करा.';
  }
  if (code === 'auth/network-request-failed') {
    return 'नेटवर्क त्रुटी. कृपया इंटरनेट कनेक्शन तपासा.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google लॉगिन रद्द केले.';
  }
  return msg || 'प्रमाणीकरण अयशस्वी झाले. (Authentication failed.)';
}

export const emailPasswordSignIn = async (
  email: string,
  password: string
): Promise<{ user: User }> => {
  const cleanEmail = email.trim();
  const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
  return { user: result.user };
};

export const sendAdminPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const resendAdminVerificationEmail = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No authenticated user found.');
  }
  await sendEmailVerification(auth.currentUser);
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || '';
    if (accessToken) {
      cachedAccessToken = accessToken;
    }
    return { user: result.user, accessToken };
  } catch (error: unknown) {
    console.error('Google Sign-in error:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutAdmin = async () => {
  cachedAccessToken = null;
  await signOut(auth);
};

export const logoutGoogle = logoutAdmin;
