"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./ui/Input";
import { FcGoogle } from "react-icons/fc";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loading,
    error,
    adminMessage,
    resetAuthState,
  } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setRegisterSuccess(false);
    setFieldErrors({});

    const errors: typeof fieldErrors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await loginWithEmail(email, password);
    if (!error) {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setRegisterSuccess(false);
    setFieldErrors({});

    const errors: typeof fieldErrors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (!validatePassword(password)) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!confirm) {
      errors.confirm = "Please confirm your password";
    } else if (password !== confirm) {
      errors.confirm = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await registerWithEmail(email, password);
    if (!error) {
      setRegisterSuccess(true);
      // Clear form
      setEmail("");
      setPassword("");
      setConfirm("");
      // Switch to login tab after successful registration
      setTab("login");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    if (!error) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    resetAuthState();
    setLocalError(null);
    setRegisterSuccess(false);
    setFieldErrors({});
  };

  const handleTabChange = (newTab: "login" | "register") => {
    setTab(newTab);
    resetAuthState();
    setRegisterSuccess(false);
    setLocalError(null);
    setFieldErrors({});
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full"
            onClick={handleClose}
          ></div>
          {/* Modal Card */}
          <motion.div
            initial={{ y: 80, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[var(--color-modal-background)] rounded-2xl shadow-2xl p-8 w-full max-w-sm sm:max-w-md relative"
          >
            <div className="font-extrabold text-xl text-[var(--color-accent)] tracking-wide mb-8 w-full text-center">
              SVI Movies
            </div>
            {/* Dummy Credentials Info */}
            <div className="mb-6 p-4 bg-[var(--color-background-secondary)] rounded-lg text-sm">
              <p className="text-[var(--color-text-secondary)] mb-2">
                Demo Credentials:
              </p>
              <div className="space-y-1">
                <p className="text-[var(--color-text-tertiary)]">
                  <span className="text-[var(--color-accent)]">Email:</span>{" "}
                  admin@svi.com
                </p>
                <p className="text-[var(--color-text-tertiary)]">
                  <span className="text-[var(--color-accent)]">Password:</span>{" "}
                  svi2025rocks!
                </p>
              </div>
            </div>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-2 rounded-full font-semibold transition ${
                  tab === "login"
                    ? "bg-[var(--color-accent)] text-[var(--color-background)]"
                    : "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]"
                }`}
                onClick={() => handleTabChange("login")}
                aria-label="Switch to login form"
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 rounded-full font-semibold transition ${
                  tab === "register"
                    ? "bg-[var(--color-accent)] text-[var(--color-background)]"
                    : "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]"
                }`}
                onClick={() => handleTabChange("register")}
                aria-label="Switch to register form"
              >
                Register
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={tab === "login" ? handleLogin : handleRegister}
              className="flex flex-col gap-4"
              role="form"
            >
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                autoFocus
                disabled={loading}
              />
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                disabled={loading}
              />
              {tab === "register" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={fieldErrors.confirm}
                    disabled={loading}
                  />
                </motion.div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-background)] font-bold hover:bg-[var(--color-accent-hover)] transition disabled:opacity-60"
                disabled={loading}
                aria-label={
                  tab === "login" ? "Submit login" : "Submit registration"
                }
              >
                {tab === "login"
                  ? loading
                    ? "Logging in..."
                    : "Login"
                  : loading
                  ? "Registering..."
                  : "Register"}
              </button>
            </form>
            <div className="my-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-[var(--color-background-secondary)]" />
              <span className="text-xs text-[var(--color-text-tertiary)]">
                or
              </span>
              <div className="flex-1 h-px bg-[var(--color-background-secondary)]" />
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-lg bg-[var(--color-background)] text-[var(--color-text-primary)] font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-background-secondary)] transition disabled:opacity-60"
              disabled={loading}
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
            {(localError || error) && (
              <div className="mt-4 text-[var(--color-error)] text-sm text-center">
                {localError || error}
              </div>
            )}
            {registerSuccess && tab === "register" && !error && (
              <div className="mt-4 text-[var(--color-success)] text-sm text-center">
                Registration successful! You can now log in.
              </div>
            )}
            {adminMessage && (
              <div className="mt-4 text-[var(--color-success)] text-sm text-center">
                {adminMessage}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
