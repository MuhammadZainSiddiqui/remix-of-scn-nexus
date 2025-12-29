import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { messagingLog } from '@/lib/mockData';
import { MessageSquare, Lock } from 'lucide-react';

export default function Messaging() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messaging Log</h1>
        <p className="text-sm text-muted-foreground">Email, SMS, WhatsApp, and Portal notifications</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Messages</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messagingLog.map((msg) => (
                <TableRow key={msg.id} className={msg.restricted ? 'bg-red-50/50' : ''}>
                  <TableCell><Badge variant="outline">{msg.type}</Badge></TableCell>
                  <TableCell>{msg.recipient}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell>
                    {msg.restricted ? (
                      <Badge className="status-restricted gap-1"><Lock className="w-3 h-3" />{msg.channel}</Badge>
                    ) : (
                      <Badge variant="outline">{msg.channel}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{msg.timestamp}</TableCell>
                  <TableCell><Badge className="status-approved">{msg.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <strong>Portal-Only Rule:</strong> Restricted alerts display "Portal-only alert sent — no details via SMS / WhatsApp / Email."
      </div>
    </div>
  );
}
