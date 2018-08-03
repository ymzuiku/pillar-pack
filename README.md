# Zero Config Parcel-pack

> Use parcel, browser-sync

[中文文档](README-CN.md)

## Why use this?

In React Project, Parcel need install `babel-*` packages, and need config `.babelrc`. And sometimes `Hot Reload` fail.
Parcel native don't have copy assets feature. So, we have this package. It's juset over parcel, wrapped up in a layer candy.

New feature candy of Parcel

- only use `.js` or `.ts` file input, but we can replce `.html` strings.
- copy assets files to out dir
- auto replce `.html` string, change `bundle-rename.js` to real bundle.js
- Automatic configuration `.babelrc`
- Automatic install about `bebel-*` packages
- Use `browser-sync` start server, can select Use `HRM` or `Reload-Page`

## Install

```sh
$ npm i -g piller-pack
```

## Init configuration

In first start, need use `init` shell

```sh
$ piller-pack init
```

## Convention is larger than configuration

```html
<body>
    <!-- add this code -->
    <script src="bundle-rename.js"></script>
<body>
```

**Start:**

```sh
$ piller-pack
```

If your project like React defalut projcet, That's all you have to do, they are do this:

1.  Source file from `src/index.js` or `src/index.ts`
2.  Bundle put out dir to `build`
3.  Copy `public` dir to out dir
4.  Replace in `public/index.html` string of `bundle-rename.js` to real bundle.js

## Custom configuration

You can add params to change config:

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

## Example

**Install package**

```sh
$ piller-pack init
```

**change source .js and server port**

```sh
$ piller-pack -s src/app.js --port 4100
```

**Other custom example:**

1.  Use source file in `lib/index.js`
2.  Copy `lib/assets`
3.  Bundle out to `build-prod`
4.  Change `index.prod.html`
5.  Don't use sourceMap

```sh
$ piller-pack -s lib/index.js -c lib/assets -o build-prod --html index.prod.html --source-map false --prod
```
