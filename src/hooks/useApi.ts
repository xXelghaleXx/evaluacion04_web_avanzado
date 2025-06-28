'use client';

import { useAuth } from '@/contexts/AuthContext';

interface ApiRequest {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requireAuth?: boolean;
}

export function useApi() {
  const { token } = useAuth();

  const apiRequest = async ({ url, method = 'GET', body, requireAuth = false }: ApiRequest) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Agregar token de autorización si es requerido
      if (requireAuth && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const config: RequestInit = {
        method,
        headers,
      };

      // Agregar body si no es GET
      if (method !== 'GET' && body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      const data = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: response.ok ? null : data.error || 'Error desconocido',
        status: response.status,
      };
    } catch (error) {
      console.error('Error en petición API:', error);
      return {
        success: false,
        data: null,
        error: 'Error de conexión',
        status: 0,
      };
    }
  };

  return { apiRequest };
}
