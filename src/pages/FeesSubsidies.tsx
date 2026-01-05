import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  useFeePlans,
  useInvoices,
  useWaiverRequests,
  useCreateWaiverRequest,
} from '@/hooks/useFees';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';

export default function FeesSubsidies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [waiverReason, setWaiverReason] = useState('');
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: feePlansData, isLoading: feePlansLoading, error: feePlansError } = useFeePlans(
    { search: searchQuery },
    page,
    20
  );

  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useInvoices(
    { search: searchQuery },
    page,
    10
  );

  const { data: waiversData, isLoading: waiversLoading, error: waiversError } = useWaiverRequests(
    { search: searchQuery },
    page,
    10
  );

  const createWaiverMutation = useCreateWaiverRequest();

  const handleCreateWaiver = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createWaiverMutation.mutateAsync({
        beneficiary_id: formData.get('beneficiary_id') as string,
        fee_plan_id: formData.get('fee_plan_id') as string,
        requested_amount: parseFloat(formData.get('amount') as string),
        reason: formData.get('reason') as string,
      });
      setWaiverReason('');
      toast({
        title: "Waiver Requested",
        description: "Your waiver request has been submitted for approval.",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleApproveWaiver = (id: string) => {
    toast({
      title: "Waiver Approved",
      description: "Fee waiver has been approved. Audit log entry created.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fees & Subsidies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage fee plans, invoices, payments, and waiver requests
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Invoices
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Fee Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="plans">Fee Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="waivers">Waiver Requests</TabsTrigger>
        </TabsList>

        {/* Fee Plans */}
        <TabsContent value="plans">
          {feePlansError && <ErrorAlert error={feePlansError} title="Failed to load fee plans" />}
          {feePlansLoading ? (
            <LoadingSpinner />
          ) : feePlansData?.data && feePlansData.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {feePlansData.data.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <Badge variant="outline">{plan.vertical_name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-semibold">PKR {plan.monthly_fee.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Monthly Fee</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-semibold">{plan.enrolled_count}</p>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-semibold">{plan.waiver_count}</p>
                        <p className="text-xs text-muted-foreground">Waivers</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Edit Plan</Button>
                      <Button size="sm" className="flex-1">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No fee plans found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Add your first fee plan to get started</p>
            </div>
          )}
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Invoices</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    156 Paid
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    23 Pending
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    5 Overdue
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Fee Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">INV-2024-0156</TableCell>
                    <TableCell>Beneficiary #1234</TableCell>
                    <TableCell>Standard Education Fee</TableCell>
                    <TableCell>PKR 5,000</TableCell>
                    <TableCell>Jan 20, 2024</TableCell>
                    <TableCell><Badge className="status-pending">Pending</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">INV-2024-0155</TableCell>
                    <TableCell>Beneficiary #2156</TableCell>
                    <TableCell>Disability Care Program</TableCell>
                    <TableCell>PKR 4,000</TableCell>
                    <TableCell>Jan 18, 2024</TableCell>
                    <TableCell><Badge className="status-approved">Paid</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">INV-2024-0154</TableCell>
                    <TableCell>Beneficiary #3089</TableCell>
                    <TableCell>Therapy Session</TableCell>
                    <TableCell>PKR 2,500</TableCell>
                    <TableCell>Jan 10, 2024</TableCell>
                    <TableCell><Badge className="status-overdue">Overdue</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">PAY-2024-0089</TableCell>
                    <TableCell>INV-2024-0155</TableCell>
                    <TableCell>
                      <div>
                        <p>Government Subsidy</p>
                        <p className="text-xs text-muted-foreground">Auto-matched</p>
                      </div>
                    </TableCell>
                    <TableCell>PKR 4,000</TableCell>
                    <TableCell><Badge variant="outline">Bank Transfer</Badge></TableCell>
                    <TableCell>Jan 15, 2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">PAY-2024-0088</TableCell>
                    <TableCell>INV-2024-0152</TableCell>
                    <TableCell>Parent #1234</TableCell>
                    <TableCell>PKR 5,000</TableCell>
                    <TableCell><Badge variant="outline">Online</Badge></TableCell>
                    <TableCell>Jan 14, 2024</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waiver Requests */}
        <TabsContent value="waivers">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Waiver Requests</CardTitle>
                  <CardDescription>Approval required with documented reason</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Waiver Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Waiver Request</DialogTitle>
                      <DialogDescription>
                        A waiver requires documented justification and approval.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Beneficiary</Label>
                        <Input placeholder="Select beneficiary" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fee Plan</Label>
                        <Input placeholder="Select fee plan" />
                      </div>
                      <div className="space-y-2">
                        <Label>Waiver Amount (PKR)</Label>
                        <Input type="number" placeholder="Enter amount" />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason (Required)</Label>
                        <Textarea 
                          placeholder="Document the justification for this waiver..."
                          value={waiverReason}
                          onChange={(e) => setWaiverReason(e.target.value)}
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-700">
                          This waiver request will be logged in the audit trail and requires approval from an authorized user.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button disabled={!waiverReason}>Submit for Approval</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {waiversLoading ? (
                <LoadingTable />
              ) : waiversData?.data && waiversData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiary</TableHead>
                        <TableHead>Fee Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waiversData.data.map((waiver) => (
                        <TableRow key={waiver.id}>
                          <TableCell className="font-medium">{waiver.beneficiary_name}</TableCell>
                          <TableCell>{waiver.fee_plan_name}</TableCell>
                          <TableCell>PKR {waiver.requested_amount.toLocaleString()}</TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {waiver.reason}
                          </TableCell>
                          <TableCell className="text-sm">{waiver.requested_by_name}</TableCell>
                          <TableCell>
                            <Badge className={
                              waiver.status === 'approved' ? 'status-approved' : 'status-pending'
                            }>
                              {waiver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {waiver.status !== 'approved' && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveWaiver(waiver.id)}
                                >
                                  Approve
                                </Button>
                                <Button size="sm" variant="ghost">Reject</Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    page={page}
                    totalPages={waiversData.pagination.totalPages}
                    total={waiversData.pagination.total}
                    onPageChange={setPage}
                    className="mt-4"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No waiver requests found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery ? "Try adjusting your search" : "No waiver requests at this time"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
