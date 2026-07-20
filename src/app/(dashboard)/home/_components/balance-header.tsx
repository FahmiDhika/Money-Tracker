"use client";

import { useState } from "react";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function BalanceHeader({ balance }: { balance: number }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-500 p-5 text-white shadow-sm">
      <div className="flex items-center gap-2 text-emerald-50 mb-3">
        <Wallet className="h-4 w-4" />
        <p className="text-sm">Total balance</p>
      </div>

      <div className="flex gap-2">
        <p className="text-3xl font-bold">
          {hidden ? "••••••••" : formatCurrency(balance)}
        </p>
        <button
          onClick={() => setHidden((h) => !h)}
          className="text-emerald-100 hover:text-white"
        >
          {hidden ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
