const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const pathForClone = path.join(__dirname, 'styles');
const newPath = path.join(__dirname, 'project-dist', 'bundle.css');

function unitFiles(pathForClone, newPath, fileType) {
  const writeableStream = fs.createWriteStream(newPath, 'utf-8');

  readdir(pathForClone, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const fileForClone = path.join(pathForClone, file.name);

        if (!file.isDirectory() && path.extname(fileForClone) === fileType) {
          const readableStream = fs.createReadStream(fileForClone, 'utf-8');
          readableStream.pipe(writeableStream);
          writeableStream.write('\n');
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

unitFiles(pathForClone, newPath, '.css');
