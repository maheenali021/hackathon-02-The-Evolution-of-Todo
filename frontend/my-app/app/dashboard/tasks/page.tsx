'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../../types/task';
import { apiClient } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { Check, Edit3, Trash2, Calendar, Flag, Search } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    loadTasks(storedUserId);
  }, [router]);

  const loadTasks = async (currentUserId: string) => {
    try {
      setLoading(true);
      const tasksData = await apiClient.getTasks(currentUserId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
  };

  const handleToggleCompletion = async (taskId: number) => {
    if (!userId) return;

    try {
      const updatedTask = await apiClient.toggleTaskCompletion(userId, taskId);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!userId) return;

    try {
      await apiClient.deleteTask(userId, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const saveEditedTask = async (taskId: number) => {
    if (!userId) return;

    try {
      const updatedTask = await apiClient.updateTask(userId, taskId, {
        title: editingTitle,
        description: editingDescription
      });

      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      cancelEditing();
    } catch (error) {
      console.error('Error updating task:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && !task.completed) ||
                         (filter === 'completed' && task.completed);

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  if (!userId) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">All Tasks</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9AA0B3]" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent w-full sm:w-64 text-[#FFFFFF]"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
            className="px-4 py-2 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] focus:border-transparent text-[#FFFFFF]"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DA9FF]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`bg-[#3C4252]/50 backdrop-blur-lg border rounded-xl p-5 shadow-lg transition-all duration-200 ${
                  task.completed
                    ? 'border-[#4CD7A5]/30 bg-[#4CD7A5]/10'
                    : 'border-[#9AA0B3]/50 hover:border-[#5DA9FF]/50'
                }`}
              >
                {isEditing ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full px-3 py-1 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] text-[#FFFFFF] mb-2"
                        placeholder="Task title"
                      />
                      <textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        className="w-full px-3 py-1 bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B5C] text-[#FFFFFF] text-sm"
                        placeholder="Task description (optional)"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 text-sm bg-[#3A3F4E]/50 text-[#FFFFFF] rounded-lg hover:bg-[#3C4252]/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEditedTask(task.id)}
                        className="px-3 py-1 text-sm bg-[#FF6B5C] text-white rounded-lg hover:bg-[#e05a4d] transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <button
                          onClick={() => handleToggleCompletion(task.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                            task.completed
                              ? 'bg-[#4CD7A5] border-[#4CD7A5]'
                              : 'border-[#9AA0B3] hover:border-[#5DA9FF]'
                          }`}
                        >
                          {task.completed && (
                            <Check size={14} className="text-white" />
                          )}
                        </button>
                        <div>
                          <h3 className={`font-medium ${task.completed ? 'line-through text-[#9AA0B3]' : 'text-[#FFFFFF]'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-[#C7CBD6]' : 'text-[#9AA0B3]'}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingTask(task)}
                          className="p-1.5 rounded-lg hover:bg-[#3C4252]/50 text-[#9AA0B3] hover:text-[#5DA9FF]"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-[#3C4252]/50 text-[#9AA0B3] hover:text-[#FF5C5C]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#9AA0B3]/50">
                      <div className="flex items-center text-[#9AA0B3] text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(task.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center">
                        <Flag size={14} className="text-[#F5C76A] mr-1" />
                        <span className="text-xs bg-[#F5C76A]/20 text-[#F5C76A] px-2 py-1 rounded-full border border-[#F5C76A]/30">
                          Medium
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-[#9AA0B3] text-lg">No tasks found</div>
          <p className="text-[#C7CBD6] mt-2">Try changing your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}