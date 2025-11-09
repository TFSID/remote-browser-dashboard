import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Home, Bookmark, ZoomIn, ZoomOut } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ControlPanel = ({ sessionId, currentUrl, onUrlChange }) => {
  const [url, setUrl] = useState(currentUrl || '');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [loading, setLoading] = useState(false);

  const handleNavigate = async () => {
    if (!url || !sessionId) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/sessions/${sessionId}/navigate`, { url });
      if (response.data.current_url) {
        setUrl(response.data.current_url);
        if (onUrlChange) onUrlChange(response.data.current_url);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (!sessionId) return;
    try {
      const response = await axios.post(`${API}/sessions/${sessionId}/back`);
      if (response.data.current_url) {
        setUrl(response.data.current_url);
        if (onUrlChange) onUrlChange(response.data.current_url);
      }
    } catch (error) {
      console.error('Back error:', error);
    }
  };

  const handleForward = async () => {
    if (!sessionId) return;
    try {
      const response = await axios.post(`${API}/sessions/${sessionId}/forward`);
      if (response.data.current_url) {
        setUrl(response.data.current_url);
        if (onUrlChange) onUrlChange(response.data.current_url);
      }
    } catch (error) {
      console.error('Forward error:', error);
    }
  };

  const handleRefresh = async () => {
    if (!sessionId) return;
    try {
      await axios.post(`${API}/sessions/${sessionId}/refresh`);
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  const handleHome = () => {
    setUrl('https://www.google.com');
    handleNavigate();
  };

  const handleZoomIn = async () => {
    const newZoom = Math.min(zoomLevel + 0.1, 2.0);
    setZoomLevel(newZoom);
    try {
      await axios.post(`${API}/sessions/${sessionId}/zoom`, { level: newZoom });
    } catch (error) {
      console.error('Zoom error:', error);
    }
  };

  const handleZoomOut = async () => {
    const newZoom = Math.max(zoomLevel - 0.1, 0.5);
    setZoomLevel(newZoom);
    try {
      await axios.post(`${API}/sessions/${sessionId}/zoom`, { level: newZoom });
    } catch (error) {
      console.error('Zoom error:', error);
    }
  };

  const handleAddBookmark = async () => {
    if (!sessionId || !url) return;
    try {
      await axios.post(`${API}/sessions/${sessionId}/bookmarks`, {
        url: url,
        title: url
      });
      alert('Bookmark added!');
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-3 space-y-3">
      {/* Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Back"
          data-testid="back-button"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleForward}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Forward"
          data-testid="forward-button"
        >
          <ArrowRight className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
          data-testid="refresh-button"
        >
          <RefreshCw className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleHome}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Home"
          data-testid="home-button"
        >
          <Home className="w-5 h-5 text-gray-700" />
        </button>
        
        {/* URL Bar */}
        <div className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
            placeholder="Enter URL..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            data-testid="url-input"
          />
          <button
            onClick={handleNavigate}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            data-testid="navigate-button"
          >
            {loading ? 'Loading...' : 'Go'}
          </button>
        </div>

        {/* Additional Controls */}
        <button
          onClick={handleAddBookmark}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Bookmark"
          data-testid="bookmark-button"
        >
          <Bookmark className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out"
          data-testid="zoom-out-button"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In"
          data-testid="zoom-in-button"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
