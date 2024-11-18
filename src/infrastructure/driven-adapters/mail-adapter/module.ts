import { Global, Module } from '@nestjs/common';
import { MailService } from './service';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
