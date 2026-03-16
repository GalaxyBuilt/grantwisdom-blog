/**
 * Cloudflare Worker: grantwisdom-blog-proxy
 *
 * Routes all traffic for grantwisdom.com/blog/* to the standalone
 * Astro blog hosted at grantwisdom-blog.pages.dev.
 *
 * Since the Astro blog serves from root (/), we strip the /blog prefix
 * so that /blog/some-post → grantwisdom-blog.pages.dev/some-post
 * and /blog/ → grantwisdom-blog.pages.dev/
 */

const BLOG_ORIGIN = 'https://grantwisdom-blog.pages.dev';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only intercept /blog paths
    if (!url.pathname.startsWith('/blog')) {
      // Pass through to the main Next.js app (original request)
      return fetch(request);
    }

    // Strip /blog prefix so Astro's root-based paths resolve correctly
    // /blog        → /
    // /blog/       → /
    // /blog/guides/startup-funding/my-post → /guides/startup-funding/my-post
    const strippedPath = url.pathname.replace(/^\/blog\/?/, '/') || '/';

    const targetUrl = new URL(strippedPath + url.search, BLOG_ORIGIN);

    // Forward the request to the Astro blog
    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    const response = await fetch(proxyRequest);

    // Return the response, passing through status, headers, and body
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
