# micro-qiankun-substrate

一个 `qiankun` 基座，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

包含项目：

- `react-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra)] 子应用，使用 `create-react-app` 搭建
- `static-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-static)] 子应用，自定义创建的一个静态项目
- `substrate` [[查看](https://github.com/cgfeel/micro-qiankun-substrate)] 基座主应用，使用 `create-react-app` 搭建
- `vue-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3)] 子应用，使用 `Vue3` 搭建

文档分 2 部分：

- 来自珠峰的 `qiankun` 课程整理
- 官方文档（稍后补充）

## 来自珠峰的 `qiankun` 课程整理

按照搭建顺序整理，具体见源码。`qiankun` 基于 `Single-spa` 进行再封装，其优点：

- 简化配置过程，不再不需要父子应用 id、链接地址对应
- 支持沙箱、支持预加载
- 缺点：`css` 沙箱隔离方案在不同的情况下可能存在问题

对比看了下 `qiankun` 官网的配置过程有点老了：

- `React` 子应用演示版本是 `React 16`，其中 `ReactDOM.unmountComponentAtNode` 在版本 18 中已废弃
- `Vue` 子应用演示版本是 `Vue2`
- `@rescripts/cli` 对新版的 `create-react-app` 支持不够好

建议按照下面配置方式

### 搭建基座主应用

目录：`substrate` [[查看](https://github.com/cgfeel/micro-qiankun-substrate)] 当前仓库

3 步完成：

- 在 `src` 下添加注册文件 `registerApps.ts` [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/registerApp.ts)]
- 将 `registerApps.ts` 在入口文件引入 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/index.tsx)]
- 使用 `React-Router` 作为路由劫持，并添加放置容器的 Dom 节点 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/App.tsx)]

和 `single-spa` 对比：

- 不再需要按照 `SystemJS` 那样需要将导入资源表和注册信息分别写入
- 不再要求父子应用名和项目完整名称对应
- 在注册应用同时，也暴露了完整的生命周期回调函数
- 在启动应用中支持沙箱等操作
- 操作更简单，只要 3 步骤
- 直接拿现有的框架作为基座，而不是将 `single-spa` 作为基座

### 配置 `React` 子应用

目录：`react-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra)]

入口文件 `index.tsx` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/src/index.tsx)]：

- 暴露 3 个异步方法：`bootstrap`、`mount`、`unmount`
- 暴露一个全局对象用于单独启动：`window.__POWERED_BY_QIANKUN_`
- 在 `React` 之前引入动态 `publicPath`

运行时动态 `publicPath`：

- 设置 `__webpack_public_path__` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/src/public-path.ts)]
- `TypeScript` 还需声明文件 `globals.d.ts` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/src/globals.d.ts)]

配置 `webpack`：

- 添加输出格式为 `umd`，添加项目名 [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/config-overrides.js)]
- 修改 `package.json` 的 `script` [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/package.json)]

设置端口号 [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/.env)]：

- `PORT`、`WDS_SOCKET_PORT`

和章节不一样的地方：

- 使用 `react-app-rewired` 代替 `@rescripts/cli`，因为 `@rescripts/cli` 依赖和 `react-scripts@5.0.1` 冲突
- 不需要配置 `create-react-app` 的 `cors`，默认支持

### 配置 `Vue` 子应用

目录：`vue-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3)]

入口文件 `main.vue` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3/blob/main/src/main.ts)]：

- 暴露 3 个异步方法：`bootstrap`、`mount`、`unmount`
- 暴露一个全局对象用于单独启动：`window.__POWERED_BY_QIANKUN_`
- 在 `Vue` 之前引入动态 `publicPath`

分离路由 `index.ts` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3/blob/main/src/router/index.ts)]：

- 将 `router` 从 `routes` 分离到 `main.vue`
- 这样便于记录 `history`、`router`，在注销时 `destory`

运行时动态 `publicPath`：

- 设置 `__webpack_public_path__` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3/blob/main/src/public-path.ts)]
- `TypeScript` 还需声明文件 `globals.d.ts` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3/blob/main/src/globals.d.ts)]

配置 `vue.config.js` [[查看](https://github.com/cgfeel/micro-qiankun-app-vue3/blob/main/vue.config.js)]：

- 设置端口号和 `cors`
- 添加输出格式为 `umd`，添加项目名

### 手动加载自定义的静态子仓库

目录：`static-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-static)]

自定义静态子仓库 [[查看](https://github.com/cgfeel/micro-qiankun-app-static/blob/main/index.html)]：

- 给 `window` 添加一个项目名作为属性，演示为：`@levi/static`
- 包含个异步方法：`bootstrap`、`mount`、`unmount`
- 暴露一个全局对象用于单独启动：`window.__POWERED_BY_QIANKUN_`

静态应用需要通过 `http-server` 启动

```
npx http-server --port 30000 --cors
```

> 如果有必要也可以接受一个全局对象 `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__` 作为静态资源

基座应用手动添加容器 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/App.tsx)]：

- 通过 `qiankun` 提供的 `loadMicroApp` 手动加载应用
- 添加一个自定义的容器节点，演示中是：`yourContainer`

注意：珠峰的课程有个错误，通过 `ref` 提供容器节点会导致报错子应用未卸载又加载的情况

> dex.js:1 single-spa minified message #31: See https://single-spa.js.org/error/?code=31&arg=mount&arg=parcel&arg=app1_1&arg=3000

- 这里的解决办法是将 `ref` 替换成 `id` 即可
- 但这不是唯一解，这个问题会发生在不同的情况，具体情况具体解决

### 父子应用通信

基座应用 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/registerApp.ts)]：

- 使用 `initGlobalState` 创建一个 `state`，通过 `onGlobalStateChange` 接收订阅

子应用 [[查看](https://github.com/cgfeel/micro-qiankun-app-cra/blob/main/src/index.tsx)]：

- 在 `mount` 的 `props` 中提供 `onGlobalStateChange` 接受订阅，`setGlobalState` 发布订阅
- 只有 `mount` 的 `props` 存在订阅方法，`bootstrap` 没有
- 可以通过 `context` 或者透传传递订阅方法

### `qiankun` 沙箱隔离样式

将主应用的样式居中注释掉 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/App.css)] 没有效果，这时子应用的样式影响了主应用

解决办法如下 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/registerApp.ts)]：

`experimentalStyleIsolation`：

- 原理：通过 `css-module`，为每一个子应用的样式添加一个选择器，如：`.name[data-qiankun="xxxx"] `
- 缺点 1：子应用的 DOM 元素挂载到了外层，会导致样式不生效
- 缺点 2：子应用设置样式在 `body`，会导致样式不生效

`strictStyleIsolation`：

- 原理：将子应用放到 `shadom-root` 中进行隔离
- 缺点：完全隔离，无法拿到外层的属性，在当前演示中静态子应用将失效

样式隔离的几个方式：

- `css-module`、`scope` 生成一个选择器，如：`.name[data-qiankun="xxxx"] `
- `BEM`
- `css-in-js` 通过 `:where` 在不提权情况下设置样式，详细记录在 `@cgfeel/ant-design-style` [[查看](https://github.com/cgfeel/ant-design-style)]
- `shadowDOM` 严格隔离

下面会通过通过演示对沙箱做一个简单了解
