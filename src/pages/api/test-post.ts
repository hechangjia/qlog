import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  return new Response('GET works', { status: 200 });
};

export const POST: APIRoute = () => {
  console.log('TEST POST HANDLER CALLED');
  return new Response('POST works', { status: 200 });
};
