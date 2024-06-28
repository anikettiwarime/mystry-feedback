import {resend} from '@/config/resend';
import VerificationEmail from '../../../emails/VerificationEmail';

import {ApiResponse} from '@/types/ApiResponse';

const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mysterious Email Verification Code',
      react: VerificationEmail({username, otp}),
    });

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error in sending verification email',
    };
  }
};

export {sendVerificationEmail};
