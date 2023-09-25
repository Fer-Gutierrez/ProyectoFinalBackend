import mailer from "nodemailer";
import { CONFIG } from "../config/config.js";

class MailService {
  constructor() {
    this.client = mailer.createTransport({
      service: CONFIG.MAIL_SERVICE,
      port: 587,
      auth: {
        user: CONFIG.MAIL_USER,
        pass: CONFIG.MAIL_PASSWORD,
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
    {
      let result = await this.client.sendMail({
        from,
        to,
        subject,
        html,
        attachments,
      });
      return result;
    }
  };
}

export default new MailService();
