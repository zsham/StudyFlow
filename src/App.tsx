import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Timer, ListTodo, CalendarDays, Settings as SettingsIcon, Bell, Search, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from './components/Dashboard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { Schedule } from './components/Schedule';
import { Settings } from './components/Settings';
import { Task, StudySession, ScheduleItem, TimerSettings } from './types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Finish Math Homework', category: 'Study', priority: 'high', completed: false, dueDate: new Date() },
  { id: '2', title: 'Read Chapter 4 of History', category: 'Study', priority: 'medium', completed: true, dueDate: new Date() },
  { id: '3', title: 'Buy groceries', category: 'Personal', priority: 'low', completed: false, dueDate: new Date() },
];

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: '1', title: 'Mathematics 101', startTime: '09:00', endTime: '10:30', dayOfWeek: 0, color: 'border-blue-500' },
  { id: '2', title: 'History of Art', startTime: '11:00', endTime: '12:30', dayOfWeek: 0, color: 'border-purple-500' },
  { id: '3', title: 'Computer Science Lab', startTime: '14:00', endTime: '16:00', dayOfWeek: 1, color: 'border-emerald-500' },
  { id: '4', title: 'Physics Lecture', startTime: '10:00', endTime: '11:30', dayOfWeek: 2, color: 'border-amber-500' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setTasks([...tasks, task]);
    toast.success('Task added successfully');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.info('Task deleted');
  };

  const handleSessionComplete = (type: StudySession['type'], duration: number) => {
    const newSession: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      duration,
      timestamp: new Date(),
    };
    setSessions([...sessions, newSession]);
  };

  const handleAddScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSchedule([...schedule, newItem]);
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-right" />
      
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-zinc-100 flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Timer className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight text-zinc-900">StudyFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'focus', label: 'Focus Mode', icon: Timer },
            { id: 'tasks', label: 'Tasks', icon: ListTodo },
            { id: 'schedule', label: 'Schedule', icon: CalendarDays },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-indigo-600' : ''}`} />
              <span className="hidden md:block font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="hidden md:block font-medium">Settings</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-3 mt-2">
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-zinc-900">Alex Student</p>
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 md:ml-64 p-4 md:p-10 max-w-6xl mx-auto min-h-screen">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              {activeTab === 'dashboard' && 'Welcome back, Alex'}
              {activeTab === 'focus' && 'Focus Session'}
              {activeTab === 'tasks' && 'My Tasks'}
              {activeTab === 'schedule' && 'Weekly Schedule'}
              {activeTab === 'settings' && 'Study Flow Setup'}
            </h1>
            <p className="text-zinc-500 mt-1 font-medium">
              {activeTab === 'dashboard' && "Here's what's happening today."}
              {activeTab === 'focus' && 'Stay focused and productive.'}
              {activeTab === 'tasks' && 'Organize your academic life.'}
              {activeTab === 'schedule' && 'Never miss a lecture.'}
              {activeTab === 'settings' && 'Customize your study environment.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <button className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard tasks={tasks} sessions={sessions} />}
            {activeTab === 'focus' && <PomodoroTimer onSessionComplete={handleSessionComplete} settings={timerSettings} />}
            {activeTab === 'tasks' && (
              <TaskList 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onToggleTask={handleToggleTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
            {activeTab === 'schedule' && <Schedule items={schedule} />}
            {activeTab === 'settings' && (
              <Settings 
                timerSettings={timerSettings}
                onUpdateTimerSettings={setTimerSettings}
                schedule={schedule}
                onAddScheduleItem={handleAddScheduleItem}
                onDeleteScheduleItem={handleDeleteScheduleItem}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background Accents */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-50 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-40 -translate-x-1/4 translate-y-1/4" />
    </div>
  );
}
