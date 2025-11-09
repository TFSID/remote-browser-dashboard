import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (sessionId, onFrame, onMessage) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    latency: 0,
    frames_sent: 0
  });
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!sessionId) return;

    try {
      const ws = new WebSocket('ws://localhost:8765');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Send initial connection message
        ws.send(JSON.stringify({
          session_id: sessionId,
          action: 'connect',
          viewport_width: 1280,
          viewport_height: 720
        }));
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'frame') {
            if (onFrame) {
              onFrame(data.data);
            }
            if (data.metrics) {
              setMetrics(data.metrics);
            }
          } else if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 2 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [sessionId, onFrame, onMessage]);

  const sendEvent = useCallback((eventData) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(eventData));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, sendEvent, metrics, disconnect };
};

export default useWebSocket;
