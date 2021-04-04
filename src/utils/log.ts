import { appendFileSync } from 'fs';
import { join } from 'path';

const logPath = join(__dirname, '..', '..', './.noderogue.log');

function writeToFile(message: string): void {
  appendFileSync(logPath, message);
}

export default function log(message: string): void {
  writeToFile(`${message}\n`);
}
