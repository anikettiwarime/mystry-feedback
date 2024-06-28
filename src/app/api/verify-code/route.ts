import {connectDB} from '@/config/connectDb';
import {NextRequest, NextResponse} from 'next/server';
import {verifySchema} from '@/schemas/verifySchema';
import {UserModel} from '@/models/user.model';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const {username, code} = await request.json();

    const result = verifySchema.safeParse({username, code});

    if (!result.success) {
      const errors = result.error.format() || [];

      return NextResponse.json(
        {
          success: false,
          message:
            errors.username && errors.code
              ? `Username error: ${
                  errors.username._errors[0]
                },Verification code error:  ${errors.code?._errors[0] ?? ''}`
              : errors.username
              ? `Username error: ${errors.username._errors[0]}`
              : `Verification code error: ${errors.code?._errors[0] ?? ''}`,
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        {message: 'User not found', success: false},
        {status: 404}
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {message: 'User verified successfully', success: true},
        {status: 200}
      );
    } else if (!isCodeValid) {
      return NextResponse.json(
        {message: 'Invalid verification code', success: false},
        {status: 400}
      );
    } else {
      return NextResponse.json(
        {
          message:
            'Verification code expired please signup again to get a new code',
          success: false,
        },
        {status: 400}
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {message: 'Error in verifying otp', success: false},
      {status: 500}
    );
  }
}
