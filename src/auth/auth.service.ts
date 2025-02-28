import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentConfig } from 'src/config/configuration';
import { usersRepository } from 'src/users/users.repository';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfig, true>,
    private usersRepository: usersRepository,
  ) {}

  // Gera um novo token de acesso e um novo token de atualização
  async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('jwtSecret'),

          expiresIn: '15m', // 15 minutos
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('jwtRefreshSecret'),
          expiresIn: '7d', // 7 dias
        },
      ),
    ]);

    // Calcula a expiração do token de atualização
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 dias

    // Salva o relefresh token no banco de dados
    await this.usersRepository.updateRefreshToken(
      userId,
      refreshToken,
      refreshTokenExpires,
    );

    // Retorna os tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Primeiro, encontra o usuário pelo refresh token atual
      const user = await this.usersRepository.findByRefreshToken(refreshToken);
      if (
        !user ||
        !user.refreshTokenExpires ||
        user.refreshTokenExpires < new Date()
      ) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }

      // Depois verifica se o token é válido
      try {
        await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get('jwtRefreshSecret'),
        });
      } catch {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Gera novos tokens (access e refresh)
      const tokens = await this.generateTokens(user.id);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Falha na renovação dos tokens');
    }
  }

  async login({ email, password }: LoginDto) {
    // Busca o usuário pelo email
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se o email foi confirmado

    if (!user.emailVerified) {
      throw new BadRequestException('Email não confirmado');
    }

    // Verifica se a senha está correta
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar os tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }
}
