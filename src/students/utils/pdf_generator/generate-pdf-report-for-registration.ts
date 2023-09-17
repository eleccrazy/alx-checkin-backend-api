import * as xlsx from 'xlsx';
import { ExcelRegisterData } from 'src/students/interfaces/students.interface';
import * as path from 'path';

const basePath = path.join(
  __dirname,
  '../../../../public/reports/registration',
);

async function updateRegistrationStatus(
  filePath: string,
  students: ExcelRegisterData[],
  status: string[],
): Promise<string> {
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.SheetNames[0];
    const worksheetData: any[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[worksheet],
      {
        header: 1,
        blankrows: false,
      },
    );

    // Add the registration status as a new column header
    const statusColumnHeader = 'Status';
    worksheetData[0].push(statusColumnHeader);

    // Update the registration status for each student
    for (let i = 1; i < worksheetData.length; i++) {
      const student = students[i - 1];
      worksheetData[i].push(status[i - 1]);
    }

    // Update the worksheet with the modified data
    const updatedWorksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    workbook.Sheets[worksheet] = updatedWorksheet;

    // Save the updated workbook to a new file
    const updatedFileName = `registration_report_updated.xlsx`;
    // Specify the target file path
    const targetFilePath = path.join(basePath, updatedFileName);
    xlsx.writeFile(workbook, targetFilePath);
    return updatedFileName;
  } catch (error) {
    throw new Error();
  }
}

export default updateRegistrationStatus;
