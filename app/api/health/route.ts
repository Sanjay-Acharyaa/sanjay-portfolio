import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrlSet = !!process.env.DATABASE_URL;
  const dbUrlHost = process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : 'not-set';

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', db: 'connected', dbUrlSet, dbUrlHost });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', db: 'failed', dbUrlSet, dbUrlHost, error: String(err) },
      { status: 500 }
    );
  }
}
