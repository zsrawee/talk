import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
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
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
