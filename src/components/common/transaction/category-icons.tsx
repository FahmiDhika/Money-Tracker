import {
  PiggyBank,
  Briefcase,
  FolderKanban,
  TrendingUp,
  Dumbbell,
  Cookie,
  UtensilsCrossed,
  Coffee,
  Car,
  Wrench,
  ShoppingBag,
  Wallet,
  Landmark,
  Smartphone,
  Banknote,
  CreditCard,
  type LucideIcon,
  LineChart,
  Vault,
} from "lucide-react";

export type IconConfig = {
  icon: LucideIcon;
  bg: string;
  text: string;
  solid: string;
};

const CATEGORY_ICONS: Record<string, IconConfig> = {
  "Uang Saku": {
    icon: PiggyBank,
    bg: "bg-amber-100",
    text: "text-amber-600",
    solid: "bg-amber-500",
  },
  Gaji: {
    icon: Briefcase,
    bg: "bg-blue-100",
    text: "text-blue-600",
    solid: "bg-blue-500",
  },
  Project: {
    icon: FolderKanban,
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    solid: "bg-indigo-500",
  },
  Tabungan: {
    icon: Vault,
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    solid: "bg-cyan-500",
  },
  Saham: {
    icon: LineChart,
    bg: "bg-violet-100",
    text: "text-violet-600",
    solid: "bg-violet-500",
  },
  Membership: {
    icon: Dumbbell,
    bg: "bg-teal-100",
    text: "text-teal-600",
    solid: "bg-teal-500",
  },
  Jajan: {
    icon: Cookie,
    bg: "bg-orange-100",
    text: "text-orange-600",
    solid: "bg-orange-500",
  },
  Makan: {
    icon: UtensilsCrossed,
    bg: "bg-rose-100",
    text: "text-rose-600",
    solid: "bg-rose-500",
  },
  Ngopi: {
    icon: Coffee,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    solid: "bg-yellow-500",
  },
  Transportasi: {
    icon: Car,
    bg: "bg-sky-100",
    text: "text-sky-600",
    solid: "bg-sky-500",
  },
  Servis: {
    icon: Wrench,
    bg: "bg-slate-100",
    text: "text-slate-600",
    solid: "bg-slate-500",
  },
};

const FALLBACK_INCOME: IconConfig = {
  icon: TrendingUp,
  bg: "bg-emerald-100",
  text: "text-emerald-700",
  solid: "bg-emerald-600",
};
const FALLBACK_EXPENSE: IconConfig = {
  icon: ShoppingBag,
  bg: "bg-red-100",
  text: "text-red-600",
  solid: "bg-red-500",
};

export function getCategoryIcon(
  category: string,
  type: "income" | "expense",
): IconConfig {
  return (
    CATEGORY_ICONS[category] ??
    (type === "income" ? FALLBACK_INCOME : FALLBACK_EXPENSE)
  );
}

const PAYMENT_ICONS: Record<string, IconConfig> = {
  Cash: {
    icon: Banknote,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    solid: "bg-emerald-600",
  },
  "E-Wallet": {
    icon: Smartphone,
    bg: "bg-purple-100",
    text: "text-purple-600",
    solid: "bg-purple-500",
  },
  Bank: {
    icon: Landmark,
    bg: "bg-blue-100",
    text: "text-blue-600",
    solid: "bg-blue-500",
  },
  "Kartu Kredit": {
    icon: CreditCard,
    bg: "bg-rose-100",
    text: "text-rose-600",
    solid: "bg-rose-500",
  },
};
const FALLBACK_WALLET: IconConfig = {
  icon: Wallet,
  bg: "bg-stone-100",
  text: "text-stone-600",
  solid: "bg-stone-500",
};

export function getPaymentMethodIcon(method: string): IconConfig {
  return PAYMENT_ICONS[method] ?? FALLBACK_WALLET;
}
