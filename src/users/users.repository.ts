import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersResitory {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByToken(token: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  async verifyEmail(token: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        emailVerificationToken: token,
      },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }
}
