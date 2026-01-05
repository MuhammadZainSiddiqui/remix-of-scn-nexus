import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon || <Inbox className="w-12 h-12 text-muted-foreground/50 mb-4" />}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

export function EmptyTable({ title = 'No data found', description, action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="w-12 h-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

export function EmptyList({ title = 'No items', description, action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
      <h4 className="font-medium text-foreground mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
