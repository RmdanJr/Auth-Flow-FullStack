import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, type User } from '../api/auth';
import { LoadingScreen } from './ui/LoadingScreen';

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
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet context={{ user }} />;
}
