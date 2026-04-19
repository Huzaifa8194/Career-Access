import * as React from "react";

export function Field({
  label,
  hint,
  required,
  children,
  htmlFor,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-ink-muted"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

const inputBase =
  "h-11 w-full rounded-md border border-line bg-white px-3 text-[14px] text-ink placeholder:text-ink-subtle/70 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...rest }, ref) {
  return <input ref={ref} className={`${inputBase} ${className}`} {...rest} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${inputBase} h-auto py-2.5 leading-6 ${className}`}
      {...rest}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }
>(function Select({ className = "", children, ...rest }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`${inputBase} appearance-none pr-9 ${className}`}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="m6 9 6 6 6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

export function Checkbox({
  label,
  description,
  className = "",
  ...rest
}: { label: React.ReactNode; description?: React.ReactNode; className?: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
>) {
  return (
    <label
      className={`flex items-start gap-3 rounded-md border border-line bg-white p-3 cursor-pointer transition-colors hover:border-line-strong has-checked:border-primary has-checked:bg-primary-50/40 ${className}`}
    >
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded-[4px] border border-line-strong text-primary accent-primary"
        {...rest}
      />
      <span className="text-sm leading-5">
        <span className="font-medium text-ink">{label}</span>
        {description && (
          <span className="block text-ink-subtle text-[13px]">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export function Radio({
  label,
  description,
  className = "",
  ...rest
}: { label: React.ReactNode; description?: React.ReactNode; className?: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
>) {
  return (
    <label
      className={`flex items-start gap-3 rounded-md border border-line bg-white p-3 cursor-pointer transition-colors hover:border-line-strong has-checked:border-primary has-checked:bg-primary-50/40 ${className}`}
    >
      <input
        type="radio"
        className="mt-0.5 h-4 w-4 border border-line-strong text-primary accent-primary"
        {...rest}
      />
      <span className="text-sm leading-5">
        <span className="font-medium text-ink">{label}</span>
        {description && (
          <span className="block text-ink-subtle text-[13px]">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
