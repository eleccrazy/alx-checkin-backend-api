import {
  Injectable,
  PipeTransform,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParseFilePipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const basePath = path.join(__dirname, '../../../public/excelUploads');

@Injectable()
export class SaveExcelFilePipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const excelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!excelTypes.includes(file.mimetype)) {
        throw new BadRequestException('File type must be either .xls or .xlsx');
      }
      const completePath = `${basePath}/${file.originalname}`;
      // Save the file to a desired location
      fs.writeFileSync(completePath, file.buffer);
      return completePath;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
