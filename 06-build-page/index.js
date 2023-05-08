const fs = require('fs').promises;
const path = require('path');
const fsPr = require('fs');

async function buildHTML() {
  const template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const regex = /{{(.+?)}}/g;

  let matches = [];
  let match;
  while ((match = regex.exec(template))) {
    matches.push(match[1]);
  }

  let result = template;
  for (const filename of matches) {
    const articles = await fs.readFile(path.join(__dirname, 'components', `${filename}.html`), 'utf-8');
    if (articles) {
      result = result.replace(`{{${filename}}}`, articles);
    }
  }

  await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  await fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), result, { flag: 'w' });
}

const stylesFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');

function getStylesFiles() {
  return new Promise((resolve, reject) => {
    fsPr.readdir(stylesFolder, (err, files) => {
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
        fsPr.readFile(file, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    });
    Promise.all(promises).then((styles) => {
      const bundlePath = path.join(distFolder, 'style.css');
      fsPr.writeFile(bundlePath, styles.join('\n'), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }).catch((err) => {
    console.error(err);
  });
}


function copy(sourceDir, destDir) {
  fsPr.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }
    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);

      fsPr.stat(sourcePath, (err, stats) => {
        if (stats.isDirectory()) {
          fsPr.mkdir(destPath,
            () => {
              copy(sourcePath, destPath)
            })

        }
        if (stats.isFile()) {
          fsPr.copyFile(sourcePath, destPath, err => {
            if (err) {
              console.error(`Error copying file ${sourcePath}: ${err}`);
              return;
            }
          });
        }

      })

    });
  });
}

buildHTML()
  .then(() => {
    fsPr.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => { })
    copy(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))

    fsPr.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => { })
    createBundle()
  })
  .catch((err) => console.error(err));



