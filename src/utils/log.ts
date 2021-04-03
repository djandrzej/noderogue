import fs from 'fs';

const logPath = './noderogue.log';

function writeToFile(message: string): void {
  fs.appendFileSync(logPath, message);
}

export default function log(message: string, force: boolean = false): void {
  const forceCall = force || false;
  if (forceCall) {
    writeToFile(`${message}\n`);
  }
}
