import { useEffect, useState } from 'react';
import { blogPosts, type BlogPost } from '@/data/blog';
import { getPublishedBlog, getPublishedBlogs } from '@/app/services/public';

function mergeWithFallback(cmsPosts: BlogPost[]) {
  const cmsSlugs = new Set(cmsPosts.map((post) => post.slug));
  return [...cmsPosts, ...blogPosts.filter((post) => !cmsSlugs.has(post.slug))];
}

export function usePublishedBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    let active = true;
    getPublishedBlogs()
      .then((cmsPosts) => { if (active) setPosts(mergeWithFallback(cmsPosts)); })
      .catch(() => { /* Bundled posts are the deliberate availability fallback. */ });
    return () => { active = false; };
  }, []);

  return posts;
}

export function usePublishedBlog(slug?: string) {
  const fallback = blogPosts.find((post) => post.slug === slug) || null;
  const [post, setPost] = useState<BlogPost | null>(fallback);
  const [loading, setLoading] = useState(Boolean(slug && !fallback));

  useEffect(() => {
    let active = true;
    if (!slug) {
      setPost(null);
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(!fallback);
    getPublishedBlog(slug)
      .then((cmsPost) => { if (active) setPost(cmsPost); })
      .catch(() => { if (active) setPost(fallback); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  return { post, loading };
}
