import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[auth] authorize called, email:', credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log('[auth] missing credentials');
          return null;
        }
        try {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email as string },
          });
          console.log('[auth] admin found:', !!admin);
          if (!admin) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          );
          console.log('[auth] password valid:', valid);
          if (!valid) return null;

          return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
        } catch (err) {
          console.error('[auth] error:', err);
          return null;
        }
      },
    }),
  ],
});
