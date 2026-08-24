import { Hero, Plans, PricingFAQs } from "./components";
import { FinalCTA } from "../home/components";
import SEO from "../../shared/seo/metadata"
export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Pricing - Ziplin"
        description="Affordable pricing for all your link management needs."
        keywords={"pricing, Ziplin, link management, URL shortener"}
        canonical="/pricing"
      />
      <Hero />
      <Plans />
      <PricingFAQs />
      <FinalCTA />
    </main>
  );
}
