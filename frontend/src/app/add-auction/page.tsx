// src/app/add-auction/page.tsx
"use client";

import React, { useState } from 'react';
import apiService from '../../services/apiService';

interface Props {
  token: string;
}

const AddAuction: React.FC<Props> = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productId, setProductId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await apiService.addAuction({
      name,
      description,
      productId,
    }, token);
    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Auction Name" required />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Product ID" required />
      <button type="submit">Add Auction</button>
    </form>
  );
};

export default AddAuction;
