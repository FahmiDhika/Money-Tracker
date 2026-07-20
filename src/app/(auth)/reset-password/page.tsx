import ResetPassword from "./_components/reset.password";
import { BanknoteCheck } from "lucide-react";

export const metadata = {
  title: "Money Tracker | Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-muted">
          <BanknoteCheck className="size-8" />
        </div>
        <p className="text-emerald-700 text-2xl font-bold">Money Tracker</p>
      </div>
      <ResetPassword />
    </div>
  );
}
