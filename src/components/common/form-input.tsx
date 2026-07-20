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
