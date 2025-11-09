import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'log' | 'error' | 'data';
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [url, setUrl] = useState<string>('https://example.com');
  const [cveId, setCveId] = useState<string>('CVE-2023-0001');
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [captchaSolution, setCaptchaSolution] = useState<string>('');
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [headlessMode, setHeadlessMode] = useState<boolean>(false);
  const [screenshotImage, setScreenshotImage] = useState<string>('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = () => {
      setIsConnected(true);
      addLog('Connected to server', 'log');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSessionActive(false);
      addLog('Disconnected from server', 'error');
    };

    ws.onerror = (error) => {
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
  };

  const handleMessage = (data: any) => {
    switch (data.status || data.action) {
      case 'log':
        addLog(data.message, 'log');
        if (data.message.includes('Session started')) {
          setSessionActive(true);
        } else if (data.message.includes('Session stopped')) {
          setSessionActive(false);
        }
        break;
      case 'error':
        addLog(data.message, 'error');
        break;
      case 'data':
        addLog('Data received', 'data');
        setScrapedData(data.payload);
        break;
      case 'solve_request':
        addLog(data.message || 'CAPTCHA detected', 'log');
        setCaptchaImage(data.image_base64);
        setShowCaptcha(true);
        break;
      case 'screenshot':
        setScreenshotImage(data.image_base64);
        addLog('Screenshot received', 'log');
        break;
      default:
        addLog(`Unknown message type: ${data.status || data.action}`, 'error');
    }
  };

  const addLog = (message: string, type: 'log' | 'error' | 'data') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      addLog('Not connected to server', 'error');
    }
  };

  const handleStartSession = () => {
    sendMessage({ action: 'start_session', headless: headlessMode });
  };

  const handleStopSession = () => {
    sendMessage({ action: 'stop_session' });
  };

  const handleGoToUrl = (e: FormEvent) => {
    e.preventDefault();
    if (!url) {
      addLog('Please enter a URL', 'error');
      return;
    }
    sendMessage({ action: 'goto', url });
  };

  const handleScrapeCve = (e: FormEvent) => {
    e.preventDefault();
    if (!cveId) {
      addLog('Please enter a CVE ID', 'error');
      return;
    }
    sendMessage({ action: 'scrape_cve', cve_id: cveId });
  };

  const handleSubmitCaptcha = () => {
    if (!captchaSolution) {
      addLog('Please enter CAPTCHA solution', 'error');
      return;
    }
    sendMessage({ action: 'solve_solution', solution: captchaSolution });
    setShowCaptcha(false);
    setCaptchaSolution('');
  };

  const handleGetScreenshot = () => {
    sendMessage({ action: 'get_screenshot' });
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleClearData = () => {
    setScrapedData(null);
    setScreenshotImage('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Selenium WebSocket Scraper</h1>
        <div style={{
          ...styles.statusBadge,
          backgroundColor: isConnected ? '#10b981' : '#ef4444'
        }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.controlPanel}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Session Control</h2>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="headless"
                checked={headlessMode}
                onChange={(e) => setHeadlessMode(e.target.checked)}
                style={styles.checkbox}
                disabled={sessionActive}
              />
              <label htmlFor="headless" style={styles.checkboxLabel}>
                Headless Mode
              </label>
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleStartSession}
                disabled={!isConnected || sessionActive}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  ...((!isConnected || sessionActive) && styles.buttonDisabled)
                }}
              >
                Start Session
              </button>
              <button
                onClick={handleStopSession}
                disabled={!sessionActive}
                style={{
                  ...styles.button,
                  ...styles.buttonDanger,
                  ...(!sessionActive && styles.buttonDisabled)
                }}
              >
                Stop Session
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Navigation</h2>
            <form onSubmit={handleGoToUrl} style={styles.form}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                style={styles.input}
                disabled={!sessionActive}
              />
              <button
                type="submit"
                disabled={!sessionActive}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(!sessionActive && styles.buttonDisabled)
                }}
              >
                Go to URL
              </button>
            </form>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>CVE Scraper</h2>
            <form onSubmit={handleScrapeCve} style={styles.form}>
              <input
                type="text"
                value={cveId}
                onChange={(e) => setCveId(e.target.value)}
                placeholder="Enter CVE ID"
                style={styles.input}
                disabled={!sessionActive}
              />
              <button
                type="submit"
                disabled={!sessionActive}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(!sessionActive && styles.buttonDisabled)
                }}
              >
                Scrape CVE
              </button>
            </form>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Actions</h2>
            <button
              onClick={handleGetScreenshot}
              disabled={!sessionActive}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                ...(!sessionActive && styles.buttonDisabled),
                width: '100%'
              }}
            >
              Capture Screenshot
            </button>
          </div>
        </div>

        <div style={styles.logsPanel}>
          <div style={styles.logHeader}>
            <h2 style={styles.sectionTitle}>Logs</h2>
            <button onClick={handleClearLogs} style={styles.clearButton}>
              Clear Logs
            </button>
          </div>
          <div ref={logContainerRef} style={styles.logContainer}>
            {logs.map((log, index) => (
              <div
                key={index}
                style={{
                  ...styles.logEntry,
                  ...(log.type === 'error' && styles.logError),
                  ...(log.type === 'data' && styles.logData)
                }}
              >
                <span style={styles.timestamp}>[{log.timestamp}]</span>
                <span style={styles.logMessage}>{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div style={styles.emptyState}>No logs yet...</div>
            )}
          </div>
        </div>
      </div>

      {scrapedData && (
        <div style={styles.dataPanel}>
          <div style={styles.logHeader}>
            <h2 style={styles.sectionTitle}>Scraped Data</h2>
            <button onClick={handleClearData} style={styles.clearButton}>
              Clear Data
            </button>
          </div>
          <pre style={styles.jsonContainer}>
            {JSON.stringify(scrapedData, null, 2)}
          </pre>
        </div>
      )}

      {screenshotImage && (
        <div style={styles.dataPanel}>
          <div style={styles.logHeader}>
            <h2 style={styles.sectionTitle}>Screenshot</h2>
            <button onClick={() => setScreenshotImage('')} style={styles.clearButton}>
              Clear
            </button>
          </div>
          <div style={styles.screenshotContainer}>
            <img
              src={`data:image/png;base64,${screenshotImage}`}
              alt="Screenshot"
              style={styles.screenshot}
            />
          </div>
        </div>
      )}

      {showCaptcha && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Solve CAPTCHA</h2>
            <div style={styles.captchaImageContainer}>
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="CAPTCHA"
                style={styles.captchaImage}
              />
            </div>
            <input
              type="text"
              value={captchaSolution}
              onChange={(e) => setCaptchaSolution(e.target.value)}
              placeholder="Enter CAPTCHA solution"
              style={styles.input}
              autoFocus
            />
            <div style={styles.modalButtons}>
              <button
                onClick={handleSubmitCaptcha}
                style={{ ...styles.button, ...styles.buttonPrimary }}
              >
                Submit Solution
              </button>
              <button
                onClick={() => setShowCaptcha(false)}
                style={{ ...styles.button, ...styles.buttonDanger }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  buttonSecondary: {
    background: '#3b82f6',
    color: 'white',
  },
  buttonDanger: {
    background: '#ef4444',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  logsPanel: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  clearButton: {
    padding: '6px 12px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  logContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    maxHeight: '600px',
    fontFamily: 'monospace',
    fontSize: '13px',
  },
  logEntry: {
    marginBottom: '8px',
    padding: '8px',
    borderRadius: '4px',
    background: '#f9fafb',
  },
  logError: {
    background: '#fee2e2',
    color: '#991b1b',
  },
  logData: {
    background: '#dbeafe',
    color: '#1e40af',
  },
  timestamp: {
    color: '#6b7280',
    marginRight: '10px',
  },
  logMessage: {
    color: '#1f2937',
  },
  emptyState: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '40px',
  },
  dataPanel: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  jsonContainer: {
    padding: '20px',
    margin: 0,
    background: '#1f2937',
    color: '#10b981',
    overflowX: 'auto',
    fontSize: '13px',
  },
  screenshotContainer: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  screenshot: {
    maxWidth: '100%',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)',
  },
  modalTitle: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  captchaImageContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  captchaImage: {
    maxWidth: '100%',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
};
