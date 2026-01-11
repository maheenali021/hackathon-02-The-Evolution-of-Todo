'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api';
import { User, Bell, Shield, Moon, Sun, Key, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserId = localStorage.getItem('user_id');
    if (!token || !storedUserId) {
      router.push('/auth/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const handleLogout = () => {
    apiClient.logout();
  };

  const handleSaveSettings = () => {
    // In a real app, you would save settings to backend
    console.log('Settings saved');
    alert('Settings saved successfully!');
  };

  if (!userId) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">Settings</h1>
        <div className="text-sm text-[#9AA0B3]">Manage your account</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-4 shadow-lg">
            <nav className="space-y-2">
              <a href="#" className="flex items-center p-3 bg-[#FF6B5C]/20 text-[#FF6B5C] rounded-lg border border-[#FF6B5C]/50">
                <User size={18} className="mr-3" />
                Profile
              </a>
              <a href="#" className="flex items-center p-3 hover:bg-[#3C4252]/70 rounded-lg">
                <Bell size={18} className="mr-3" />
                Notifications
              </a>
              <a href="#" className="flex items-center p-3 hover:bg-[#3C4252]/70 rounded-lg">
                <Shield size={18} className="mr-3" />
                Security
              </a>
              <a href="#" className="flex items-center p-3 hover:bg-[#3C4252]/70 rounded-lg">
                <Key size={18} className="mr-3" />
                API Keys
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 text-[#FF5C5C] hover:bg-[#FF5C5C]/20 rounded-lg"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Profile Settings</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9AA0B3] text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#9AA0B3] text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9AA0B3] text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#9AA0B3] text-sm mb-2">User ID</label>
                <input
                  type="text"
                  value={userId}
                  disabled
                  className="w-full px-4 py-2 bg-[#3A3F4E]/30 border border-[#9AA0B3]/50 rounded-lg text-[#9AA0B3] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FFFFFF] font-medium">Dark Mode</h3>
                  <p className="text-[#9AA0B3] text-sm">Switch between dark and light mode</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    darkMode ? 'bg-[#FF6B5C]' : 'bg-[#3A3F4E]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FFFFFF] font-medium">Email Notifications</h3>
                  <p className="text-[#9AA0B3] text-sm">Receive email updates</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#FF6B5C]">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FFFFFF] font-medium">Task Reminders</h3>
                  <p className="text-[#9AA0B3] text-sm">Get notified before due dates</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#3A3F4E]">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 bg-[#3A3F4E]/50 text-[#FFFFFF] rounded-lg hover:bg-[#3C4252]/50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-[#FF6B5C] text-white rounded-lg hover:bg-[#e05a4d] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}