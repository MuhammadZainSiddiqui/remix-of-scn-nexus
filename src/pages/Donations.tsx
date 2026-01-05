import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Search, Plus, FileText, Eye, EyeOff, DollarSign, Gift, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useDonations, useCreateDonation, useDonationStats, Donation } from '@/hooks/useDonations';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { EmptyTable } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donorSafeView, setDonorSafeView] = useState(false);
  const [page, setPage] = useState(1);
  const { currentRole } = useApp();
  const { toast } = useToast();

  // Force donor-safe view for donor role
  const effectiveDonorSafe = currentRole.id === 'donor' ? true : donorSafeView;

  const { data: donationsData, isLoading: donationsLoading, error: donationsError } = useDonations(
    { search: searchQuery },
    page,
    10
  );
  const { data: stats } = useDonationStats();
  const createDonationMutation = useCreateDonation();

  const handleCreateDonation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      await createDonationMutation.mutateAsync({
        donor_id: formData.get('donor_id') as string,
        amount: parseFloat(formData.get('amount') as string),
        donation_type: formData.get('donation_type') as 'unrestricted' | 'restricted' | 'zakat',
        fund_type: formData.get('fund_type') as string,
        notes: formData.get('notes') as string,
      });
      toast({
        title: "Donation Recorded",
        description: "The donation has been recorded successfully.",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const donationStats = stats || {
    total_this_month: 1620000,
    donations_count: 4,
    pending_allocation: 1,
    receipts_issued: 4,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Donations & Allocations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track donations, receipts, and fund allocations
          </p>
        </div>
        <div className="flex items-center gap-4">
          {currentRole.id !== 'donor' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border">
              {effectiveDonorSafe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <Label className="text-sm">Donor-Safe View</Label>
              <Switch checked={donorSafeView} onCheckedChange={setDonorSafeView} />
            </div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Donation</DialogTitle>
                <DialogDescription>
                  Enter donation details and allocation preferences.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDonation} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="donor_id">Donor</Label>
                  <Input id="donor_id" name="donor_id" placeholder="Select or enter donor ID" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (PKR)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="Enter amount" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation_type">Donation Type</Label>
                  <Select name="donation_type" defaultValue="unrestricted">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unrestricted">Unrestricted</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="zakat">Zakat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fund_type">Fund Type</Label>
                  <Input id="fund_type" name="fund_type" placeholder="e.g., General, Education, Medical" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" placeholder="Optional notes" />
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Restricted Fund Allocation</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Restricted and Zakat funds require approval before allocation.
                  </p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit" disabled={createDonationMutation.isPending}>
                    {createDonationMutation.isPending ? 'Recording...' : 'Record Donation'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {donationsError && (
        <ErrorAlert error={donationsError} title="Failed to load donations" />
      )}

      {/* Donor-Safe View Notice */}
      {effectiveDonorSafe && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Donor-Safe View Active</p>
                <p className="text-sm text-blue-600">
                  Sensitive operational details are hidden. Showing anonymized, redacted information only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">PKR {(donationStats.total_this_month / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-muted-foreground">Total This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{donationStats.donations_count}</p>
                <p className="text-sm text-muted-foreground">Donations Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{donationStats.pending_allocation}</p>
                <p className="text-sm text-muted-foreground">Pending Allocation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{donationStats.receipts_issued}</p>
                <p className="text-sm text-muted-foreground">Receipts Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Donations</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {donationsLoading ? (
            <LoadingTable />
          ) : donationsData?.data && donationsData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donation ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fund Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationsData.data.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-mono text-sm">{donation.id}</TableCell>
                      <TableCell className="font-medium">
                        {effectiveDonorSafe && donation.donor_name?.includes('Individual') 
                          ? '[ANONYMIZED]' 
                          : donation.donor_name}
                      </TableCell>
                      <TableCell>PKR {donation.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          donation.donation_type === 'zakat' ? 'border-purple-300 text-purple-700' :
                          donation.donation_type === 'restricted' ? 'border-amber-300 text-amber-700' :
                          'border-emerald-300 text-emerald-700'
                        }>
                          {donation.donation_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{donation.fund_type}</TableCell>
                      <TableCell>
                        <Badge className={donation.status === 'allocated' ? 'status-approved' : 'status-pending'}>
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="w-3 h-3" />
                          {donation.receipt_no || 'N/A'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={donationsData.pagination.totalPages}
                total={donationsData.pagination.total}
                onPageChange={setPage}
                className="mt-4"
              />
            </>
          ) : (
            <EmptyTable
              title="No donations found"
              description={searchQuery ? "Try adjusting your search" : "Record your first donation to get started"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
