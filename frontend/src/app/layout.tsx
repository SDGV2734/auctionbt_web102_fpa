// src/app/layout.tsx

import React from 'react';
import './globals.css'; // Corrected path

export const metadata = {
  title: 'Auction App',
  description: 'An auction app built with Next.js',
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
