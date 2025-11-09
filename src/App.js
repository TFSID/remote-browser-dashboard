import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/App.css";
import Sidebar from "./components/Sidebar";
import BrowserViewer from "./components/BrowserViewer";
import ControlPanel from "./components/ControlPanel";
import PerformanceMonitor from "./components/PerformanceMonitor";
import HistoryView from "./components/HistoryView";
import BookmarksView from "./components/BookmarksView";
import ConsoleViewer from "./components/ConsoleViewer";
import SettingsView from "./components/SettingsView";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentView, setCurrentView] = useState('browser');
  const [currentUrl, setCurrentUrl] = useState('');
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions`);
      setSessions(response.data);
      
      // If no active session and sessions exist, select first one
      if (!activeSessionId && response.data.length > 0) {
        setActiveSessionId(response.data[0].session_id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/sessions`, {
        viewport_width: 1280,
        viewport_height: 720
      });
      
      if (response.data.session_id) {
        await fetchSessions();
        setActiveSessionId(response.data.session_id);
        setCurrentUrl(response.data.current_url || '');
        setCurrentView('browser');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`${API}/sessions/${sessionId}`);
      await fetchSessions();
      
      // If deleted session was active, clear it
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setCurrentUrl('');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session.');
    }
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setCurrentView('browser');
  };

  const handleNavigate = async (url) => {
    if (!activeSessionId) return;
    
    try {
      const response = await axios.post(`${API}/sessions/${activeSessionId}/navigate`, { url });
      if (response.data.current_url) {
        setCurrentUrl(response.data.current_url);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleMetricsUpdate = (newMetrics) => {
    setMetrics(newMetrics);
    if (newMetrics.current_url) {
      setCurrentUrl(newMetrics.current_url);
    }
  };

  const renderMainContent = () => {
    if (!activeSessionId) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Session</h2>
            <p className="text-gray-600 mb-6">Create a new browser session to get started</p>
            <button
              onClick={handleCreateSession}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
              data-testid="create-first-session-button"
            >
              {loading ? 'Creating...' : 'Create Browser Session'}
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'browser':
        return (
          <div className="flex flex-col h-full">
            <ControlPanel 
              sessionId={activeSessionId}
              currentUrl={currentUrl}
              onUrlChange={setCurrentUrl}
            />
            <div className="flex-1">
              <BrowserViewer 
                sessionId={activeSessionId}
                onMetricsUpdate={handleMetricsUpdate}
              />
            </div>
          </div>
        );
      
      case 'performance':
        return (
          <PerformanceMonitor 
            sessionId={activeSessionId}
            metrics={metrics}
          />
        );
      
      case 'history':
        return (
          <HistoryView 
            sessionId={activeSessionId}
            onNavigate={handleNavigate}
          />
        );
      
      case 'bookmarks':
        return (
          <BookmarksView 
            sessionId={activeSessionId}
            onNavigate={handleNavigate}
          />
        );
      
      case 'console':
        return (
          <ConsoleViewer sessionId={activeSessionId} />
        );
      
      case 'settings':
        return (
          <SettingsView sessionId={activeSessionId} />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" data-testid="app-container">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onCreateSession={handleCreateSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onViewChange={setCurrentView}
      />
      <div className="flex-1 overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;
