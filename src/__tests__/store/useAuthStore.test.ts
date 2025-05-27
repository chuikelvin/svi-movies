import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore'; // Adjust the path
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  setPersistence: jest.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  onAuthStateChanged: jest.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in with Google successfully', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.loginWithGoogle());

    expect(signInWithPopup).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Successfully logged in with Google!', { duration: 2000 });
  });

  it('handles Google login failure', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Google error'));

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.loginWithGoogle());

    expect(result.current.error).toBe('Google error');
    expect(toast.error).toHaveBeenCalledWith('Google login failed: Google error', { duration: 4000 });
  });

  it('logs in with email successfully', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.loginWithEmail('user@example.com', 'password'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'user@example.com', 'password');
    expect(result.current.error).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Successfully logged in!', { duration: 2000 });
  });

  it('logs in as admin with dummy user and message', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.loginWithEmail('admin@svi.com', 'svi2025rocks!'));

    expect(result.current.user).toEqual({ email: 'admin@svi.com' });
    expect(result.current.adminMessage).toContain('This is a special login for system assessment');
    expect(toast.success).toHaveBeenCalledWith('Welcome, Admin!', { duration: 2000 });
  });

  it('handles login error', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Login error'));

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.loginWithEmail('wrong@example.com', '123456'));

    expect(result.current.error).toBe('Login error');
    expect(toast.error).toHaveBeenCalledWith('Login failed: Login error', { duration: 4000 });
  });

  it('registers user successfully', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.registerWithEmail('new@example.com', 'password'));

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Registration successful! Please log in.', { duration: 3000 });
  });

  it('handles registration failure', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Register error'));

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.registerWithEmail('fail@example.com', 'password'));

    expect(result.current.error).toBe('Register error');
    expect(toast.error).toHaveBeenCalledWith('Registration failed: Register error', { duration: 4000 });
  });

  it('logs out successfully', async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Successfully logged out!', { duration: 2000 });
  });

  it('handles logout failure', async () => {
    (signOut as jest.Mock).mockRejectedValue(new Error('Logout error'));

    const { result } = renderHook(() => useAuthStore());
    await act(() => result.current.logout());

    expect(result.current.error).toBe('Logout error');
    expect(toast.error).toHaveBeenCalledWith('Logout failed: Logout error', { duration: 4000 });
  });

  it('resets auth state', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => result.current.resetAuthState());
    expect(result.current.error).toBeNull();
    expect(result.current.adminMessage).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
