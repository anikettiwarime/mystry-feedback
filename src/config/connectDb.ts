import {DB_NAME} from '@/lib/helpers/constants';
import mongoose from 'mongoose';

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log('Database is already connected');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: DB_NAME,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database: ', error);
    throw new Error('Error connecting to database');
  }
};

export {connectDB};
