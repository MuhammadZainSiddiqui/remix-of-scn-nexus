import { Search, Calendar, ChevronDown, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { verticals, roles } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export function TopBar() {
  const { 
    currentVertical, 
    setCurrentVertical, 
    currentRole, 
    setCurrentRole,
    reducedOperationsMode,
    setReducedOperationsMode,
  } = useApp();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">SCN Operating System</h1>
            <p className="text-xs text-muted-foreground">Super Admin Portal</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border mx-2" />

        {/* Vertical Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-9">
              <div className={`w-2 h-2 rounded-full ${currentVertical.color}`} />
              <span className="font-medium">{currentVertical.shortName}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch Vertical</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {verticals.map((vertical) => (
              <DropdownMenuItem
                key={vertical.id}
                onClick={() => setCurrentVertical(vertical)}
                className="gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${vertical.color}`} />
                <span>{vertical.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range */}
        <Button variant="outline" className="gap-2 h-9">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Jan 1 - Jan 16, 2024</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Reduced Operations Mode */}
        {reducedOperationsMode && (
          <Badge variant="destructive" className="gap-1 animate-pulse-subtle">
            <AlertTriangle className="w-3 h-3" />
            Reduced Operations Mode
          </Badge>
        )}

        {/* Global Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search across all modules..."
            className="pl-9 h-9 bg-muted/50"
          />
        </div>

        {/* Role Simulator */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-9">
              <span className="text-xs text-muted-foreground">Role:</span>
              <span className="font-medium">{currentRole.name}</span>
              {currentRole.restricted && (
                <Badge variant="secondary" className="text-xs px-1">R</Badge>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Demo Role Simulator</span>
              <Badge variant="outline" className="text-xs">Demo Only</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => setCurrentRole(role)}
                className="justify-between"
              >
                <span>{role.name}</span>
                {role.restricted && (
                  <Badge variant="destructive" className="text-xs">Restricted</Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Reduced Ops Mode</span>
                <Switch
                  checked={reducedOperationsMode}
                  onCheckedChange={setReducedOperationsMode}
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
