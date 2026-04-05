import { TaskStatus, Priority } from '@/types';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

export function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === 'PENDING') {
    return (
      <span className="badge-pending">
        <Clock size={11} />
        Pending
      </span>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <span className="badge-in-progress">
        <Loader2 size={11} className="animate-spin" />
        In Progress
      </span>
    );
  }
  return (
    <span className="badge-completed">
      <CheckCircle2 size={11} />
      Completed
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'LOW') return <span className="badge-low">Low</span>;
  if (priority === 'HIGH') return <span className="badge-high">High</span>;
  return <span className="badge-medium">Medium</span>;
}
