import { SEO } from "../../../shared/seo";
import { SearchHero } from "./components/SearchHero";
import { Categories } from "./components/Categories";
import { PopularArticles } from "./components/PopularArticles";

export default function HelpCenterPage() {
  return (
    <div className="bg-slate-50/50 pb-18">
      <SEO
        title="Help Center | Ziplin"
        description="Get answers to all your questions about Ziplin, the free URL shortener with analytics. Find tutorials, guides, and support for all our features."
        canonical="https://www.ziplin.io/resources/help-center"
        keywords={"Help Center,Ziplin,URL shortener,link analytics,link tracking,URL shortener with analytics,custom domains,link management,URL analytics,free URL shortener,URL shortener with analytics"}
      />
      <SearchHero />
      <Categories />
      <PopularArticles />
    </div>
  );
}
