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
  getOnlyServerDirPath,
  getLibFilePath,
  getIsTypescript,
  copyTsConfigAndBabelrc,
} = require('./utils');
const argv = process.argv.splice(2);

let bin = path.resolve(__dirname, '../node_modules/.bin');
let outDir = `build`;
let publicDir = `public`;
let publicDirPath = getPublicDirPath(publicDir);
let outDirPath = getOutDirPath(outDir);
let sourceFile = `src/index.js`;
let isTypescript = getIsTypescript(sourceFile);
let htmlFile = `index.html`;
let bundleReanme = `bundle-rename.js`;
let sourceDir = getSourceDir(sourceFile);
let sourceFilePath = getSourceFilePath(sourceFile);
let libFilePath = getLibFilePath(outDirPath, sourceFilePath, isTypescript);
let isProd = false;
let jsx = 'react';
let sourceMap = true;
let targetES3 = 'es3';
let isAutoCreateTsConfig = true;
let isAutoCopyPublicDir = true;
let isOnlyServer = false;
let onlyServerDir = 'build';
let onlyServerDirPath = getOnlyServerDirPath(onlyServerDir);
let isOnlyPack = false;
let isCopyAndPackCode = true;
let isOpenBrowser = false;
let tscParams = '';
let syncParams = '';
let fpackParams = '';
let port = 4010;

// 命令行参数
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-o') {
    outDir = argv[i + 1];
  }
  if (argv[i] === '-s') {
    sourceFile = argv[i + 1];
  }
  if (argv[i] === '-c' || argv[i] === '--copy') {
    publicDir = argv[i + 1];
  }
  if (argv[i] === '--prod') {
    isProd = true;
  }
  if (argv[i] === '--port') {
    port = argv[i + 1];
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
  if (argv[i] === '--server') {
    if (argv[i + 1]) {
      onlyServerDir = argv[i + 1];
    }
    isOnlyServer = true;
  }
  if (argv[i] === '--browser' || argv[i] === '-b') {
    isOpenBrowser = true;
  }
  if (argv[i] === '--pack') {
    isOnlyPack = true;
  }
  if (argv[i] === '--tsc-params') {
    tscParams = argv[i + 1];
  }
  if (argv[i] === '--fpack-params') {
    fpackParams = argv[i + 1];
  }
  if (argv[i] === '--sync-params') {
    syncParams = argv[i + 1];
  }
  if (argv[i] === '--version') {
    console.log('pillar-pack: ' + package.version);
  }
  if (argv[i] === '-h' || argv[i] === '--help') {
    isCopyAndPackCode = false;
    console.log(' ');
    console.log('help list:');
    console.log('-s : source file');
    console.log('-o : set out dir');
    console.log('-c, --copy : set copy dir to outDir, defalut ./public');
    console.log('--prod : use prod mode, only build');
    console.log('--html : set dev server html, default public/index.html');
    console.log('--rename : change fix bundleName, defalut bundle-rename.js');
    console.log('--jsx : "react"| "react-native" | "none", defalut: "react"');
    console.log('--no-tsconfig : no auto create tsconfig.json');
    console.log('--no-public : no copy public dir');
    console.log('--source-map : true | false, defalut true');
    console.log('--target : defalut es3');
    console.log('--pack : only pack js');
    console.log('--server : only use server');
    console.log('--tsc-params : set "typescript:tsc" params');
    console.log('--fpack-params : set "fastpack" params');
    console.log('--sync-params : set "brower-sync" params');
    console.log('--version : cat version');
  }
}
outDirPath = getOutDirPath(outDir);
sourceDir = getSourceDir(sourceFile);
sourceFilePath = getSourceFilePath(sourceFile);
publicDirPath = getPublicDirPath(publicDir);
onlyServerDirPath = getOnlyServerDirPath(onlyServerDir);
isTypescript = getIsTypescript(sourceFile);
libFilePath = getLibFilePath(outDirPath, sourceFilePath, isTypescript);
let bundleEndName = isProd ? `bundle_${Date.now()}.js` : 'index.js';

// change tsconfig
if (jsx === 'react' || jsx === 'react-native') {
  tsconfig.compilerOptions.jsx = jsx;
}
tsconfig.compilerOptions.outDir = outDir + '/lib';
tsconfig.compilerOptions.sourceMap = sourceMap;
tsconfig.compilerOptions.target = targetES3;
tsconfig.compilerOptions.watch = !isProd;
tsconfig.include = [sourceDir + '/**/*'];

function runPack(...args) {
  setTimeout(() => {
    console.log(',,', libFilePath);
    if (isProd) {
      exec(
        `
${bin}/fpack ${libFilePath} \
    -o ${outDirPath} \
    --nm "$(pwd)/node_modules" \
    --nm node_modules \
    --preprocess='^lib.+\.js$:babel-loader?filename=.babelrc' \
    --preprocess='\.svg$:file-loader?name=static/media/[name].[hash:8].[ext]&publicPath=http://example.com/' \
    --preprocess='\.css$:style-loader!css-loader?importLoaders=1!postcss-loader?path=postcss.config.js'
    ${fpackParams}
`,
        packEnd,
      );
    } else {
      setTimeout(() => {
        exec(
          `
  ${bin}/fpack ${libFilePath} \
    -o ${outDirPath} \
      -w \
      --dev \
      --nm "$(pwd)/node_modules" \
      --nm node_modules \
      --preprocess='^lib.+\.js$:babel-loader?filename=.babelrc' \
      --preprocess='\.svg$:file-loader?name=static/media/[name].[hash:8].[ext]&publicPath=http://example.com/' \
      --preprocess='\.css$:style-loader!css-loader?importLoaders=1!postcss-loader?path=postcss.config.js'
      ${fpackParams}
  `,
          execLog,
        );
      }, 300);
    }
  });
}

function copyAndPackCode() {
  if (isProd) {
    if (fs.existsSync(outDirPath)) {
      fs.removeSync(outDirPath);
    }
  }
  fs.mkdirpSync(outDirPath);
  if (isAutoCreateTsConfig) {
    copyTsConfigAndBabelrc(tsconfig, outDirPath);
  }
  if (isAutoCopyPublicDir) {
    copyPublic({
      publicDirPath,
      outDir,
      bundleReanme,
      bundleEndName,
      htmlFile,
    });
  }

  if (isTypescript) {
    if (!isProd) {
      exec(`node ${bin}/tsc ${tscParams} &`, execLog);
    } else {
      exec(`node ${bin}/tsc ${tscParams} &`, runPack);
    }
  }

  if (!isProd) {
    runPack();
    runServer(outDir);
    console.log('open http://127.0.0.1:' + port);
  } else {
    console.log('build...');
  }
}

function packEnd(...args) {
  execLog(...args);
  fs.moveSync(outDirPath + '/index.js', outDirPath + '/' + bundleEndName);
  console.log('done! build: ' + outDirPath);
}

function runServer(dir) {
  exec(
    `cd ${dir} && node ${bin}/browser-sync start ${
      isOpenBrowser ? '' : '--browser'
    } --server ${syncParams} --port ${port} --no-notify --files "*.js, *.html, *.css" &`,
    execLog,
  );
}

if (isOnlyServer) {
  runServer(onlyServerDirPath);
} else if (isOnlyPack) {
  runPack();
} else if (isCopyAndPackCode) {
  copyAndPackCode();
}
