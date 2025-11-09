"use client";

import { useWebSocket } from '@/hooks/useWebSocket';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { LogsPanel } from '@/components/LogsPanel';
import { DataDisplay } from '@/components/DataDisplay';
import { CaptchaModal } from '@/components/CaptchaModal';

export default function Home() {
  const {
    isConnected,
    sessionActive,
    logs,
    scrapedData,
    screenshotImage,
    captcha,
    logContainerRef,
    sendMessage,
    clearLogs,
    clearData,
    hideCaptcha,
  } = useWebSocket();

  return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-indigo-500 to-purple-700">
      <Header isConnected={isConnected} />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5 mb-5">
        <ControlPanel
          sessionActive={sessionActive}
          isConnected={isConnected}
          sendMessage={sendMessage}
        />
        <LogsPanel
          logs={logs}
          logContainerRef={logContainerRef}
          clearLogs={clearLogs}
        />
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
    </div>
  );
}