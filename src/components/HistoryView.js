import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, ExternalLink, Trash2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryView = ({ sessionId, onNavigate }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API}/sessions/${sessionId}/history`);
        if (response.data.history) {
          setHistory(response.data.history.reverse()); // Most recent first
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Refresh every 5 seconds
    const interval = setInterval(fetchHistory, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browsing History</h2>
        <p className="text-gray-600">Your recent browsing activity</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No browsing history yet</p>
          <p className="text-sm text-gray-500 mt-2">Start browsing to see your history here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate && onNavigate(item.url)}
              data-testid={`history-item-${index}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-gray-900">{item.title || 'Untitled'}</h3>
                  </div>
                  <p className="text-sm text-gray-600 break-all">{item.url}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatTime(item.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
