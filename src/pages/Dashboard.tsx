import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  FileText,
  ArrowUpRight,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { useDashboardStats, useVerticalHealth, useOpenExceptions, usePendingApprovals } from '@/hooks/useDashboard';
import { LoadingSpinner, LoadingCard } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function Dashboard() {
  const { currentRole, isRestrictedRole, currentVertical, reducedOperationsMode } = useApp();
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: verticalData, isLoading: verticalLoading } = useVerticalHealth();
  const { data: exceptions, isLoading: exceptionsLoading } = useOpenExceptions(4);
  const { data: pendingApprovals } = usePendingApprovals();

  const isLoading = statsLoading || verticalLoading || exceptionsLoading;

  if (statsError) {
    return (
      <div className="p-8">
        <ErrorAlert error={statsError} title="Failed to load dashboard" onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const displayStats = stats || {
    tier1_risks: [],
    open_exceptions: 0,
    compliance_score: 0,
    total_donations: 0,
    pending_approvals: 0,
    active_volunteers: 0,
    staff_count: 0,
    safeguarding_cases: 0,
  };

  const tier1Risks = displayStats.tier1_risks || [];
  const verticalHealthData = verticalData || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time overview of {currentVertical.name} operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Board Pack
          </Button>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Monthly Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Reduced Operations Warning */}
          {reducedOperationsMode && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Reduced Operations Mode Active</p>
                    <p className="text-sm text-muted-foreground">
                      Payments frozen. Portal-only alerts enabled. Emergency protocols in effect.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tier-1 Risk Panel */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg risk-tier1 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tier-1 Risk Panel</CardTitle>
                  <CardDescription>Critical items requiring immediate attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tier1Risks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No Tier-1 risks at this time</p>
                ) : (
                  tier1Risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          risk.severity === 'critical' ? 'bg-destructive animate-pulse' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{risk.title}</p>
                          <p className="text-xs text-muted-foreground">{risk.vertical}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive" className="text-xs">
                          {risk.hours_remaining === 0 ? 'OVERDUE' : `${risk.hours_remaining}h remaining`}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Exceptions</p>
                    <p className="text-3xl font-semibold text-foreground mt-1">
                      {displayStats.open_exceptions}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="status-pending">3 pending approval</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-3xl font-semibold text-foreground mt-1">
                      {displayStats.compliance_score}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <Progress value={displayStats.compliance_score} className="mt-4 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Donations (YTD)</p>
                    <p className="text-3xl font-semibold text-foreground mt-1">
                      PKR {(displayStats.total_donations / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="status-active">On target</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isRestrictedRole() ? 'Safeguarding Cases' : 'Active Staff'}
                    </p>
                    <p className="text-3xl font-semibold text-foreground mt-1">
                      {isRestrictedRole() ? displayStats.safeguarding_cases : displayStats.staff_count}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isRestrictedRole() ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {isRestrictedRole() ? (
                      <Shield className="w-6 h-6 text-red-600" />
                    ) : (
                      <Users className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </div>
                {isRestrictedRole() ? (
                  <div className="mt-4 flex items-center gap-2">
                    <Badge className="status-restricted">Active investigation</Badge>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Safeguarding data restricted</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Open Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Open Exceptions</CardTitle>
                <CardDescription>Items requiring escalation or approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exceptions && exceptions.length > 0 ? (
                    exceptions.map((exception) => (
                      <div
                        key={exception.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{exception.type}</Badge>
                            <span className="text-xs text-muted-foreground">Level {exception.escalation_level}</span>
                          </div>
                          <p className="text-sm text-foreground mt-1 truncate">{exception.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{exception.vertical}</p>
                        </div>
                        <Badge className={
                          exception.status === 'Approved' ? 'status-approved' : 'status-pending'
                        }>
                          {exception.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No open exceptions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vertical Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vertical Health Summary</CardTitle>
                <CardDescription>Quick overview of all verticals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verticalHealthData.map((vertical) => (
                    <div
                      key={vertical.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          vertical.health_score >= 90 ? 'bg-emerald-500' :
                          vertical.health_score >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{vertical.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {vertical.open_exceptions} exceptions • {vertical.staff_count} staff
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{vertical.health_score}%</p>
                          <p className="text-xs text-muted-foreground">Health</p>
                        </div>
                        <Badge className={
                          vertical.funding_status === 'adequate' ? 'status-active' :
                          vertical.funding_status === 'needs_attention' ? 'status-pending' : 'status-restricted'
                        }>
                          {vertical.funding_status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                  <CardDescription>Items awaiting your action</CardDescription>
                </div>
                <Badge variant="secondary">{displayStats.pending_approvals} items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {pendingApprovals ? (
                  pendingApprovals.map((approval) => (
                    <div key={approval.type} className="p-4 rounded-lg bg-muted/50 border text-center">
                      <p className="text-2xl font-semibold text-foreground">{approval.count}</p>
                      <p className="text-sm text-muted-foreground">{approval.type}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                      <p className="text-2xl font-semibold text-foreground">3</p>
                      <p className="text-sm text-muted-foreground">Fee Waivers</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                      <p className="text-2xl font-semibold text-foreground">2</p>
                      <p className="text-sm text-muted-foreground">Procurement POs</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                      <p className="text-2xl font-semibold text-foreground">2</p>
                      <p className="text-sm text-muted-foreground">Budget Transfers</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                      <p className="text-2xl font-semibold text-foreground">1</p>
                      <p className="text-sm text-muted-foreground">User Role Changes</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
