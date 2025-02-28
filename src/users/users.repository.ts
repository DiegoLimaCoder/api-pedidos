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
    return await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  async verifyEmail(token: string): Promise<User> {
    // Primeiro encontra o usuário pelo token
    const user = await this.findByToken(token);

    if (!user) {
      throw new Error('Token de verificação inválido');
    }

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }

  async findByResetToken(token: string) {
    return this.prisma.user.findUnique({
      where: {
        passwordResetToken: token,
      },
    });
  }

  async updateResetToken(
    userId: string,
    data: {
      passwordResetToken: string;
      passwordResetExpires: Date;
      passwordResetCode: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(userId: string, password: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password,
        passwordResetToken: null,
        passwordResetCode: null,
        passwordResetExpires: null,
      },
    });
  }
}
