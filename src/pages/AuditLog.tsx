import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Lock, Search, Download } from 'lucide-react';
import { useAuditLogs, useAuditLogStats } from '@/hooks/useAuditLog';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: auditData, isLoading: auditLoading, error: auditError } = useAuditLogs(
    { search: searchQuery },
    page,
    50
  );

  const { data: stats } = useAuditLogStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <History className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
            <p className="text-sm text-muted-foreground">Immutable, append-only system audit trail</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {auditError && <ErrorAlert error={auditError} title="Failed to load audit log" />}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-semibold">{stats?.total || auditData?.pagination.total || 0}</p>
              </div>
              <History className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-semibold">{stats?.today || 0}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{new Date().getDate()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-semibold">{stats?.this_week || 0}</p>
              </div>
              <History className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-semibold">{stats?.this_month || 0}</p>
              </div>
              <History className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Immutable Audit Rule</p>
              <p className="text-sm text-blue-600">
                This log is append-only. Entries cannot be edited or deleted. All sensitive actions are automatically logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">System Audit Trail</CardTitle>
              <CardDescription>Complete record of all system actions</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search audit log..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {auditLoading ? (
            <LoadingTable />
          ) : auditData?.data && auditData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditData.data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">{entry.created_at}</TableCell>
                      <TableCell className="font-medium">{entry.action}</TableCell>
                      <TableCell>{entry.actor_name || 'System'}</TableCell>
                      <TableCell><Badge variant="outline">{entry.entity_type}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{entry.entity_id || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{entry.reason || '-'}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{entry.ip_address || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={auditData.pagination.totalPages}
                total={auditData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No audit entries found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery ? "Try adjusting your search" : "No audit entries have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
