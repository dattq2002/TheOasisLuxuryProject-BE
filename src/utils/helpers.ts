import { createHash } from 'crypto';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();
//viết 1 hàm nhận vào 1 chuỗi và mã hoá theo chuẩn SHA256
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex');
}

//viết 1 hàm nhận vào password và mã hoá theo chuẩn SHA256
export function hashPassword(password: string) {
  return sha256(password + (process.env.PASSWORD_SECRET as string));
}

export function sendMail({ toEmail, token, type }: { toEmail: string; token: string; type: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.USER_NAME_EMAIL}`,
      pass: `${process.env.PASSWORD_EMAIL}`
    }
  });

  // Tạo một đối tượng email
  const mailOptions: nodemailer.SendMailOptions = {
    from: `${process.env.USER_NAME_EMAIL}`,
    to: toEmail,
    subject: `Xác thực ${type} của bạn`,
    text: `Xin chào đây là link xác thực ${type} của bạn: http://localhost:${process.env.PORT}/api/v1/users/${type}/${token}`
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: OK sucessfully !!!');
    }
  });
}

export function sendMailMobile({ toEmail, token, type }: { toEmail: string; token: string; type: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.USER_NAME_EMAIL}`,
      pass: `${process.env.PASSWORD_EMAIL}`
    }
  });

  // Tạo một đối tượng email
  const mailOptions: nodemailer.SendMailOptions = {
    from: `${process.env.USER_NAME_EMAIL}`,
    to: toEmail,
    subject: `Xác thực ${type} của bạn`,
    text: `Xin chào đây là mã xác thực ${type} của bạn: ${token}`
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: OK sucessfully !!!');
    }
  });
}

//hàm format date
export function formatDate(date: Date) {
  return new Date(date.toISOString().split('T')[0]);
}
