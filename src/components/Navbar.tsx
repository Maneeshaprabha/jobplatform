'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, X, MapPin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const NAV_LINKS = [
  { href: '/jobs', label: 'Find Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/papers', label: 'Papers' },
  { href: '/employer/jobs/create', label: 'Upload Job' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const switchLanguage = (locale: 'en' | 'si' | 'ta') => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.replace(segments.join('/'));
    setMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (!pathname) return false;
    // Strip locale prefix (e.g. /en/papers -> /papers)
    const cleanPath = pathname.replace(/^\/(en|si|ta)(?=\/|$)/, '') || '/';
    if (href === '/jobs' && cleanPath === '/') return true;
    return cleanPath === href || cleanPath.startsWith(`${href}/`);
  };

  const navBg = isDarkMode
    ? 'bg-[#1A1A1A]/95 border-zinc-800 shadow-black/50'
    : 'bg-white/95 border-zinc-200 shadow-zinc-200/60';
  const pillBorder = isDarkMode ? 'border-zinc-700' : 'border-zinc-200';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <>
      <div className="sticky top-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pb-2">
        <nav
          className={`max-w-[1400px] mx-auto ${navBg} backdrop-blur-md border rounded-2xl sm:rounded-full shadow-md px-4 sm:px-6 py-2.5 sm:py-3 transition-colors duration-300`}
        >
          <div className="flex justify-between items-center gap-2">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 min-w-0"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs relative ${
                  isDarkMode
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-[#1A1A1A] text-white'
                }`}
              >
                JP
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#29AAE3] rounded-full border-2 border-white dark:border-[#1A1A1A]" />
              </div>
              <span
                className={`font-bold text-lg sm:text-2xl tracking-tight truncate ${textMain}`}
              >
                Job Platform
              </span>
            </Link>

            {/* Desktop Center Navigation Links */}
            <div
              className={`hidden lg:flex items-center gap-7 font-medium text-base ${textMuted}`}
            >
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors ${
                      active
                        ? `${textMain} font-semibold text-[#29AAE3]`
                        : 'hover:text-[#29AAE3]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div
              className={`hidden md:flex items-center gap-3 sm:gap-4 font-medium text-base ${textMuted}`}
            >
              <div
                className={`flex items-center rounded-full border ${pillBorder} overflow-hidden text-sm`}
              >
                <button
                  onClick={() => switchLanguage('en')}
                  className="px-3 py-1.5 hover:text-[#29AAE3] transition-colors cursor-pointer"
                >
                  EN
                </button>
                <button
                  onClick={() => switchLanguage('si')}
                  className={`px-3 py-1.5 border-l ${pillBorder} hover:text-[#29AAE3] transition-colors cursor-pointer`}
                >
                  සිං
                </button>
                <button
                  onClick={() => switchLanguage('ta')}
                  className={`px-3 py-1.5 border-l ${pillBorder} hover:text-[#29AAE3] transition-colors cursor-pointer`}
                >
                  த
                </button>
              </div>

              <div className="relative">
                <Bell
                  className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:${textMain} transition-colors`}
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#29AAE3] rounded-full border border-white"></span>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full border ${pillBorder} transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-white/10 text-yellow-400'
                    : 'hover:bg-zinc-100 text-zinc-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Mobile Compact Controls */}
            <div className="flex md:hidden items-center gap-2">
              <div className="relative p-1.5">
                <Bell className={`w-5 h-5 ${textMuted}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#29AAE3] rounded-full" />
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full border ${pillBorder} text-sm cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-white/10 text-yellow-400'
                    : 'hover:bg-zinc-100 text-zinc-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-full border ${pillBorder} ${textMain} cursor-pointer`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Full-Screen Dark Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-[#0B0B0D] text-white flex flex-col justify-between px-6 py-6 overflow-y-auto md:hidden"
          >
            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between mb-10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-extrabold tracking-wider uppercase text-white"
                >
                  JOB PLATFORM<span className="text-[#29AAE3]">.</span>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-11 h-11 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Section */}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-5">
                Navigation
              </p>

              <div className="flex flex-col space-y-5 text-2xl font-semibold">
                {NAV_LINKS.map((link) => {
                  const active = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`transition-colors ${
                        active
                          ? 'text-[#29AAE3]'
                          : 'text-white hover:text-[#29AAE3]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="mt-8 pt-6 border-t border-zinc-800/90 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Language
                </span>
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden text-sm font-medium text-zinc-300">
                  <button
                    onClick={() => switchLanguage('en')}
                    className="px-4 py-1.5 hover:text-[#29AAE3] transition-colors cursor-pointer"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => switchLanguage('si')}
                    className="px-4 py-1.5 border-l border-zinc-800 hover:text-[#29AAE3] transition-colors cursor-pointer"
                  >
                    සිං
                  </button>
                  <button
                    onClick={() => switchLanguage('ta')}
                    className="px-4 py-1.5 border-l border-zinc-800 hover:text-[#29AAE3] transition-colors cursor-pointer"
                  >
                    த
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Callout + Location & Email */}
            <div className="mt-10 pt-8 border-t border-zinc-800/90 space-y-6">
              <div>
                <h3 className="text-3xl font-extrabold leading-tight text-white">
                  Find your career
                </h3>
                <p className="text-3xl font-extrabold leading-tight text-zinc-500">
                  across Sri Lanka.
                </p>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                  Explore verified government gazettes, past papers, companies,
                  and IT vacancies across all 9 provinces.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Location
                    </p>
                    <p className="text-sm font-medium text-zinc-200">
                      Colombo, Sri Lanka.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Email
                    </p>
                    <p className="text-sm font-medium text-zinc-200">
                      hello@jobplatform.lk
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}