import fs from 'fs';
import path from 'path';

async function generateTags() {
  // Note: Since this is a standalone script, we might not have easy access to getCollection
  // without a complex setup. However, we can just read the files directly from src/content/blog.
  
  const blogDir = path.join(process.cwd(), 'public/blog');
  const tagCounts = {};

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const match = content.match(/tags:\s*\[(.*?)\]/);
        if (match) {
          const tags = match[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
          for (const tag of tags) {
            if (tag) {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
          }
        }
      }
    }
  }

  walk(blogDir);

  // Filter tags with count >= 2 as requested
  const filteredTags = Object.fromEntries(
    Object.entries(tagCounts).filter(([_, count]) => count >= 2)
  );

  const outputPath = path.join(process.cwd(), 'public/tags.json');
  fs.writeFileSync(outputPath, JSON.stringify(tagCounts, null, 2));
  
  const cloudPath = path.join(process.cwd(), 'public/tag-cloud.json');
  fs.writeFileSync(cloudPath, JSON.stringify(filteredTags, null, 2));

  console.log('✅ Generated tags.json and tag-cloud.json');
}

generateTags().catch(console.error);
