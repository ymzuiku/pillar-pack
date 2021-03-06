const fs = require('fs-extra');
const path = require('path');
const babel = require('./babelrc.json');
const { execLog } = require('./utils');
const packageToPath = path.resolve(process.cwd(), 'package.json');
const packageFrom = require('../package.json');
const packageTo = require(packageToPath);
const postcssData = require('./postcssrc.json');
const { exec } = require('child_process');
let initType = 'script';
let isScss = false;
let callback = function() {};

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

module.exports = async function({
  publicDirPath,
  outDirPath,
  bundleReanme,
  bundleEndName,
  isBabelCover,
  isBabelrc,
  isInit,
  isScss,
  runPack,
  isOnlyPack,
}) {
  callback = runPack;
  isScss = isScss;
  if (!isInit) {
    const nodePathTo = path.resolve(process.cwd(), 'node_modules');
    if (!packageTo.devDependencies || !packageTo.devDependencies['babel-plugin-transform-runtime']) {
      console.log('Use "pillar-pack init" in new project...');
      initType = 'auto';
      // throw 'Please first Use "pillar-pack init" in new project';
    }
    if (isOnlyPack === false) {
      if (!fs.existsSync(outDirPath)) {
        fs.mkdirpSync(outDirPath);
      }
      if (fs.existsSync(publicDirPath)) {
        fs.copySync(publicDirPath, outDirPath);
      }
    }
    fs.readdirSync(outDirPath).forEach(v => {
      if (v.indexOf('.html') > 0) {
        const htmlPath = path.resolve(outDirPath, v);
        changeHtml(htmlPath, bundleReanme, bundleEndName);
      }
    });
  }
  const babelPath = path.resolve(process.cwd(), '.babelrc');
  const postcssPath = path.resolve(process.cwd(), '.postcssrc');
  if (isBabelCover === false && isBabelrc) {
    if (!fs.existsSync(babelPath)) {
      fs.writeJSONSync(babelPath, babel);
    }
    if (!fs.existsSync(postcssData)) {
      fs.writeJSONSync(postcssPath, postcssData);
    }
  } else if (isBabelrc) {
    fs.writeJSONSync(babelPath, babel);
    fs.writeJSONSync(postcssPath, postcssData);
  }
  if (isInit || initType === 'auto') {
    doInit();
  } else {
    callback();
  }
};

function doInit() {
  if (!packageTo.devDependencies) {
    packageTo.devDependencies = {};
  }
  Object.keys(packageFrom.pack_babel).forEach(k => {
    packageTo.devDependencies[k] = packageFrom.pack_babel[k];
  });
  if (isScss) {
    Object.keys(packageFrom.pack_scss).forEach(k => {
      packageTo.devDependencies[k] = packageFrom.pack_scss[k];
    });
  }
  if (!packageTo.scripts) packageTo.scripts = {};
  packageTo.scripts.babel = `"./node_modules/.bin/babel src --out-dir lib"`;

  fs.writeJSONSync(packageToPath, packageTo);
  console.log('install babel-plugins...');
  exec('yarn install', initEnd);
}

function initEnd(...args) {
  execLog(...args);
  if (initType === 'auto') {
    console.log('Init done! Now build code and start Server...');
  } else {
    console.log('Init done! Please use "pillar-pack" in this project');
  }
  callback();
}
