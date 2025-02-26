import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
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
    return res.redirect('/auth');
  }

  @Get('/')
  async home() {
    return 'Email confirmado com sucesso!';
  }
}
