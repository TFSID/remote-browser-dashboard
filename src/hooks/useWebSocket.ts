"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'log' | 'error' | 'data';
}

export interface WebSocketState {
  isConnected: boolean;
  sessionActive: boolean;
  logs: LogEntry[];
  scrapedData: any | null;
  screenshotImage: string;
  captcha: {
    show: boolean;
    image: string;
  };
}

const WS_URL = 'ws://localhost:8000/ws';

export const useWebSocket = () => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    sessionActive: false,
    logs: [],
    scrapedData: null,
    screenshotImage: '',
    captcha: {
      show: false,
      image: '',
    },
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: 'log' | 'error' | 'data') => {
    const timestamp = new Date().toLocaleTimeString();
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { timestamp, message, type }],
    }));
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      addLog('Not connected to server', 'error');
    }
  }, [addLog]);

  const handleMessage = useCallback((data: any) => {
    switch (data.status || data.action) {
      case 'log':
        addLog(data.message, 'log');
        if (data.message.includes('Session started')) {
          setState(prev => ({ ...prev, sessionActive: true }));
        } else if (data.message.includes('Session stopped')) {
          setState(prev => ({ ...prev, sessionActive: false }));
        }
        break;
      case 'error':
        addLog(data.message, 'error');
        break;
      case 'data':
        addLog('Data received', 'data');
        setState(prev => ({ ...prev, scrapedData: data.payload }));
        break;
      case 'solve_request':
        addLog(data.message || 'CAPTCHA detected', 'log');
        setState(prev => ({
          ...prev,
          captcha: { show: true, image: data.image_base64 },
        }));
        break;
      case 'screenshot':
        setState(prev => ({ ...prev, screenshotImage: data.image_base64 }));
        addLog('Screenshot received', 'log');
        break;
      default:
        addLog(`Unknown message type: ${data.status || data.action}`, 'error');
    }
  }, [addLog]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }));
      addLog('Connected to server', 'log');
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false, sessionActive: false }));
      addLog('Disconnected from server', 'error');
    };

    ws.onerror = () => {
      addLog('WebSocket error occurred', 'error');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch (e) {
        addLog('Failed to parse message', 'error');
      }
    };

    wsRef.current = ws;
  }, [addLog, handleMessage]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [state.logs]);

  const clearLogs = () => setState(prev => ({ ...prev, logs: [] }));
  const clearData = () => setState(prev => ({ ...prev, scrapedData: null, screenshotImage: '' }));
  const hideCaptcha = () => setState(prev => ({ ...prev, captcha: { show: false, image: '' } }));

  return {
    ...state,
    logContainerRef,
    sendMessage,
    clearLogs,
    clearData,
    hideCaptcha,
  };
};