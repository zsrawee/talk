import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  primary:
    "bg-ember text-paper hover:bg-ember/90 focus-visible:ring-starlight",
  secondary:
    "border border-starlight/40 text-starlight dark:text-starlight-light bg-transparent hover:bg-starlight/10 focus-visible:ring-starlight",
  danger:
    "bg-ember/10 text-ember border border-ember/30 hover:bg-ember/20 focus-visible:ring-ember dark:bg-ember/20 dark:text-ember-light dark:border-ember/50 dark:hover:bg-ember/30",
  ghost:
    "text-dusk dark:text-dusk-light hover:text-starlight dark:hover:text-starlight-light hover:bg-starlight/10 focus-visible:ring-starlight",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

type ButtonVariants = keyof typeof variants;
type ButtonSizes = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  size?: ButtonSizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm font-display font-bold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-night dark:ring-offset-night",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
