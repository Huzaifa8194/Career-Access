export function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <div className="text-[12px] font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-2 text-[28px] sm:text-[32px] font-semibold tracking-tight leading-[1.1]">
        {title}
      </h2>
      {copy && (
        <p className="mt-3 text-[16px] text-ink-muted leading-7">{copy}</p>
      )}
    </div>
  );
}
