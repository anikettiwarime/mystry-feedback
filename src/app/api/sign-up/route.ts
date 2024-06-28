import {connectDB} from '@/config/connectDb';
import {UserModel} from '@/models/user.model';
import bcrypt from 'bcryptjs';

import {sendVerificationEmail} from '@/lib/helpers/sendVerficationEmail';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const {username, email, fullName, password} = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      verified: true,
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          message: 'User already exists with this username',
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({email});
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            message: 'User already exists with this email',
            success: false,
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        fullName,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      await newUser.save();
    }

    //   Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          message: emailResponse.message,
          success: false,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: 'User registered successfully. Please verify your email.',
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error in registering user: -> ', error);

    return NextResponse.json(
      {
        message: 'Error in registering user',
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
