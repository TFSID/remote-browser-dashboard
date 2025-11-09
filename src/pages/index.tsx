"use client";

import React, { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { LogsPanel } from '@/components/LogsPanel';
import { DataDisplay } from '@/components/DataDisplay';
import { CaptchaModal } from '@/components/CaptchaModal';
import { BrowserIframe } from '@/components/BrowserIframe';

export default function Home() {
  const {
    isConnected,
    sessionActive,
    isStartingSession,
    logs,
    scrapedData,
    screenshotImage,
    captcha,
    logContainerRef,
    sendMessage,
    clearLogs,
    clearData,
    hideCaptcha,
    handleStartSession,
    handleStopSession,
  } = useWebSocket();

  // State lokal untuk URL yang ditampilkan di iframe
  const [browserUrl, setBrowserUrl] = useState<string>('about:blank');

  // Modifikasi sendMessage untuk memperbarui browserUrl saat navigasi
  const sendMessageWithUrlUpdate = (message: any) => {
    if (message.action === 'goto' && message.url) {
      setBrowserUrl(message.url);
    }
    sendMessage(message);
  };

  return (
    <>
      <Header isConnected={isConnected} />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5 mb-5">
        <ControlPanel
          sessionActive={sessionActive}
          isConnected={isConnected}
          isStartingSession={isStartingSession}
          sendMessage={sendMessageWithUrlUpdate} // Menggunakan handler yang dimodifikasi
          handleStartSession={handleStartSession}
          handleStopSession={handleStopSession}
        />
        
        {/* Output Area: Logs and Browser View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LogsPanel
            logs={logs}
            logContainerRef={logContainerRef}
            clearLogs={clearLogs}
          />
          <BrowserIframe
            url={browserUrl}
            sessionActive={sessionActive}
          />
        </div>
      </div>

      <DataDisplay
        scrapedData={scrapedData}
        screenshotImage={screenshotImage}
        clearData={clearData}
      />

      <CaptchaModal
        show={captcha.show}
        captchaImage={captcha.image}
        sendMessage={sendMessage}
        onClose={hideCaptcha}
      />
    </>
  );
}