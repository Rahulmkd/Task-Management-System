'use client';

import { Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ taskTitle, onConfirm, onClose, loading }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="card w-full max-w-sm animate-slide-up p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>
        <h3 className="font-semibold text-ink-900 mb-2">Delete task?</h3>
        <p className="text-sm text-ink-400 mb-6">
          <span className="font-medium text-ink-600">&ldquo;{taskTitle}&rdquo;</span> will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 active:scale-95 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
