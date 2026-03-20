import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const siteUrl = 'https://grantwisdom.com';
  const blogBase = '/blog';

  // Sort newest first
  posts.sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());

  return rss({
    title: 'GrantWisdom Blog',
    description: 'Insights, guides, and updates from the world of global funding and AI-powered grant writing.',
    site: siteUrl + blogBase,
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedAt),
      description: post.data.description,
      categories: [post.data.pillar, post.data.subcategory],
      author: post.data.author,
      link: `${blogBase}/${post.data.pillar}/${post.data.subcategory}/${post.data.slug}/`,
      // Add hero image as enclosure
      enclosure: post.data.featuredImage ? {
        url: post.data.featuredImage.startsWith('http') 
          ? post.data.featuredImage 
          : `${siteUrl}${post.data.featuredImage}`,
        length: 0,
        type: 'image/png',
      } : undefined,
    })),
  });
}
