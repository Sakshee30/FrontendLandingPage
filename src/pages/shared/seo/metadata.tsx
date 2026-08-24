import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    image?: string;
    noIndex?: boolean;
}
const baseURL = "https://www.ziplin.io"
const SEO = ({
    title,
    description,
    keywords,
    canonical,
    image,
    noIndex = false,
}: SEOProps) => {
    return (
        <Helmet>
            <title>{title}</title>

            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta
                name="robots"
                content={noIndex ? "noindex,nofollow" : "index,follow"}
            />

            <link rel="canonical" href={`${baseURL}${canonical}`} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={`${baseURL}${canonical}`} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta charSet="UTF-8" />
            <meta name="author" content="XolFlow" />
            <meta name="theme-color" content="#4F46E5" />
        </Helmet>
    );
}
export default SEO;