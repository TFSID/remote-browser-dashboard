"use client";

import React, { RefObject } from 'react';
import { LogEntry } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LogsPanelProps {
  logs: LogEntry[];
  logContainerRef: RefObject<HTMLDivElement>;
  clearLogs: () => void;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, logContainerRef, clearLogs }) => {
  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold">Logs</CardTitle>
        <Button onClick={clearLogs} variant="secondary" size="sm" className="bg-gray-500 hover:bg-gray-600 text-white">
          Clear Logs
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div ref={logContainerRef} className="font-mono text-sm pr-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "mb-2 p-2 rounded-md",
                  log.type === 'error' && "bg-red-100 text-red-800",
                  log.type === 'data' && "bg-blue-100 text-blue-800",
                  log.type === 'log' && "bg-gray-50 text-gray-800"
                )}
              >
                <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                <span>{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center text-gray-400 p-10">No logs yet...</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};