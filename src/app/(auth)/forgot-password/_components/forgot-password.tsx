"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
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
  ForgotPasswordForm,
  forgotPasswordSchema,
} from "@/validations/auth-validation";
import {
  INITIAL_FORGOT_PASSWORD_FORM,
  INITIAL_STATE_FORGOT_PASSWORD_FORM,
} from "@/constants/auth-constant";
import { forgotPassword } from "../../actions";
import { FormInput } from "@/components/common/form-input";

export default function ForgotPassword() {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: INITIAL_FORGOT_PASSWORD_FORM,
  });

  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    INITIAL_STATE_FORGOT_PASSWORD_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);

    startTransition(() => {
      formAction(formData);
    });
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Something went wrong", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => {
        formAction(null);
      });
    }

    if (state?.status === "success") {
      toast.success("Check your email", {
        description:
          "If that email is registered, we've sent a password reset link.",
      });
      form.reset();
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
          Forgot password
        </CardTitle>
        <CardDescription className="text-stone-500">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send reset link"
            )}
          </Button>

          <Link
            href="/login"
            className="block text-center text-sm text-stone-500 hover:text-emerald-700 hover:underline"
          >
            Back to login
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
