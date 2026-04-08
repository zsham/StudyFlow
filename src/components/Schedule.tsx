import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleItem } from '@/src/types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface ScheduleProps {
  items: ScheduleItem[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Schedule({ items }: ScheduleProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="border-bottom border-zinc-100 bg-zinc-50/50">
        <CardTitle className="text-xl font-semibold tracking-tight">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b border-zinc-100">
          {DAYS.map((day, i) => {
            const date = addDays(weekStart, i);
            const isToday = isSameDay(date, today);
            return (
              <div key={day} className={`p-4 text-center border-r border-zinc-100 last:border-r-0 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">{day}</span>
                <span className={`text-lg font-semibold ${isToday ? 'text-indigo-600' : 'text-zinc-900'}`}>{format(date, 'd')}</span>
              </div>
            );
          })}
        </div>
        
        <div className="divide-y divide-zinc-100">
          {items.length > 0 ? (
            items.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item) => (
              <div key={item.id} className="flex items-center p-4 hover:bg-zinc-50/50 transition-colors">
                <div className="w-20 flex-shrink-0">
                  <span className="text-xs font-mono font-medium text-zinc-500">{item.startTime}</span>
                  <div className="h-4 border-l-2 border-zinc-100 ml-2 my-1" />
                  <span className="text-xs font-mono font-medium text-zinc-300">{item.endTime}</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className={`p-3 rounded-xl border-l-4 ${item.color} bg-opacity-10`}>
                    <h4 className="font-semibold text-sm text-zinc-900">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider font-medium">
                      {DAYS[item.dayOfWeek]} • {item.startTime} - {item.endTime}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-400">
              <p>No classes or events scheduled.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
