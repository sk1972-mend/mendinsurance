import { Smartphone, FileText, User, LayoutDashboard, ScanLine, ClipboardList, TrendingUp, Activity, AlertTriangle, Store, Settings, Building2, BarChart3, ShieldCheck, Headphones } from 'lucide-react';
import mendLogo from '@/assets/mend-logo.png';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const customerLinks = [
  { title: 'My Devices', url: '/dashboard', icon: Smartphone },
  { title: 'File Claim', url: '/dashboard/claims/new', icon: FileText },
  { title: 'Account', url: '/dashboard/account', icon: User },
];

const shopLinks = [
  { title: 'Overview', url: '/shop', icon: LayoutDashboard },
  { title: 'Scanner', url: '/shop/scanner', icon: ScanLine },
  { title: 'Claims Queue', url: '/shop/queue', icon: ClipboardList },
  { title: 'Revenue', url: '/shop/revenue', icon: TrendingUp },
];

const adminLinks = [
  { title: 'Overview', url: '/admin', icon: Activity },
  { title: 'Claims Oversight', url: '/admin/claims', icon: AlertTriangle },
  { title: 'Partner Network', url: '/admin/partners', icon: Store },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const enterpriseLinks = [
  { title: 'Overview', url: '/enterprise', icon: Building2 },
  { title: 'Fleet Risk', url: '/enterprise/risk', icon: BarChart3 },
  { title: 'Claims Audit', url: '/enterprise/claims', icon: ShieldCheck },
  { title: 'Settings', url: '/enterprise/settings', icon: Settings },
];

export function AppSidebar() {
  const { role, loading } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const showAllLinks = loading || !role;

  const getMenuItems = () => {
    if (showAllLinks) {
      return [
        { label: 'Customer', items: customerLinks },
        { label: 'Shop Partner', items: shopLinks },
        { label: 'Enterprise', items: enterpriseLinks },
        { label: 'Admin', items: adminLinks },
      ];
    }
    switch (role) {
      case 'customer':
        return [{ label: 'Dashboard', items: customerLinks }];
      case 'shop':
        return [{ label: 'Shop Portal', items: shopLinks }];
      case 'enterprise':
        return [{ label: 'Enterprise', items: enterpriseLinks }];
      case 'admin':
        return [{ label: 'Admin Panel', items: adminLinks }];
      default:
        return [];
    }
  };

  const menuGroups = getMenuItems();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={mendLogo} alt="Mend" className="h-9 w-auto shrink-0 brightness-0 invert" />
          {!isCollapsed && (
            <div>
              <span className="text-lg font-semibold text-sidebar-foreground">Mend</span>
              <span className="ml-1.5 text-xs font-medium text-sidebar-foreground/50">OS</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/dashboard' || item.url === '/shop' || item.url === '/admin' || item.url === '/enterprise'}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* SOS / Support - visible for ALL roles */}
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Support">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeClassName=""
                onClick={(e) => {
                  e.preventDefault();
                  // Will trigger concierge in the future
                }}
              >
                <Headphones className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>SOS / Support</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
