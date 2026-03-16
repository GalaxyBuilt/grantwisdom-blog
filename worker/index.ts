export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Proxy /blog requests to the Astro blog on Cloudflare Pages
    if (url.pathname.startsWith('/blog')) {
      // Create a new URL based on the Astro blog's target address
      // Since we set base: '/blog' in Astro, the path structure matches exactly.
      const targetUrl = new URL(url.pathname + url.search, 'https://grantwisdom-blog.pages.dev');
      
      const newRequest = new Request(targetUrl, request);
      return fetch(newRequest);
    }
    
    // Fallback: This part would normally be handled by the Next.js app 
    // if the Worker is only bound to /blog/*, this code won't even run for other paths.
    return fetch(request);
  },
};
