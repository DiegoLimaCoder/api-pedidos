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

    console.log('token salvo no banco de dados', verificationToken);

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

  async forgotPassword(email: string) {
    // Verificar se o email existe no banco de dados
    const user = await this.usersRepository.findByEmail(email);

    // Por segurança, não revelamos se o email existe ou não
    if (!user) {
      return {
        message:
          'Se o email existir, você receberá as instruções de recuperação.',
      };
    }

    // Gerar um token de redefinição de senha
    const resetToken = uuidv4();

    // Gerar um código de verificação de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Definir a data de expiração do token para 1 hora a partir do momento atual
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

    // Atualizar o token e a data de expiração no banco de dados
    await this.usersRepository.updateResetToken(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: tokenExpiration,
      passwordResetCode: verificationCode,
    });

    await this.mailService.sendPasswordReset(
      email,
      user.name,
      resetToken,
      verificationCode,
    );

    return {
      message:
        'Se o email existir, você receberá as instruções de recuperação.',
    };
  }

  async resetPassword(token: string, code: string, password: string) {
    const user = await this.usersRepository.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido.');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token expirado.');
    }

    // Verificar se o código fornecido corresponde ao código armazenado
    if (user.passwordResetCode !== code) {
      throw new BadRequestException('Código de verificação inválido.');
    }

    const hashedPassword = await hash(password, 10);

    await this.usersRepository.updatePassword(user.id, hashedPassword);
    return {
      message: 'Senha redefinida com sucesso.',
    };
  }
}
