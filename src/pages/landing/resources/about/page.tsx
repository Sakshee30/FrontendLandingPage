import {
  Hero,
  Mission,
  Values,
  Stats
} from "./components";
import { FinalCTA } from "../../home/components";
import { SEO } from "../../../shared/seo";

export default function AboutPage() {
  return (
    <main className="bg-slate-50">
      <SEO
        title="About Ziplin - Free URL Shortener with Analytics"
        description="Learn about Ziplin, the free URL shortener with analytics. Create short links, track clicks, and get detailed insights with our powerful platform."
        canonical="https://www.ziplin.io/resources/about"
        keywords={"about Ziplin,URL shortener,link analytics,link tracking,URL shortener with analytics,custom domains,link management,URL analytics,free URL shortener,URL shortener with analytics"}
      />
      <Hero />
      <Mission />
      <Values />
      <Stats />
      <FinalCTA />
    </main>
  );
}
