import {
  Hero,
  Features,
  Showcase,
  FAQs,
} from "./components";
import { FinalCTA } from "../../home/components";
import Testimonials from "../../../shared/Testimonial";
import { SEO } from "../../../shared/seo";

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

export default function SmartBioPagesPage() {
  return (
    <main className="bg-slate-50">
      <SEO
        title="Smart Bio Pages | Ziplin"
        description="Create custom smart bio pages for your brand with Ziplin's free builder. Design unique profiles, share your story, and track engagement with powerful analytics."
        canonical="https://www.ziplin.io/features/smart-bio-pages"
        keywords={"smart bio pages,free bio builder,profile page maker,link in bio tool,custom profile pages,online bio pages,branded bio pages,bio page analytics,responsive bio pages,mobile bio pages,ziplin"}
      />
      <Hero />
      <Features />
      <Showcase />
      <Testimonials testimonials={testimonials} />
      <FAQs />
      <FinalCTA />
    </main>
  );
}
