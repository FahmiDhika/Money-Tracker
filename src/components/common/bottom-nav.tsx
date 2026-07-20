"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/transaction", label: "Transaction", icon: ArrowLeftRight },
  { href: "/history", label: "History", icon: History },
  { href: "/user", label: "User", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Mobile: full-width bar stuck to the bottom
        "fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur",
        "px-2 py-2",
        // Desktop: floating centered dock
        "sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2",
        "sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:px-2 sm:py-2 sm:shadow-lg",
      )}
    >
      <ul className="flex items-center justify-around gap-1 sm:justify-center sm:gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors",
                  "sm:flex-row sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
