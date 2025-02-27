import { ConfigFactory } from '@nestjs/config';
import { validationSchema } from './env.validation';

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  resendApiKey: string;
  databaseUrl: string;
}

const configuration: ConfigFactory<EnvironmentConfig> = () => {
  const config = validationSchema.validate(process.env);

  return {
    port: config.value.PORT ? parseInt(config.value.PORT, 10) : 3000,
    nodeEnv: config.value.NODE_ENV || 'development',
    resendApiKey: config.value.RESEND_API_KEY,
    databaseUrl: config.value.DATABASE_URL,
  };
};
export default configuration;
