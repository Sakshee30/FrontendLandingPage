import { Outlet } from "react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
