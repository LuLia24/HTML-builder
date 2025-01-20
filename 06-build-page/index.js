const { readdir, rm, mkdir, copyFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

function newDir(sourse) {
  return rm(path.join(__dirname, sourse), { force: true, recursive: true })
    .then(() => {
      return mkdir(path.join(__dirname, sourse), { recursive: true });
    })
    .catch((err) => {
      console.log(err);
    });
}

function copyDir(sourse, target) {
  rm(path.join(__dirname, target), { force: true, recursive: true })
    .then(() => {
      return mkdir(path.join(__dirname, target), { recursive: true });
    })
    .then(() => {
      return readdir(path.join(__dirname, sourse), { withFileTypes: true });
    })
    .then((files) => {
      files.forEach((file) => {
        if (file.isDirectory()) {
          return copyDir(
            path.join(sourse, file.name),
            path.join(target, file.name),
          );
        } else {
          const pathForClone = path.join(__dirname, sourse, file.name);
          const newPath = path.join(__dirname, target, file.name);

          return copyFile(pathForClone, newPath);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

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

newDir('project-dist')
  .then(() => {
    return copyDir('assets', path.join('project-dist', 'assets'));
  })
  .then(() => {
    const pathForClone = path.join(__dirname, 'styles');
    const newPath = path.join(__dirname, 'project-dist', 'style.css');

    unitFiles(pathForClone, newPath, '.css');
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      const templateHtmlPath = path.join(__dirname, 'template.html');
      const templateHtmlStream = fs.createReadStream(templateHtmlPath, 'utf-8');

      let temp = '';
      templateHtmlStream.on('data', (chunk) => (temp += chunk));
      templateHtmlStream.on('end', () => {
        resolve(temp);
      });
      templateHtmlStream.on('error', (error) => reject(error));
    });
  })
  .then((temp) => {
    const pathForClone = path.join(__dirname, 'components');
    const componentsList = readdir(pathForClone, { withFileTypes: true });
    return Promise.all([temp, componentsList, pathForClone]);
  })
  .then(([temp, files, pathForClone]) => {
    files.forEach((file) => {
      const componentPath = path.join(pathForClone, file.name); // file = components

      const arr = [];

      if (!file.isDirectory() && path.extname(componentPath) === '.html') {
        const componentPromise = new Promise((resolve, reject) => {
          const componentReadStream = fs.createReadStream(
            componentPath,
            'utf-8',
          );
          let componentTemp = '';
          componentReadStream.on('data', (chunk) => (componentTemp += chunk));
          componentReadStream.on('end', () => {
            const replaceTemplate = `{{${file.name.split('.')[0]}}}`;
            resolve([replaceTemplate, componentTemp]); //строки файлов
          });
          componentReadStream.on('error', (error) => reject(error));
        });
        arr.push(componentPromise);
      }

      Promise.all(arr).then((arr) => {
        arr.forEach((el) => {
          temp = temp.replaceAll(el[0], `\n${el[1]}\n`);
        });

        const targetHtmlPath = path.join(
          __dirname,
          'project-dist',
          'index.html',
        );
        const writeableStream = fs.createWriteStream(targetHtmlPath, 'utf-8');
        writeableStream.write(temp);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
