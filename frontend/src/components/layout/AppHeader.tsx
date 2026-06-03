import { EasygeneratorLogo } from '../branding/EasygeneratorLogo';

export function AppHeader() {
  return (
    <header className="border-b border-[#c3cad7]/60 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <EasygeneratorLogo />
      </div>
    </header>
  );
}
