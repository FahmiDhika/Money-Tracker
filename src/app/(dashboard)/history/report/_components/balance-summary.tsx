import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

export function BalanceSummary({
  openingBalance,
  endingBalance,
}: {
  openingBalance: number;
  endingBalance: number;
}) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-500 p-5 text-white shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-emerald-100">
        <Wallet className="h-4 w-4" />
        <p className="text-sm">Balance</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <p className="mb-1 text-xs text-emerald-100">Opening</p>
          <p className="text-base font-semibold">
            {formatCurrency(openingBalance)}
          </p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <p className="mb-1 text-xs text-emerald-100">Ending</p>
          <p
            className={`text-base font-semibold ${endingBalance < 0 ? "text-red-100" : "text-white"}`}
          >
            {formatCurrency(endingBalance)}
          </p>
        </div>
      </div>
    </div>
  );
}
