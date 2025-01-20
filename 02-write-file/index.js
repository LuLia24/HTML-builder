const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'answer.txt'), '', (err) => {
  if (err) throw err;
});
stdout.write('Enter your text:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Bye!\n');
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'answer.txt'), data, (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('Good luck!\n');
  process.exit();
});
