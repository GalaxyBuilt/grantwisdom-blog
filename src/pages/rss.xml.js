import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort newest first
  posts.sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());

  return rss({
    title: 'GrantWisdom Blog',
    description: 'Insights, guides, and updates from the world of global funding and AI-powered grant writing.',
    site: context.site ?? 'https://grantwisdom-blog.pages.dev',
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedAt),
      description: post.data.description,
      customData: post.data.customData,
      categories: [post.data.pillar, post.data.subcategory],
      author: post.data.author,
      link: `/blog/${post.data.pillar}/${post.data.subcategory}/${post.data.slug}/`,
    })),
  });
}
