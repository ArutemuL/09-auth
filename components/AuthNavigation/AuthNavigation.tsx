'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore, type AuthState } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

const AuthNavigation = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const user = useAuthStore((state: AuthState) => state.user);
  const clearIsAuthenticated = useAuthStore((state: AuthState) => state.clearIsAuthenticated);

  const handleLogout = async () => {
    try {
      setIsPending(true);
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
    } finally {
      clearIsAuthenticated();
      setIsPending(false);
      router.replace('/sign-in');
      router.refresh();
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button
            type="button"
            className={css.logoutButton}
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
