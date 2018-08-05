const path = require('path');
const fs = require('fs-extra');

function execLog(error, stdout, stderr) {
  if (error) {
    console.error(error);
    return;
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
}

function getSourceDir(file) {
  const p = path.resolve(process.cwd(), file);
  return path.dirname(p);
}

function getSourceFilePath(file) {
  return path.resolve(process.cwd(), file);
}

function getOutDirPath(file) {
  return path.resolve(process.cwd(), file);
}
function getPublicDirPath(file) {
  return path.resolve(process.cwd(), file);
}
function getLibFilePath(outPath, sourceFilePath) {
  return path.resolve(outPath, `lib/${path.basename(sourceFilePath)}`);
}
function copyTsConfigAndBabelrc(v, outPath) {
  const p = path.resolve(process.cwd(), 'tsconfig.json');
  const babelFrom = path.resolve(__dirname, '.babelrc');
  const babelTo = path.resolve(outPath, '.babelrc');
  fs.removeSync(p);
  fs.writeJSONSync(p, v, { encoding: 'utf-8' });
  fs.copyFileSync(babelFrom, babelTo);
}

module.exports = {
  execLog,
  getSourceDir,
  getSourceFilePath,
  getOutDirPath,
  getPublicDirPath,
  getLibFilePath,
  copyTsConfigAndBabelrc,
};
