import { formatCurrency } from "@/lib/utils";
import { getPaymentMethodIcon } from "@/components/common/transaction/category-icons";

type Wallet = { name: string; balance: number };

export function WalletsCard({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-stone-900">My Wallets</p>

      {wallets.length === 0 ? (
        <p className="py-4 text-center text-sm text-stone-400">
          No transactions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {wallets.map((w) => {
            const { icon: Icon, bg, text } = getPaymentMethodIcon(w.name);
            return (
              <div key={w.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}
                  >
                    <Icon className={`h-4 w-4 ${text}`} />
                  </div>
                  <span className="text-sm text-stone-700">{w.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${w.balance < 0 ? "text-red-600" : "text-stone-900"}`}
                >
                  {formatCurrency(w.balance)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
