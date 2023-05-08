const fs = require('fs');
const path = require('path');

const stylesFolder = path.join('05-merge-styles', 'styles');
const distFolder = path.join('05-merge-styles', 'project-dist');

function getStylesFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(stylesFolder, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const cssFiles = files.filter((file) => path.extname(file) === '.css');
        const cssFilePaths = cssFiles.map((file) => path.join(stylesFolder, file));
        resolve(cssFilePaths);
      }
    });
  });
}

function createBundle() {
  getStylesFiles().then((cssFilePaths) => {
    const promises = cssFilePaths.map((file) => {
      return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    });
    Promise.all(promises).then((styles) => {
      const bundlePath = path.join(distFolder, 'bundle.css');
      fs.writeFile(bundlePath, styles.join('\n'), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Bundle created successfully!');
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }).catch((err) => {
    console.error(err);
  });
}

createBundle();