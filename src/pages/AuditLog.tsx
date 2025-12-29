import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Lock, Info } from 'lucide-react';
import { auditLog } from '@/lib/mockData';

export default function AuditLog() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <History className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground">Immutable, append-only system audit trail</p>
        </div>
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
        <CardHeader>
          <CardTitle className="text-lg">System Audit Trail</CardTitle>
          <CardDescription>Complete record of all system actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                  <TableCell className="font-medium">{entry.action}</TableCell>
                  <TableCell>{entry.actor}</TableCell>
                  <TableCell><Badge variant="outline">{entry.module}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{entry.reference}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
