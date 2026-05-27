addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const targetDomain = 'scienceos.ai';

async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === '/robots.txt') {
    const robots = `User-agent: *
Disallow: /
    `;
    return new Response(robots, { status: 200 });
  }

  const origin = `https://${targetDomain}`;
  const actualUrl = new URL(`${origin}${pathname}${url.search}${url.hash}`);

  const modifiedRequest = new Request(actualUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow'
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  return modifiedResponse;
}
