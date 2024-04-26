import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, MongooseModule.forRoot("mongodb+srv://omar:omar123456@cluster0.3lmci0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
