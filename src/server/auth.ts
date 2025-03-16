import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import EmailProvider from 'next-auth/providers/email';

import { env } from '@/env';
import { db } from '@/server/db';
// import { sendMagicLinkEmail } from '@/server/services/sendgrid';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/join',
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    EmailProvider({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sendVerificationRequest({ identifier, url }) {
        // sendMagicLinkEmail(identifier, url);
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    async session({ session }) {
      const existingUser = await db.user.findFirst({
        where: { email: session.user.email },
      });
      if (existingUser) {
        session.user.id = existingUser.id;
        session.user.name = existingUser.name;
      }
      return session;
    },
    async signIn({ account }) {
      if (account?.provider == 'email') {
        const existingUser = await db.user.findFirst({
          where: { email: account.userId },
        });
        if (!existingUser) {
          await db.user.create({
            data: {
              email: account.userId,
            },
          });
        }
      }
      return true;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
