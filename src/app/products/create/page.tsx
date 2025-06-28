'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { apiRequest } = useApi();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.name.trim()) {
      setError('El nombre del producto es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      setIsLoading(false);
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('El stock debe ser 0 o mayor');
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const response = await apiRequest({
        url: '/api/products-demo',
        method: 'POST',
        body: productData,
        requireAuth: true,
      });

      if (response.success) {
        // Redirigir a la lista de productos
        router.push('/products');
      } else {
        setError(response.error || 'Error al crear el producto');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              ← Volver a productos
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h1>
          <p className="text-gray-600 mt-2">Agrega un nuevo producto a tu inventario</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Laptop Dell XPS"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe las características principales del producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando...' : 'Crear Producto'}
              </button>
              <Link
                href="/products"
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        {formData.name && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {formData.name || 'Nombre del producto'}
              </h4>
              <p className="text-gray-600 mb-4">
                {formData.description || 'Sin descripción'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${formData.price || '0.00'}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {formData.stock || '0'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
