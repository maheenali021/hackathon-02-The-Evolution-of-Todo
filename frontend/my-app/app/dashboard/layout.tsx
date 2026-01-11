'use client';

import { useState, ReactNode } from 'react';
import { Home, CheckSquare, BarChart3, Settings, Bell, Plus, Search, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiClient } from '../../lib/api';
import { Task } from '../../types/task';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Completed', href: '/dashboard/completed', icon: CheckSquare },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const newTask = await apiClient.createTask(userId, {
        title: taskTitle,
        description: taskDescription,
        completed: false
      });

      // Reset form and close modal
      setTaskTitle('');
      setTaskDescription('');
      setShowAddTaskModal(false);

      // In a real app, you might want to refresh the tasks list
      // For now, we'll just close the modal
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#2F3441] text-[#FFFFFF]">
      {/* Sidebar */}
      <div className={`bg-[#3A3F4E]/50 backdrop-blur-lg border-r border-[#9AA0B3]/50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-[#9AA0B3]/50">
          <h1 className={`text-xl font-bold text-[#FF6B5C] ${!sidebarOpen && 'hidden'}`}>
            Todo Dashboard
          </h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-[#FF6B5C]/20 text-[#FF6B5C] border border-[#FF6B5C]/50'
                        : 'hover:bg-[#3C4252]/50'
                    }`}
                  >
                    <Icon size={20} className="min-w-[20px]" />
                    <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-[#3A3F4E]/50 backdrop-blur-lg border-b border-[#9AA0B3]/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-[#3C4252]/50 mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9AA0B3]" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 bg-[#3C4252]/50 border border-[#9AA0B3]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-[#3C4252]/50 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5C5C] rounded-full"></span>
              </button>

              <button
                className="p-2 rounded-lg hover:bg-[#3C4252]/50"
                onClick={() => window.location.href = '/dashboard/settings'}
              >
                <User size={20} />
              </button>

              <button
                className="flex items-center bg-[#FF6B5C] hover:bg-[#e05a4d] text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus size={18} className="mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#2F3441] to-[#3A3F4E]">
          {children}
        </main>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#3C4252]/90 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#FFFFFF]">Add New Task</h2>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-[#9AA0B3] hover:text-[#FFFFFF]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#9AA0B3] text-sm mb-2">Task Title *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA0B3] text-sm mb-2">Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description (optional)"
                  className="w-full px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 bg-[#3A3F4E]/50 text-[#FFFFFF] rounded-lg hover:bg-[#3C4252]/50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={loading || !taskTitle.trim()}
                className="px-4 py-2 bg-[#FF6B5C] text-white rounded-lg hover:bg-[#e05a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;