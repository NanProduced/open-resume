"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "lib/i18n";
import type { Language } from "lib/redux/settingsSlice";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const { t, language, setLanguage } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowDropdown(false);
  };

  const navLinks = [
    ["/resume-builder", t.nav.builder],
    ["/resume-parser", t.nav.parser],
  ] as const;

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">OpenResume</span>
          <Image
            src={logoSrc}
            alt="OpenResume Logo"
            className="h-8 w-full"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {navLinks.map(([href, text]) => (
            <Link
              key={href}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Switch language"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{language === "zh" ? "中文" : "EN"}</span>
              <svg className={`h-3 w-3 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${language === "en" ? "bg-sky-50 text-sky-600" : "text-gray-700"}`}
                  onClick={() => handleLanguageChange("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${language === "zh" ? "bg-sky-50 text-sky-600" : "text-gray-700"}`}
                  onClick={() => handleLanguageChange("zh")}
                >
                  中文
                </button>
              </div>
            )}
          </div>

          <div className="ml-1 mt-1">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=xitanggg&repo=open-resume&type=star&count=true"
              width="100"
              height="20"
              className="overflow-hidden border-none"
              title="GitHub"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};
