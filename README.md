# Zero Config Parcel-pack

> Use parcel, browser-sync

## 缘由

parcel在React项目中还是需要配置`babel`,`transform-runtime`等其他配置的，并且某些情况的热更新会失效，并且不方便忽略一些不需要打包的库，所以有了这个基于Parcel和browser-sync的打包库。

## 自动配置

首次启动时，使用 `init` 命令

```sh
$ piller-pack init
```

## 约定大于配置

1. 目录来自 `src/index.js` 或者 `src/index.ts`
2. 输出目录至 `build`
3. 拷贝 `public` 目录至输出目录
4. 替换 `public/index.html` 文件中的 `bundle-rename.js` 文件为打包后的js文件

**启动:**
```sh
$ piller-pack
```

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

**修改js起始路径, 和启动端口号**

```sh
$ piller-pack -s src/app.js --port 4100
```

**其它自定义例子:**

1. 打包 `lib/index.js` 的js为生产版本
2. 拷贝 `lib/assets`
3. 输出至 `build-prod`
4. 修改 `index.prod.html` 的html文件
5. 不使用 sourceMap

```sh
$ piller-pack -s lib/index.js -c lib/assets -o build-prod --html index.prod.html --source-map false --prod
```

