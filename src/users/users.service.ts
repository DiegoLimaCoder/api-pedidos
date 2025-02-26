import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersResitory } from './users.repository';
import { hash } from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersResitory,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Endereço de e-mail já cadastrado.');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const verificationToken = uuidv4();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 24);

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: tokenExpiration,
    });

    const mailSent = await this.mailService.sendUserConfirmation(
      createUserDto.email,
      createUserDto.name,
      verificationToken,
    );

    if (!mailSent) {
      throw new BadRequestException('Erro ao enviar o email.');
    }

    const { password, emailVerificationToken, ...result } = newUser;
    return result;
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepository.findByToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido.');
    }

    if (!user.emailVerificationExpires) {
      throw new BadRequestException(
        'Token inválido: data de expiração não encontrada.',
      );
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Token expirado.');
    }

    return await this.usersRepository.verifyEmail(token);
  }
}
