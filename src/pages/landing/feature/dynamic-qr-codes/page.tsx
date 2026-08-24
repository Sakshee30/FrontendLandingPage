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
    quote: "Ziplin's dynamic QR codes have transformed how we handle menu updates at our restaurant. No more reprinting every time we change dishes!",
    name: "Sarah Chen",
    role: "Restaurant Owner",
    company: "The Urban Table"
  },
  {
    quote: "The analytics are incredible. We can see exactly which of our QR campaigns are performing best and optimize in real-time.",
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "BrightWave Agency"
  },
  {
    quote: "Finally, a QR tool that lets us fully customize our codes to match our brand. Our customers actually comment on how nice they look!",
    name: "Emma Thompson",
    role: "Brand Manager",
    company: "Luxe Boutique"
  }
];
export default function DynamicQRCodesPage() {
  return (
    <main className="bg-slate-50">
      <SEO
        title="Dynamic QR Codes - Free QR Code Generator with Analytics"
        description="Create dynamic QR codes for your business with custom designs and real-time analytics. Free QR code generator with tracking and insights."
        canonical="https://www.ziplin.io/features/dynamic-qr-codes"
        keywords={"dynamic QR codes,free QR code generator,QR code with analytics,QR code tracking,custom QR codes,QR code generator,QR codes for business,QR code management,bulk QR codes,vector QR codes,branded QR codes,scan analytics,free QR code maker,QR code maker with analytics"}
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