import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  className,
  label,
  error,
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-sm border bg-surface px-4 py-2.5 text-sm text-moon-ink dark:text-moon-text dark:bg-surface-dark",
          "border-starlight/30 placeholder:text-dusk",
          "focus:outline-none focus:ring-2 focus:ring-ember focus:border-ember",
          "dark:placeholder:text-dusk-light",
          "transition-colors duration-200",
          error && "border-ember focus:ring-ember",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-ember dark:text-ember-light">{error}</p>
      )}
    </div>
  );
}
