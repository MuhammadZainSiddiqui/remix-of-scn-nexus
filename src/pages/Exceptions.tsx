import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { exceptionsEscalations } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';

export default function Exceptions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Exceptions & Escalations</h1>
        <p className="text-sm text-muted-foreground">Open exceptions and escalation ladder (Level 1-5)</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Open Exceptions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptionsEscalations.map((exc) => (
                <TableRow key={exc.id}>
                  <TableCell><Badge variant="outline">{exc.type}</Badge></TableCell>
                  <TableCell>
                    <Badge className={
                      exc.level >= 3 ? 'risk-tier1' : exc.level === 2 ? 'risk-tier2' : 'risk-tier3'
                    }>L{exc.level}</Badge>
                  </TableCell>
                  <TableCell>{exc.description}</TableCell>
                  <TableCell>{exc.owner}</TableCell>
                  <TableCell className="text-sm">{exc.deadline}</TableCell>
                  <TableCell>
                    <Badge className={exc.status === 'Approved' ? 'status-approved' : 'status-pending'}>{exc.status}</Badge>
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
