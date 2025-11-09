import React from 'react';
import { Settings as SettingsIcon, Monitor, Globe, Zap } from 'lucide-react';

const SettingsView = ({ sessionId }) => {
  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your browser session</p>
      </div>

      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Monitor className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 font-medium">Session ID</p>
              <p className="text-base text-gray-900 mt-1 font-mono">{sessionId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Viewport Resolution</p>
              <p className="text-base text-gray-900 mt-1">1280 x 720</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Browser Engine</p>
              <p className="text-base text-gray-900 mt-1">Chrome (Selenium WebDriver)</p>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Performance Overlay</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Connection Status</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enable Animations</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Target Frame Rate</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Quality</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Technology:</strong> React + FastAPI + Selenium + WebSocket</p>
            <p><strong>Description:</strong> Interactive browser streaming dashboard with real-time control and monitoring capabilities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
