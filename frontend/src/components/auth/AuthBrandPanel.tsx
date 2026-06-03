import { AUTH_FEATURES } from './auth.constants';

export function AuthBrandPanel() {
  return (
    <section className="relative flex flex-1 flex-col justify-between p-8 sm:p-10 lg:p-12">
      <div className="absolute inset-0 eg-gradient-orange" aria-hidden />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)',
        }}
        aria-hidden
      />

      <div className="relative text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
          Assessment demo
        </p>
        <h2 className="mt-3 font-display text-3xl leading-[1.2] sm:text-4xl xl:text-[2.75rem]">
          Create company-tailored
          <br />
          training at scale.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
          Secure sign-in for your learning platform — cookie-based sessions, validated forms, and
          protected routes built for production.
        </p>

        <ul className="mt-8 space-y-3 sm:mt-10">
          {AUTH_FEATURES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-10 text-xs text-white/60 lg:mt-0">Full-stack auth flow</p>
    </section>
  );
}
