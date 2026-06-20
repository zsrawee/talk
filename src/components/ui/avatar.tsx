import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-sm",
        className
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  src,
  alt,
}: { className?: string; src?: string | null; alt?: string }) {
  if (!src) return null;
  return (
    <img
      className={cn("aspect-square h-full w-full object-cover", className)}
      src={src}
      alt={alt || "Avatar"}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-sm bg-starlight/10 text-ember dark:text-ember-light font-display text-sm font-bold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
