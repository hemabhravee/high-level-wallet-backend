import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_CONNECTION_URL ||
        'mongodb+srv://dbUser:MQAd3dGFBDfzg==@cluster0.06kaxeq.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: process.env.MONGO_DB_NAME || 'wallet-management',
      },
    ),
  ],
})
export class DatabaseModule {}
