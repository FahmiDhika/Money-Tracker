"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, History, User, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/transaction", label: "Transaction", icon: ArrowLeftRight },
  { href: "/budget", label: "Budget", icon: Target },
  { href: "/user", label: "User", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur",
        "px-2 py-2",
        "sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2",
        "sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:px-2 sm:py-2 sm:shadow-lg",
      )}
    >
      <ul className="flex items-center justify-around sm:justify-center sm:gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-center rounded-xl p-2.5 transition-colors",
                  "sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm sm:font-medium",
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
