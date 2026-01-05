import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Heart, Shield, Clock, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { useVolunteers, useVolunteerStats, useCreateVolunteer, Volunteer } from '@/hooks/useVolunteers';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { EmptyTable } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';

export default function Volunteers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: volunteersData, isLoading: volunteersLoading, error: volunteersError } = useVolunteers(
    { search: searchQuery },
    page,
    10
  );
  const { data: stats } = useVolunteerStats();
  const createVolunteerMutation = useCreateVolunteer();

  const handleRegisterVolunteer = () => {
    toast({
      title: "Register Volunteer",
      description: "Opening volunteer registration form...",
    });
  };

  const volunteerStats = stats || {
    total: 0,
    fully_trained: 0,
    total_hours: 0,
    insurance_expired: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Volunteers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage volunteer tiers, training, accreditation, and insurance
          </p>
        </div>
        <Button className="gap-2" onClick={handleRegisterVolunteer}>
          <Plus className="w-4 h-4" />
          Register Volunteer
        </Button>
      </div>

      {volunteersError && (
        <ErrorAlert error={volunteersError} title="Failed to load volunteers" />
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{volunteerStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{volunteerStats.fully_trained}</p>
                <p className="text-sm text-muted-foreground">Fully Trained</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{volunteerStats.total_hours}</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
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
                <p className="text-2xl font-semibold">{volunteerStats.insurance_expired}</p>
                <p className="text-sm text-muted-foreground">Insurance Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Expiry Warning */}
      {volunteerStats.insurance_expired > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Auto-Lock Triggered</p>
                <p className="text-sm text-red-600">
                  {volunteerStats.insurance_expired} volunteer(s) have been auto-locked due to expired insurance. 
                  Access will be restored upon insurance renewal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tier Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Volunteer Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-600">Tier 1</Badge>
                <span className="text-sm font-medium">Full Access</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Direct beneficiary contact, unsupervised work, child protection trained
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600">Tier 2</Badge>
                <span className="text-sm font-medium">Supervised Access</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Limited beneficiary contact, requires supervision, basic training complete
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-slate-600">Tier 3</Badge>
                <span className="text-sm font-medium">Admin Only</span>
              </div>
              <p className="text-xs text-muted-foreground">
                No beneficiary contact, administrative tasks only, orientation complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Volunteers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {volunteersLoading ? (
            <LoadingTable />
          ) : volunteersData?.data && volunteersData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Accreditation</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteersData.data.map((volunteer) => (
                    <TableRow key={volunteer.id} className={!volunteer.insurance_valid ? 'bg-red-50/50' : ''}>
                      <TableCell className="font-medium">{volunteer.name}</TableCell>
                      <TableCell>
                        <Badge className={
                          volunteer.tier === 'Tier 1' ? 'bg-emerald-600' :
                          volunteer.tier === 'Tier 2' ? 'bg-blue-600' : 'bg-slate-600'
                        }>
                          {volunteer.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{volunteer.vertical_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {volunteer.training_status === 'complete' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="text-sm capitalize">{volunteer.training_status?.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{volunteer.accreditation || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {volunteer.insurance_valid ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs text-muted-foreground">
                                Exp: {volunteer.insurance_expiry || 'N/A'}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600 font-medium">EXPIRED</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{volunteer.hours_contributed}</TableCell>
                      <TableCell>
                        <Badge className={
                          volunteer.status === 'active' ? 'status-active' : 'status-restricted'
                        }>
                          {volunteer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={volunteersData.pagination.totalPages}
                total={volunteersData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <EmptyTable
              title="No volunteers found"
              description={searchQuery ? "Try adjusting your search" : "Register your first volunteer to get started"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
