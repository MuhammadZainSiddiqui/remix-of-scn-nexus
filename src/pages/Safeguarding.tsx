import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, Lock, Clock, AlertTriangle, Plus, Search } from 'lucide-react';
import { useSafeguardingCases, useSafeguardingStats } from '@/hooks/useSafeguarding';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';
import { useApp } from '@/contexts/AppContext';

export default function Safeguarding() {
  const { isRestrictedRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: casesData, isLoading: casesLoading, error: casesError } = useSafeguardingCases(
    { search: searchQuery },
    page,
    10
  );

  const { data: stats } = useSafeguardingStats();

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

      {casesError && <ErrorAlert error={casesError} title="Failed to load safeguarding cases" />}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-semibold">{stats?.active || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-semibold">{stats?.pending || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-semibold">{stats?.resolved || 0}</p>
              </div>
              <Lock className="w-8 h-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Breaches</p>
                <p className="text-2xl font-semibold">{stats?.sla_breaches || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
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
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Cases</CardTitle>
              <CardDescription>Case summaries are redacted for portal display</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {casesLoading ? (
            <LoadingTable />
          ) : casesData?.data && casesData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>SLA Deadline</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casesData.data.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono">{c.case_number}</TableCell>
                      <TableCell><Badge variant="outline">{c.case_type}</Badge></TableCell>
                      <TableCell>
                        <Badge className={
                          c.severity === 'critical' ? 'risk-tier1' :
                          c.severity === 'high' ? 'risk-tier2' : 'risk-tier3'
                        }>{c.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">{c.summary}</TableCell>
                      <TableCell>
                        <Badge className={c.status === 'active' ? 'status-restricted' : 'status-pending'}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="text-sm">{c.sla_due_date}</span>
                        </div>
                      </TableCell>
                      <TableCell>{c.assigned_to_name || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.notes_count} notes</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={casesData.pagination.totalPages}
                total={casesData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No safeguarding cases found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery ? "Try adjusting your search" : "No active cases at this time"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <p><strong>Audit Notice:</strong> Notes are append-only. Case closure requires approval and creates an immutable audit entry.</p>
      </div>
    </div>
  );
}
