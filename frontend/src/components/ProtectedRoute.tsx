import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, type User } from '../api/auth';

export function ProtectedRoute() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    getMe()
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setAuthenticated(true);
      })
      .catch(() => {
        if (!active) return;
        setAuthenticated(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet context={{ user }} />;
}
