const fs = require('fs').promises;
const path = require('path');

const fPath = path.join(__dirname, 'secret-folder');

async function listFiles() {
  try {
    const files = await fs.readdir(fPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isDirectory()) {
        const [name, type] = file.name.split('.');
        const stats = await fs.stat(path.join(fPath, file.name));
        const resStr = `${name}-${type}-${(stats.size / 1024).toFixed(2)}kb`;
        console.log(resStr);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listFiles();
