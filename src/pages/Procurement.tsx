import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { procurementItems } from '@/lib/mockData';
import { ShoppingCart, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Procurement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Procurement & Inventory</h1>
          <p className="text-sm text-muted-foreground">Requisition → RFQ → Quotes → PO → GRN → Payment</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />New Requisition</Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {['Requisition', 'RFQ Sent', '3 Quotes', 'PO Approved', 'Complete'].map((stage, i) => (
          <div key={stage} className="p-3 rounded-lg bg-muted/50 border text-center">
            <p className="text-lg font-semibold">{i === 4 ? 1 : i + 1}</p>
            <p className="text-xs text-muted-foreground">{stage}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Active Requisitions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Req ID</TableHead>
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
              {procurementItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>PKR {item.estimatedCost.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline">{item.stage}</Badge></TableCell>
                  <TableCell>{item.quotes}/3</TableCell>
                  <TableCell>{item.selectedVendor || '-'}</TableCell>
                  <TableCell className="text-sm">{item.vertical}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
