import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { roles, verticals } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';
import { useUsers, useRoles, useCreateUser, useUpdateUser, useToggleUserStatus, useUserStats, User } from '@/hooks/useUsers';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { EmptyTable } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';

export default function UsersRoles() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isRestrictedRole } = useApp();
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers(
    { search: searchQuery },
    page,
    10
  );
  const { data: rolesData } = useRoles();
  const { data: stats } = useUserStats();
  
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const toggleStatusMutation = useToggleUserStatus();

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      await createUserMutation.mutateAsync({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role_id: formData.get('role') as string,
        vertical_id: formData.get('vertical') as string,
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: user.id,
        status: user.status === 'active' ? 'inactive' : 'active',
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const userStats = stats || {
    total: usersData?.pagination?.total || 0,
    active: 0,
    pending: 0,
    restricted: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user access, roles, and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign role permissions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Enter full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@scn.org" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rolesData || roles).map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vertical">Vertical</Label>
                <Select name="vertical" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    {verticals.map(vertical => (
                      <SelectItem key={vertical.id} value={vertical.id}>
                        {vertical.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isRestrictedRole() && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-destructive" />
                    <Label className="text-sm">Restricted Access</Label>
                  </div>
                  <Switch name="restricted_access" />
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {usersError && (
        <ErrorAlert error={usersError} title="Failed to load users" />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold mt-1">{userStats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold mt-1">{userStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Activation</p>
                <p className="text-2xl font-semibold mt-1">{userStats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Restricted Access</p>
                <p className="text-2xl font-semibold mt-1">{userStats.restricted}</p>
              </div>
              <Lock className="w-8 h-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <LoadingTable />
          ) : usersData?.data && usersData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Policy Ack</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role_name || user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.vertical_name}</TableCell>
                      <TableCell>
                        <Badge className={user.status === 'active' ? 'status-active' : 'status-pending'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.policy_ack ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_login || 'Never'}
                      </TableCell>
                      <TableCell>
                        {user.restricted_access && (
                          <Badge className="status-restricted gap-1">
                            <Lock className="w-3 h-3" />
                            Restricted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={usersData.pagination.totalPages}
                total={usersData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <EmptyTable
              title="No users found"
              description={searchQuery ? "Try adjusting your search" : "Add your first user to get started"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
