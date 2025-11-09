"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface ControlPanelProps {
  sessionActive: boolean;
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  sessionActive,
  isConnected,
  sendMessage,
}) => {
  const [url, setUrl] = useState<string>('https://example.com');
  const [cveId, setCveId] = useState<string>('CVE-2023-0001');
  const [headlessMode, setHeadlessMode] = useState<boolean>(false);

  const handleStartSession = () => {
    sendMessage({ action: 'start_session', headless: headlessMode });
  };

  const handleStopSession = () => {
    sendMessage({ action: 'stop_session' });
  };

  const handleGoToUrl = (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    sendMessage({ action: 'goto', url });
  };

  const handleScrapeCve = (e: FormEvent) => {
    e.preventDefault();
    if (!cveId) return;
    sendMessage({ action: 'scrape_cve', cve_id: cveId });
  };

  const handleGetScreenshot = () => {
    sendMessage({ action: 'get_screenshot' });
  };

  return (
    <Card className="h-full bg-white/95 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        {/* Session Control Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Session Control</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="headless"
              checked={headlessMode}
              onCheckedChange={(checked) => setHeadlessMode(!!checked)}
              disabled={sessionActive}
            />
            <Label htmlFor="headless">
              Headless Mode
            </Label>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleStartSession}
              disabled={!isConnected || sessionActive}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Start Session
            </Button>
            <Button
              onClick={handleStopSession}
              disabled={!sessionActive}
              variant="destructive"
              className="flex-1"
            >
              Stop Session
            </Button>
          </div>
        </div>

        <Separator />

        {/* Navigation Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
          <form onSubmit={handleGoToUrl} className="space-y-3">
            <Input
              type="text"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter URL"
              disabled={!sessionActive}
              className="w-full"
            />
            <Button
              type="submit"
              disabled={!sessionActive}
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go to URL
            </Button>
          </form>
        </div>

        <Separator />

        {/* CVE Scraper Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">CVE Scraper</h3>
          <form onSubmit={handleScrapeCve} className="space-y-3">
            <Input
              type="text"
              value={cveId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCveId(e.target.value)}
              placeholder="Enter CVE ID"
              disabled={!sessionActive}
              className="w-full"
            />
            <Button
              type="submit"
              disabled={!sessionActive}
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Scrape CVE
            </Button>
          </form>
        </div>

        <Separator />

        {/* Actions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
          <Button
            onClick={handleGetScreenshot}
            disabled={!sessionActive}
            variant="secondary"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Capture Screenshot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};