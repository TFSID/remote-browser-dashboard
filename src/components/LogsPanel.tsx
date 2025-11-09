"use client";

import React, { RefObject } from 'react';
import { LogEntry } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Database } from 'lucide-react';

interface LogsPanelProps {
  logs: LogEntry[];
  logContainerRef: RefObject<HTMLDivElement>;
  clearLogs: () => void;
}

const logTypeStyles = {
  log: {
    icon: <Info className="h-4 w-4 text-gray-500" />,
    className: "bg-gray-50 text-gray-800",
  },
  error: {
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    className: "bg-red-100 text-red-800",
  },
  data: {
    icon: <Database className="h-4 w-4 text-blue-500" />,
    className: "bg-blue-100 text-blue-800",
  },
};

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, logContainerRef, clearLogs }) => {
  return (
    <Card className="flex flex-col h-[600px] bg-white/95 shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Logs</CardTitle>
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
                  "flex items-start gap-3 mb-2 p-2 rounded-md",
                  logTypeStyles[log.type].className
                )}
              >
                <div className="flex-shrink-0 mt-0.5">{logTypeStyles[log.type].icon}</div>
                <div className="flex-grow">
                  <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
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