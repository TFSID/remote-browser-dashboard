import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ConsoleViewer = ({ sessionId }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!sessionId) return;

    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API}/sessions/${sessionId}/console`);
        if (response.data.logs) {
          setLogs(prevLogs => [...prevLogs, ...response.data.logs]);
        }
      } catch (error) {
        console.error('Error fetching console logs:', error);
      }
    };

    // Fetch logs every 2 seconds
    const interval = setInterval(fetchLogs, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const getLogIcon = (level) => {
    switch (level.toLowerCase()) {
      case 'severe':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level) => {
    switch (level.toLowerCase()) {
      case 'severe':
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level.toLowerCase() === filter.toLowerCase();
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Console Logs</h2>
            <p className="text-gray-600">Browser console output</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="log-filter"
            >
              <option value="all">All Logs</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="error">Errors</option>
            </select>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              data-testid="clear-logs-button"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Terminal className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No console logs</p>
          <p className="text-sm text-gray-500 mt-2">Console output will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${getLogColor(log.level)}`}
              data-testid={`console-log-${index}`}
            >
              <div className="flex items-start space-x-3">
                {getLogIcon(log.level)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700 uppercase">
                      {log.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap break-all font-mono">
                    {log.message}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsoleViewer;
