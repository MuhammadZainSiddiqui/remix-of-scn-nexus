import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Plus, Search, AlertTriangle } from 'lucide-react';
import {
  useRequisitions,
  useLowStockItems,
  useRequisitionPipeline,
} from '@/hooks/useProcurement';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';

export default function Procurement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: requisitionsData, isLoading: requisitionsLoading, error: requisitionsError } = useRequisitions(
    { search: searchQuery },
    page,
    10
  );

  const { data: lowStockData } = useLowStockItems();

  const { data: pipelineData } = useRequisitionPipeline();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Procurement & Inventory</h1>
          <p className="text-sm text-muted-foreground">Requisition → RFQ → Quotes → PO → GRN → Payment</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />New Requisition</Button>
      </div>

      {requisitionsError && <ErrorAlert error={requisitionsError} title="Failed to load requisitions" />}

      {/* Pipeline Overview */}
      {pipelineData && (
        <div className="grid grid-cols-5 gap-2">
          {pipelineData.map((stage) => (
            <div key={stage.stage} className="p-3 rounded-lg bg-muted/50 border text-center">
              <p className="text-lg font-semibold">{stage.count}</p>
              <p className="text-xs text-muted-foreground">{stage.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockData && lowStockData.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">
                <strong>Low Stock Alert:</strong> {lowStockData.length} items are at or below minimum stock level.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="requisitions" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Requisitions Tab */}
        <TabsContent value="requisitions">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Requisitions</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requisitions..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {requisitionsLoading ? (
                <LoadingTable />
              ) : requisitionsData?.data && requisitionsData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Req #</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Quotes</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Vertical</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requisitionsData.data.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-mono">{req.req_no}</TableCell>
                          <TableCell className="font-medium">{req.item}</TableCell>
                          <TableCell>{req.quantity}</TableCell>
                          <TableCell>PKR {req.estimated_cost.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline">{req.stage}</Badge></TableCell>
                          <TableCell>{req.quotes_count}/3</TableCell>
                          <TableCell>{req.selected_vendor_name || '-'}</TableCell>
                          <TableCell className="text-sm">{req.vertical_name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    page={page}
                    totalPages={requisitionsData.pagination.totalPages}
                    total={requisitionsData.pagination.total}
                    onPageChange={setPage}
                    className="mt-4"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No requisitions found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery ? "Try adjusting your search" : "Create your first requisition to get started"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendors</CardTitle>
              <CardDescription>Manage vendor relationships and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">Vendors Module</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Vendor management features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory</CardTitle>
              <CardDescription>Track stock levels and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">Inventory Module</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Inventory tracking features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
