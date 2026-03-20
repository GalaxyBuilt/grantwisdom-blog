import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(160),
    pillar: z.enum([
      'grant-guides',
      'grant-writing',
      'grants-by-industry',
      'grants-by-location',
      'grants-by-demographic',
      'grant-programs',
      'grant-strategy'
    ]),
    subcategory: z.string(), // We will use a refine() to enforce pillar-subcategory mapping
    tags: z.array(z.string()).min(1).max(5),
    publishedAt: z.string(), // YYYY-MM-DD
    updatedAt: z.string().optional(),
    author: z.string(),
    slug: z.string(),
    type: z.enum(['hub', 'money', 'article']),
    featuredImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
  }).refine((data) => {
    // Pillar -> Subcategory Enforcement logic
    const mapping: Record<string, string[]> = {
      'grant-guides': ['what-are-grants', 'grant-basics', 'grant-funding-explained', 'index', 'grant-research'],
      'grant-writing': ['grant-proposals', 'budgets', 'application-strategy', 'index', 'writing-services'],
      'grants-by-industry': ['startups', 'nonprofits', 'restaurants', 'agriculture', 'artists', 'index', 'industry-consulting'],
      'grants-by-location': ['california', 'texas', 'new-york', 'florida', 'arizona', 'index', 'search-services'],
      'grants-by-demographic': ['women', 'veterans', 'minorities', 'students', 'index', 'matching-services'],
      'grant-programs': ['sbir', 'nsf', 'usda', 'nih', 'index', 'grant-navigation'],
      'grant-strategy': ['stacking-grants', 'funding-strategy', 'grant-calendars', 'index', 'grant-consulting']
    };
    return mapping[data.pillar]?.includes(data.subcategory);
  }, {
    message: "Invalid subcategory for the selected pillar.",
    path: ["subcategory"]
  }),
});

export const collections = { blog };
