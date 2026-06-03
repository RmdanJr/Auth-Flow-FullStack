import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { logout, type User } from '../api/auth';
import { AppHeader } from '../components/layout/AppHeader';
import { UserAvatar } from '../components/ui/UserAvatar';
import { buttonSecondaryClassName } from '../lib/formStyles';

interface AppContext {
  user: User | null;
}

export function AppPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<AppContext>();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      navigate('/signin');
    }
  };

  return (
    <div className="app-shell min-h-screen bg-[#f5f7fb]">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 sm:py-16">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#848fa3]">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#363e4e] sm:text-4xl">
            Welcome to the application.
          </h1>
        </div>

        <div className="animate-fade-up-delay mt-10 overflow-hidden rounded-2xl border border-[#c3cad7]/80 bg-white shadow-[4px_4px_28px_rgba(192,192,192,0.18)]">
          <div className="h-1 w-full eg-gradient-orange" />

          <div className="flex flex-col gap-8 p-8 sm:flex-row sm:items-center sm:p-10">
            {user && <UserAvatar name={user.name} />}

            <div className="flex-1">
              {user && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#848fa3]">
                    Signed in as
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#363e4e]">{user.name}</p>
                  <p className="mt-1 text-sm text-[#848fa3]">{user.email}</p>
                </>
              )}
            </div>

            <div className="flex shrink-0 sm:items-end">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className={buttonSecondaryClassName}
              >
                {loading ? 'Signing out...' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
