import { SEO } from "../../../shared/seo";
import Testimonials from "../../../shared/Testimonial";
import { FinalCTA } from "../../home/components";
import {
  Hero,
  Features,
  Showcase,
  FAQs,
} from "./components";

const testimonials = [
  {
    quote: "We use UTM tracking for all our paid campaigns — Ziplin makes it incredibly easy to generate and manage UTM parameters.",
    name: "Alice Zhao",
    role: "Head of Performance Marketing",
    company: "CodeLoom"
  },
  {
    quote: "The custom UTM parameter builder has been a game-changer for our team. Highly recommended!",
    name: "Ben Carter",
    role: "Marketing Manager",
    company: "DataStream"
  },
  {
    quote: "Ziplin's UTM tracking is simple, powerful, and saves us so much time on campaign setup.",
    name: "Priya Patel",
    role: "Digital Strategist",
    company: "PixelGrow"
  },
  {
    quote: "Finally, UTM tracking that's actually user-friendly! Ziplin nailed it.",
    name: "David Rodriguez",
    role: "Growth Hacker",
    company: "GrowthLab"
  },
  {
    quote: "The integration with our analytics platform was seamless. Ziplin's UTM tracking is a must-have for serious marketers.",
    name: "Maria Garcia",
    role: "Marketing Director",
    company: "ConnectSphere"
  },
  {
    quote: "We love the custom UTM templates! Makes it so easy to stay consistent with our tracking.",
    name: "Tom Wilson",
    role: "Social Media Lead",
    company: "ContentWave"
  }
];

export default function UTMTrackingPage() {
  return (
    <main >
      <SEO
        title="UTM Tracking - URL Shortener with Analytics"
        description="Track your marketing campaign performance with UTM tracking. Create UTM parameters, track clicks, and get detailed analytics with Ziplin."
        canonical="https://www.ziplin.io/features/utm-tracking"
        keywords={"UTM tracking,UTM parameters,URL tracking,campaign analytics,URL shortener with analytics,link tracking,campaign tracking,UTM builder,URL analytics,link analytics,free URL shortener,URL shortener with analytics"}
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
