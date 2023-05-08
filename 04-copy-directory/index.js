const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

async function copyDir() {
  try {
    await fs.promises.access(destDir);
  } catch (err) {
    await fs.promises.mkdir(destDir);
  }

  const files = await readdir(sourceDir);

  await Promise.all(files.map(async file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    const [sourceStat, destStat] = await Promise.all([
      stat(sourcePath),
      stat(destPath).catch(() => null)
    ]);

    if (!destStat || sourceStat.mtimeMs > destStat.mtimeMs) {
      await copyFile(sourcePath, destPath);
    }
  }));

  const destFiles = await readdir(destDir);
  await Promise.all(destFiles.map(async file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    try {
      await fs.promises.access(sourcePath);
    } catch (err) {
      await fs.promises.unlink(destPath);
    }
  }));
}

copyDir();