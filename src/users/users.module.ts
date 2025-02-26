import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';

import { UsersResitory } from './users.repository';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResitory, PrismaService],
})
export class UsersModule {}
