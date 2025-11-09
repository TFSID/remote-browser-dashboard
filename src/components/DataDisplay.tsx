"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DataDisplayProps {
  scrapedData: any | null;
  screenshotImage: string;
  clearData: () => void;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ scrapedData, screenshotImage, clearData }) => {
  // Selalu kembalikan null karena fungsionalitas scraping dihapus
  return null;
};