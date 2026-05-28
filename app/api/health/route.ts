import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst({
      select: { email: true, name: true, role: true },
    });
    return NextResponse.json({ status: 'ok', admin });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: String(err).slice(0, 200) }, { status: 200 });
  }
}
