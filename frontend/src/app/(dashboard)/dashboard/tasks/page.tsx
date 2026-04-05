'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, SlidersHorizontal, ListTodo, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Task, TaskFilters, Pagination } from '@/types';
import { taskService } from '@/lib/tasks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskFormModal from '@/components/tasks/TaskFormModal';
import DeleteConfirmModal from '@/components/tasks/DeleteConfirmModal';
import { AxiosError } from 'axios';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 9 });
  const [searchInput, setSearchInput] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreate = async (data: {
    title: string; description: string; status: string; priority: string; dueDate: string;
  }) => {
    setActionLoading(true);
    try {
      await taskService.createTask({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      });
      toast.success('Task created!');
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: {
    title: string; description: string; status: string; priority: string; dueDate: string;
  }) => {
    if (!editingTask) return;
    setActionLoading(true);
    try {
      await taskService.updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
      });
      toast.success('Task updated!');
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setActionLoading(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      toast.success('Task deleted');
      setDeletingTask(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const res = await taskService.toggleTask(task.id);
      toast.success(res.message);
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">My Tasks</h1>
          <p className="text-ink-400 text-sm mt-0.5">
            {pagination ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-ink-400" />
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as typeof filters.status, page: 1 }))}
            className="w-auto pr-8"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value as typeof filters.priority, page: 1 }))}
          className="w-auto pr-8"
        >
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="w-8 h-8 border-2 border-ink-200 border-t-accent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-24">
          <ListTodo size={48} className="text-ink-200 mx-auto mb-4" />
          <h3 className="font-semibold text-ink-500 mb-1">No tasks found</h3>
          <p className="text-ink-300 text-sm mb-6">
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {!filters.search && !filters.status && !filters.priority && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus size={14} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-400">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className="btn-secondary flex items-center gap-1 px-3"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary flex items-center gap-1 px-3"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <TaskFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          loading={actionLoading}
        />
      )}
      {editingTask && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdate}
          loading={actionLoading}
        />
      )}
      {deletingTask && (
        <DeleteConfirmModal
          taskTitle={deletingTask.title}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
