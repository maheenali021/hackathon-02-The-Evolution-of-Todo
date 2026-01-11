'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../types/task';
import { apiClient } from '../../lib/api';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4CD7A5', '#F5C76A', '#5DA9FF']; // mint green, amber yellow, soft blue

export default function DashboardPage() {
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

  // Calculate dashboard metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => !task.completed).length; // In a real app, this would check due dates

  // For the status chart, use real data based on actual tasks
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
    { name: 'In Progress', value: 0 }, // This could be extended to include tasks with different statuses
  ];

  // Calculate weekly data based on actual task creation dates
  // Group tasks by day of the week based on created_at
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  // Initialize weekly data
  const weeklyDataInit = [
    { name: 'Sun', completed: 0, created: 0 },
    { name: 'Mon', completed: 0, created: 0 },
    { name: 'Tue', completed: 0, created: 0 },
    { name: 'Wed', completed: 0, created: 0 },
    { name: 'Thu', completed: 0, created: 0 },
    { name: 'Fri', completed: 0, created: 0 },
    { name: 'Sat', completed: 0, created: 0 },
  ];

  // Count tasks by day of the week
  const weeklyDataWithTasks = [...weeklyDataInit];
  tasks.forEach(task => {
    const day = getDayOfWeek(task.created_at);
    const dayIndex = weeklyDataWithTasks.findIndex(d => d.name === day);
    if (dayIndex !== -1) {
      weeklyDataWithTasks[dayIndex].created += 1;
      if (task.completed) {
        weeklyDataWithTasks[dayIndex].completed += 1;
      }
    }
  });

  // Use the completed data for the chart
  const weeklyData = weeklyDataWithTasks.map(dayData => ({
    name: dayData.name,
    completed: dayData.completed
  }));

  if (!userId) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {userId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Today</span>
          <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center">
            <span className="text-white font-medium">{userId.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#5DA9FF]/10 border border-[#5DA9FF]/30">
              <span className="text-[#5DA9FF] text-xl font-bold">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-[#9AA0B3] text-sm">Total Tasks</h3>
              <p className="text-2xl font-bold text-[#FFFFFF]">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#4CD7A5]/10 border border-[#4CD7A5]/30">
              <span className="text-[#4CD7A5] text-xl font-bold">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-[#9AA0B3] text-sm">Completed</h3>
              <p className="text-2xl font-bold text-[#FFFFFF]">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#F5C76A]/10 border border-[#F5C76A]/30">
              <span className="text-[#F5C76A] text-xl font-bold">⏳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-[#9AA0B3] text-sm">Pending</h3>
              <p className="text-2xl font-bold text-[#FFFFFF]">{pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#FF5C5C]/10 border border-[#FF5C5C]/30">
              <span className="text-[#FF5C5C] text-xl font-bold">⏰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-[#9AA0B3] text-sm">Overdue</h3>
              <p className="text-2xl font-bold text-[#FFFFFF]">{overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Tasks Completed Per Week</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed Tasks" fill="#4CD7A5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Task Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FFFFFF]">Recent Tasks</h2>
          <button className="text-[#FF6B5C] hover:text-[#e05a4d] text-sm">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[#9AA0B3] border-b border-[#9AA0B3]/50">
                <th className="pb-3">Task</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task.id} className="border-b border-[#9AA0B3]/50 hover:bg-[#3C4252]/70">
                  <td className="py-4">
                    <div className="font-medium text-[#FFFFFF]">{task.title}</div>
                    <div className="text-sm text-[#9AA0B3]">{task.description}</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-[#F5C76A]/20 text-[#F5C76A] rounded-full text-xs border border-[#F5C76A]/30">
                      Medium
                    </span>
                  </td>
                  <td className="py-4 text-[#9AA0B3]">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.completed
                        ? 'bg-[#4CD7A5]/20 text-[#4CD7A5] border border-[#4CD7A5]/30'
                        : 'bg-[#3A3F4E]/20 text-[#9AA0B3] border border-[#9AA0B3]/30'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}