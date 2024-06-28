import {connectDB} from '@/config/connectDb';
import {auth} from '../auth/[...nextauth]/auth';
import {NextRequest, NextResponse} from 'next/server';
import {UserModel} from '@/models/user.model';
import {User} from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const user: User = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        {
          message: 'Not authenticated',
          success: false,
        },
        {status: 401}
      );
    }

    const {isAcceptingMessages} = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {isAcceptingMessages},
      {new: true}
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: 'User not found',
          success: false,
        },
        {status: 404}
      );
    }

    return NextResponse.json(
      {
        message: `User ${
          updatedUser.isAcceptingMessages
            ? 'is now accepting'
            : 'is no longer accepting'
        } messages`,
        success: true,
      },

      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal server error',
        success: false,
      },
      {status: 500}
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user: User = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        {
          message: 'Not authenticated',
          success: false,
        },
        {status: 401}
      );
    }

    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return NextResponse.json(
        {
          message: 'User not found',
          success: false,
        },
        {status: 404}
      );
    }

    return NextResponse.json(
      {
        isAcceptingMessages: foundUser.isAcceptingMessages,
        success: true,
      },
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal server error',
        success: false,
      },
      {status: 500}
    );
  }
}
