"use server";

import {
  INITIAL_STATE_FORGOT_PASSWORD_FORM,
  INITIAL_STATE_LOGIN_FORM,
  INITIAL_STATE_RESET_PASSWORD_FORM,
} from "@/constants/auth-constant";
import { environment } from "@/environments/environment";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import {
  forgotPasswordSchema,
  loginSchemaForm,
  resetPasswordSchema,
} from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validatedFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const { data: profile } = await supabase
    .from("user_data")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profile) {
    const cookiesStore = await cookies();
    cookiesStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function forgotPassword(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_FORGOT_PASSWORD_FORM;
  }

  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const redirectUrl = `${environment.SITE_URL}/auth/confirm`;
  console.log("DEBUG redirectTo:", redirectUrl);

  const { error } = await supabase.auth.resetPasswordForEmail(
  validatedFields.data.email,
  {
    redirectTo: redirectUrl,
  },
);



  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    errors: {},
  };
}

export async function resetPassword(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_RESET_PASSWORD_FORM;
  }

  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      errors: {
        _form: [
          "This reset link is invalid or has expired. Please request a new one.",
        ],
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    errors: {},
  };
}
