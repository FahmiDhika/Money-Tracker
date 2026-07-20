import { LogoutButton } from "./logout-button";

export function AccountActions({ memberSince }: { memberSince: string }) {
  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-stone-900">Account</p>
      <p className="mb-4 text-xs text-stone-500">Member since {memberSince}</p>
      <LogoutButton />
    </div>
  );
}