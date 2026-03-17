import https from 'https';

const INDEXNOW_KEY = '5f9b4c02741d4c2b8c9e47f2f183c5e8';
const HOST = 'grantwisdom.com'; // Use the final routed domain
const SITEMAP_URL = `https://${HOST}/blog/sitemap-index.xml`;

const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: `https://${HOST}/blog/${INDEXNOW_KEY}.txt`,
  urlList: [SITEMAP_URL] // We submit the sitemap URL which contains all the posts
});

const options = {
  hostname: 'api.indexnow.org',
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Submitting sitemap to IndexNow API...');

const req = https.request(options, (res) => {
  console.log(`IndexNow API Response Status: ${res.statusCode}`);
  
  if (res.statusCode === 200 || res.statusCode === 202) {
    console.log('✅ Successfully pinged IndexNow!');
  } else {
    console.error('❌ Failed to ping IndexNow. See response code above.');
  }

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error('❌ Error pinging IndexNow:', error);
});

req.write(payload);
req.end();
