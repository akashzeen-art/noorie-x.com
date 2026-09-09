import { proxyUpstream } from './proxy-core.js';

export default async function proxyHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'X-Embed-Failed');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const feedUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!feedUrl) {
    res.status(400).send('Missing url parameter');
    return;
  }

  try {
    // eslint-disable-next-line no-new
    new URL(feedUrl);
  } catch {
    res.status(400).send('Invalid url parameter');
    return;
  }

  const result = await proxyUpstream(feedUrl);
  res.setHeader('Cache-Control', result.embedFailed ? 'no-store' : 'public, s-maxage=120, stale-while-revalidate=300');
  if (result.embedFailed) res.setHeader('X-Embed-Failed', '1');
  res.setHeader('Content-Type', result.contentType);
  res.status(result.status).send(result.body);
}
