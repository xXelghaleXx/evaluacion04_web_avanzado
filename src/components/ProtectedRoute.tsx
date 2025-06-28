'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si no hay usuario, redirigir al login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Si se requiere admin y el usuario no es admin
      if (requireAdmin && user.role !== 'admin') {
        router.push('/dashboard'); // Redirigir al dashboard normal
        return;
      }
    }
  }, [user, isLoading, requireAdmin, redirectTo, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  // Si se requiere admin y el usuario no es admin, no mostrar nada (se está redirigiendo)
  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
