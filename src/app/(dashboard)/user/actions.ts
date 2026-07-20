"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { editProfileSchema } from "@/validations/auth-validation";
import { AuthFormState } from "@/types/auth";
import { INITIAL_STATE_EDIT_PROFILE_FORM } from "@/constants/auth-constant";
import { redirect } from "next/navigation";

export async function updateProfile(
  prevState: AuthFormState,
  formData: FormData | null,
): Promise<AuthFormState> {
  if (!formData) {
    return INITIAL_STATE_EDIT_PROFILE_FORM;
  }

  const avatarEntry = formData.get("avatar");
  const avatar =
    avatarEntry instanceof File && avatarEntry.size > 0
      ? avatarEntry
      : undefined;

  const validatedFields = editProfileSchema.safeParse({
    username: formData.get("username"),
    avatar,
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
      errors: { _form: ["Your session has expired. Please log in again."] },
    };
  }

  let avatarUrl: string | undefined;

  if (validatedFields.data.avatar) {
    const file = validatedFields.data.avatar;
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return {
        status: "error",
        errors: { _form: [uploadError.message] },
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // Cache-bust: nama file selalu sama, jadi tanpa ini browser bisa
    // menampilkan foto lama dari cache walau sudah diganti.
    avatarUrl = `${publicUrl}?t=${Date.now()}`;
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("user_data")
    .update({
      username: validatedFields.data.username,
      ...(avatarUrl && { profile: avatarUrl }),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (updateError) {
    return {
      status: "error",
      errors: { _form: [updateError.message] },
    };
  }

  // Sinkronkan ulang cookie user_profile supaya konsisten di seluruh app
  const cookieStore = await cookies();
  cookieStore.set("user_profile", JSON.stringify(updatedProfile), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/user");

  return { status: "success", errors: {} };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("user_profile");

  redirect("/login");
}