import { Outlet, useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, LogOut, User } from 'lucide-react';
import mendLogo from '@/assets/mend-logo.png';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Route label mapping for breadcrumbs
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  shop: 'Shop',
  admin: 'Admin',
  scanner: 'Scanner',
  queue: 'Claims Queue',
  revenue: 'Revenue',
  claims: 'Claims',
  new: 'New Claim',
  account: 'Account',
  partners: 'Partner Network',
  settings: 'Settings',
  apply: 'Apply',
};

// Check if a segment looks like a UUID
const isUuid = (s: string) => /^[0-9a-f]{8}-/.test(s);

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Parse current path for breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Get user initials for avatar
  const userEmail = user?.email || '';
  const userInitials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          {/* Sticky Top Bar - Rugged Fintech Style */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-primary/10 bg-white/80 px-6 backdrop-blur-md">
            {/* Left side: Trigger + Breadcrumbs */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-primary hover:bg-accent" />
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="flex items-center gap-1.5 text-primary hover:text-primary/80">
                        <img src={mendLogo} alt="Mend" className="h-5 w-auto" />
                        <span className="font-semibold">Mend</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const path = '/' + pathSegments.slice(0, index + 1).join('/');
                    const label = isUuid(segment)
                      ? `#${segment.slice(0, 8).toUpperCase()}`
                      : routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                      <BreadcrumbItem key={path}>
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        {isLast ? (
                          <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={path} className="hover:text-foreground">
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right side: Notifications + User Dropdown */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                {/* Notification dot - uncomment when there are notifications */}
                {/* <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" /> */}
              </Button>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="container py-6 animate-in fade-in duration-300">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
