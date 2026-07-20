"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "@/components/common/transaction/category-icons";
import { Transaction } from "./transaction-list";
import { EditTransactionSheet } from "./edit-transaction-list";

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
          <p className="text-xs text-stone-500">
            {transaction.payment_method}
            {transaction.note ? ` · ${transaction.note}` : ""}
          </p>
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
