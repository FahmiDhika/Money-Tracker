"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import {
  EditProfileForm,
  editProfileSchema,
} from "@/validations/auth-validation";
import { INITIAL_STATE_EDIT_PROFILE_FORM } from "@/constants/auth-constant";
import { updateProfile } from "../actions";

type EditProfileProps = {
  initialUsername: string;
  initialAvatarUrl: string | null;
  email: string;
};

export default function EditProfile({
  initialUsername,
  initialAvatarUrl,
  email,
}: EditProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { username: initialUsername, avatar: undefined },
  });

  const [state, formAction, isPending] = useActionState(
    updateProfile,
    INITIAL_STATE_EDIT_PROFILE_FORM,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue("avatar", file, { shouldValidate: true });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    if (data.avatar) formData.append("avatar", data.avatar);
    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not update profile", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => formAction(null));
    }
    if (state?.status === "success") {
      toast.success("Profile updated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="space-y-5">
      {/* Kartu gradient: foto + nama + email */}
      <div className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-center text-white shadow-sm">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative mx-auto mb-3 block h-24 w-24"
        >
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile photo"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-full w-full p-5 text-white/70" />
            )}
          </div>
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-700 bg-white text-emerald-700 shadow-sm">
            <Camera className="h-4 w-4" />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-lg font-semibold">
          {form.watch("username") || initialUsername}
        </p>
        <p className="text-sm text-emerald-100">{email}</p>

        {form.formState.errors.avatar && (
          <p className="mt-2 text-xs text-red-100">
            {form.formState.errors.avatar.message as string}
          </p>
        )}
      </div>

      {/* Kartu form edit */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-200 p-4 shadow-sm"
      >
        <p className="text-sm font-semibold text-stone-900">Edit Profile</p>
        <FormInput
          form={form}
          name="username"
          label="Username"
          placeholder="Your username"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-700 hover:bg-emerald-800"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </div>
  );
}
