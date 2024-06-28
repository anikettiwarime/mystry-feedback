'use client';

import {X} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from './ui/button';
import {MessageInterface} from '@/models/message.model';
import axios, {AxiosError} from 'axios';
import {toast} from './ui/use-toast';
import {ApiResponse} from '@/types/ApiResponse';

type MessageCardProps = {
  message: MessageInterface;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
  const handleDeleteconfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });

      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className='card-bordered'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className='w-5 h-5' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteconfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className='text-sm'>
          {new Date(message.createdAt).toLocaleString()}
          {/* {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')} */}
          2024-06-27 12:00:00
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCard;
