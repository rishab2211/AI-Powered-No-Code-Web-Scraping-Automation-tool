"use client";

import { Workflow, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-zinc-800/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-7 bg-violet-600 rounded-md flex items-center justify-center group-hover:bg-violet-500 transition-colors">
            <Workflow className="size-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">FlowCraft</span>
        </Link>

        {/* Desktop center links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="text-zinc-400 hover:text-white text-sm transition-colors font-medium">
            Sign in
          </Link>
          <Link href="/sign-up">
            <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
              Get started
            </button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-zinc-500 hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0f]/95 backdrop-blur-xl px-8 py-6 space-y-5">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-zinc-400 hover:text-white text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <Link href="/sign-in" onClick={() => setOpen(false)} className="text-zinc-400 text-sm font-medium">
              Sign in
            </Link>
            <Link href="/sign-up" onClick={() => setOpen(false)}>
              <button className="w-full bg-white text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-zinc-100 transition-colors">
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;