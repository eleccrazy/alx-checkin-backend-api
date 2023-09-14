import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { QRImageProcesser } from './qr-image-processor';
import verifyEmail from './verify-email';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const qrImageProcesser = new QRImageProcesser();

const basePath = path.join(__dirname, '../../../public/qrcodes');

const mailSender = async (
  id: string,
  firstName: string,
  from: string,
  password: string,
  to: string,
  subject: string,
  text: string,
  host: string,
  port: number,
): Promise<{ message: string }> => {
  try {
    // Get qr code path
    const path = await qrImageProcesser.getImagePath(id);
    if (path.error) {
      throw new BadRequestException(path.error);
    }
    // Create a transproter object
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // Set to true if using a secure connection (e.g., TLS)
      auth: {
        user: from,
        pass: password,
      },
    });

    // Check if email is a verified email address.
    const res = await verifyEmail(to);
    if (!res) {
      throw new BadRequestException('Invalid email address');
    }
    const info = await transporter.sendMail({
      from: from, // sender address
      to: to, // receiver address
      subject: subject, // Subject Line
      text: `Dear ${firstName},\n\n${text}`, // text body, can be html
      attachments: [
        {
          filename: `${firstName.replace(/\s/g, '_')}_QRCode.png`,
          path: path.path,
        },
      ],
    });
    return { message: 'Mail sent successfully' };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
    throw new Error();
  }
};

export default mailSender;
