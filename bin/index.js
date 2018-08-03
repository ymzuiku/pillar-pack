#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const copyPublic = require('./copyPublic');
const package = require('../package.json');
const Bundler = require('parcel-bundler');

const {
  execLog,
  getSourceDir,
  getSourceFilePath,
  getOutDirPath,
  getPublicDirPath,
  getOnlyServerDirPath,
  getLibFilePath,
} = require('./utils');
const argv = process.argv.splice(2);

let bin = path.resolve(__dirname, '../node_modules/.bin');
let outDir = `build`;
let publicDir = `public`;
let publicDirPath = getPublicDirPath(publicDir);
let outDirPath = getOutDirPath(outDir);
let sourceFile = `src/index.js`;
let htmlFile = `index.html`;
let bundleReanme = `bundle-rename.js`;
let sourceDir = getSourceDir(sourceFile);
let sourceFilePath = getSourceFilePath(sourceFile);
let isProd = false;
let sourceMap = true;
let isAutoCopyPublicDir = true;
let isOnlyServer = false;
let onlyServerDir = 'build';
let onlyServerDirPath = getOnlyServerDirPath(onlyServerDir);
let isOnlyPack = false;
let isCopyAndPackCode = true;
let isOpenBrowser = false;
let isHot = false;
let isInit = false;
let browerParams = '';
let port = 3100;
let babelCover = false;

if (!fs.existsSync(sourceFilePath)) {
  sourceFile = `src/index.ts`;
  sourceDir = getSourceDir(sourceFile);
  sourceFilePath = getSourceFilePath(sourceFile);
}

// 命令行参数
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === 'init') {
    isInit = true;
  }
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
  if (argv[i] === '--hot') {
    isHot = true;
  }
  if (argv[i] === '--html') {
    htmlFile = argv[i + 1];
  }
  if (argv[i] === '--babel') {
    babelCover = true;
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
  if (argv[i] === '--brower-params') {
    browerParams = argv[i + 1];
  }
  if (argv[i] === '--version') {
    console.log('pillar-pack: ' + package.version);
  }
  if (argv[i] === '-h' || argv[i] === '--help') {
    isCopyAndPackCode = false;
    console.log(' ');
    console.log('help list:');
    console.log('init : isInit pack');
    console.log('-s : source file');
    console.log('-o : set out dir');
    console.log('-c, --copy : set copy dir to outDir, defalut ./public');
    console.log('--prod : use prod mode, only build');
    console.log('--babel : is cover babel file, defaut false');
    console.log('--hot : use hrm mode, no use brower-sync reload');
    console.log('--html : set dev server html, default public/index.html');
    console.log('--rename : change fix bundleName, defalut bundle-rename.js');
    console.log('--jsx : "react"| "react-native" | "none", defalut: "react"');
    console.log('--no-tsconfig : no auto create tsconfig.json');
    console.log('--no-public : no copy public dir');
    console.log('--source-map : true | false, defalut true');
    console.log('--pack : only pack js');
    console.log('--server : only use server');
    console.log('--brower-params : set "brower-sync" params');
    console.log('--version : cat version');
  }
}
outDirPath = getOutDirPath(outDir);
sourceDir = getSourceDir(sourceFile);
sourceFilePath = getSourceFilePath(sourceFile);
publicDirPath = getPublicDirPath(publicDir);
onlyServerDirPath = getOnlyServerDirPath(onlyServerDir);
libFilePath = getLibFilePath(outDirPath, sourceFilePath);
let bundleEndName = isProd ? `bundle_${Date.now()}.js` : 'index.js';

async function runPack(...args) {
  console.log('build...');
  if (!process.env) {
    process.env = {};
  }
  if (isProd) {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = 'development';
  }
  const options = {
    outDir: outDirPath, // 将生成的文件放入输出目录下，默认为 dist
    outFile: bundleEndName, // 输出文件的名称
    publicUrl: './', // 静态资源的 url ，默认为 dist
    watch: true, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
    cache: true, // 启用或禁用缓存，默认为 true
    cacheDir: '.cache', // 存放缓存的目录，默认为 .cache
    minify: isProd ? true : false, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，会启用
    target: 'browser', // 浏览器/node/electron, 默认为 browser
    https: false, // 服务器文件使用 https 或者 http，默认为 false
    logLevel: 3, // 3 = 输出所有内容，2 = 输出警告和错误, 1 = 输出错误
    sourceMaps: isProd ? false : sourceMap, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
    hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
    hmrHostname: '127.0.0.1', // 热模块重载的主机名，默认为 ''
    detailedReport: false, // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告
  };
  const bundler = new Bundler(sourceFilePath, options);
  const data = await bundler.bundle();
  bundler.on('bundled', bundler => {});
  bundler.on('buildEnd', () => {
    packEnd();
  });
  if (!isProd) {
    runServer(outDir);
    console.log(`open http://127.0.0.1:${port}/${htmlFile}`);
  }
}

function copyAndPackCode() {
  if (isProd) {
    if (fs.existsSync(outDirPath)) {
      fs.removeSync(outDirPath);
    }
  }
  fs.mkdirpSync(outDirPath);
  if (isAutoCopyPublicDir) {
    copyPublic({
      publicDirPath,
      outDirPath,
      bundleReanme,
      bundleEndName,
      babelCover,
      isInit,
    });
  }
  if (!isInit) {
    runPack();
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
    } --server ${browerParams} --open ${htmlFile} --port ${port} --serveStatic "./" --no-notify --files "*.js, *.html, *.css" &`,
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
