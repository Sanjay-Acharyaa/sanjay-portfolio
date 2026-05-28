import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Step 1: findUnique (same as authorize does)
    const admin = await prisma.admin.findUnique({
      where: { email: 'sanjay@portfolio.com' },
    });

    if (!admin) return NextResponse.json({ step: 'findUnique', result: 'not found' });

    // Step 2: bcrypt compare
    const valid = await bcrypt.compare('admin123', admin.password);

    return NextResponse.json({
      step: 'complete',
      adminFound: true,
      email: admin.email,
      passwordValid: valid,
      passwordHashPrefix: admin.password.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json({ step: 'error', error: String(err).slice(0, 300) });
  }
}
