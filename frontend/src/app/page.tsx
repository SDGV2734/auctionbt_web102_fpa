// src/app/page.tsx
import React from 'react';
import Link from 'next/link';

const Home = () => (
  <div>
    <h1>Welcome to the Auction App</h1>
    <nav>
      <ul>
        <li><Link href="/register">Register</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/add-product">Add Product</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/add-auction">Add Auction</Link></li>
        <li><Link href="/auctions">Auctions</Link></li>
      </ul>
    </nav>
  </div>
);

export default Home;
