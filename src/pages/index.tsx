"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { DataDisplay } from '@/components/DataDisplay';
import { CaptchaModal } from '@/components/CaptchaModal';
import { BrowserIframe } from '@/components/BrowserIframe';
import { LogsPanel } from '@/components/LogsPanel'; // Tetap impor LogsPanel untuk saat ini

export default function Home() {
  // State lokal sederhana untuk mengontrol UI
  const [browserUrl, setBrowserUrl] = useState<string>('about:blank');
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  
  // Dummy data/handlers karena WebSocket dihapus
  const logs: any[] = [];
  const logContainerRef = React.useRef(null);
  const clearLogs = () => {};
  const clearData = () => {};
  const hideCaptcha = () => {};
  const sendMessage = () => {};
  
  const handleStartSession = (initialUrl: string) => {
    setBrowserUrl(initialUrl);
    setSessionActive(true);
  };

  const handleStopSession = () => {
    setSessionActive(false);
    setBrowserUrl('about:blank');
  };

  return (
    <>
      <Header isConnected={false} /> {/* Koneksi selalu false */}

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5 mb-5">
        <ControlPanel
          sessionActive={sessionActive}
          isConnected={false}
          isStartingSession={false}
          handleStartSession={handleStartSession}
          handleStopSession={handleStopSession}
          setBrowserUrl={setBrowserUrl}
        />
        
        {/* Output Area: Logs and Browser View */}
        <div className="flex flex-col gap-5">
          <BrowserIframe
            url={browserUrl}
            sessionActive={sessionActive}
          />
          <LogsPanel
            logs={logs}
            logContainerRef={logContainerRef}
            clearLogs={clearLogs}
          />
        </div>
      </div>

      {/* DataDisplay dan CaptchaModal mungkin perlu dibersihkan lebih lanjut, tapi untuk saat ini biarkan dengan dummy props */}
      <DataDisplay
        scrapedData={null}
        screenshotImage={''}
        clearData={clearData}
      />

      <CaptchaModal
        show={false}
        captchaImage={''}
        sendMessage={sendMessage}
        onClose={hideCaptcha}
      />
    </>
  );
}