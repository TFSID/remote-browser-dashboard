"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <div className="flex justify-between items-center mb-8 p-5 bg-white/95 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Selenium WebSocket Scraper
      </h1>
      <Badge
        className={cn(
          "px-4 py-2 text-sm font-semibold",
          isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
        )}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    </div>
  );
};