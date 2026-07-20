"use client"

import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Item = {
  type: "income" | "expense";
  amount: number;
  category: string;
  transaction_date: string;
};

function buildDailySeries(items: Item[]) {
  const map = new Map<
    string,
    { date: string; income: number; expense: number }
  >();
  items.forEach((t) => {
    const entry = map.get(t.transaction_date) ?? {
      date: t.transaction_date,
      income: 0,
      expense: 0,
    };
    if (t.type === "income") entry.income += Number(t.amount);
    else entry.expense += Number(t.amount);
    map.set(t.transaction_date, entry);
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function ReportCard({
  range,
  thisPeriodItems,
  thisPeriodExpense,
  lastPeriodExpense,
}: {
  range: "week" | "month";
  thisPeriodItems: Item[];
  thisPeriodExpense: number;
  lastPeriodExpense: number;
}) {
  const change =
    lastPeriodExpense > 0
      ? Math.round(
          ((thisPeriodExpense - lastPeriodExpense) / lastPeriodExpense) * 100,
        )
      : 0;

  const dailySeries = buildDailySeries(thisPeriodItems);
  const barData = [
    {
      name: range === "week" ? "Last Week" : "Last Month",
      amount: lastPeriodExpense,
    },
    {
      name: range === "week" ? "This Week" : "This Month",
      amount: thisPeriodExpense,
    },
  ];

  return (
    <div className="rounded-xl border border-stone-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-900">
          Report this {range}
        </p>
        <Link
          href="/history/report"
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          See report
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1">
        <Link
          href="/home?range=week"
          className={`rounded-lg py-2 text-center text-sm font-medium ${
            range === "week"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500"
          }`}
        >
          Week
        </Link>
        <Link
          href="/home?range=month"
          className={`rounded-lg py-2 text-center text-sm font-medium ${
            range === "month"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500"
          }`}
        >
          Month
        </Link>
      </div>

      <p className="text-2xl font-semibold text-stone-900">
        {formatCurrency(thisPeriodExpense)}
      </p>
      <p className="mb-4 text-xs text-stone-500">
        Total spent this {range}{" "}
        <span className={change > 0 ? "text-red-600" : "text-emerald-700"}>
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </p>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-stone-500">
        Income vs Expense trend
      </p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySeries}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={(d: string) => d.slice(8)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#047857"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
