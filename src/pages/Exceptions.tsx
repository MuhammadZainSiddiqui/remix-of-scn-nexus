import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Plus, Search, ArrowUpRight } from 'lucide-react';
import { useExceptions, Exception } from '@/hooks/useExceptions';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';

export default function Exceptions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: exceptionsData, isLoading: exceptionsLoading, error: exceptionsError } = useExceptions(
    { search: searchQuery },
    page,
    10
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Exceptions & Escalations</h1>
          <p className="text-sm text-muted-foreground">Open exceptions and escalation ladder (Level 1-5)</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Log Exception
        </Button>
      </div>

      {exceptionsError && (
        <ErrorAlert error={exceptionsError} title="Failed to load exceptions" />
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Open Exceptions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exceptions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {exceptionsLoading ? (
            <LoadingTable />
          ) : exceptionsData?.data && exceptionsData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exception ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>SLA Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exceptionsData.data.map((exception) => (
                    <TableRow key={exception.id}>
                      <TableCell className="font-mono text-sm">{exception.exception_number}</TableCell>
                      <TableCell><Badge variant="outline">{exception.type}</Badge></TableCell>
                      <TableCell>
                        <Badge className={
                          exception.escalation_level >= 3 ? 'risk-tier1' :
                          exception.escalation_level === 2 ? 'risk-tier2' : 'risk-tier3'
                        }>L{exception.escalation_level}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{exception.title}</TableCell>
                      <TableCell className="text-sm">{exception.vertical_name}</TableCell>
                      <TableCell className="text-sm">{exception.assigned_to_name || 'Unassigned'}</TableCell>
                      <TableCell className="text-sm">{exception.sla_due_date}</TableCell>
                      <TableCell>
                        <Badge className={exception.status === 'resolved' ? 'status-approved' : 'status-pending'}>
                          {exception.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={exceptionsData.pagination.totalPages}
                total={exceptionsData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No exceptions found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery ? "Try adjusting your search" : "No open exceptions at this time"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
