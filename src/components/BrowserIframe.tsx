"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BrowserIframeProps {
  url: string;
  sessionActive: boolean;
}

export const BrowserIframe: React.FC<BrowserIframeProps> = ({ url, sessionActive }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Reset loading state ketika URL berubah
    setIsLoading(true);
  }, [url]);

  return (
    <Card className="flex flex-col h-[600px] bg-white/95 shadow-lg rounded-xl">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Browser View
        </CardTitle>
        <p className="text-sm text-gray-500 truncate">{sessionActive ? url : `Target URL: ${url}`}</p>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        {!sessionActive ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <p className="mb-2">Start a session to view the browser.</p>
            <p className="text-xs text-gray-400 break-all">Current Target: {url}</p>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 p-4">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            <iframe
              src={url}
              title="Browser View"
              className="w-full h-full border-none"
              onLoad={() => setIsLoading(false)}
              style={{ visibility: isLoading ? 'hidden' : 'visible' }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};