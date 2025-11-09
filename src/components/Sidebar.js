import React, { useState } from 'react';
import { Monitor, History, Bookmark, Settings, Plus, Trash2, Activity } from 'lucide-react';

const Sidebar = ({ 
  sessions, 
  activeSessionId, 
  onCreateSession, 
  onSelectSession, 
  onDeleteSession,
  onViewChange 
}) => {
  const [activeView, setActiveView] = useState('browser');

  const handleViewChange = (view) => {
    setActiveView(view);
    if (onViewChange) onViewChange(view);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center space-x-2">
          <Monitor className="w-6 h-6" />
          <span>Browser Dashboard</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button
          onClick={() => handleViewChange('browser')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'browser' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
          data-testid="nav-browser"
        >
          <Monitor className="w-5 h-5" />
          <span>Browser</span>
        </button>

        <button
          onClick={() => handleViewChange('performance')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'performance' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
          data-testid="nav-performance"
        >
          <Activity className="w-5 h-5" />
          <span>Performance</span>
        </button>

        <button
          onClick={() => handleViewChange('history')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'history' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
          data-testid="nav-history"
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => handleViewChange('bookmarks')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'bookmarks' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
          data-testid="nav-bookmarks"
        >
          <Bookmark className="w-5 h-5" />
          <span>Bookmarks</span>
        </button>

        <button
          onClick={() => handleViewChange('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
          data-testid="nav-settings"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>

        <div className="pt-4 border-t border-gray-700 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400">Active Sessions</h3>
            <button
              onClick={onCreateSession}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
              title="Create New Session"
              data-testid="create-session-button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeSessionId === session.session_id ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => onSelectSession(session.session_id)}
                  data-testid={`session-${session.session_id}`}
                >
                  <div className="flex-1 truncate">
                    <div className="text-sm truncate">{session.session_id.substring(0, 8)}...</div>
                    <div className="text-xs text-gray-400 truncate">
                      {session.current_url || 'No URL'}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.session_id);
                    }}
                    className="p-1 hover:bg-red-600 rounded transition-colors"
                    title="Delete Session"
                    data-testid={`delete-session-${session.session_id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 text-center py-4">
                No active sessions
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <div>Browser Streaming Dashboard</div>
        <div className="mt-1">v1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
