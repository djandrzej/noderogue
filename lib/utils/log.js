const fs = require('fs');

const logPath = './noderogue.log';

function writeToFile(message) {
    fs.appendFileSync(logPath, message);
}

module.exports = function (message, force) {
    const forceCall = force || false;
    if (forceCall) {
        writeToFile(`${message}\n`);
    }
};
