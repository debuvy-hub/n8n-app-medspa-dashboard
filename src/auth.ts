import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Credentials stored as flat env vars to avoid bcrypt $ sign expansion issues.
// For production, swap to hashed passwords and use bcrypt.compare.
function validateCredentials(email: string, password: string) {
  const storedEmail = process.env.AUTH_EMAIL ?? "";
  const storedPassword = process.env.AUTH_PASSWORD ?? "";

  if (
    email.toLowerCase() !== storedEmail.toLowerCase() ||
    password !== storedPassword
  ) {
    return null;
  }

  return {
    id: "1",
    email: storedEmail,
    name: process.env.AUTH_USER_NAME ?? "Dashboard User",
    clientName: process.env.AUTH_CLIENT_NAME ?? "Client",
    role: (process.env.AUTH_USER_ROLE ?? "owner") as "owner" | "manager",
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) return null;
        return validateCredentials(email, password);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.clientName = (user as Record<string, unknown>).clientName as string;
        token.role = (user as Record<string, unknown>).role as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = session.user as any;
        u.clientName = token.clientName;
        u.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
});
