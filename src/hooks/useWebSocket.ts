"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'log' | 'error' | 'data';
}

export interface WebSocketState {
  isConnected: boolean;
  sessionActive: boolean;
  isStartingSession: boolean; // New loading state
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
    isStartingSession: false,
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
  const loadingToastIdRef = useRef<string | null>(null);

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
      showError('Not connected to server. Attempting to reconnect.');
      addLog('Not connected to server', 'error');
      connectWebSocket();
    }
  }, [addLog]);

  const handleMessage = useCallback((data: any) => {
    switch (data.status || data.action) {
      case 'log':
        addLog(data.message, 'log');
        if (data.message.includes('Session started')) {
          if (loadingToastIdRef.current) dismissToast(loadingToastIdRef.current);
          showSuccess('Session started successfully.');
          setState(prev => ({ ...prev, sessionActive: true, isStartingSession: false }));
        } else if (data.message.includes('Session stopped')) {
          if (loadingToastIdRef.current) dismissToast(loadingToastIdRef.current);
          showSuccess('Session stopped.');
          setState(prev => ({ ...prev, sessionActive: false, isStartingSession: false }));
        }
        break;
      case 'error':
        if (loadingToastIdRef.current) dismissToast(loadingToastIdRef.current);
        showError(data.message);
        addLog(data.message, 'error');
        setState(prev => ({ ...prev, isStartingSession: false }));
        break;
      case 'data':
        showSuccess('Scraping data received.');
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
        showSuccess('Screenshot captured.');
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
      setState(prev => ({ ...prev, isConnected: false, sessionActive: false, isStartingSession: false }));
      addLog('Disconnected from server', 'error');
    };

    ws.onerror = () => {
      showError('WebSocket connection failed.');
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

  const handleStartSession = (headless: boolean) => {
    setState(prev => ({ ...prev, isStartingSession: true }));
    loadingToastIdRef.current = showLoading('Starting session...');
    sendMessage({ action: 'start_session', headless });
  };

  const handleStopSession = () => {
    loadingToastIdRef.current = showLoading('Stopping session...');
    sendMessage({ action: 'stop_session' });
  };

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
    handleStartSession,
    handleStopSession,
  };
};