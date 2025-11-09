"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
    <div className="flex flex-col space-y-5">
      {/* Session Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Session Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="headless"
              checked={headlessMode}
              onCheckedChange={(checked) => setHeadlessMode(!!checked)}
              disabled={sessionActive}
            />
            <Label htmlFor="headless" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Headless Mode
            </Label>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleStartSession}
              disabled={!isConnected || sessionActive}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGoToUrl} className="flex flex-col space-y-3">
            <Input
              type="text"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter URL"
              disabled={!sessionActive}
            />
            <Button
              type="submit"
              disabled={!sessionActive}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Go to URL
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CVE Scraper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">CVE Scraper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScrapeCve} className="flex flex-col space-y-3">
            <Input
              type="text"
              value={cveId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCveId(e.target.value)}
              placeholder="Enter CVE ID"
              disabled={!sessionActive}
            />
            <Button
              type="submit"
              disabled={!sessionActive}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Scrape CVE
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGetScreenshot}
            disabled={!sessionActive}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Capture Screenshot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};