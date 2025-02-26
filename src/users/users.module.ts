import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { UsersResitory } from './users.repository';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [MailModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResitory],
})
export class UsersModule {}
