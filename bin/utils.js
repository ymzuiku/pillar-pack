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
function getOnlyServerDirPath(file) {
  return path.resolve(process.cwd(), file);
}
function saveTsConfig(v) {
  const p = path.resolve(process.cwd(), 'tsconfig.json');
  fs.removeSync(p);
  fs.writeJSONSync(p, v, { encoding: 'utf-8' });
}



module.exports = {
  execLog,
  getSourceDir,
  getSourceFilePath,
  getOutDirPath,
  getPublicDirPath,
  getOnlyServerDirPath,
  getLibFilePath,
  saveTsConfig,
};
