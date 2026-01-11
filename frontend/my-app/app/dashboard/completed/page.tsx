'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../../types/task';
import { apiClient } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { Check, Edit3, Trash2, Calendar, Flag } from 'lucide-react';

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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
      // Filter to only show completed tasks
      const completedTasks = tasksData.filter(task => task.completed);
      setTasks(completedTasks);
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

  if (!userId) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">Completed Tasks</h1>
        <div className="text-sm text-[#9AA0B3]">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} completed
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DA9FF]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <div
                key={task.id}
                className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#4CD7A5]/30 bg-[#4CD7A5]/10 rounded-xl p-5 shadow-lg transition-all duration-200"
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
                          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#4CD7A5] bg-[#4CD7A5] flex items-center justify-center mr-3 mt-0.5"
                        >
                          <Check size={14} className="text-white" />
                        </button>
                        <div>
                          <h3 className="font-medium line-through text-[#9AA0B3]">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm mt-1 line-through text-[#C7CBD6]">
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

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#4CD7A5]/20">
                      <div className="flex items-center text-[#9AA0B3] text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(task.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center">
                        <Flag size={14} className="text-[#F5C76A] mr-1" />
                        <span className="text-xs bg-[#4CD7A5]/20 text-[#4CD7A5] px-2 py-1 rounded-full border border-[#4CD7A5]/30">
                          Completed
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

      {tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-[#9AA0B3] text-lg">No completed tasks yet</div>
          <p className="text-[#C7CBD6] mt-2">Complete some tasks to see them here</p>
        </div>
      )}
    </div>
  );
}