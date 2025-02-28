import { Controller, Post, Body, Get, Query, Param, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    await this.usersService.verifyEmail(token);
    res.redirect('http://localhost:3000/sign-in');
    return { message: 'Email confirmado com sucesso !' };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.usersService.forgotPassword(email);
  }

  @Get('/reset-password')
  async resetPasswordForm(@Query('token') token: string) {
    // Esta rota apenas renderiza o formulário de redefinição de senha
    return { token };
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('code') code: string,
    @Body('password') password: string,
  ) {
    return this.usersService.resetPassword(token, code, password);
  }
}
