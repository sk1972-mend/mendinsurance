import { Shield, Smartphone, FileText, User, LayoutDashboard, ScanLine, ClipboardList, TrendingUp, Activity, AlertTriangle, Store, Settings } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';

// Menu items for each role
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

export function AppSidebar() {
  const { role, loading } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Dev Override: Show all links when role is loading/undefined for easy testing
  const showAllLinks = loading || !role;

  // Determine which links to show
  const getMenuItems = () => {
    if (showAllLinks) {
      // Dev mode: show all sections
      return [
        { label: 'Customer', items: customerLinks },
        { label: 'Shop Partner', items: shopLinks },
        { label: 'Admin', items: adminLinks },
      ];
    }

    switch (role) {
      case 'customer':
        return [{ label: 'Dashboard', items: customerLinks }];
      case 'shop':
        return [{ label: 'Shop Portal', items: shopLinks }];
      case 'admin':
        return [{ label: 'Admin Panel', items: adminLinks }];
      default:
        return [];
    }
  };

  const menuGroups = getMenuItems();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header - Deep Navy with Mend OS branding */}
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-semibold text-sidebar-foreground">Mend</span>
              <span className="ml-1.5 text-xs font-medium text-sidebar-foreground/50">OS</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
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
                        end={item.url === '/dashboard' || item.url === '/shop' || item.url === '/admin'}
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
    </Sidebar>
  );
}
