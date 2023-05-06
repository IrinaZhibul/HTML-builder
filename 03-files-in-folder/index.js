const fs = require('fs');
const path = require('path');

const folderPath = path.join('03-files-in-folder', 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      
      if (stats.isFile()) {
        const index = file.indexOf(".");
        const name = file.substring(0, index);
        const fileExtension = path.extname(file).slice(1);
        const fileSizeInBytes = stats.size;

        console.log(`${name} - ${fileExtension} - ${fileSizeInBytes}b`);
      }
    });
  });
});