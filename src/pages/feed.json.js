import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const siteUrl = 'https://grantwisdom.com';
  const blogBase = '/blog';

  // Sort newest first
  posts.sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'GrantWisdom Blog',
    home_page_url: `${siteUrl}${blogBase}/`,
    feed_url: `${siteUrl}${blogBase}/feed.json`,
    description: 'Insights, guides, and updates from the world of global funding and AI-powered grant writing.',
    icon: `${siteUrl}/favicon.svg`,
    favicon: `${siteUrl}/favicon.svg`,
    authors: [
      {
        name: 'GrantWisdom Team',
        url: siteUrl
      }
    ],
    items: posts.map((post) => ({
      id: `${siteUrl}${blogBase}/${post.data.pillar}/${post.data.subcategory}/${post.data.slug}/`,
      url: `${siteUrl}${blogBase}/${post.data.pillar}/${post.data.subcategory}/${post.data.slug}/`,
      title: post.data.title,
      content_text: post.data.description,
      summary: post.data.description,
      image: post.data.featuredImage?.startsWith('http') 
        ? post.data.featuredImage 
        : `${siteUrl}${post.data.featuredImage}`,
      date_published: new Date(post.data.publishedAt).toISOString(),
      authors: [
        {
          name: post.data.author
        }
      ],
      tags: [post.data.pillar, post.data.subcategory, ...(post.data.tags || [])]
    }))
  };

  return new Response(JSON.stringify(feed), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
