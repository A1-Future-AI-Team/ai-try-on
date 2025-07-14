import mongoose from 'mongoose';

const maskMongoUri = (uri: string) => {
  // Mask credentials in the URI for logging
  return uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*:.*)@/, '$1****:****@');
};

const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-try-on';
    console.log('[MongoDB] Attempting to connect to:', maskMongoUri(mongoURI));
    
    const options = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority' as const,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[MongoDB] Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[MongoDB] Connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('[MongoDB] Database connection failed:', error);
    if (error instanceof Error) {
      console.error('[MongoDB] Reason:', error.message);
    }
    process.exit(1);
  }
};

export { connectDatabase }; 