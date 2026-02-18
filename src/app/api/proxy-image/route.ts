import { NextRequest, NextResponse } from 'next/server';

// Hostnames allowed for image proxying (matches next.config.ts remotePatterns)
const ALLOWED_HOSTNAMES = [
  'api.vivahavedimatrimony.com',
  'www.vivahavedimatrimony.com',
  '127.0.0.1',
  'localhost',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  // Security: only proxy from known image hostnames
  if (!ALLOWED_HOSTNAMES.includes(parsedUrl.hostname)) {
    return new NextResponse('URL not allowed', { status: 403 });
  }

  // Security: only allow /images/ paths (user-uploaded content)
  if (!parsedUrl.pathname.startsWith('/images/')) {
    return new NextResponse('Path not allowed', { status: 403 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch {
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}
