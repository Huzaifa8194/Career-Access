import * as React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "action" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none rounded-md select-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-700 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
  action: "bg-action text-white hover:bg-action-700",
  secondary:
    "bg-white text-ink border border-line hover:border-line-strong hover:bg-canvas",
  outline:
    "bg-transparent text-primary border border-primary/30 hover:bg-primary-50",
  ghost: "bg-transparent text-ink hover:bg-canvas",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonAsButton) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  target,
  rel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
