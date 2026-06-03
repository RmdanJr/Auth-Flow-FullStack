interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: Readonly<LoadingScreenProps>) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center bg-[#f5f7fb]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full border-2 border-[#fc794b]/40"
            style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
          />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fc794b]" />
        </div>
        <p className="text-sm text-[#848fa3]">{message}</p>
      </div>
    </div>
  );
}
