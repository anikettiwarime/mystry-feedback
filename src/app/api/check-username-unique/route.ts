import {connectDB} from '@/config/connectDb';
import {UserModel} from '@/models/user.model';
import {signUpSchema} from '@/schemas/signUpSchema';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

const UsernameQuerySchema = z.object({
  username: signUpSchema.pick({username: true}).shape.username,
});

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const {searchParams} = new URL(request.url);

    const queryParams = {
      username: searchParams.get('username'),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        {
          status: 400,
        }
      );
    }

    const {username} = result.data;

    const existingUser = await UserModel.findOne({username, isVerified: true});

    if (existingUser) {
      return NextResponse.json(
        {
          message: 'Username already taken',
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: 'Username is unique',
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error('Error in check-username-unique route: ', err);

    return NextResponse.json(
      {
        message: 'Error checking username uniqueness',
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
