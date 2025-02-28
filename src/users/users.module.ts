import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { usersRepository } from './users.repository';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [MailModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, usersRepository],
  exports: [usersRepository],
})
export class UsersModule {}
