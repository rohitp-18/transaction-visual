"use client";

import { DollarSign, Home, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav
      className={
        "bg-white sticky top-0 z-50 left-0 w-full bg-opacity-20 backdrop-blur-md shadow-md p-4 flex justify-between items-center"
      }
    >
      <section className="max-w-6xl mx-auto flex items-center justify-between w-full space-x-4">
        <h2 className="text-xl font-bold italic">TS</h2>
        <div className="flex space-x-6">
          <a
            href="/"
            className={`text-gray-700 no-underline hover:underline hover:text-gray-900 ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            <Home className="h-3 w-3" /> Home
          </a>
          <a
            href="/new"
            className={`text-gray-700 no-underline hover:underline hover:text-gray-900 ${
              pathname === "/new" ? "font-bold" : ""
            }`}
          >
            <Plus className="h-3 w-3" /> New
          </a>
          <a
            href="/transactions"
            className={`text-gray-700 no-underline hover:underline hover:text-gray-900 ${
              pathname === "/transactions" ? "font-bold" : ""
            }`}
          >
            <DollarSign className="h-3 w-3" /> Transactions
          </a>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
