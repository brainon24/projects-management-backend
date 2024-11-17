import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HashModule } from '../infrastructure/driven-adapters/hash-password-adapter/hash-password.module';
import { DatabaseModule } from '../infrastructure/driven-adapters/mongo-adapter/database.module';
import { UserModule } from '../infrastructure/entry-points/auth/user.module';
import { BusinessModule } from '../infrastructure/entry-points/business/business.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ProjectModule } from '../infrastructure/entry-points/project/project.module';
import { CommentaryModule } from '../infrastructure/entry-points/commentary/commentary.module';
import { MessageModule } from 'src/infrastructure/entry-points/message/message.module';

@Module({
  imports: [
    HashModule,
    DatabaseModule,
    UserModule,
    UserModule,
    BusinessModule,
    ProjectModule,
    CommentaryModule,
    MessageModule,

    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
