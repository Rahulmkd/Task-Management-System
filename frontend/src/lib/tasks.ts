import api from './api';
import { Task, TaskFilters, TasksResponse } from '@/types';

export const taskService = {
  getTasks: async (filters: TaskFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);

    const res = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return res.data;
  },

  getTask: async (id: string) => {
    const res = await api.get<{ task: Task }>(`/tasks/${id}`);
    return res.data.task;
  },

  createTask: async (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }) => {
    const res = await api.post<{ task: Task; message: string }>('/tasks', data);
    return res.data;
  },

  updateTask: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      dueDate: string | null;
    }>
  ) => {
    const res = await api.patch<{ task: Task; message: string }>(`/tasks/${id}`, data);
    return res.data;
  },

  deleteTask: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/tasks/${id}`);
    return res.data;
  },

  toggleTask: async (id: string) => {
    const res = await api.post<{ task: Task; message: string }>(`/tasks/${id}/toggle`);
    return res.data;
  },
};
