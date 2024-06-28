import {connectDB} from '@/config/connectDb';
import {UserModel} from '@/models/user.model';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import becrypt from 'bcryptjs';
import {signInSchema} from '@/schemas/signInSchema';

export const {
  handlers: {GET, POST},
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: {label: 'Email/Username', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await connectDB();

          const {identifier, password} = await signInSchema.parseAsync(
            credentials
          );

          const user = await UserModel.findOne({
            $or: [
              {
                email: identifier,
              },
              {
                username: identifier,
              },
            ],
          });

          return user;
        } catch (err: any) {
          throw new Error('Error signing in: ' + err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.fullName = user.fullName;
      }
      return token;
    },

    async session({session, token}) {
      if (token) {
        session.user = {
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
          fullName: token.fullName,
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: 'sign-in',
  },
  secret: process.env.AUTH_SECRET,
});

export const checkUser = async (credentials: any) => {
  try {
    await connectDB();

    const {identifier, password} = await signInSchema.parseAsync(credentials);

    const user = await UserModel.findOne({
      $or: [
        {
          email: identifier,
        },
        {
          username: identifier,
        },
      ],
    });

    if (!user) {
      throw new Error(
        'No user found with that email address or username. Please check your credentials and try again.'
      );
    }

    if (!user.isVerified) {
      throw new Error(
        'Your account email has not been verified yet. Please check your inbox for a verification email.'
      );
    }

    const isPasswordValid = await becrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error(
        'The password you entered is incorrect. Please try again.'
      );
    }

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
