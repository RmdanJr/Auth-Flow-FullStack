import type { ReactNode } from 'react';
import { AuthBrandPanel } from '../auth/AuthBrandPanel';
import { AppHeader } from './AppHeader';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="app-shell min-h-screen bg-[#f5f7fb]">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 sm:py-16">
        <div className="animate-fade-up overflow-hidden rounded-2xl border border-[#c3cad7]/80 bg-white shadow-[4px_4px_28px_rgba(192,192,192,0.18)] lg:flex lg:min-h-[34rem]">
          <AuthBrandPanel />

          <section className="flex w-full flex-col justify-center border-t border-[#c3cad7]/60 px-6 py-8 sm:px-10 sm:py-10 lg:w-[min(100%,28rem)] lg:shrink-0 lg:border-t-0 lg:border-l xl:w-[30rem] xl:px-12">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[#363e4e] sm:text-4xl">{title}</h1>
              <p className="mt-2 text-sm text-[#848fa3]">{subtitle}</p>
            </div>

            {children}

            {footer && (
              <div className="mt-6 text-center text-sm text-[#848fa3]">{footer}</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
