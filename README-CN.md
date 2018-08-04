# 基于Brower-sync和Parcel的真正零配置打包工具

[English Document](README.md)

## 缘由

Parcel 在 React 项目中还是需要配置 `babel`,`transform-runtime`等其他配置的，并且某些情况的热更新会失效，并且不方便忽略一些不需要打包的库，所以有了这个基于 Parcel 和 browser-sync 的打包库。

## 安装

```sh
$ npm i -g pillar-pack
```

## 从零创建一个React项目 

我们试试,从一个空白的项目中, 不使用 `create-react-app` 需要多少个步骤可以创建于一个React项目

> 约定大于配置

**创建一个工程, 并创建基本的目录和文件**

```sh
$ mkdir your-project
$ cd your-project
$ npm init -y
$ mkdir public src
$ touch public/index.html src/index.js
$ yarn add react react-dom
```

**当前工程结构如下, 这是一个标准的 React 工程结构**

```sh
-- public
  - index.html
-- src
  - index.js
-- package.json
```

**编写 public/index.html**

```html
<!DOCTYPE html>
<html lang="en">

<body>
  <div id="root"></div>
  <script src="bundle-rename.js"></script>
</body>

</html>
```

**编写 src/index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = {
    num: 0,
  };
  addNum = () => {
    this.setState({ num: this.state.num + 1 });
  };
  render() {
    return (
      <div>
        <h1>Hello pillar-pack</h1>
        <h2>{this.state.num}</h2>
        <button onClick={this.addNum}>Add Num</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

**启动:**

```sh
$ pillar-pack -s src/index.js -o build -c public --open
```

如图, 项目已启动
![](.imgs/2018-08-04-13-48-36.png)

### 简单几步就从零创建了一个React项目, 它做了：

1. (首次非常耗时) 若没有安装 `babel-*` 相关依赖, 自动安装 `babel-*` 相关库
2. 创建并配置 .babelrc 文件
3. 目录来自 `src/index.js` 或者 `src/index.ts`
4. 输出目录至 `build`
5. 拷贝 `public` 目录至输出目录
6. 替换 `public/index.html` 文件中的 `bundle-rename.js` 文件为打包后的 js 文件
7. 使用 `brower-sync` 启动服务, 并代替 `parcel` 的 `hmr-reload` 进行刷新页面
8. 使用浏览器打开项目

同理, Vue项目, 甚至是 LayaAir 游戏引擎的项目也是一样

## 标准工程

```sh
-- public
  - index.html
-- src
  - index.js
-- package.json
```

如果你的工程结构是标准的 `React` 工程结构(如上文), 你可以不必加后缀参数, 直接使用

```sh
$ pillar-pack
```


## 自定义配置

使用简单的几个参数,就可以设定输入输出的项目路径,以满足不同结构的项目需要

使用 `pillar-pack --help 查看命令列表`:

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
$ pillar-pack -s src/app.js --port 4100
```

**其它自定义例子:**

1.  打包 `lib/index.js` 的 js 为生产版本
2.  拷贝 `lib/assets`
3.  输出至 `build-prod`
4.  修改 `index.prod.html` 的 html 文件
5.  不使用 sourceMap

```sh
$ pillar-pack \
  -s lib/index.js \
  -c lib/assets  \
  -o build-prod \
  --html index.prod.html \
  --source-map false \
  --prod
```
