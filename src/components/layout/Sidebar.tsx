import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Contact,
  Gift,
  Receipt,
  Heart,
  ShoppingCart,
  Briefcase,
  BarChart3,
  ShieldAlert,
  Activity,
  AlertCircle,
  MessageSquare,
  FileText,
  History,
  Lock,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, module: 'dashboard' },
  { name: 'Multi-Vertical Overview', href: '/verticals', icon: Building2, module: 'multi-vertical' },
  { name: 'Users & Roles', href: '/users', icon: Users, module: 'users' },
  { name: 'Contacts (CRM)', href: '/contacts', icon: Contact, module: 'contacts' },
  { name: 'Donations & Allocations', href: '/donations', icon: Gift, module: 'donations' },
  { name: 'Fees & Subsidies', href: '/fees', icon: Receipt, module: 'fees' },
  { name: 'Volunteers', href: '/volunteers', icon: Heart, module: 'volunteers' },
  { name: 'Procurement & Inventory', href: '/procurement', icon: ShoppingCart, module: 'procurement' },
  { name: 'HR (Staff)', href: '/hr', icon: Briefcase, module: 'hr' },
  { name: 'Programs & MEL', href: '/programs', icon: BarChart3, module: 'programs' },
  { name: 'Safeguarding', href: '/safeguarding', icon: ShieldAlert, module: 'safeguarding', restricted: true },
  { name: 'Unified Event Log', href: '/events', icon: Activity, module: 'events' },
  { name: 'Exceptions & Escalations', href: '/exceptions', icon: AlertCircle, module: 'exceptions' },
  { name: 'Messaging Log', href: '/messaging', icon: MessageSquare, module: 'messaging' },
  { name: 'Reports & Evidence Packs', href: '/reports', icon: FileText, module: 'reports' },
  { name: 'Audit Log', href: '/audit', icon: History, module: 'audit' },
];

export function Sidebar() {
  const location = useLocation();
  const { canAccessModule, isRestrictedRole, currentRole } = useApp();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">SCN</h2>
            <p className="text-xs text-muted-foreground">Operating System</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-1">
          <p className="section-header">Main Navigation</p>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const hasAccess = canAccessModule(item.module);
            const isRestricted = item.restricted && !isRestrictedRole();

            if (!hasAccess) return null;

            return (
              <Link
                key={item.name}
                to={isRestricted ? '#' : item.href}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active',
                  isRestricted && 'opacity-50 cursor-not-allowed'
                )}
                onClick={(e) => isRestricted && e.preventDefault()}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.name}</span>
                {item.restricted && (
                  <Lock className="w-3 h-3 text-destructive" />
                )}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="section-header">Governance</p>
            <Link
              to="/board-view"
              className={cn(
                'nav-link',
                location.pathname === '/board-view' && 'nav-link-active'
              )}
            >
              <Eye className="w-4 h-4" />
              <span>Board / Auditor View</span>
            </Link>
          </div>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">{currentRole.name}</p>
          <p>Access Level: {currentRole.level}</p>
          {currentRole.restricted && (
            <p className="text-destructive flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Restricted Access
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
