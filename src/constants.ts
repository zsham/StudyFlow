export const TIMER_MODES = {
  FOCUS: {
    label: 'Focus',
    duration: 25 * 60,
    color: 'bg-indigo-600',
    accent: 'text-indigo-600',
  },
  SHORT_BREAK: {
    label: 'Short Break',
    duration: 5 * 60,
    color: 'bg-emerald-600',
    accent: 'text-emerald-600',
  },
  LONG_BREAK: {
    label: 'Long Break',
    duration: 15 * 60,
    color: 'bg-amber-600',
    accent: 'text-amber-600',
  },
} as const;

export const CATEGORY_COLORS = {
  Study: 'bg-blue-100 text-blue-700 border-blue-200',
  Personal: 'bg-purple-100 text-purple-700 border-purple-200',
  Project: 'bg-orange-100 text-orange-700 border-orange-200',
  Other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-amber-500',
  high: 'text-rose-500',
};
