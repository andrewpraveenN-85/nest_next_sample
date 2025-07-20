// src/app/dashboard/page.tsx
'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useContext(AuthContext);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } finally {
      setLogoutLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
      </div>
      <p>Welcome to your dashboard!</p>
      <p>You can manage your products from here.</p>
      <Link href="/products" className="btn btn-primary">
        View Products
      </Link>
      <p>Click the button below to log out.</p>
      <button
        onClick={handleLogout}
        className="btn btn-danger"
        disabled={logoutLoading}
      >
        {logoutLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Logging out...
          </>
        ) : (
          'Logout'
        )}
      </button>
    </div>
  );
}