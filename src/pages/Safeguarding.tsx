import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, Lock, Clock, AlertTriangle, FileText, Plus } from 'lucide-react';
import { safeguardingCases } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';

export default function Safeguarding() {
  const { isRestrictedRole } = useApp();

  if (!isRestrictedRole()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Restricted Access</h2>
            <p className="text-muted-foreground">
              This module contains sensitive safeguarding data. Access is restricted to Super Admin and Safeguarding Officers only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Safeguarding</h1>
            <p className="text-sm text-muted-foreground">Strictly restricted module - Audit logged</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Log New Case
        </Button>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              <strong>RESTRICTED:</strong> All access to this module is logged. Data shown is redacted. 
              Detailed information available only in secure case files.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Cases</CardTitle>
          <CardDescription>Case summaries are redacted for portal display</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Deadline</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeguardingCases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono">{c.id}</TableCell>
                  <TableCell className="text-muted-foreground">{c.summary}</TableCell>
                  <TableCell>
                    <Badge className={c.status === 'Active' ? 'status-restricted' : 'status-pending'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">{c.slaDeadline}</span>
                    </div>
                  </TableCell>
                  <TableCell>{c.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{c.notes} notes</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <p><strong>Audit Notice:</strong> Notes are append-only. Case closure requires approval and creates an immutable audit entry.</p>
      </div>
    </div>
  );
}
