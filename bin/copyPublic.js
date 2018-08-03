const fs = require('fs-extra');
const path = require('path');
const babel = require('./babelrc.json');
const { execLog } = require('./utils');
const packageToPath = path.resolve(process.cwd(), 'package.json');
const packageFrom = require('../package.json');
const packageTo = require(packageToPath);
const { exec } = require('child_process');

function changeHtml(filePath, bundleReanme, bundleEndName) {
  let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const exp = eval(`/${bundleReanme}/g`);
  data = data.replace(exp, bundleEndName);
  data = data.replace(/<!--\[/g, '');
  data = data.replace(/\]-->/g, '');
  setTimeout(() => {
    fs.removeSync(filePath);
    fs.createFileSync(filePath);
    fs.writeFileSync(filePath, data);
  }, 30);
}

module.exports = function({
  publicDirPath,
  outDirPath,
  bundleReanme,
  bundleEndName,
  babelCover,
  isInit,
}) {
  if (!isInit) {
    if (!fs.existsSync(outDirPath)) {
      fs.mkdirpSync(outDirPath);
    }
    fs.copySync(publicDirPath, outDirPath);
    fs.readdirSync(outDirPath).forEach(v => {
      if (v.indexOf('.html') > 0) {
        const htmlPath = path.resolve(outDirPath, v);
        changeHtml(htmlPath, bundleReanme, bundleEndName);
      }
    });
  }
  const babelPath = path.resolve(process.cwd(), '.babelrc');
  if (babelCover === false) {
    if (!fs.existsSync(babelPath)) {
      fs.writeJSONSync(babelPath, babel);
    }
  } else {
    fs.writeJSONSync(babelPath, babel);
  }
  if (isInit) {
    if (!packageTo.devDependencies) {
      packageTo.devDependencies = {};
    }
    Object.keys(packageFrom.copyDevDependencies).forEach(k => {
      packageTo.devDependencies[k] = packageFrom.copyDevDependencies[k];
    });
    fs.writeJSONSync(packageToPath, packageTo);
    console.log('install babel-plugins...');
    exec('yarn install', execLog);
  }
  // if (false) {
  //   const nodePathFrom = path.resolve(__dirname, '../node_modules');
  //   const nodePathTo = path.resolve(process.cwd(), 'node_modules');
  //   fs.mkdirpSync(nodePathTo);
  //   const packs = fs.readdirSync(nodePathFrom);
  //   const needCopyFiles = ['babel-', 'esutils'];
  //   for (let i = 0; i < packs.length; i++) {
  //     let needCopy = true;
  //     needCopyFiles.forEach(v => {
  //       if (packs[i].indexOf(v) > -1) {
  //         needCopy = false;
  //       }
  //     });
  //     if (needCopy && !fs.existsSync(nodePathTo + '/' + packs[i])) {
  //       fs.copySync(nodePathFrom + '/' + packs[i], nodePathTo + '/' + packs[i]);
  //     }
  //   }
  // }
};
