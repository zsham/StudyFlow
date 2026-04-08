import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, Tag, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task, TaskCategory } from '@/src/types';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '@/src/constants';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Study');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      dueDate: new Date(),
    });
    setNewTitle('');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-white border-zinc-200 focus:ring-indigo-500"
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Category</label>
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as TaskCategory)}>
                  <SelectTrigger className="bg-white border-zinc-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Priority</label>
                <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Task['priority'])}>
                  <SelectTrigger className="bg-white border-zinc-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`group flex items-center p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="mr-4 text-zinc-300 hover:text-indigo-600 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-indigo-50" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[task.category]}`}>
                    {task.category}
                  </span>
                  <span className={`flex items-center text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
                    <Flag className="w-3 h-3 mr-1 fill-current" />
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center text-[10px] text-zinc-400">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {format(task.dueDate, 'MMM d')}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-zinc-50/50 rounded-3xl border-2 border-dashed border-zinc-200">
            <p className="text-zinc-400 font-medium">No tasks yet. Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
