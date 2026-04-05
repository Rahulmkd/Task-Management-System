'use client';

import { Task } from '@/types';
import { StatusBadge, PriorityBadge } from './Badges';
import { Pencil, Trash2, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={clsx(
      'card p-5 transition-all duration-200 hover:shadow-md group animate-slide-up',
      isCompleted && 'opacity-70'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            'font-medium text-sm leading-snug',
            isCompleted ? 'line-through text-ink-300' : 'text-ink-900'
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-ink-400 mt-1.5 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-3">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                <Calendar size={11} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onToggle(task)}
            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
            className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-emerald-600 transition-colors"
          >
            {isCompleted ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-accent transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
