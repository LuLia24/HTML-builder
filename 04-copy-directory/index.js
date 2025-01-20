const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const path = require('path');

function copyDir(sourse, target) {
  rm(path.join(__dirname, target), { force: true, recursive: true })
    .then(() => {
      return mkdir(path.join(__dirname, target), { recursive: true });
    })
    .then(() => {
      return readdir(path.join(__dirname, sourse));
    })
    .then((files) => {
      files.forEach((file) => {
        const pathForClone = path.join(__dirname, sourse, file);
        const newPath = path.join(__dirname, target, file);

        return copyFile(pathForClone, newPath);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
copyDir('files', 'files-copy');
