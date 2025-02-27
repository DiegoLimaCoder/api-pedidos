import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from 'src/config/configuration';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(
    private readonly configService: ConfigService<EnvironmentConfig, true>,
  ) {
    this.resend = new Resend(this.configService.get('resendApiKey'));
  }

  private async compileTemplate(templateName: string, data: any) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${templateName}.hbs`,
    );
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const template = handlebars.compile(templateContent);

    return template(data);
  }

  async sendUserConfirmation(email: string, name: string, token: string) {
    try {
      const confirmationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

      const htmlContent = await this.compileTemplate('email-confirmation', {
        name,
        confirmationUrl,
      });

      const { data, error } = await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Confirme seu email',
        html: htmlContent,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
