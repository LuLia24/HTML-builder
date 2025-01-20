const fs = require('fs');
const path = require('path');

const txtPath = path.join(__dirname, 'text.txt');

const rs = fs.createReadStream(txtPath, 'utf-8');
let data = '';
rs.on('data', (chunk) => {
  data += chunk;
});
rs.on('end', () => {
  console.log(data);
});
rs.on('error', (err) => {
  console.error(err);
});
