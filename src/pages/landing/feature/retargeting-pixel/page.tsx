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
    quote: "Adding retargeting pixels to our social links allowed us to target warm leads with Facebook Ads. Our ROI increased by 3x in the first month!",
    name: "Sarah Jenkins",
    role: "Growth Lead",
    company: "VentureScale"
  },
  {
    quote: "Ziplin's pixel feature is incredibly easy to set up. We save our pixel IDs once and toggle them on for any link we generate. Brilliant!",
    name: "Alex Chen",
    role: "Founder",
    company: "SparkFlow"
  },
  {
    quote: "We retarget everyone who clicks our affiliate links across Twitter and LinkedIn. It has completely transformed our conversion rates.",
    name: "Marcus Vance",
    role: "Digital Marketer",
    company: "Vance Media"
  }
];

export default function RetargetingPixelPage() {
  return (
    <main className=" bg-slate-50">
      <SEO
        title="Retargeting Pixels - Free URL Shortener with Analytics | Ziplin"
        description="Add retargeting pixels to your links and track conversions with Ziplin. Free URL shortener with analytics and custom domains."
        canonical="https://www.ziplin.io/features/retargeting-pixel"
        keywords={"retargeting pixel,retargeting,URL shortener with analytics,custom domains,link tracking,URL analytics,bulk URL shortener,custom domain links,link analytics,link management,link analytics,free URL shortener,URL shortener with analytics"}
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
