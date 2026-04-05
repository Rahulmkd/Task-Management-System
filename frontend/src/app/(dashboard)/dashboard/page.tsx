'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Loader2, ListTodo, ArrowRight, Plus } from 'lucide-react';
import { taskService } from '@/lib/tasks';
import { Task } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge, PriorityBadge } from '@/components/tasks/Badges';

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export default function DashboardPage() {
  const { user, initialize } = useAuthStore();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [all, pending, inProgress, completed] = await Promise.all([
          taskService.getTasks({ limit: 5 }),
          taskService.getTasks({ status: 'PENDING', limit: 1 }),
          taskService.getTasks({ status: 'IN_PROGRESS', limit: 1 }),
          taskService.getTasks({ status: 'COMPLETED', limit: 1 }),
        ]);
        setStats({
          total: all.pagination.total,
          pending: pending.pagination.total,
          inProgress: inProgress.pagination.total,
          completed: completed.pagination.total,
        });
        setRecentTasks(all.tasks);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'text-ink-600', bg: 'bg-ink-100' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Good {getGreeting()},{' '}
            <span className="text-accent">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-ink-400 text-sm mt-1">Here's a summary of your work</p>
        </div>
        <Link href="/dashboard/tasks/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Task
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-bold text-ink-900">{loading ? '—' : value}</div>
            <div className="text-xs text-ink-400 font-medium mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="font-semibold text-ink-900">Recent Tasks</h2>
          <Link href="/dashboard/tasks" className="text-accent text-sm font-medium hover:text-accent-dark flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-6 h-6 border-2 border-ink-200 border-t-accent rounded-full animate-spin" />
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-12">
            <ListTodo size={40} className="text-ink-200 mx-auto mb-3" />
            <p className="text-ink-400 text-sm">No tasks yet.</p>
            <Link href="/dashboard/tasks/new" className="btn-primary inline-flex items-center gap-2 mt-4">
              <Plus size={14} /> Create your first task
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-ink-50">
            {recentTasks.map((task) => (
              <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-ink-50/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'line-through text-ink-300' : 'text-ink-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
