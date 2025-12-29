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
import { donations } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donorSafeView, setDonorSafeView] = useState(false);
  const { currentRole } = useApp();

  // Force donor-safe view for donor role
  const effectiveDonorSafe = currentRole.id === 'donor' ? true : donorSafeView;

  const filteredDonations = donations.filter(d =>
    d.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Donor</Label>
                  <Input placeholder="Select or enter donor name" />
                </div>
                <div className="space-y-2">
                  <Label>Amount (PKR)</Label>
                  <Input type="number" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <Label>Fund Type</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Unrestricted</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Restricted</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Zakat</Badge>
                  </div>
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
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Record Donation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                <p className="text-2xl font-semibold">PKR 1.62M</p>
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
                <p className="text-2xl font-semibold">4</p>
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
                <p className="text-2xl font-semibold">1</p>
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
                <p className="text-2xl font-semibold">4</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Fund Type</TableHead>
                <TableHead>Vertical</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-mono text-sm">{donation.id}</TableCell>
                  <TableCell className="font-medium">
                    {effectiveDonorSafe && donation.donor.includes('Individual') 
                      ? '[ANONYMIZED]' 
                      : donation.donor}
                  </TableCell>
                  <TableCell>PKR {donation.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      donation.type === 'Zakat' ? 'border-purple-300 text-purple-700' :
                      donation.type === 'Restricted' ? 'border-amber-300 text-amber-700' :
                      'border-emerald-300 text-emerald-700'
                    }>
                      {donation.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{donation.fundType}</TableCell>
                  <TableCell className="text-sm">{donation.vertical}</TableCell>
                  <TableCell>
                    <Badge className={donation.status === 'Allocated' ? 'status-approved' : 'status-pending'}>
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <FileText className="w-3 h-3" />
                      {donation.receiptNo}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
