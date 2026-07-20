"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTransactions } from "../actions";
import { Transaction, TransactionList } from "../_components/transaction-list";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Transaction[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    setQuery(value);
    startTransition(async () => {
      const data = await searchTransactions(value);
      setResults(data);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/history" className="text-stone-500 hover:text-stone-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Input
          autoFocus
          placeholder="Search category, note, or payment method"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      {isPending && <p className="text-sm text-stone-500">Searching...</p>}

      {!query && (
        <div className="flex flex-col items-center py-16 text-stone-300">
          <Search className="mb-2 h-10 w-10" />
          <p className="text-sm text-stone-400">
            Search by category, note, or payment method
          </p>
        </div>
      )}
      {!isPending && query && <TransactionList transactions={results} />}
    </div>
  );
}
