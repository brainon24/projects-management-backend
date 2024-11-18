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
  async send(payload: Dto) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: this.MAIL_USER,
          pass: this.MAIL_SECRET,
        },
      });

      await transporter.sendMail({
        from: this.MAIL_USER,
        // to: 'daviddiazlds1221@gmail.com',
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
}

interface Dto {
  project: IProject;
  authorProject: IUser;
  authorComment: IUser;
  comment: ICommentary;
}
