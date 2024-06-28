import mongoose, {Schema, Document, Model} from 'mongoose';
import {MessageInterface, MessageSchema} from './message.model';

// Define the interface for the User document
interface UserInterface extends Document {
  username: string;
  password: string;
  email: string;
  isAcceptingMessages: boolean;
  fullName: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  messages: MessageInterface[];
}

// Define the User schema
const UserSchema: Schema<UserInterface> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please fill a valid email address',
      ],
    },
    fullName: {
      type: String,
      required: [true, 'Fullname is required'],
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: true,
    },
    verifyCodeExpiry: {
      type: Date,
      required: true,
    },
    messages: [MessageSchema],
  },
  {timestamps: true}
);

const UserModel: Model<UserInterface> =
  mongoose.models && mongoose.models.User
    ? (mongoose.models.User as Model<UserInterface>)
    : mongoose.model<UserInterface>('User', UserSchema);

export {UserModel};
export type {UserInterface};
