import { SEO } from "../../../shared/seo";
import {
  Hero,
  ContactForm,
  DirectChannels,
  Locations
} from "./components";

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      <SEO
        title="Contact Ziplin - Free URL Shortener with Analytics"
        description="Get in touch with Ziplin, the free URL shortener with analytics. Contact us for support, questions, or collaboration opportunities."
        canonical="https://www.ziplin.io/resources/contact"
        keywords={"contact,URL shortener,link analytics,link tracking,URL shortener with analytics,custom domains,link management,URL analytics,free URL shortener,URL shortener with analytics"}
      />
      <Hero />
      <ContactForm />
      <DirectChannels />
      <Locations />
    </main>
  );
}
