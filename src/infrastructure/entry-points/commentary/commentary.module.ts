import { Module } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CommentaryController } from './commentary.controller';
import { MailModule } from 'src/infrastructure/driven-adapters/mail-adapter/module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../auth/user.module';

@Module({
  imports: [MailModule, ProjectModule, UserModule],
  controllers: [CommentaryController],
  providers: [CommentaryService],
})
export class CommentaryModule {}
