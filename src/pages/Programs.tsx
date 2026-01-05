import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Plus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useKPIs } from '@/hooks/usePrograms';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: kpisData, isLoading: kpisLoading, error: kpisError } = useKPIs(
    { search: searchQuery },
    page,
    20
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Programs & MEL</h1>
          <p className="text-sm text-muted-foreground">KPIs, outcomes tracking, and corrective actions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add KPI
        </Button>
      </div>

      {kpisError && (
        <ErrorAlert error={kpisError} title="Failed to load KPIs" />
      )}

      {/* KPI Summary Cards */}
      {kpisLoading ? (
        <LoadingSpinner />
      ) : kpisData?.data && kpisData.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            {kpisData.data.slice(0, 6).map((kpi) => (
              <Card key={kpi.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{kpi.program_name}</CardTitle>
                    <Badge className={
                      kpi.status === 'exceeded' ? 'status-approved' :
                      kpi.status === 'on_track' ? 'status-active' : 'status-pending'
                    }>{kpi.status.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{kpi.indicator}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-semibold">{kpi.actual}</span>
                    <span className="text-sm text-muted-foreground">/ {kpi.target} {kpi.unit}</span>
                  </div>
                  <Progress value={(kpi.actual / kpi.target) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{kpi.vertical_name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed KPI Table */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">All KPIs</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search KPIs..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Indicator</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vertical</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpisData.data.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.program_name}</TableCell>
                      <TableCell>{kpi.indicator}</TableCell>
                      <TableCell>{kpi.target} {kpi.unit}</TableCell>
                      <TableCell className="font-semibold">{kpi.actual}</TableCell>
                      <TableCell className="w-32">
                        <Progress value={(kpi.actual / kpi.target) * 100} className="h-2" />
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          kpi.status === 'exceeded' ? 'status-approved' :
                          kpi.status === 'on_track' ? 'status-active' : 'status-pending'
                        }>
                          {kpi.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{kpi.vertical_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={kpisData.pagination.totalPages}
                total={kpisData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No KPIs found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            {searchQuery ? "Try adjusting your search" : "Add your first KPI to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
