import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/errorHandler';

interface ErrorAlertProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({ error, title = 'Error', onRetry, className = '' }: ErrorAlertProps) {
  const message = handleApiError(error);

  return (
    <div className={`rounded-lg border border-destructive/20 bg-destructive/10 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-destructive">{title}</p>
          <p className="text-sm text-destructive/80 mt-1">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorPageProps {
  error: unknown;
  title?: string;
}

export function ErrorPage({ error, title = 'Something went wrong' }: ErrorPageProps) {
  const message = handleApiError(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <AlertCircle className="w-16 h-16 text-destructive/50 mb-4" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </Button>
    </div>
  );
}
