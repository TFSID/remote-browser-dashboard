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
  if (!scrapedData && !screenshotImage) {
    return null;
  }

  const showBoth = scrapedData && screenshotImage;

  return (
    <div className={showBoth ? "grid grid-cols-1 lg:grid-cols-2 gap-5" : "space-y-5"}>
      {scrapedData && (
        <Card className="bg-white/95 shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Scraped Data</CardTitle>
            <Button onClick={clearData} variant="secondary" size="sm">
              Clear Data
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm max-h-[400px]">
              {JSON.stringify(scrapedData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {screenshotImage && (
        <Card className="bg-white/95 shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Screenshot</CardTitle>
            <Button onClick={() => clearData()} variant="secondary" size="sm">
              Clear
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex justify-center">
            <img
              src={`data:image/png;base64,${screenshotImage}`}
              alt="Screenshot"
              className="max-w-full border-2 border-gray-200 rounded-lg shadow-md"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};