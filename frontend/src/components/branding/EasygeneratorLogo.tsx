interface EasygeneratorLogoProps {
  className?: string;
}

export function EasygeneratorLogo({ className = '' }: EasygeneratorLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/easygenerator-logo.png"
        alt="Easygenerator"
        className="h-10 w-auto sm:h-11"
      />
    </span>
  );
}
