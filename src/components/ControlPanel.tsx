"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
// import { showError } from '@/lib/toast'; // Hapus impor toast

interface ControlPanelProps {
  sessionActive: boolean;
  isConnected: boolean; // Tidak digunakan, tapi dipertahankan untuk kompatibilitas prop
  isStartingSession: boolean; // Tidak digunakan
  handleStartSession: (initialUrl: string) => void; // Mengubah tipe handler
  handleStopSession: () => void;
  setBrowserUrl: (url: string) => void; // Tidak digunakan langsung di sini, tapi dipertahankan
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  sessionActive,
  isStartingSession,
  handleStartSession,
  handleStopSession,
}) => {
  const [url, setUrl] = useState<string>('https://example.com');
  const [initialUrl, setInitialUrl] = useState<string>('http://10.20.20.99:4444/vnc/host/172.19.0.2/port/50000/?nginx=&path=proxy/172.19.0.2:50000/websockify&view_only=false');
  const [cveId, setCveId] = useState<string>('CVE-2023-0001');
  const [headlessMode, setHeadlessMode] = useState<boolean>(false); // Tidak digunakan, tapi dipertahankan untuk UI

  const handleStart = () => {
    if (!initialUrl) {
      // showError("Initial Browser URL cannot be empty."); // Hapus toast
      return;
    }
    
    // Hanya memanggil handler yang akan mengatur URL dan sessionActive
    handleStartSession(initialUrl);
  };

  const handleStop = () => {
    handleStopSession();
  };

  // Fungsi-fungsi ini sekarang tidak melakukan apa-apa selain mencegah submit form
  const handleGoToUrl = (e: FormEvent) => {
    e.preventDefault();
    // Logika navigasi langsung ke iframe harus ditambahkan di sini jika diperlukan
    // Untuk saat ini, kita hanya mencegah submit
  };

  const handleScrapeCve = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleGetScreenshot = () => {
    // Tidak ada aksi
  };

  const renderContent = () => {
    if (isStartingSession) {
      return (
        <div className="flex flex-col space-y-6 p-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-6">
        {/* Session Control Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Session Control</h3>
          
          {/* Input URL Awal */}
          <div className="space-y-2">
            <Label htmlFor="initial-url">Browser URL (VNC/Websockify)</Label>
            <Input
              id="initial-url"
              type="text"
              value={initialUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInitialUrl(e.target.value)}
              placeholder="e.g., http://host:port/vnc/..."
              disabled={sessionActive}
              className="w-full transition-all duration-200 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="headless"
              checked={headlessMode}
              onCheckedChange={(checked) => setHeadlessMode(!!checked)}
              disabled={sessionActive}
            />
            <Label htmlFor="headless">
              Headless Mode (Disabled)
            </Label>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleStart}
              disabled={sessionActive} 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
            >
              Load Iframe
            </Button>
            <Button
              onClick={handleStop}
              disabled={!sessionActive}
              variant="destructive"
              className="flex-1 transition-all duration-200"
            >
              Clear Iframe
            </Button>
          </div>
        </div>

        <Separator />

        {/* Navigation Section (Dibuat non-fungsional) */}
        <div className="space-y-4 opacity-50 pointer-events-none">
          <h3 className="text-lg font-semibold text-gray-800">Navigation (Disabled)</h3>
          <form onSubmit={handleGoToUrl} className="space-y-3">
            <Input
              type="text"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter URL"
              disabled={true}
              className="w-full transition-all duration-200 focus:border-indigo-500"
            />
            <Button
              type="submit"
              disabled={true}
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            >
              Go to URL
            </Button>
          </form>
        </div>

        <Separator />

        {/* CVE Scraper Section (Dibuat non-fungsional) */}
        <div className="space-y-4 opacity-50 pointer-events-none">
          <h3 className="text-lg font-semibold text-gray-800">CVE Scraper (Disabled)</h3>
          <form onSubmit={handleScrapeCve} className="space-y-3">
            <Input
              type="text"
              value={cveId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCveId(e.target.value)}
              placeholder="Enter CVE ID"
              disabled={true}
              className="w-full transition-all duration-200 focus:border-indigo-500"
            />
            <Button
              type="submit"
              disabled={true}
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            >
              Scrape CVE
            </Button>
          </form>
        </div>

        <Separator />

        {/* Actions Section (Dibuat non-fungsional) */}
        <div className="space-y-4 opacity-50 pointer-events-none">
          <h3 className="text-lg font-semibold text-gray-800">Actions (Disabled)</h3>
          <Button
            onClick={handleGetScreenshot}
            disabled={true}
            variant="secondary"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
          >
            Capture Screenshot
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full bg-white/95 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Controls</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};