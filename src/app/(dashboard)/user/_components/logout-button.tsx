"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </>
      )}
    </Button>
  );
}
