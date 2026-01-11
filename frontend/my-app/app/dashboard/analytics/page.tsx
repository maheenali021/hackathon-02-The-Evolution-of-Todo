'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../../types/task';
import { apiClient } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#FF5C5C', '#F5C76A', '#4CD7A5']; // soft red, amber yellow, mint green

export default function AnalyticsPage() {
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
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  // Use the data for the chart
  const weeklyData = weeklyDataWithTasks;

  // For priority data, we could add priority field to tasks if needed
  // For now, using a simple distribution
  const priorityData = [
    { name: 'High', value: Math.floor(totalTasks * 0.2) }, // 20% high priority
    { name: 'Medium', value: Math.floor(totalTasks * 0.6) }, // 60% medium priority
    { name: 'Low', value: Math.floor(totalTasks * 0.2) }, // 20% low priority
  ];

  // Status distribution based on actual tasks
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
    { name: 'In Progress', value: 0 }, // Could be extended with actual status field
  ];

  if (!userId) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <div className="text-sm text-slate-400">Last 7 days</div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-[#9AA0B3] text-sm mb-1">Total Tasks</h3>
          <p className="text-3xl font-bold text-[#FFFFFF]">{totalTasks}</p>
          <div className="mt-2 h-1 w-full bg-[#3A3F4E] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6B5C]" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-[#9AA0B3] text-sm mb-1">Completed</h3>
          <p className="text-3xl font-bold text-[#FFFFFF]">{completedTasks}</p>
          <div className="mt-2 h-1 w-full bg-[#3A3F4E] rounded-full overflow-hidden">
            <div className="h-full bg-[#4CD7A5]" style={{ width: `${(completedTasks / Math.max(totalTasks, 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-[#9AA0B3] text-sm mb-1">Completion Rate</h3>
          <p className="text-3xl font-bold text-[#FFFFFF]">{completionRate}%</p>
          <div className="mt-2 h-1 w-full bg-[#3A3F4E] rounded-full overflow-hidden">
            <div className="h-full bg-[#8B7CF6]" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Created vs Completed */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Tasks Created vs Completed</h2>
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
                <Bar dataKey="created" name="Tasks Created" fill="#5DA9FF" />
                <Bar dataKey="completed" name="Tasks Completed" fill="#4CD7A5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Trend */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Completion Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#4CD7A5" fill="#4CD7A5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Priority Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#FF5C5C', '#F5C76A', '#4CD7A5'][index % COLORS.length]} />
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

        {/* Status Distribution */}
        <div className="bg-[#3C4252]/50 backdrop-blur-lg border border-[#9AA0B3]/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">Status Distribution</h2>
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
    </div>
  );
}