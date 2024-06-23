// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
        deviceInfo: { label: "Device Info", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.usernameOrEmail ||
          !credentials?.password ||
          !credentials?.deviceInfo
        ) {
          throw new Error("Invalid username, password, or device info");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.usernameOrEmail },
              { email: credentials.usernameOrEmail },
            ],
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid username or password");
        }

        const knownDevices = await prisma.verifiedDevice.findMany({
          where: { userId: user.id },
        });

        const deviceMatch = knownDevices.some(
          (device) => device.deviceId === credentials.deviceInfo
        );

        if (!deviceMatch) {
          // Generate a 6-digit verification code
          const verificationCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();

          // Update the user's verificationCode in the database
          await prisma.user.update({
            where: { id: user.id },
            data: {
              verificationCode,
            },
          });

          // Send the verification code via email
          const emailContent = {
            to: user.email,
            from: "example.com",
            subject: "Your MFA Code",
            text: `Your MFA code is: ${verificationCode}`,
            html: `<p>Your MFA code is: <strong>${verificationCode}</strong></p>`,
          };

          await sgMail.send(emailContent);

          // Return a specific error that can be checked client-side
          throw new Error(JSON.stringify({ mfaRequired: true }));
        }

        // Return user object to include in the session
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        id: token.id as string, // Ensure these values are strings
        name: token.name || "", // Provide a default value if necessary
        email: token.email as string,
        role: token.role as string,
        image: token.picture || "", // Default to empty if no image
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
