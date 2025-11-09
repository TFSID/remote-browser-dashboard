import React, { useRef, useEffect, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const BrowserViewer = ({ sessionId, onMetricsUpdate }) => {
  const canvasRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  const handleFrame = (base64Image) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = 'data:image/png;base64,' + base64Image;
  };

  const handleMessage = (data) => {
    if (data.type === 'connected') {
      setCurrentUrl(data.current_url);
    } else if (data.type === 'navigation') {
      setCurrentUrl(data.url);
    } else if (data.metrics) {
      setCurrentUrl(data.metrics.current_url);
      setPageTitle(data.metrics.page_title);
      if (onMetricsUpdate) {
        onMetricsUpdate(data.metrics);
      }
    }
  };

  const { isConnected, sendEvent, metrics } = useWebSocket(
    sessionId,
    handleFrame,
    handleMessage
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Event handlers
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sendEvent({ type: 'mousemove', x, y });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sendEvent({ type: 'mousedown', x, y, button: e.button });
  };

  const handleMouseUp = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sendEvent({ type: 'mouseup', x, y, button: e.button });
  };

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sendEvent({ type: 'click', x, y, button: e.button });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    sendEvent({ type: 'wheel', deltaX: e.deltaX, deltaY: e.deltaY });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      sendEvent({
        type: 'keydown',
        key: e.key,
        code: e.code,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey
      });
    };

    const handleKeyUp = (e) => {
      sendEvent({
        type: 'keyup',
        key: e.key,
        code: e.code
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [sendEvent]);

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Connection Status */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-medium" style={{
        backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white'
      }}>
        {isConnected ? '● Connected' : '● Disconnected'}
      </div>

      {/* Performance Metrics */}
      <div className="absolute top-4 right-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg text-xs space-y-1">
        <div>FPS: {metrics.fps}</div>
        <div>Latency: {metrics.latency}ms</div>
        <div>Frames: {metrics.frames_sent}</div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-default"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        data-testid="browser-canvas"
      />
    </div>
  );
};

export default BrowserViewer;
