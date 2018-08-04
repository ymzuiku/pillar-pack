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

## 约定大于配置

例如,工程结构如下, 这是一个标准的 React 工程结构
```sh
-- public
  - index.html
-- src
  - index.js
-- package.json
```

修改 public/index.html

```html
<body>
    <!-- 增加以下这行 -->
    <script src="bundle-rename.js"></script>
<body>
```

**启动:**

```sh
$ piller-pack -s src/index.js -o build -c public
```

### 以上就是你要做的所有，它做了：

1.  若没有安装 `babel-*` 相关依赖, 自动安装 `babel-*` 相关库
2.  目录来自 `src/index.js` 或者 `src/index.ts`
3.  输出目录至 `build`
4.  拷贝 `public` 目录至输出目录
5.  替换 `public/index.html` 文件中的 `bundle-rename.js` 文件为打包后的 js 文件

## 标准工程

```sh
-- public
  - index.html
-- src
  - index.js
-- package.json
```

如果你的工程结构是标准的 `React` 工程结构(如上文), 你可以直接使用

```sh
$ pillar-pack
```

---

通常情况, 你不需要继续阅读下文, 除非你需要自定义一些特殊配置

## 自定义配置

使用 `pillar-pack --help 查看命令列表`, 要使用其它配置打包，可以在启动时增加参数

```js
帮助列表:
-s : 设置源码路径, 默认 src/index.js
-o : 设置输出路径
-c, --copy : 设置需要拷贝的资源路径, 默认 public
--init : 安装所需 babel-* 在你当前项目
--prod : 编译项目, 不使用sourceMaps, 不启动服务
--cors : 打开 brower-sync 的跨域设置
--open : 启动后自动打开浏览器
--no-reload : 关闭 brower-sync 的自动更新页面
--hmr : 打 parcel 开热更新, defalut close
--html : 设置启动时使用的 .html 文件, 默认 public/index.html
--rename : 修改编译后会替换的 .html 中的编译文件字符, 默认 bundle-rename.js
--no-copy : 不进行拷贝资源文件
--cover-babel : 创建 .babelrc 文件时, 覆盖原有的 .babelrc 文件
--no-babel : 不自动创建 .babelrc 文件
--source-map : true | false 设置是否输出sourceMaps, 默认 true
--pack : 只使用默认的 parcel 打包项目
--server : 只使用 brower-sync 启动服务
--version : 查看版本
--help : 英文帮助列表
```

## 例子

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
$ piller-pack \
  -s lib/index.js \
  -c lib/assets  \
  -o build-prod \
  --html index.prod.html \
  --source-map false \
  --prod
```
