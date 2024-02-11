import mongoose from 'mongoose';

const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error(error);
  }
};

export default connectToMongoDB;
