// src/app/add-product/page.tsx
"use client";

import React, { useState } from 'react';
import apiService from '../../services/apiService';

interface Props {
  token: string;
}

const AddProduct: React.FC<Props> = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [minSellingPrice, setMinSellingPrice] = useState('');
  const [minIncrementBid, setMinIncrementBid] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await apiService.addProduct({
      name,
      description,
      startPrice: parseFloat(startPrice),
      minSellingPrice: parseFloat(minSellingPrice),
      minIncrementBid: parseFloat(minIncrementBid),
      image,
    }, token);
    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="number" value={startPrice} onChange={(e) => setStartPrice(e.target.value)} placeholder="Start Price" required />
      <input type="number" value={minSellingPrice} onChange={(e) => setMinSellingPrice(e.target.value)} placeholder="Min Selling Price" required />
      <input type="number" value={minIncrementBid} onChange={(e) => setMinIncrementBid(e.target.value)} placeholder="Min Increment Bid" required />
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
