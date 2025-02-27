import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // pega a configuração do arquivo .env
  const configService =
    app.get<ConfigService<EnvironmentConfig, true>>(ConfigService);
  // pega a porta do arquivo.env
  const port = configService.get<number>('port', { infer: true });
  await app.listen(port);
}

bootstrap();
