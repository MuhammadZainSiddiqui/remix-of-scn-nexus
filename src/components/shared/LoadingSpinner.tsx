import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="h-4 bg-muted rounded flex-1" />
            <div className="h-4 bg-muted rounded flex-1" />
            <div className="h-4 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-muted rounded w-32" />
          <div className="h-9 bg-muted rounded w-32" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 bg-muted rounded w-24 mb-4" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
