// import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const BrieflyAILogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" className="h-8 w-auto">
    <text x="220" y="60" fontSize="60" fontWeight="bold" textAnchor="middle">
      SummaryAI
    </text>
  </svg>
);

export const NavBar = () => {

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <BrieflyAILogo />
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};