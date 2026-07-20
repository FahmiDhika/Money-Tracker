"use client";

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type BaseProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type FormInputProps<TFieldValues extends FieldValues> =
  BaseProps<TFieldValues> & {
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
    multiline?: false;
  };

type FormTextareaProps<TFieldValues extends FieldValues> =
  BaseProps<TFieldValues> & {
    multiline: true;
    rows?: number;
  };

export function FormInput<TFieldValues extends FieldValues>(
  props: FormInputProps<TFieldValues> | FormTextareaProps<TFieldValues>,
) {
  const { form, name, label, description, placeholder, disabled, className } =
    props;
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = !props.multiline && props.type === "password";

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          {props.multiline ? (
            <Textarea
              {...field}
              id={field.name}
              placeholder={placeholder}
              disabled={disabled}
              rows={props.rows ?? 4}
              aria-invalid={fieldState.invalid}
            />
          ) : isPasswordField ? (
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <Input
              {...field}
              id={field.name}
              type={props.type ?? "text"}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
          )}

          {description && !fieldState.invalid && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {fieldState.invalid && (
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          )}
        </Field>
      )}
    />
  );
}
