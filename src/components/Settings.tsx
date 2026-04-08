import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TimerSettings, ScheduleItem } from '@/src/types';
import { Timer, Calendar, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsProps {
  timerSettings: TimerSettings;
  onUpdateTimerSettings: (settings: TimerSettings) => void;
  schedule: ScheduleItem[];
  onAddScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  onDeleteScheduleItem: (id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = [
  { label: 'Blue', value: 'border-blue-500' },
  { label: 'Purple', value: 'border-purple-500' },
  { label: 'Emerald', value: 'border-emerald-500' },
  { label: 'Amber', value: 'border-amber-500' },
  { label: 'Rose', value: 'border-rose-500' },
  { label: 'Indigo', value: 'border-indigo-500' },
];

export function Settings({ 
  timerSettings, 
  onUpdateTimerSettings, 
  schedule, 
  onAddScheduleItem, 
  onDeleteScheduleItem 
}: SettingsProps) {
  const [localTimer, setLocalTimer] = useState(timerSettings);
  const [newItem, setNewItem] = useState<Omit<ScheduleItem, 'id'>>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek: 0,
    color: 'border-blue-500',
  });

  const handleSaveTimer = () => {
    onUpdateTimerSettings(localTimer);
    toast.success('Timer settings updated');
  };

  const handleAddSchedule = () => {
    if (!newItem.title.trim()) {
      toast.error('Please enter a title for the schedule item');
      return;
    }
    onAddScheduleItem(newItem);
    setNewItem({ ...newItem, title: '' });
    toast.success('Schedule item added');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Timer Settings */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600" />
            Timer Configuration
          </CardTitle>
          <CardDescription>Customize your focus and break durations (in minutes).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Duration</Label>
              <Input
                id="focus"
                type="number"
                value={localTimer.focus}
                onChange={(e) => setLocalTimer({ ...localTimer, focus: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreak">Short Break</Label>
              <Input
                id="shortBreak"
                type="number"
                value={localTimer.shortBreak}
                onChange={(e) => setLocalTimer({ ...localTimer, shortBreak: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreak">Long Break</Label>
              <Input
                id="longBreak"
                type="number"
                value={localTimer.longBreak}
                onChange={(e) => setLocalTimer({ ...localTimer, longBreak: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={handleSaveTimer} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" />
            Save Timer Settings
          </Button>
        </CardContent>
      </Card>

      {/* Schedule Management */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Schedule Management
          </CardTitle>
          <CardDescription>Add your classes, lectures, or study blocks to the weekly view.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Add Form */}
          <div className="p-6 bg-zinc-50 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="e.g. Advanced Calculus" 
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select 
                  value={newItem.dayOfWeek.toString()} 
                  onValueChange={(v) => setNewItem({ ...newItem, dayOfWeek: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, i) => (
                      <SelectItem key={day} value={i.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select 
                  value={newItem.color} 
                  onValueChange={(v) => setNewItem({ ...newItem, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={newItem.startTime}
                  onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={newItem.endTime}
                  onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddSchedule} className="w-full bg-zinc-900 hover:bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* List of Items */}
          <div className="space-y-3">
            <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Current Schedule Items</Label>
            {schedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-10 rounded-full ${item.color.replace('border-', 'bg-')}`} />
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-zinc-500">
                      {DAYS[item.dayOfWeek]} • {item.startTime} - {item.endTime}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDeleteScheduleItem(item.id)}
                  className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {schedule.length === 0 && (
              <p className="text-center py-8 text-zinc-400 text-sm italic">No schedule items yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
