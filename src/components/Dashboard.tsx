import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, StudySession } from '@/src/types';
import { Brain, CheckCircle2, Clock, Flame, Target, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'motion/react';

interface DashboardProps {
  tasks: Task[];
  sessions: StudySession[];
}

export function Dashboard({ tasks, sessions }: DashboardProps) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalFocusMinutes = sessions
    .filter(s => s.type === 'focus')
    .reduce((acc, s) => acc + s.duration, 0);
  
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;

  const todaySessions = sessions.filter(s => 
    new Date(s.timestamp).toDateString() === new Date().toDateString()
  );
  const todayFocusMinutes = todaySessions
    .filter(s => s.type === 'focus')
    .reduce((acc, s) => acc + s.duration, 0);

  const stats = [
    {
      label: 'Focus Time',
      value: `${hours}h ${minutes}m`,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Tasks Done',
      value: `${completedTasks}/${totalTasks}`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Today Focus',
      value: `${todayFocusMinutes}m`,
      icon: Flame,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Efficiency',
      value: '84%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-default overflow-hidden group">
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1 tracking-tight">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-600" />
              Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-500">Completion Rate</span>
                <span className="text-zinc-900">{Math.round(taskProgress)}%</span>
              </div>
              <Progress value={taskProgress} className="h-3 bg-zinc-100" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{totalTasks - completedTasks}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{completedTasks}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.slice(-4).reverse().map((session, i) => (
                <div key={session.id} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      session.type === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 capitalize">{session.type} Session</p>
                      <p className="text-[10px] text-zinc-400">{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-medium text-zinc-600">+{session.duration}m</span>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-center py-8 text-zinc-400 text-sm italic">No sessions recorded today.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
