import {NextRequest, NextResponse} from 'next/server';
import {connectDB} from '@/config/connectDb';
import {auth} from '../auth/[...nextauth]/auth';
import {UserModel} from '@/models/user.model';

import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user) {
      console.log('Please login first');

      return NextResponse.json(
        {
          message: 'Please login first',
          sucess: false,
        },
        {
          status: 401,
        }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    const user = await UserModel.aggregate([
      {$match: {_id: userId}},
      {$unwind: '$messages'},
      // {$sort: {'messages.createdAt': -1}},
      {$group: {_id: '$_id', messages: {$push: '$messages'}}},
    ]);

    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          message: "User doesn't have any messages",
          sucess: false,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        messages: user[0].messages,
        sucess: true,
      },
      {status: 200}
    );
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      {
        message: err.message,
        sucess: false,
      },
      {
        status: 500,
      }
    );
  }
}
