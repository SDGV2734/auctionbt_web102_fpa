// src/app/products/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

interface Product {
  id: string;
  name: string;
  description: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiService.getProducts();
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - {product.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
