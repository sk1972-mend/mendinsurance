import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

// Public Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";

// Dashboard Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import ShopDashboard from "./pages/shop/Dashboard";
import ShopApply from "./pages/shop/Apply";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

// Shop Sub-views
import { DiagnosticScanner } from "@/components/shop/DiagnosticScanner";
import { ClaimsQueue } from "@/components/shop/ClaimsQueue";
import { RevenueVisualizer } from "@/components/shop/RevenueVisualizer";
import ClaimWorkspacePage from "./pages/shop/ClaimWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes - no layout */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected routes - wrapped in DashboardLayout */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['customer', 'shop', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Customer routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/claims/new"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/account"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Shop routes */}
              <Route
                path="/shop"
                element={
                  <ProtectedRoute allowedRoles={['shop']}>
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/scanner"
                element={
                  <ProtectedRoute allowedRoles={['shop']}>
                    <DiagnosticScanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/queue"
                element={
                  <ProtectedRoute allowedRoles={['shop']}>
                    <ClaimsQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/revenue"
                element={
                  <ProtectedRoute allowedRoles={['shop']}>
                    <RevenueVisualizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/claims/:id"
                element={
                  <ProtectedRoute allowedRoles={['shop']}>
                    <ClaimWorkspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/apply"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'shop']}>
                    <ShopApply />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/claims"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/partners"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
