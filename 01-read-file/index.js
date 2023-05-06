const fs = require('fs');
const path = require('node:path'); 

const readStream = fs.createReadStream(path.join('01-read-file', 'text.txt'), 'utf8');

readStream.on('data', (data) => {
  console.log(data);
});

readStream.on('error', (err) => {
  console.error(err);
});