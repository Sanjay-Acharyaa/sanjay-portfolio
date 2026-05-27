import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? '';
  const urlLen = dbUrl.length;
  const urlFirst50 = dbUrl.slice(0, 50);
  const urlLast20 = dbUrl.slice(-20);

  // Parse out hostname from the URL
  let host = 'parse-error';
  try {
    const m = dbUrl.match(/@([^/:?]+)/);
    host = m ? m[1] : 'no-host-found';
  } catch { /**/ }

  // Try a direct HTTP fetch to Neon's serverless HTTP API
  let neonHttpResult = 'not-tried';
  try {
    const neonApiUrl = `https://${host}/sql`;
    const res = await fetch(neonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${dbUrl}` },
      body: JSON.stringify({ query: 'SELECT 1' }),
    });
    neonHttpResult = `HTTP ${res.status}`;
  } catch (e) {
    neonHttpResult = `fetch-error: ${String(e).slice(0, 100)}`;
  }

  return NextResponse.json({
    urlLen,
    urlFirst50,
    urlLast20,
    host,
    neonHttpResult,
  });
}
