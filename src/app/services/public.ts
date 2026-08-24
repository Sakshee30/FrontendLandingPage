import { apiClient } from "../api/api-client";
import type { AuthUser } from "./auth";
import type { BlogPost } from "../../data/blog";

export type PublicPlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  limits: Record<string, unknown>;
  sortOrder: number;
  isDefault: boolean;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
};

export type RegisterResult = {
  user: AuthUser;
  organization: { id: string; name: string; slug: string };
  workspace: { id: string; name: string; slug: string };
  plan: { id: string; name: string; slug: string };
};

export async function getPlans(): Promise<PublicPlan[]> {
  const data = await apiClient.get<unknown, PublicPlan[]>("/public/plans");
  return Array.isArray(data) ? data : [];
}

export async function registerTenant(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  return apiClient.post<unknown, RegisterResult>("/public/register", payload);
}

type CmsBlogResponse = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  category?: string;
  author?: string;
  authorRole?: string;
  readTimeMinutes?: number;
  seo?: BlogPost['seo'];
  publishedAt?: string;
  modifiedAt?: string;
};

function toBlogPost(blog: CmsBlogResponse): BlogPost {
  const published = blog.publishedAt ? new Date(blog.publishedAt) : new Date();
  return {
    slug: blog.slug,
    category: blog.category || 'ZIPLIN NEWS',
    title: blog.title,
    excerpt: blog.excerpt || '',
    author: blog.author || 'Ziplin Editorial',
    role: blog.authorRole || 'Editorial team',
    date: published.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: `${blog.readTimeMinutes || 5} min read`,
    body: blog.body || '',
    seo: blog.seo,
    publishedAt: blog.publishedAt,
    modifiedAt: blog.modifiedAt,
  };
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const data = await apiClient.get<unknown, { blogs?: CmsBlogResponse[] }>("/public/content/blogs", { params: { page: 1, limit: 100 } });
  return (data?.blogs || []).map(toBlogPost);
}

export async function getPublishedBlog(slug: string): Promise<BlogPost> {
  const data = await apiClient.get<unknown, { blog: CmsBlogResponse }>(`/public/content/blogs/${encodeURIComponent(slug)}`);
  return toBlogPost(data.blog);
}
