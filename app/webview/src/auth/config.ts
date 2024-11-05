import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signinAction } from '@/server-actions/signin-action';
import { AuthToken } from '@/domain/schema';

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                if (typeof credentials.email !== 'string') return null;
                if (typeof credentials.password !== 'string') return null;

                try {
                    const res = await signinAction(credentials.email, credentials.password);
                    
                    return {
                        email: credentials.email,
                        authorization: res
                    };
                } catch {
                    console.error('不正なログインです。');
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email
                token.authorization = user.authorization
            }
            return token;
        },
        async session({ session, token }) {
            session.user.authorization = token.authorization as AuthToken
            return session;
        }
    },
});