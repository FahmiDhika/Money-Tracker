"use client";

import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import createClient from "@/lib/supabase/client";
import { TransactionForm } from "@/validations/transaction-validation";

export function TagInput({ form }: { form: UseFormReturn<TransactionForm> }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc("get_user_tags")
      .then(({ data }: { data: { tag: string }[] | null }) => {
        if (data) setSuggestions(data.map((row) => row.tag));
      });
  }, []);

  return (
    <Controller
      control={form.control}
      name="tags"
      render={({ field, fieldState }) => {
        const tags = field.value ?? [];

        const addTag = (raw: string) => {
          const value = raw.trim();
          if (!value || tags.includes(value)) return;
          field.onChange([...tags, value]);
          setInputValue("");
        };

        const removeTag = (tag: string) => {
          field.onChange(tags.filter((t) => t !== tag));
        };

        const filteredSuggestions = suggestions.filter(
          (s) =>
            !tags.includes(s) &&
            inputValue.length > 0 &&
            s.toLowerCase().includes(inputValue.toLowerCase()),
        );

        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-900">
              Tags (optional)
            </label>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(inputValue);
                }
                if (e.key === "Backspace" && !inputValue && tags.length > 0) {
                  removeTag(tags[tags.length - 1]);
                }
              }}
              placeholder="Type a tag and press Enter"
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-700"
            />

            {filteredSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {filteredSuggestions.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag(s)}
                    className="rounded-full border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {fieldState.error && (
              <p className="text-xs text-red-600">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
