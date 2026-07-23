"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, X } from "lucide-react";

const STORAGE_KEY = "reminder-dismissed-date";

export function ReminderBanner({
  show,
  todayStr,
}: {
  show: boolean;
  todayStr: string;
}) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === todayStr,
  );

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, todayStr);
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <BellRing className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-900">
          Belum ada transaksi hari ini
        </p>
        <p className="text-xs text-amber-700">
          Jangan lupa catat pemasukan/pengeluaran hari ini.
        </p>
      </div>
      <Link
        href="/transaction"
        className="shrink-0 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
      >
        Catat
      </Link>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-amber-400 hover:text-amber-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
