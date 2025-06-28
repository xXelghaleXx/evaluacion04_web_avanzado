'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const { apiRequest } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await apiRequest({
        url: '/api/products-demo',
        method: 'GET',
        requireAuth: true,
      });

      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">Gestiona tu inventario de productos</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Dashboard
            </Link>
            <Link
              href="/products/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Nuevo Producto
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1 bg-blue-100 text-blue-700 text-center py-2 rounded hover:bg-blue-200 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    className="flex-1 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors"
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar este producto?')) {
                        // Aquí iría la lógica de eliminación
                        console.log('Eliminar producto:', product.id);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primer producto al inventario
            </p>
            <Link
              href="/products/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Crear Primer Producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
