import { lazy, Suspense, JSX } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
import AppLayout from '../layout/AppLayout';
import LandingLayout from '../layout/LandingLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import { LandingPage } from "../pages/LandingPage";
import { FeaturePage } from "../pages/FeaturePage";
import { SolutionPage } from "../pages/SolutionPage";
import { PricingPage } from "../pages/PricingPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { BlogPage } from "../pages/BlogPage";
import { BlogArticlePage } from "../pages/BlogArticlePage";
import { ComparePage } from "../pages/ComparePage";
import { CommunityPage } from "../pages/CommunityPage";
import { HelpCenterPage } from "../pages/HelpCenterPage";
import { HelpArticlePage } from "../pages/HelpArticlePage";
import { LegalPage } from "../pages/LegalPage";
import { DemoPage } from "../pages/DemoPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { paths } from '../app/config/route.config';


const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const LinksPage = lazy(() => import("../pages/LinksPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const QRPage = lazy(() => import("../pages/QRPage"));
const BioPage = lazy(() => import("../pages/BioPage"));
const CampaignsPage = lazy(() => import("../pages/CampaignsPage"));
const FilesPage = lazy(() => import("../pages/FilesPage"));
const PreviewsPage = lazy(() => import("../pages/PreviewsPage"));
const MigrationCenterPage = lazy(() => import("../pages/MigrationCenterPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("../pages/SubscriptionPage"));
const HelpPage = lazy(() => import("../pages/HelpPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const CreateLinkPage = lazy(() => import("../pages/CreateLinkPage"));
const EditLinkPage = lazy(() => import("../pages/EditLinkPage"));
const ImportLinksPage = lazy(() => import("../pages/ImportLinksPage"));

function PageLoader() {
  return (
    <div
      style={{
        padding: 40,
        color: "#637381",
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

function wrap(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      {
        path: paths.home,
        element: <LandingPage />,
      },
      {
        path: paths.pricing,
        element: <PricingPage />,
      },
      {
        path: "/demo",
        element: <DemoPage />,
      },
      {
        path: "/features/link-management",
        element: <Navigate to="/features/url-shortener" replace />,
      },
      {
        path: "/features/link-shortener",
        element: <Navigate to="/features/url-shortener" replace />,
      },
      {
        path: "/features/qr-code",
        element: <Navigate to="/features/qr-code-generator" replace />,
      },
      {
        path: "/features/dynamic-qr-codes",
        element: <Navigate to="/features/qr-code-generator" replace />,
      },
      {
        path: "/features/smart-bio-pages",
        element: <Navigate to="/features/bio-pages" replace />,
      },
      {
        path: "/features/pixel-retargeting",
        element: <Navigate to="/features/retargeting" replace />,
      },
      {
        path: "/features/retargeting-pixel",
        element: <Navigate to="/features/retargeting" replace />,
      },
      {
        path: "/features/:slug",
        element: <FeaturePage />,
      },
      {
        path: "/solutions/content-creator",
        element: <Navigate to="/solutions/content-creators" replace />,
      },
      {
        path: "/solutions/influencer",
        element: <Navigate to="/solutions/influencers" replace />,
      },
      {
        path: "/solutions/:slug",
        element: <SolutionPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/blog/:slug",
        element: <BlogArticlePage />,
      },
      {
        path: "/compare",
        element: <ComparePage />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
      {
        path: "/help",
        element: <HelpCenterPage />,
      },
      {
        path: "/help/getting-started",
        element: <HelpArticlePage />,
      },
      {
        path: "/resources/help-center",
        element: <Navigate to="/help" replace />,
      },
      {
        path: "/resources/about",
        element: <Navigate to="/about" replace />,
      },
      {
        path: "/resources/contact",
        element: <Navigate to="/contact" replace />,
      },
      {
        path: "/privacy",
        element: <LegalPage />,
      },
      {
        path: "/terms",
        element: <LegalPage />,
      },
      // Resources routes
      {
        path: paths.resources.root,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: paths.resources.helpCenter,
            element: <Navigate to="/help" replace />,
          },
          {
            path: paths.resources.about,
            element: <Navigate to="/about" replace />,
          },
          {
            path: paths.resources.contact,
            element: <Navigate to="/contact" replace />,
          },
          {
            path: paths.resources.switchyAlternative,
            element: <ComparePage />,
          },
          {
            path: paths.resources.linkTreeAlternative,
            element: <ComparePage />,
          },
          {
            path: paths.resources.linkoAlternative,
            element: <ComparePage />,
          },
          {
            path: paths.resources.rebrandlyAlternative,
            element: <ComparePage />,
          },
        ],
      },
      // Legal routes
      {
        path: paths.legal.privacy,
        element: <Navigate to="/privacy" replace />,
      },
      {
        path: paths.legal.terms,
        element: <Navigate to="/terms" replace />,
      },
      {
        path: paths.features.root,
        element: <Navigate to="/features/url-shortener" replace />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },

  // Auth routes (redirect logged-in users to dashboard)
  {
    element: <GuestGuard />,
    children: [
      {
        path: paths.login,
        element: <LoginPage />,
      },
      {
        path: paths.signup,
        element: <SignupPage />,
      },
    ],
  },

  // Password reset routes (public)
  {
    path: paths.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: paths.resetPassword,
    element: <ResetPasswordPage />,
  },

  // Protected app routes (require authentication)
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      {
        path: paths.dashboard,
        element: wrap(DashboardPage),
      },
      {
        path: paths.links.root,
        element: wrap(LinksPage),
      },
      {
        path: paths.links.new,
        element: wrap(CreateLinkPage),
      },
      {
        path: paths.links.import,
        element: wrap(ImportLinksPage),
      },
      {
        path: paths.links.edit(),
        element: wrap(EditLinkPage),
      },
      {
        path: paths.analytics,
        element: wrap(AnalyticsPage),
      },
      {
        path: paths.qr,
        element: wrap(QRPage),
      },
      {
        path: paths.barcodes,
        element: (
          <Suspense fallback={<PageLoader />}>
            <QRPage initialType="Barcode" />
          </Suspense>
        ),
      },
      {
        path: paths.bio,
        element: wrap(BioPage),
      },
      {
        path: paths.campaigns,
        element: wrap(CampaignsPage),
      },
      {
        path: paths.files,
        element: wrap(FilesPage),
      },
      {
        path: paths.previews,
        element: wrap(PreviewsPage),
      },
      {
        path: paths.migrations,
        element: wrap(MigrationCenterPage),
      },
      {
        path: paths.settings,
        element: wrap(SettingsPage),
      },
      {
        path: paths.subscription,
        element: wrap(SubscriptionPage),
      },
      {
        path: paths.help,
        element: wrap(HelpPage),
      },
      {
        path: paths.profile,
        element: wrap(ProfilePage),
      },
    ],
  },

  {
    path: paths.notFound,
    element: <Navigate to={paths.home} replace />,
  },
]);

export default function AppRoutes() {
  return router;
}
