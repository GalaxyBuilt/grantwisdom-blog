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
    slug: z.string(), // auto-generated from title logic should be handled by the user/AI during content creation
    featuredImage: z.string().url().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
  }).refine((data) => {
    // Pillar -> Subcategory Enforcement logic
    const mapping: Record<string, string[]> = {
      'grant-guides': ['what-are-grants', 'grant-basics', 'grant-funding-explained'],
      'grant-writing': ['grant-proposals', 'budgets', 'application-strategy'],
      'grants-by-industry': ['startups', 'nonprofits', 'restaurants', 'agriculture', 'artists'],
      'grants-by-location': ['california', 'texas', 'new-york', 'florida', 'arizona'],
      'grants-by-demographic': ['women', 'veterans', 'minorities', 'students'],
      'grant-programs': ['sbir', 'nsf', 'usda', 'nih'],
      'grant-strategy': ['stacking-grants', 'funding-strategy', 'grant-calendars']
    };
    return mapping[data.pillar]?.includes(data.subcategory);
  }, {
    message: "Invalid subcategory for the selected pillar.",
    path: ["subcategory"]
  }),
});

export const collections = { blog };
