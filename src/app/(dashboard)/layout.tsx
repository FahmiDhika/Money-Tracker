import { BottomNav } from "@/components/common/bottom-nav";
import { BanknoteCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="flex border-b gap-2 border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-700 text-muted">
          <BanknoteCheck className="size-4" />
        </div>
        <p className="text-emerald-700 font-bold">Money Tracker</p>
      </header>
      
      <main className="mx-auto max-w-2xl px-4 py-6 pb-28 sm:px-6 sm:pb-32">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
