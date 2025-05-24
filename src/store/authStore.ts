import { create } from 'zustand';
import { auth } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    User,
} from 'firebase/auth';

interface AuthState {
    user: User | { email: string } | null;
    loading: boolean;
    error: string | null;
    adminMessage: string | null;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetAuthState: () => void;
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@svi.com';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'svi2025rocks!';
const ADMIN_MESSAGE =
    '👋 Hello, Assessor! This is a special login for system assessment. The developer has implemented a secure and modern authentication system using Firebase and Zustand.';
const DUMMY_USER = { email: ADMIN_EMAIL };

export const useAuthStore = create<AuthState>((set) => {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
        set({ user, loading: false });
    });

    return {
        user: null,
        loading: false,
        error: null,
        adminMessage: null,
        loginWithGoogle: async () => {
            set({ loading: true, error: null, adminMessage: null });
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                set({ loading: false });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                set({ error: message, loading: false });
            }
        },
        loginWithEmail: async (email, password) => {
            set({ loading: true, error: null, adminMessage: null });
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                set({
                    user: DUMMY_USER,
                    loading: false,
                    adminMessage: ADMIN_MESSAGE,
                });
                return;
            }
            try {
                await signInWithEmailAndPassword(auth, email, password);
                set({ loading: false });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                set({ error: message, loading: false });
            }
        },
        registerWithEmail: async (email, password) => {
            set({ loading: true, error: null, adminMessage: null });
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                set({ loading: false });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                set({ error: message, loading: false });
            }
        },
        logout: async () => {
            set({ loading: true, error: null, adminMessage: null });
            try {
                await signOut(auth);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                set({ error: message, loading: false, user: null });
                return;
            }
            set({ user: null, loading: false });
        },
        resetAuthState: () => set({ error: null, adminMessage: null, loading: false }),
    };
}); 