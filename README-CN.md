# 基于Parcel的零配置打包工具

> Use parcel, browser-sync

[English Document](README.md)

## 缘由

Parcel 在 React 项目中还是需要配置 `babel`,`transform-runtime`等其他配置的，并且某些情况的热更新会失效，并且不方便忽略一些不需要打包的库，所以有了这个基于 Parcel 和 browser-sync 的打包库。

添加的额外功能：

- 固定由 `javascript` 或 `typescript` 文件作为入口
- 拷贝资源文件至输出目录
- 自动替换 `html` 文件中指定的`js`引用，方便我们选择打包库在`html`中的加载顺序
- 自动配置 `babelrc`
- 自动安装 `bebel-*` 相关库
- 使用 `browser-sync` 启动服务, 可以选择性的使用 HRM 或者 Reload-Page

## 安装

```sh
$ npm i -g piller-pack
```

## 初始化配置

首次启动时，使用 `init` 命令

```sh
$ piller-pack init
```

## 约定大于配置

修改 public/index.html

```html
<body>
    <!-- 增加以下这行 -->
    <script src="bundle-rename.js"></script>
<body>
```

**启动:**

```sh
$ piller-pack
```

如果你的项目是标准的React库，以上就是你要做的所有，它做了：

1.  目录来自 `src/index.js` 或者 `src/index.ts`
2.  输出目录至 `build`
3.  拷贝 `public` 目录至输出目录
4.  替换 `public/index.html` 文件中的 `bundle-rename.js` 文件为打包后的 js 文件

## 自定义配置

要使用其它配置打包，可以在启动时增加参数

```js
-s : source file
-o : set out dir
-c, --copy : set copy dir to outDir, defalut ./public
--prod : use prod mode, only build
--hot : use hrm mode, no use brower-sync reload
--html : set dev server html, default public/index.html
--rename : change fix bundleName, defalut bundle-rename.js
--jsx : "react"| "react-native" | "none", defalut: "react"
--no-public : no copy public dir
--source-map : true | false, defalut true
--pack : only pack js
--server : only use server
--brower-params : set "brower-sync" params
--version : cat version
```

## 例子

**安装依赖**

```sh
$ piller-pack init
```

**修改 js 起始路径, 和启动端口号**

```sh
$ piller-pack -s src/app.js --port 4100
```

**其它自定义例子:**

1.  打包 `lib/index.js` 的 js 为生产版本
2.  拷贝 `lib/assets`
3.  输出至 `build-prod`
4.  修改 `index.prod.html` 的 html 文件
5.  不使用 sourceMap

```sh
$ piller-pack -s lib/index.js -c lib/assets -o build-prod --html index.prod.html --source-map false --prod
```
