import { TransactionForm } from "./_components/transaction-form";

export const metadata = { title: "Money Tracker | Transaction" };

export default function TransactionPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-stone-900">
        Add Transaction
      </h1>
      <TransactionForm />
    </div>
  );
}
