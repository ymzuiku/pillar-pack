#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const copyPublic = require('./copyPublic');
const package = require('../package.json');
const tsconfig = require('./tsconfig.json');
const {
  execLog,
  getSourceDir,
  getSourceFilePath,
  getOutDirPath,
  getPublicDirPath,
  getLibFilePath,
  saveTsConfig,
} = require('./utils');
const argv = process.argv.splice(2);

let bundleName = `bundle_${Date.now()}.js`;
let outDir = `build`;
let publicDir = `src/public`;
let publicDirPath = getPublicDirPath(publicDir);
let outDirPath = getOutDirPath(outDir);
let sourceFile = `src/index.js`;
let htmlFile = `index.html`;
let bundleReanme = `bundle-rename.js`;
let sourceDir = getSourceDir(sourceFile);
let sourceFilePath = getSourceFilePath(sourceFile);
let libFilePath = getLibFilePath(outDirPath, sourceFilePath);
let isProd = false;
let jsx = 'react';
let sourceMap = true;
let targetES3 = 'es3';
let isAutoCreateTsConfig = true;
let isAutoCopyPublicDir = true;

// 命令行参数
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-o') {
    outDir = argv[i + 1];
  }
  if (argv[i] === '-s') {
    sourceFile = argv[i + 1];
  }
  if (argv[i] === '--public') {
    publicDir = argv[i + 1];
  }
  if (argv[i] === '--prod') {
    isProd = true;
  }
  if (argv[i] === '--html') {
    htmlFile = argv[i + 1];
  }
  if (argv[i] === '--rename') {
    bundleName = argv[i + 1];
  }
  if (argv[i] === '--jsx') {
    jsx = argv[i + 1];
  }
  if (argv[i] === '--no-tsconfig') {
    isAutoCreateTsConfig = false;
  }
  if (argv[i] === '--no-public') {
    isAutoCopyPublicDir = false;
  }
  if (argv[i] === '--source-map') {
    if (argv[i + 1] === 'true') {
      sourceMap = true;
    } else if (argv[i + 1] === 'false') {
      sourceMap = false;
    }
  }
  if (argv[i] === '--target') {
    targetES3 = argv[i + 1];
  }
  if (argv[i] === '--version') {
    console.log('pillar-pack: ' + package.version);
  }
  if (argv[i] === '-h' || argv[i] === '--help') {
    console.log('-s : source file');
    console.log('-o : set out dir');
    console.log('--public : set public dir');
    console.log('--prod : use prod mode, only build');
    console.log('--html : set dev server html, default public/index.html');
    console.log('--rename : change fix bundleName, defalut bundle-rename.js');
    console.log('--jsx : "react"| "react-native" | "none", defalut: "react"');
    console.log('--no-tsconfig : no auto create tsconfig.json');
    console.log('--no-public : no copy public dir');
    console.log('--source-map : true | false, defalut true');
    console.log('--target : defalut es3');
    console.log('--version : cat version');
  }
}
outDirPath = getOutDirPath(outDir);
sourceDir = getSourceDir(sourceFile);
sourceFilePath = getSourceFilePath(sourceFile);
publicDirPath = getPublicDirPath(publicDir);
libFilePath = getLibFilePath(outDirPath, sourceFilePath);

if (isProd) {
  fs.removeSync(outDirPath);
}

// change tsconfig
if (jsx === 'react' || jsx === 'react-native') {
  tsconfig.compilerOptions.jsx = jsx;
}
tsconfig.compilerOptions.outDir = outDir;
tsconfig.compilerOptions.sourceMap = sourceMap;
tsconfig.compilerOptions.target = targetES3;
tsconfig.compilerOptions.include = [sourceDir + '/**/*'];
if (isAutoCreateTsConfig) {
  saveTsConfig(tsconfig);
}

if (isAutoCopyPublicDir) {
  copyPublic({ publicDirPath, outDir, bundleName, bundleReanme, htmlFile });
}

exec('tsc', execLog);
if (isProd) {
  exec(
    `
  fpack ${libFilePath} \
      -o ${outDirPath} \
      --nm "$(pwd)/node_modules" \
      --nm node_modules \
      --preprocess='^${outDir + '/lib'}/.+\.js$' \
      --preprocess='^node_modules/components/[^/]+\.js$'
  `,
    execLog,
  );
} else {
  exec(
    `
  fpack ./src/index.js \
      -o build \
      -w \
      --dev \
      --nm "$(pwd)/node_modules" \
      --nm node_modules \
      --preprocess='^ui/.+\.js$' \
      --preprocess='^node_modules/components/[^/]+\.js$'
  `,
    execLog,
  );
}

exec(`browser-sync start --server --files "*.js, *.html, *.css"`, execLog);
