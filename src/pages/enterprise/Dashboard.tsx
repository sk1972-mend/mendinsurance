import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, AlertTriangle, ShieldCheck, Upload, TrendingUp, BarChart3, FileText } from 'lucide-react';

export default function EnterpriseDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Command Center</h1>
          <p className="text-muted-foreground">Enterprise risk management & device fleet oversight.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Bulk Upload Devices
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Fleet Value */}
        <Card className="border-2 border-success/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Fleet Value</CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-success">$2,450,000</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-success" />
              +12% from last quarter
            </p>
          </CardContent>
        </Card>

        {/* Active Claims */}
        <Card className="border-2 border-warning/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Claims</CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-warning">23</p>
            <p className="mt-1 text-xs text-muted-foreground">
              7 pending review · 16 in repair
            </p>
          </CardContent>
        </Card>

        {/* Fraud Prevention Savings */}
        <Card className="border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fraud Prevention Savings</CardTitle>
            <ShieldCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-primary">$185,400</p>
            <p className="mt-1 text-xs text-muted-foreground">
              32 flagged claims this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fleet Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Fleet Risk Overview
            </CardTitle>
            <CardDescription>Device health distribution across your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Healthy', count: 1240, total: 1500, color: 'bg-success' },
                { label: 'At Risk', count: 180, total: 1500, color: 'bg-warning' },
                { label: 'Critical', count: 80, total: 1500, color: 'bg-destructive' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Claims Audit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              Recent Claims Activity
            </CardTitle>
            <CardDescription>Latest claims across your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'CLM-8A2F', device: 'iPhone 15 Pro', status: 'in_progress', time: '2h ago' },
                { id: 'CLM-7B3E', device: 'MacBook Air M3', status: 'filed', time: '5h ago' },
                { id: 'CLM-6C4D', device: 'iPad Pro 12.9"', status: 'verified_complete', time: '1d ago' },
                { id: 'CLM-5D5C', device: 'Galaxy S24 Ultra', status: 'flagged', time: '2d ago' },
              ].map((claim) => (
                <div key={claim.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-mono text-sm font-semibold">{claim.id}</p>
                    <p className="text-xs text-muted-foreground">{claim.device}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{claim.time}</span>
                    <Badge
                      variant="outline"
                      className={
                        claim.status === 'flagged'
                          ? 'border-destructive/20 bg-destructive/10 text-destructive'
                          : claim.status === 'verified_complete'
                            ? 'border-success/20 bg-success/10 text-success'
                            : claim.status === 'filed'
                              ? 'border-warning/20 bg-warning/10 text-warning'
                              : 'border-primary/20 bg-primary/10 text-primary'
                      }
                    >
                      {claim.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
