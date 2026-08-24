import { SEO } from "../../../shared/seo";
import Testimonials from "../../../shared/Testimonial";
import { FinalCTA, TrustBar } from "../../home/components";
import {
  Hero,
  Features,
  Showcase,
} from "./components";

const testimonials = [
  {
    quote:
      "Our URLs are long and people love to add UTMs, so branded links are much clearer for our marketing materials.",
    name: "Vinnie Rossi",
    role: "CTO & Co-Founder",
    company: "WonderCave"
  },
  {
    quote:
      "We chose Ziplin for its powerful analytics capabilities. We use the platform to share our content and training materials globally.",
    name: "Ambika Samarthya",
    role: "Head of Marketing",
    company: "GlobalCo"
  },
  {
    quote:
      "Ziplin makes it super easy to create short links for the whole team. Now we have all our links in one place which also looks amazing.",
    name: "Jim Groenen",
    role: "CTO & Co-Founder",
    company: "TechStart"
  },
  {
    quote:
      "Our URLs are long and people love to add UTMs, so branded links are much clearer for our marketing materials.",
    name: "Vinnie Rossi",
    role: "CTO & Co-Founder",
    company: "WonderCave"
  },
  {
    quote:
      "We chose Ziplin for its powerful analytics capabilities. We use the platform to share our content and training materials globally.",
    name: "Ambika Samarthya",
    role: "Head of Marketing",
    company: "GlobalCo"
  },
];

export default function LinkManagementPage() {
  return (
    <main className="bg-slate-50">
      <SEO
        title="Free URL Shortener with Analytics - Branded Links & QR Codes | Ziplin"
        description="Shorten your URLs with Ziplin's free URL shortener. Create branded links, track clicks, and get powerful analytics to optimize your marketing campaigns."
        canonical="https://www.ziplin.io/features/link-management"
        keywords={"link management,URL shortener,free URL shortener,branded links,link tracking,URL analytics,bulk URL shortener,custom domain links,link analytics,link management,link analytics,free URL shortener,URL shortener with analytics"}
      />
      <Hero />
      <TrustBar />
      <Features />
      <Showcase />
      <Testimonials testimonials={testimonials} />
      <FinalCTA />
    </main>
  );
}
