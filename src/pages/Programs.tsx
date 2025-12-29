import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { programKPIs } from '@/lib/mockData';
import { BarChart3 } from 'lucide-react';

export default function Programs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Programs & MEL</h1>
        <p className="text-sm text-muted-foreground">KPIs, outcomes tracking, and corrective actions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {programKPIs.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{kpi.program}</CardTitle>
                <Badge className={
                  kpi.status === 'Exceeded' ? 'status-approved' :
                  kpi.status === 'On Track' ? 'status-active' : 'status-pending'
                }>{kpi.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{kpi.indicator}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-semibold">{kpi.actual}</span>
                <span className="text-sm text-muted-foreground">/ {kpi.target} {kpi.unit}</span>
              </div>
              <Progress value={(kpi.actual / kpi.target) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{kpi.vertical}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
