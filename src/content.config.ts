import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    readTime: z.string(),
    category: z.enum(['Guides', 'Trends', 'Success Stories', 'Updates', 'News', 'Automation', 'Funding']),
    pillar: z.enum(['technology', 'news']),
    subcategory: z.string(),
    author: z.string().default('GrantWisdom Team'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
