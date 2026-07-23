"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "@/components/common/transaction/category-icons";
import { Transaction } from "./transaction-list";
import { EditTransactionSheet } from "./edit-transaction-sheet";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = useState(false);
  const {
    icon: Icon,
    bg,
    text,
  } = getCategoryIcon(transaction.category, transaction.type);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-stone-200 px-3 py-2.5 text-left hover:bg-stone-50"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}
        >
          <Icon className={`h-5 w-5 ${text}`} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-stone-900">
            {transaction.category}
          </p>
          <div className="text-xs text-stone-500">
            <p>
              {transaction.payment_method}
              {transaction.note ? ` · ${transaction.note}` : ""}
            </p>

            {transaction.tags && transaction.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {transaction.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <span
          className={cn(
            "text-sm font-semibold",
            transaction.type === "income" ? "text-emerald-700" : "text-red-600",
          )}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
      </button>

      <EditTransactionSheet
        transaction={transaction}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
