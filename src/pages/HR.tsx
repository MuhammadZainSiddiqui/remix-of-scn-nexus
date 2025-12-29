import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { staffMembers } from '@/lib/mockData';
import { Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';

export default function HR() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">HR (Staff)</h1>
        <p className="text-sm text-muted-foreground">Staff management, attendance, and contracts</p>
      </div>

      {staffMembers.some(s => s.overtimeHours > 40) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Burnout Alert:</strong> {staffMembers.filter(s => s.overtimeHours > 40).length} staff member(s) have exceeded 40 overtime hours this month.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-lg">Staff Directory</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Vertical</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Contract End</TableHead>
                <TableHead>Policy Ack</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell><Badge variant="outline">{staff.department}</Badge></TableCell>
                  <TableCell className="text-sm">{staff.vertical}</TableCell>
                  <TableCell>{staff.attendance}</TableCell>
                  <TableCell className={staff.overtimeHours > 40 ? 'text-amber-600 font-medium' : ''}>
                    {staff.overtimeHours}h
                  </TableCell>
                  <TableCell className="text-sm">{staff.contractEnd}</TableCell>
                  <TableCell>
                    {staff.policyAck ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
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
