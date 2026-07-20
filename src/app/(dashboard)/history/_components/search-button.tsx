import Link from "next/link";
import { Search } from "lucide-react";

export function SearchButton() {
  return (
    <Link
      href="/history/search"
      className="rounded-full border border-stone-200 p-2 text-stone-600 hover:bg-stone-50"
    >
      <Search className="h-5 w-5" />
    </Link>
  );
}
