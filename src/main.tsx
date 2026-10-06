import '@vly-ai/integrations';
import "lenis/dist/lenis.css";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import {
  RootErrorBoundary,
  RouteLoading,
  RouteSyncer,
  ToolbarErrorBoundary,
} from "@/components/AppGuards";
import { SiteLayout } from "@/layouts/SiteLayout";
import { DemoProvider } from "@/store/demo";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const RescuePage = lazy(() => import("./pages/Rescue.tsx"));
const FoodDetailPage = lazy(() => import("./pages/FoodDetail.tsx"));
const DonatePage = lazy(() => import("./pages/Donate.tsx"));
const VolunteerPage = lazy(() => import("./pages/Volunteer.tsx"));
const OrganizationPage = lazy(() => import("./pages/Organization.tsx"));
const ImpactPage = lazy(() => import("./pages/Impact.tsx"));
const CommunityPage = lazy(() => import("./pages/Community.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <DemoProvider>
          <BrowserRouter>
            <RouteSyncer />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/rescue" element={<RescuePage />} />
                  <Route path="/rescue/:id" element={<FoodDetailPage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/volunteer" element={<VolunteerPage />} />
                  <Route
                    path="/organization"
                    element={
                      <RequireAuth
                        title="Sign in to open your workspace"
                        description="The organization workspace shows tonight's incoming food, requests and active deliveries for your kitchen."
                      >
                        <OrganizationPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/impact" element={<ImpactPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/organization" replace />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route
                  path="/auth"
                  element={<AuthPage redirectAfterAuth="/organization" />}
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </DemoProvider>
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
