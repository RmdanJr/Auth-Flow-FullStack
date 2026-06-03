import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            Auth Flow
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        <p className="mt-8 text-center text-xs text-slate-500">
          <Link to="/signin" className="hover:text-sky-400">
            Sign in
          </Link>
          {' · '}
          <Link to="/signup" className="hover:text-sky-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {children}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30';

export const buttonClassName =
  'w-full rounded-lg bg-sky-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60';
