import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/**
 * Accessible form primitives. Every field renders a real <label>, connects its
 * hint and error with aria-describedby, and marks invalid state with
 * aria-invalid. Callers should keep `name` and `id` stable so that a failed
 * submission can restore values.
 */

interface FieldMeta {
  id: string;
  label: string;
  name: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  className?: string;
}

function describedBy(id: string, hint?: ReactNode, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

function FieldHeader({
  id,
  label,
  required,
  optionalLabel,
}: Pick<FieldMeta, "id" | "label" | "required" | "optionalLabel">) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {required ? (
        <span className="ml-1 text-orange-700" aria-hidden="true">
          *
        </span>
      ) : optionalLabel ? (
        <span className="ml-1.5 font-normal text-muted">({optionalLabel})</span>
      ) : null}
    </label>
  );
}

function FieldFooter({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          <Icon name="warning" className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </>
  );
}

interface TextFieldProps
  extends FieldMeta,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className"> {
  prefix?: string;
}

export function TextField({
  id,
  label,
  name,
  hint,
  error,
  required,
  optionalLabel,
  className,
  prefix,
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      <FieldHeader id={id} label={label} required={required} optionalLabel={optionalLabel} />
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          className={cn("form-input", prefix && "pl-8")}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          required={required}
          {...props}
        />
      </div>
      <FieldFooter id={id} hint={hint} error={error} />
    </div>
  );
}

interface SelectFieldProps
  extends FieldMeta,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "className"> {
  options: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export function SelectField({
  id,
  label,
  name,
  hint,
  error,
  required,
  optionalLabel,
  className,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  return (
    <div className={className}>
      <FieldHeader id={id} label={label} required={required} optionalLabel={optionalLabel} />
      <div className="relative">
        <select
          id={id}
          name={name}
          className={cn("form-input appearance-none pr-10")}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          required={required}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
      </div>
      <FieldFooter id={id} hint={hint} error={error} />
    </div>
  );
}

interface TextareaFieldProps
  extends FieldMeta,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "className"> {}

export function TextareaField({
  id,
  label,
  name,
  hint,
  error,
  required,
  optionalLabel,
  className,
  rows = 4,
  ...props
}: TextareaFieldProps) {
  return (
    <div className={className}>
      <FieldHeader id={id} label={label} required={required} optionalLabel={optionalLabel} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        className="form-input resize-y"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...props}
      />
      <FieldFooter id={id} hint={hint} error={error} />
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  checked?: boolean;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  name,
  label,
  hint,
  error,
  checked,
  onChange,
  required,
  className,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="form-checkbox mt-0.5 shrink-0"
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink">
          {label}
          {required ? (
            <span className="ml-1 text-orange-700" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      </div>
      <div className="pl-6">
        <FieldFooter id={id} hint={hint} error={error} />
      </div>
    </div>
  );
}

export function FormErrorSummary({
  errors,
  title = "Please check the highlighted fields",
}: {
  errors: Array<{ fieldId: string; message: string }>;
  title?: string;
}) {
  if (errors.length === 0) return null;
  return (
    <div role="alert" tabIndex={-1} className="rounded-xl border border-danger-600/25 bg-danger-50 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-danger-700">
        <Icon name="warning" className="h-4 w-4" />
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-danger-700">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a href={`#${error.fieldId}`} className="underline underline-offset-2">
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="space-y-5">
      <div>
        <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl text-navy-900">
          {title}
        </h2>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
