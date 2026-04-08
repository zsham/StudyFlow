export type TaskCategory = 'Study' | 'Personal' | 'Project' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  dueDate?: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export interface StudySession {
  id: string;
  taskId?: string;
  duration: number; // in minutes
  timestamp: Date;
  type: 'focus' | 'short-break' | 'long-break';
}

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  dayOfWeek: number; // 0-6
  color: string;
}
