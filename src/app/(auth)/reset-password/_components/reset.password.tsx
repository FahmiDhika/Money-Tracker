"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResetPasswordForm,
  resetPasswordSchema,
} from "@/validations/auth-validation";
import {
  INITIAL_RESET_PASSWORD_FORM,
  INITIAL_STATE_RESET_PASSWORD_FORM,
  
} from "@/constants/auth-constant";
import { resetPassword } from "../../actions";
import { FormInput } from "@/components/common/form-input";

export default function ResetPassword() {
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: INITIAL_RESET_PASSWORD_FORM,
  });

  const [state, formAction, isPending] = useActionState(
    resetPassword,
    INITIAL_STATE_RESET_PASSWORD_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    startTransition(() => {
      formAction(formData);
    });
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not reset password", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => {
        formAction(null);
      });
    }

    if (state?.status === "success") {
      toast.success("Password updated", {
        description: "Please log in again with your new password.",
      });
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Card className="w-full max-w-sm border-stone-200 shadow-sm">
      <CardHeader className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-700">
          Money Tracker
        </p>
        <CardTitle className="text-2xl font-semibold text-stone-900">
          Set a new password
        </CardTitle>
        <CardDescription className="text-stone-500">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="password"
            type="password"
            label="New password"
            placeholder="••••••••"
          />

          <FormInput
            form={form}
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
