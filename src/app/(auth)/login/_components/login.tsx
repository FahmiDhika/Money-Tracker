"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/components/common/form-input";

export default function LoginPage() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0],
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  return (
    <Card className="w-full max-w-sm border-stone-200 shadow-sm">
      <CardHeader className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-700">
          Money Tracker
        </p>
        <CardTitle className="text-2xl font-semibold text-stone-900">
          Log in
        </CardTitle>
        <CardDescription className="text-stone-500">
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <FormInput
              form={form}
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between"></div>
            <FormInput
              form={form}
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
            />
            <div className="text-end">
              <Link
                href="/forgot-password"
                className="text-xs text-emerald-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {isPendingLogin ? <Loader2 /> : "Log in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
