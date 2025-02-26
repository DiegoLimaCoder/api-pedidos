import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
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
      const confirmationUrl = `http://localhost:3000/verify-email?token=${token}`;

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
