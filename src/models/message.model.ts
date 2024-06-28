import mongoose, {Schema, Document} from 'mongoose';

export interface MessageInterface extends Document {
  createdAt: string | number | Date;
  content: string;
}

export const MessageSchema: Schema<MessageInterface> = new Schema(
  {
    content: {type: String, required: true},
  },
  {timestamps: true}
);
