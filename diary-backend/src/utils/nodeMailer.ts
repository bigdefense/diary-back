import {gmailConfig} from '@/config/gmail';
import {createTransport} from 'nodemailer';

export const sendEailApi = async (userEmail: string, uuid: string) => {
  try {
    const transporter = createTransport({
      service: 'gmail',
      host: 'smtp.google.com',
      port: 587,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: gmailConfig.GAMIL_OAUTH_USER,
        clientId: gmailConfig.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: gmailConfig.GMAIL_OAUTH_CLIENT_SCRET,
        refreshToken: gmailConfig.GMAIL_OAUTH_REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: gmailConfig.GAMIL_OAUTH_USER,
      to: userEmail,
      subject: '[MYDIARY] 회원가입 이메일 인증 메일',
      html: `
      <h1>회원가입을 위해 링크를 눌러 확인해주세요.</h1>
      <button><a href="https://api.mydiary.site/users/email-verify/${uuid}/${userEmail}">이메일 인증하기</a></button>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err: any) {
    console.error(err);
  }
};
