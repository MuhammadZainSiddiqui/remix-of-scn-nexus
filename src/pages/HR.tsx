import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, AlertTriangle, CheckCircle, Plus, Search } from 'lucide-react';
import { useStaff, useStaffStats, Staff } from '@/hooks/useStaff';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';

export default function HR() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: staffData, isLoading: staffLoading, error: staffError } = useStaff(
    { search: searchQuery },
    page,
    10
  );
  const { data: stats } = useStaffStats();

  const staffList = staffData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">HR (Staff)</h1>
          <p className="text-sm text-muted-foreground">Staff management, attendance, and contracts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {staffError && (
        <ErrorAlert error={staffError} title="Failed to load staff" />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.total || staffData?.pagination.total || 0}</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.active || 0}</p>
                <p className="text-sm text-muted-foreground">Active Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.burnout_risk || 0}</p>
                <p className="text-sm text-muted-foreground">Burnout Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats?.contract_expiry || 0}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Burnout Alert */}
      {(stats?.burnout_risk || 0) > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Burnout Alert:</strong> {stats.burnout_risk} staff member(s) are at burnout risk based on overtime hours and workload.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Directory */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Staff Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staffLoading ? (
            <LoadingTable />
          ) : staffList.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Burnout Risk</TableHead>
                    <TableHead>Contract End</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell><Badge variant="outline">{staff.department}</Badge></TableCell>
                      <TableCell className="text-sm">{staff.vertical_name}</TableCell>
                      <TableCell>
                        <Badge className={staff.status === 'active' ? 'status-active' : 'status-pending'}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {staff.burnout_level === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : staff.burnout_level === 'medium' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className="text-xs text-muted-foreground capitalize">{staff.burnout_level || 'low'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{staff.contract_end || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={staffData.pagination.totalPages}
                total={staffData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No staff found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery ? "Try adjusting your search" : "Add your first staff member to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
