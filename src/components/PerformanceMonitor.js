import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Zap, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PerformanceMonitor = ({ sessionId, metrics }) => {
  const [sessionMetrics, setSessionMetrics] = useState(metrics || {});

  useEffect(() => {
    if (metrics) {
      setSessionMetrics(metrics);
    }
  }, [metrics]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${API}/sessions/${sessionId}/metrics`);
        if (response.data.metrics) {
          setSessionMetrics(response.data.metrics);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    // Fetch metrics every 2 seconds
    const interval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Monitor</h2>
        <p className="text-gray-600">Real-time performance metrics for your browser session</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Frame Rate"
          value={sessionMetrics.fps || 0}
          unit="FPS"
          color="#3B82F6"
        />
        <MetricCard
          icon={Clock}
          label="Latency"
          value={sessionMetrics.latency || 0}
          unit="ms"
          color="#10B981"
        />
        <MetricCard
          icon={Zap}
          label="Frames Sent"
          value={sessionMetrics.frames_sent || 0}
          unit=""
          color="#F59E0B"
        />
        <MetricCard
          icon={Globe}
          label="Status"
          value={sessionMetrics.current_url ? "Active" : "Idle"}
          unit=""
          color="#8B5CF6"
        />
      </div>

      {/* Current Page Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Page Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 font-medium">Page Title</p>
            <p className="text-base text-gray-900 mt-1">{sessionMetrics.page_title || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Current URL</p>
            <p className="text-base text-gray-900 mt-1 break-all">
              {sessionMetrics.current_url || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Performance chart visualization</p>
            <p className="text-sm mt-1">Real-time metrics tracking</p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Browser Engine</p>
            <p className="text-base font-medium text-gray-900">Selenium + Chrome</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Viewport</p>
            <p className="text-base font-medium text-gray-900">1280 x 720</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mode</p>
            <p className="text-base font-medium text-gray-900">Headless</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Connection</p>
            <p className="text-base font-medium text-gray-900">WebSocket</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
