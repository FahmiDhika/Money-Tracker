"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

type SummaryCardProps = {
  inflow: number;
  outflow: number;
  periodLabel: string;
  rangeStart: string;
  rangeEnd: string;
};

export function SummaryCard({
  inflow,
  outflow,
  periodLabel,
  rangeStart,
  rangeEnd,
}: SummaryCardProps) {
  const total = inflow - outflow;

  return (
    <div className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-500 p-5 text-white shadow-sm">
      <p className="text-xs text-emerald-100">Total for {periodLabel}</p>
      <p
        className={`mb-4 text-2xl font-bold ${total < 0 ? "text-red-100" : "text-white"}`}
      >
        {formatCurrency(total)}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-emerald-100">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-xs">Inflow</span>
          </div>
          <p className="text-sm font-semibold">{formatCurrency(inflow)}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-emerald-100">
            <ArrowDownRight className="h-4 w-4" />
            <span className="text-xs">Outflow</span>
          </div>
          <p className="text-sm font-semibold">{formatCurrency(outflow)}</p>
        </div>
      </div>

      <Link
        href={`/history/report?start=${rangeStart}&end=${rangeEnd}`}
        className="mt-4 block rounded-full bg-white/15 py-2 text-center text-sm font-medium hover:bg-white/25"
      >
        View report for this period
      </Link>
    </div>
  );
}
