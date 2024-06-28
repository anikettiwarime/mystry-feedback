import {connectDB} from '@/config/connectDb';
import {NextRequest, NextResponse} from 'next/server';
import {MessageModel} from '@/models/message.model';
import {UserModel} from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {content, username} = await request.json();

    const user = await UserModel.findOne({username});

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          message: 'User is not accepting messages',
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const message = new MessageModel({
      content,
    });

    user.messages.push(message);

    await user.save();

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      {
        message: err.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
