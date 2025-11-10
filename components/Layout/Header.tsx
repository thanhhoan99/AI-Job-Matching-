"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthLoading } from "@/hooks/use-auth-loading";
import { cn } from "@/lib/utils";
import "@/public/assets/css/style.css";
import "@/styles/globalsApplicant.css";

const publicNavItems = [
  { href: "/jobs", label: "Find a Job" },
  { href: "/companies", label: "Recruiters" },
  { href: "/candidates-grid", label: "Candidates" },
  { href: "/blog-grid", label: "Blog" },
  { href: "/page-contact", label: "Contact" },
];

const applicantNavItems = [
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/profile", label: "Profile" },
  { href: "/applicant/jobs", label: "My Jobs" },
  { href: "/applicant/applications", label: "Applications" },
  { href: "/applicant/interview", label: "AI Interview" },
  { href: "/applicant/chat", label: "Chatbot" },
];

interface HeaderProps {
  handleOpen?: () => void;
  handleRemove?: () => void;
  openClass?: string;
}

export default function Header({
  handleOpen,
  handleRemove,
  openClass,
}: HeaderProps) {
  const pathname = usePathname();
  const { user, role, isLoading } = useAuth();
  const { startAuthLoading } = useAuthLoading();
  const [scroll, setScroll] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = async () => {
    startAuthLoading();
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  const shouldHideHeader =
    !isLoading &&
    (pathname?.startsWith("/employer") || pathname?.startsWith("/admin"));
  if (shouldHideHeader) return null;

  const getNavItems = () =>
    !user
      ? publicNavItems
      : role === "applicant"
      ? applicantNavItems
      : publicNavItems;
  const navItemsToShow = getNavItems();

  const getDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.email?.split("@")[0];
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // scroll sticky
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 100);
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <header className="header sticky-bar stick">
        <div className="container">
          <div className="main-header animate-pulse flex justify-between py-3">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`${
          scroll ? "header sticky-bar stick" : "header sticky-bar"
        } w-full z-40`}
      >
        <div className="w-full px-0">
          <div className="main-header flex items-center justify-between w-full px-6">
            {/* left: logo */}
            <div style={{ paddingLeft: "3rem" }} className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <Image
                      alt="JobHub"
                      src="/assets/imgs/template/logo.svg"
                      width={130}
                      height={40}
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* center: menu */}
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li>
                    <Link href="/" className={cn(pathname === "/" && "active")}>
                      <span>Home</span>
                    </Link>
                  </li>

                  {navItemsToShow.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname?.startsWith(item.href) && "active"
                        )}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* burger icon */}
              <div
                className={`burger-icon burger-icon-white ${
                  openClass && "burger-close"
                }`}
                onClick={() => {
                  handleOpen?.();
                  handleRemove?.();
                }}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>

            {/* right: user dropdown */}
            <div className="header-right">
              <div className="block-signin">
                {user ? (
                  <div className="relative user-dropdown">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Avatar */}
                      {user.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="avatar"
                          width={36}
                          height={36}
                          className="rounded-full border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full border border-blue-100 bg-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
                          {getInitials()}
                        </div>
                      )}

                      <span className="text-gray-700 font-medium hidden md:block">
                        {getDisplayName()}
                      </span>

                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          userDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown menu */}
                    {userDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/applicant/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdown(false)}
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/auth/sign-up">
                      <span className="text-link-bd-btom hover-up">
                        Register
                      </span>
                    </Link>
                    <Link href="/auth/login">
                      <span className="btn btn-default btn-shadow ml-40 hover-up">
                        Sign in
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* mobile header giữ nguyên */}
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>

              <div className="mobile-menu-wrap mobile-header-border">
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li>
                      <Link
                        href="/"
                        className={cn(pathname === "/" && "active")}
                      >
                        <span>Home</span>
                      </Link>
                    </li>
                    {navItemsToShow.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            pathname?.startsWith(item.href) && "active"
                          )}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  {user ? (
                    <>
                      <li>
                        <Link href="/applicant/profile">
                          <span>Profile</span>
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>
                          <span>Sign Out</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/auth/login">
                          <span>Sign in</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth/sign-up">
                          <span>Register</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="site-copyright">
                Copyright 2025 © JobHub.
                <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* animation nhỏ cho dropdown */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </>
  );
}
