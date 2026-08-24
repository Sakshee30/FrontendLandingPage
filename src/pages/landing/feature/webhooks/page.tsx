import {
  Hero,
  Features,
  Showcase,
  FAQs,
} from "./components";
import FinalCTA from "../../home/components/FinalCTA";
import Testimonials from "../../../shared/Testimonial";
import { SEO } from "../../../shared/seo";

const testimonials = [
  {
    quote: "Ziplin's webhooks allowed us to build a custom analytics integration in a day. The reliability has been fantastic.",
    name: "Sam Wilson",
    role: "Engineering Lead",
    company: "TechBuild",
  },
  {
    quote: "The webhook logs and replay feature are a lifesaver. Debugging integration issues has never been easier.",
    name: "Priya Patel",
    role: "Full-Stack Developer",
    company: "StartupX",
  },
  {
    quote: "Finally, a link tool with webhooks! We use them to sync data to our CRM and it's been perfect.",
    name: "James Lee",
    role: "CTO",
    company: "GrowthCo",
  },
];
export default function WebhooksPage() {
  return (
    <main >
      <SEO
        title="Webhooks | Ziplin"
        description="Connect your Ziplin account to any application with webhooks. Track link events, get real-time notifications, and automate your workflows."
        canonical="https://www.ziplin.io/features/webhooks"
        keywords={"webhooks,URL shortener with analytics,custom domains,link tracking,URL analytics,bulk URL shortener,custom domain links,link analytics,link management,link analytics,free URL shortener,URL shortener with analytics"}
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
