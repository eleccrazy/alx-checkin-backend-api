import { BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { ExcelRegisterData } from '../interfaces/students.interface';

interface ExcelRow {
  [key: string]: any;
}

export function excelProcessor(filePath: string): ExcelRegisterData[] {
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.SheetNames[0];
    const jsonData: any[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[worksheet],
      {
        header: 1,
      },
    );

    const columnNames: string[] = jsonData[0];
    const requiredColumns: string[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
    ];
    const missingColumns: string[] = requiredColumns.filter(
      (column) => !columnNames.includes(column),
    );

    if (missingColumns.length > 0) {
      throw new BadRequestException(
        `Missing required columns: ${missingColumns.join(', ')}`,
      );
    }
    const rows: any[] = jsonData.slice(1);
    const result: ExcelRegisterData[] = rows.map((row: any[]) => {
      const rowData: ExcelRegisterData = {
        firstName: row[columnNames.indexOf('firstName')],
        lastName: row[columnNames.indexOf('lastName')],
        email: row[columnNames.indexOf('email')],
        phone: row[columnNames.indexOf('phone')],
        gender: row[columnNames.indexOf('gender')],
      };
      return rowData;
    });
    return result;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException('Invalid Excel file');
  }
}
