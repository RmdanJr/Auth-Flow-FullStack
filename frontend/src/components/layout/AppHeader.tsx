import type { ReactNode } from 'react';
import { EasygeneratorLogo } from '../branding/EasygeneratorLogo';

interface AppHeaderProps {
  children?: ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="border-b border-[#c3cad7]/60 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <EasygeneratorLogo />
        {children}
      </div>
    </header>
  );
}
