import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, AlertCircle, DollarSign, CheckCircle } from 'lucide-react';
import { verticalHealth, verticals } from '@/lib/mockData';
import { Link } from 'react-router-dom';

export default function MultiVerticalOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Multi-Vertical Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consolidated view of all organizational verticals
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {verticalHealth.map((vertical, index) => {
          const verticalInfo = verticals.find(v => v.id === vertical.id);
          
          return (
            <Card key={vertical.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${verticalInfo?.color || 'bg-slate-600'} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{verticalInfo?.shortName}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{vertical.name}</CardTitle>
                      <CardDescription className="text-xs">{vertical.staffCount} staff members</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Health Score</span>
                    <span className={`text-sm font-medium ${
                      vertical.healthScore >= 90 ? 'text-emerald-600' :
                      vertical.healthScore >= 80 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {vertical.healthScore}%
                    </span>
                  </div>
                  <Progress 
                    value={vertical.healthScore} 
                    className={`h-2 ${
                      vertical.healthScore >= 90 ? '[&>div]:bg-emerald-500' :
                      vertical.healthScore >= 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-muted-foreground">Exceptions</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{vertical.openExceptions}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Compliance</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{vertical.complianceScore}%</p>
                  </div>
                </div>

                {/* Funding Status */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Funding Status</span>
                  <Badge className={
                    vertical.fundingStatus === 'Adequate' ? 'status-active' :
                    vertical.fundingStatus === 'Needs Attention' ? 'status-pending' : 'status-restricted'
                  }>
                    {vertical.fundingStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {verticalHealth.reduce((sum, v) => sum + v.staffCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {verticalHealth.reduce((sum, v) => sum + v.openExceptions, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Exceptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {Math.round(verticalHealth.reduce((sum, v) => sum + v.complianceScore, 0) / verticalHealth.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {verticalHealth.filter(v => v.fundingStatus === 'Adequate').length}/{verticalHealth.length}
                </p>
                <p className="text-sm text-muted-foreground">Adequately Funded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
