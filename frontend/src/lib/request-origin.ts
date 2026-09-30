export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const expected = new URL(request.url);
  // Next's production request URL can use the internal listening hostname.
  // Host is the actual browser destination; do not trust x-forwarded-host.
  const host = request.headers.get('host');
  if (host) {
    expected.port = '';
    expected.host = host;
  }
  return origin === expected.origin;
}
