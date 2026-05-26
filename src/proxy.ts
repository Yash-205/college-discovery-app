import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

async function verifyJwt(token: string, secretStr: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [headerB64, payloadB64, signatureB64] = parts;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  
  const secretData = encoder.encode(secretStr);
  const key = await crypto.subtle.importKey(
    'raw',
    secretData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  const signature = base64UrlDecode(signatureB64);
  
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signature as any,
    data
  );
  
  if (!isValid) return null;
  
  const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
  return JSON.parse(payloadStr);
}

export async function proxy(request: NextRequest) {
  // Only intercept write/protected HTTP methods on specific routes
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Intercept protected paths and methods
  const isDiscussionWrite = path.startsWith('/api/discussions') && method === 'POST';
  const isSavedCollegesWrite = path.startsWith('/api/users/saved'); // Intercept both GET and POST for saved colleges since both need auth

  if (isDiscussionWrite || isSavedCollegesWrite) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing Authorization Header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret';

    try {
      const payload = await verifyJwt(token, secret);
      if (!payload || !payload.userId) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token signature' }, { status: 401 });
      }

      // Inject verified credentials into down-stream request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email || '');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error: any) {
      return NextResponse.json({ message: 'Unauthorized: Token parsing error', error: error.message }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware intercepts
export const config = {
  matcher: [
    '/api/discussions/:path*',
    '/api/users/saved',
  ],
};
