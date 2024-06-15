// src/app/auctions/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

interface Auction {
  id: string;
  name: string;
  description: string;
}

const Auctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const response = await apiService.getAuctions();
      setAuctions(response.data);
    };

    fetchAuctions();
  }, []);

  return (
    <div>
      <h1>Auctions</h1>
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id}>{auction.name} - {auction.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Auctions;
