import {
  Hero,
  Features,
  Showcase,
  FAQs,
} from "./components";
import FinalCTA from "../../home/components/FinalCTA"
import Testimonials from "../../../shared/Testimonial"
import SEO from "../../../shared/seo/metadata";
const testimonials = [
  {
    quote: "Ziplin's campaign management completely changed how we organize our marketing. We can see exactly which campaigns are performing and adjust on the fly.",
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "Vertica",
  },
  {
    quote: "The ability to group links into campaigns and see roll-up analytics has saved us hours every week. Our team is more productive and our campaigns are more effective.",
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "BrightWave",
  },
  {
    quote: "Campaign scheduling is a game-changer. We can plan everything ahead of time and know our links will update automatically when the time comes.",
    name: "Emma Thompson",
    role: "Brand Manager",
    company: "Luxe Boutique",
  },
];

export default function CampaignsLanding() {
  return (
    <main>
      <SEO
        title="Campaigns - Ziplin"
        description="Organize your links into campaigns and track their performance with ease."
        keywords="Campaigns, Ziplin, link management, URL shortener"
        canonical="/campaigns"
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
