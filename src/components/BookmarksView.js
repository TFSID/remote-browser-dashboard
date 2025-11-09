import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bookmark, ExternalLink, Star, Trash2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookmarksView = ({ sessionId, onNavigate }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`${API}/sessions/${sessionId}/bookmarks`);
        if (response.data.bookmarks) {
          setBookmarks(response.data.bookmarks);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
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
        <div className="text-gray-500">Loading bookmarks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bookmarks</h2>
        <p className="text-gray-600">Your saved bookmarks</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No bookmarks yet</p>
          <p className="text-sm text-gray-500 mt-2">Click the bookmark icon in the control panel to save pages</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate && onNavigate(bookmark.url)}
              data-testid={`bookmark-item-${index}`}
            >
              <div className="flex items-start justify-between mb-2">
                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                {bookmark.title || 'Untitled'}
              </h3>
              <p className="text-sm text-gray-600 break-all line-clamp-2 mb-3">
                {bookmark.url}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{formatTime(bookmark.timestamp)}</p>
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
