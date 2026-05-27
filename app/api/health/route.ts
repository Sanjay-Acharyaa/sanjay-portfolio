import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? '';
  const dbUrlSet = dbUrl.length > 0;
  const dbUrlPrefix = dbUrl.slice(0, 20) + (dbUrl.length > 20 ? '...' : '');

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', db: 'connected', dbUrlSet, dbUrlPrefix });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', db: 'failed', dbUrlSet, dbUrlPrefix, error: String(err) },
      { status: 200 }
    );
  }
}
