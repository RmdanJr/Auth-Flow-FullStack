import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { logout, type User } from '../api/auth';
import { buttonClassName } from '../components/AuthLayout';

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900/80 p-10 text-center shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">Auth Flow</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Welcome to the application.</h1>
        {user && <p className="mt-3 text-slate-300">Signed in as {user.name}</p>}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className={`${buttonClassName} mt-8 max-w-xs`}
        >
          {loading ? 'Signing out...' : 'Log out'}
        </button>
      </div>
    </div>
  );
}
