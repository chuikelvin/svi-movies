"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";
import { useAuthStore } from "@/store/authStore";
import { FiUser, FiLogOut } from "react-icons/fi";
import NavigationBar from "./NavigationBar";
import MovieSearch from "./MovieSearch";
import AuthButton from "./AuthButton";
import Link from "next/link";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="w-full flex items-center justify-between relative h-16 px-8">
      {/* Logo */}
      <Link href="/">
        <div className="font-extrabold text-xl text-[var(--color-accent)] tracking-wide">
          SVI Movies
        </div>
      </Link>
      <div className="flex gap-2">
        <NavigationBar />
        {/* Desktop Search */}
        <div className="hidden md:block">
          <MovieSearch />
        </div>
        {/* Desktop Auth */}
        <div className="hidden md:block">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
