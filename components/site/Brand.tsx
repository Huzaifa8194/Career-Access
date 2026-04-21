import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  href?: string;
  /** md = default nav size, sm = compact (sidebars, tight headers) */
  size?: "sm" | "md" | "lg";
  /** Hide "by EmployReady Partners" sublabel (extremely tight spaces) */
  hideSublabel?: boolean;
  /** Render just the mark, no text wordmark */
  markOnly?: boolean;
  /** Swap typography to white for dark backgrounds */
  tone?: "default" | "onDark";
  className?: string;
};

/**
 * Canonical brand lockup for Career Access Hub by EmployReady Partners.
 * Uses /public/logo.png as the mark (cropped via overflow + scale to trim
 * the PNG's built-in padding) paired with a typographic wordmark so the
 * brand reads cleanly at any size.
 */
export function Brand({
  href = "/",
  size = "md",
  hideSublabel = false,
  markOnly = false,
  tone = "default",
  className,
}: BrandProps) {
  const markBox =
    size === "sm"
      ? "h-8 w-8"
      : size === "lg"
        ? "h-11 w-11"
        : "h-10 w-10";
  const titleClass =
    size === "sm"
      ? "text-[14px]"
      : size === "lg"
        ? "text-[17px]"
        : "text-[15px]";
  const sublabelClass =
    size === "sm" ? "text-[9.5px]" : "text-[10.5px]";

  const titleColor =
    tone === "onDark"
      ? "text-white group-hover:text-white/90"
      : "text-ink group-hover:text-primary";
  const sublabelColor =
    tone === "onDark" ? "text-white/60" : "text-ink-subtle";

  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center gap-2.5 min-w-0",
        className || "",
      ].join(" ")}
      aria-label="Career Access Hub by EmployReady Partners — Home"
    >
      <span
        className={[
          "relative shrink-0 overflow-hidden rounded-md",
          markBox,
        ].join(" ")}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          priority
          sizes="44px"
          className="object-contain scale-[1.18] select-none"
        />
      </span>
      {!markOnly && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={[
              "font-semibold tracking-tight transition-colors",
              titleClass,
              titleColor,
            ].join(" ")}
          >
            Career Access Hub
          </span>
          {!hideSublabel && (
            <span
              className={[
                "mt-0.5 font-medium uppercase tracking-[0.12em]",
                sublabelClass,
                sublabelColor,
              ].join(" ")}
            >
              by EmployReady Partners
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
