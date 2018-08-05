#!/usr/bin/env node

const fs = require('fs-extra');
const copyPublic = require('./copyPublic');
const package = require('../package.json');
const Bundler = require('parcel-bundler');
const bs = require('browser-sync').create('pillar-pack');

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

let outDir = `build`;
let publicDir = `public`;
let publicDirPath = getPublicDirPath(publicDir);
let outDirPath = getOutDirPath(outDir);
let sourceFile = `src/index.js`;
let htmlFile = `index.html`;
let bundleReanme = `bundle-rename.js`;
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
let isReload = true;
let isInit = false;
let isHmr = false;
let isCors = false;
let port = 3100;
let isBabelCover = false;
let isBabelrc = true;

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
  if (argv[i] === '--cors') {
    isCors = argv[i + 1];
  }
  if (argv[i] === '--no-reload') {
    isReload = false;
  }
  if (argv[i] === '--hmr') {
    isHmr = true;
  }
  if (argv[i] === '--html') {
    htmlFile = argv[i + 1];
  }
  if (argv[i] === '--no-babel') {
    isBabelrc = false;
  }
  if (argv[i] === '--cover-babel') {
    isBabelCover = true;
  }
  if (argv[i] === '--rename') {
    bundleName = argv[i + 1];
  }
  if (argv[i] === '--no-copy') {
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
  if (argv[i] === '--open') {
    isOpenBrowser = true;
  }
  if (argv[i] === 'build') {
    isOnlyPack = true;
  }
  if (argv[i] === '--version') {
    console.log('pillar-pack: ' + package.version);
  }
  if (argv[i] === '--help') {
    isCopyAndPackCode = false;
    console.log(' ');
    console.log('help list:');
    console.log('-s : source file');
    console.log('-o : set out dir');
    console.log('-c, --copy : set copy dir to outDir, defalut ./public');
    console.log('init : Install babel-* in your project');
    console.log('build : only pack js');
    console.log('--prod : use prod mode, only build');
    console.log('--cors : is use brower cors');
    console.log('--open : is open brower');
    console.log('--no-reload : set brower-sync no reload');
    console.log('--hmr : open hmr, defalut close');
    console.log('--html : set dev server html, default public/index.html');
    console.log('--rename : change fix bundleName, defalut bundle-rename.js');
    console.log('--no-copy : no copy public dir');
    console.log('--cover-babel : set cover babel file');
    console.log('--no-babel : set no create .babelrc');
    console.log('--source-map : true | false, defalut true');
    console.log('--server : only use server');
    console.log('--version : cat version');
    return;
  }
  if (argv[i] === '--help-cn') {
    isCopyAndPackCode = false;
    console.log(' ');
    console.log('帮助列表:');
    console.log('-s : 设置源码路径, 默认 src/index.js ');
    console.log('-o : 设置输出路径');
    console.log('-c, --copy : 设置需要拷贝的资源路径, 默认 public');
    console.log('init : 安装所需 babel-* 在你当前项目');
    console.log('build : 只使用默认的 parcel 打包项目 ');
    console.log('--prod : 编译项目, 不使用sourceMaps, 不启动服务');
    console.log('--cors : 打开 brower-sync 的跨域设置');
    console.log('--open : 启动后自动打开浏览器');
    console.log('--no-reload : 关闭 brower-sync 的自动更新页面');
    console.log('--hmr : 打 parcel 开热更新, defalut close');
    console.log('--html : 设置启动时使用的 .html 文件, 默认 public/index.html');
    console.log(
      '--rename : 修改编译后会替换的 .html 中的字符, 默认 bundle-rename.js',
    );
    console.log('--no-copy : 不进行拷贝资源文件');
    console.log(
      '--cover-babel : 创建 .babelrc 文件时, 覆盖原有的 .babelrc 文件',
    );
    console.log('--no-babel : 不自动创建 .babelrc 文件');
    console.log(
      '--source-map : true | false 设置是否输出sourceMaps, 默认 true',
    );
    console.log('--server : 只使用 brower-sync 启动服务');
    console.log('--version : 查看版本');
    console.log('--help : 英文帮助列表');
    return;
  }
}
outDirPath = getOutDirPath(outDir);
sourceDir = getSourceDir(sourceFile);
sourceFilePath = getSourceFilePath(sourceFile);
publicDirPath = getPublicDirPath(publicDir);
onlyServerDirPath = getOnlyServerDirPath(onlyServerDir);
libFilePath = getLibFilePath(outDirPath, sourceFilePath);
let bundleEndName = isProd ? `bundle_${Date.now()}.js` : 'index.js';

async function runPack() {
  if (isOnlyServer) {
    return;
  }
  if (isInit) {
    return;
  }
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
    watch: isOnlyPack ? false : true, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
    cache: true, // 启用或禁用缓存，默认为 true
    cacheDir: '.cache', // 存放缓存的目录，默认为 .cache
    minify: isProd ? true : false, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，会启用
    target: 'browser', // 浏览器/node/electron, 默认为 browser
    https: false, // 服务器文件使用 https 或者 http，默认为 false
    logLevel: 3, // 3 = 输出所有内容，2 = 输出警告和错误, 1 = 输出错误
    sourceMaps: isProd ? false : sourceMap, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
    hmr: isHmr,
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
  } else {
    console.log('done! build: ' + outDirPath);
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
      isBabelCover,
      isBabelrc,
      isInit,
      runPack,
      isOnlyPack,
    });
  }
}

function packEnd(...args) {
  execLog(...args);
  fs.moveSync(outDirPath + '/index.js', outDirPath + '/' + bundleEndName);
}

function runServer(dir) {
  if (isOnlyPack) {
    return;
  }
  bs.init({
    server: { baseDir: dir, index: htmlFile, directory: true },
    port,
    open: isOpenBrowser,
    notify: false,
    watch: isReload,
    ui: false,
    cors: isCors,
    logConnections: false,
    logLevel: 'warn',
  });
  bs.watch('*.html, *.js, *.css').on('change', bs.reload);
  console.log(`http://127.0.0.1:${port}/${htmlFile}`);
}

if (isCopyAndPackCode) {
  copyAndPackCode();
}
