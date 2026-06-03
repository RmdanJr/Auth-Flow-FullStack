import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: Readonly<FieldProps>) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold tracking-wide text-[#848fa3]">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
    </div>
  );
}
