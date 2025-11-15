import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import config from 'src/application/config';
import { IProject } from 'src/domain/common/project/project.interface';
import { IUser } from 'src/domain/common/user/user.interface';
import { ICommentary } from 'src/domain/common/commentary/commentary.interface';

@Injectable()
export class MailService {
  MAIL_USER = config().mailer.user;
  MAIL_SECRET = config().mailer.pass;

  private async createTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.MAIL_USER,
        pass: this.MAIL_SECRET,
      },
    });
  }

  async send(payload: CommentaryNotificationDto) {
    try {
      const transporter = await this.createTransporter();

      await transporter.sendMail({
        from: this.MAIL_USER,
        to: payload.authorProject.email,
        subject: `Tenemos una nueva actualización en tu proyecto: ${payload.project.title}`,
        html: `Hola ${payload.authorProject.fullName},
${payload.authorComment.fullName} hizo una nueva actualización.
<br />
<p><strong>Actualización:</strong> ${payload.comment.commentary}</p>
<br />
<br />
<strong>Por favor no responder este correo ya que fue generado automáticamente</strong>
<center><p>Atentamente, tú equipo de brainon24</p></center>
<center><p>Desarrollo de brainon24</p><a href="https://www.linkedin.com/in/david-diaz-herrera-2777ba1a8/"><p> por David Diaz H.</p></a></center>
`,
      });
    } catch (error) {
      console.error('Error al enviar correo:', error);
    }
  }

  async sendPasswordReset(email: string, fullName: string, resetToken: string) {
    try {
      const transporter = await this.createTransporter();
      
      // URL del frontend para reset de contraseña - ajustar según tu configuración
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: this.MAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña - brainon24',
        html: `
          <h2>Hola ${fullName},</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer contraseña</a>
          <p>Este enlace expirará en 15 minutos.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <br />
          <br />
          <strong>Por favor no responder este correo ya que fue generado automáticamente</strong>
          <center><p>Atentamente, tú equipo de brainon24</p></center>
          <center><p>Desarrollo de brainon24</p><a href="https://www.linkedin.com/in/david-diaz-herrera-2777ba1a8/"><p> por David Diaz H.</p></a></center>
        `,
      });
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      throw error;
    }
  }

  async sendGenericEmail(to: string, subject: string, htmlContent: string) {
    try {
      const transporter = await this.createTransporter();

      await transporter.sendMail({
        from: this.MAIL_USER,
        to,
        subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error al enviar correo genérico:', error);
      throw error;
    }
  }
}

interface CommentaryNotificationDto {
  project: IProject;
  authorProject: IUser;
  authorComment: IUser;
  comment: ICommentary;
}
