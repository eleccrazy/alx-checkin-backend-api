import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as QRCode from 'qrcode';
import * as path from 'path';

const basePath = path.join(__dirname, '../../../public/qrcodes');

export class QRImageProcesser {
  // Create a new function to generate QR codes
  async generateQRCode(studentId: string) {
    try {
      // Check if QRCode exits in the file system
      const completePath = `${basePath}/${studentId}.png`;
      const qrCodeImage = await QRCode.toBuffer(studentId, { scale: 5 });
      await fsPromises.writeFile(completePath, qrCodeImage);
      return { path: completePath };
    } catch (error) {
      return 'Failed to generate qr code';
    }
  }

  // Get QR image path from file system
  async getImagePath(studentId: string): Promise<any> {
    try {
      const completePath = `${basePath}/${studentId}.png`;
      // Check if path exists
      if (!fs.existsSync(completePath)) {
        return { error: 'Could not find associated qr code.' };
      }
      return { localPath: `${studentId}.png`, remotePath: 'fakepath' };
    } catch (error) {
      return { error: 'Could not get qr image path' };
    }
  }

  // Delete QR image from file system
  async deleteQRImage(studentId: string) {
    const completePath = `${basePath}/${studentId}.png`;
    try {
      // Check if the path exists
      await fsPromises.access(completePath);
      await fsPromises.unlink(completePath);
      return { message: 'QR image deleted' };
    } catch (error) {
      // Handle the error and send an appropriate error message
      if (error.code === 'ENOENT') {
        // File not found
        return { message: 'image not found' };
      }
      return { error: 'Could not delete the associated QRCode' };
    }
  }
}
