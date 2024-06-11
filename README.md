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

### 沙箱原理

下面会通过几个演示展示沙箱的原理

- 所在项目：`static-project` [[查看](https://github.com/cgfeel/micro-qiankun-app-static)]
- 运行方式：`http-server` 作为独立应用单独打开，或直接点开指定 html

#### 1. `ShadowDom`

通过沙箱隔离样式：

- 目录：`shadow-dom.html` [[查看](https://github.com/cgfeel/micro-qiankun-app-static/blob/main/sandbox/shadow-dom.html)]
- URL：`/sandbox/shadow-dom.html`

> `wujie` 利用了空 `iframe` 来做 JS 的隔离，`shadowDOM` 来做 CSS 隔离

**步骤：**

1. 创建一个模板 `template`
2. 将模板变成 `Dom` 元素 `appElement`
3. 初始化了一个关联到 `appElement` 的 `Shadow DOM` 树，并将 `Dom` 内容赋值给 `Shadow DOM` 树内
4. 将 `Dom` 内容清空，这样 `appElement` 就只剩下 `Shadow DOM`
5. 将只带有沙箱的 `Dom` 的 `appElement` 添加到 `body` 下

**优点：**

- 完全隔离

**缺点：**

- 子应用没办法直接挂载到 `body` 下，而是一个完全隔离的 `shadownDOM` 沙箱内
- `closed`模式下，父应用无法管理子应用
- 属于 `web component`，需要现代浏览器支持

> 在 `qiankun` 中不推荐通过通过 `shadownDOM` 进行隔离，这会给父子应用相互操作带来问题

#### 2. `window` 快照实现沙箱

通过快照的方式防止应用加载的时候污染 `window` 对象

- 目录：`sandbox.html` [[查看](https://github.com/cgfeel/micro-qiankun-app-static/blob/main/sandbox/sandbox.html)]
- URL：`/sandbox/sandbox.html`

**过程：**

- 加载 a 应用更改 `window` 属性，卸载删除
- 加载 b 应用更改 `window` 属性

**模式：**

- 先保存 a 应用的属性，失活的时候把修改的属性存起来，激活的时候还原回来

**优缺点：**

- 优点：不存在兼容问题
- 缺点：浪费内存，要给 `window` 拍照

#### 3. 通过 `proxy` 代理单例应用

为了避免给整个 `window` 拍照浪费内存，使用一个 `proxy` 只对修改的内容做记录

- 目录：`legacy-sandbox.html` [[查看](https://github.com/cgfeel/micro-qiankun-app-static/blob/main/sandbox/legacy-sandbox.html)]
- URL：`/sandbox/legacy-sandbox.html`

**原理：**

- 创建 3 个对象分别记录：修改 `modifyPropsMap`、新增 `addedPropsMap`、所有记录 `currentPropsMap`
- 创建一个 `proxy` ，用于设置值时记录副本，获取值时读取 `window`
- 激活时将 `currentPropsMap` 重新赋值给 `window`
- 失活时将 `modifyPropsMap`、`addedPropsMap` 拿出来还原

**优点：**

- 不用为 `window` 拍照消耗内存

**缺点：**

- `proxy` 需要现代浏览器支持
- 只支持一个应用，多个应用一起运行 `window` 就一个，就乱了
- 不能直接代理 `window`，这样会在设置时无限循环

#### 4. 通过 `proxy` 代理多例应用

为了避免多个应用 `window` 错乱的问题，将 `window` 更改到每个 `sandbox` 实例的 `proxy`：

- 目录：`proxy-sandbox.html` [[查看](https://github.com/cgfeel/micro-qiankun-app-static/blob/main/sandbox/proxy-sandbox.html)]
- URL：`/sandbox/proxy-sandbox.html`

**原理：**

- 沙箱中用每个实例的 `proxy` 作为 `window`
- 每个应用的 `window` 修改互不干扰，也不影响真实的 `window`
- 通过 `runing` 来决定沙箱激活状态，来决定每个应用中 `window` 取值

**优点：**

- 不用为 `window` 拍照消耗内存
- 支持多个应用互不干扰，也不影响真实的 `window`

**缺点：**

- `proxy` 需要现代浏览器支持

---- 分割线 ----

### `qiankun` 原理

分为注册和运行，为了便于阅读全部以当前官方版本 `eeebd3f76aa3a9d026b4f3a4e86682088e6295c1` [[查看](https://github.com/umijs/qiankun/tree/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1)] 为准

> 这一章节链接指向官方仓库，由于内容比较长，每一条信息我都暴露了关键的对象名，可以打开链接复制关键的对象名，查看上下文对照理解

#### 1. `registerMicroApps` 注册

目录：`apis.ts` - `registerMicroApps` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/apis.ts#L59)]

**参数：**

- `apps`：注册的应用信息
- `lifeCycles`：生命周期

**流程：**

- 通过 `microApps` 筛选 `app.name` 排除已注册过的应用得到 `unregisteredApps`
- 将 `unregisteredApps` 追加到 `microApps` 之后开始遍历注册每一个应用
- 将拿到的应用信息，通过 `registerApplication` 注册到 `single-spa`
- 由 `single-spa` 进行路由劫持，具体参考 `single-spa` 记录 [[查看](https://github.com/cgfeel/micro-single-app-substrate)]
- 注册完成后不会立即执行逻辑，会等待路由匹配之后执行 `app` 对应的方法

#### 2. `start` 执行

目录：`apis.ts` - `start` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/apis.ts#L210)]

和 `registerMicroApps` 一样，衍用了 `single-spa` 的 `start` 方法，在此基础上增加了优化的参数：

- `prefetch`：应用预加载，默认为 `true`
- `singular`：默认为 `true`，单例模式，也可以接受一个方法，类型为 `(app: RegistrableApp<any>) => Promise<boolean>`，注 ①
- `sandbox`：沙箱

其他的参数将在后面整理官方 API 时记录

> 注 ①：`qiankun` 文档说 `singular` 默认为 `false`，实际源码是 `true`
>
> `frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };`
>
> 单例和多例的区别主要：
>
> - 渲染：单例同一时间只能渲染一个应用
> - 沙箱：多例只能用 `proxy` 作为沙箱，而单例除此之外还支持快照沙箱来实现

**流程：**

- 如果支持预加载则开始调用预加载策略：`doPrefetchStrategy`，注 ②
- 对不支持 `proxy` 的沙箱做降级处理：`autoDowngradeForLowVersionBrowser`
- 启动 `single-spa`：`startSingleSpa`
- 完成启动，调用成功的 `promise`：`frameworkStartedDefer.resolve()`

> 注 ② `doPrefetchStrategy` 和 `React` 的 `fiber` 一样利用浏览器空闲时间进行加载

#### 2.1. `doPrefetchStrategy` 预加载

目录：`prefetch.ts` - `doPrefetchStrategy` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/prefetch.ts#L111)]

**参数：**

- `apps`：所有注册的应用
- `prefetchStrategy`：预加载策略
- `importEntryOpts`：启动选项

加载策略 `prefetchStrategy`：

- 数组：根据数组筛选应用 - 等待加载，注 ③
- `Promise` 函数：将所有应用传递过去返回两个对象：`criticalAppNames` 立即加载、`prefetchAfterFirstMounted` 等待加载，注 ③
- `true`：所有应用等待加载，注 ③
- `all`：所有应用立即加载

> 注 ③：等待加载是指，等待第一个应用加载完毕后加载其他应用 `prefetchAfterFirstMounted`，见 2.1.1

#### 2.1.1. `prefetchAfterFirstMounted` 等待预加载

等待第一个应用加载完毕后加载其他应用

目录：`prefetch.ts` - `prefetchAfterFirstMounted` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/prefetch.ts#L88)]

- `apps`：经过筛选后需要启动的应用
- `importEntryOpts`：启动选项

原理，在 `single-spa` 中第一个应用加载完会发送事件 `single-spa:first-mount`：

- 添加监听事件：`single-spa:first-mount`
- 在加载事件回调的内部先筛选所有状态为 `NOT_LOADED` 的应用集合
- 没有加载的应用依次加载：`prefetch`
- 加载完毕后移除监听：`single-spa:first-mount`

由上可以得出 `start` 预加载过程如下：

- `startSingleSpa` 发起一个微任务，启动 `single-spa` 等待执行
- 同步添加一个自定义事件：`single-spa:first-mount`
- 执行微任务启动应用
- 完成启动触发自定义事件：`single-spa:first-mount`，注 ④
- 在事件回调 `listener` 中执行预加载 `prefetch`
- 完成事件回调，删除本次监听事件：`single-spa:first-mount`

如有需要可以重复这个过程

> 注 ④：由 `single-spa` 的 `mount.js` 派发事件 [[查看](https://github.com/single-spa/single-spa/blob/main/src/lifecycles/mount.js)]

#### 2.1.2. `prefetch` 执行预加载

目录：`prefetch.ts` - `prefetch` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/prefetch.ts#L75)]

**参数：**

- `entry`：应用入口链接
- `opts`：启动选项，即 `importEntryOpts`

**流程：**

- 不在线或网速慢的情况不预加载
- 使用 `requestIdleCallback` 利用空闲时间调用入口文件
- 异步方法 `importEntry` 预加载入口文件，用于替代 `systemjs` [[回顾](https://github.com/cgfeel/micro-systemjs)]
- 在入口文件预加载后返回两个方法继续利用 `requestIdleCallback` 在空闲时加载

**`importEntry` 返回两个方法：**

- `getExternalScripts` 获取脚本、`getExternalStyleSheets` 获取样式，注 ⑤
- 这两个方法都是一个异步方法，最终返回资源链接的集合：`Promise<string[]>`
- 通过返回的方法获取额外的样式表和脚本的操作

> 注 ⑤：除此之外还返回了路径、模板、执行脚本等属性，具体查看 `import-html-entry` [[查看](https://github.com/kuitos/import-html-entry)]：
>
> - 但在 `qiankun` 中除了返回的指定 2 个方法以外其他均不需要关心
> - 通过 `importEntry` 加载的入口 `template`，会将所有脚本和样式注释掉
> - 然后将`script`、样式表通过 `getExternalScripts`、`getExternalStyleSheets` 这两个方法进行处理
> - 例如给样式增加前缀 `css-modules` 或放到 `shadowDom` 中
> - 例如脚本会放到沙箱中执行

在 `qiankuan` 中对于 `requestIdleCallback` 做了一个兼容处理，以便对于例如 `safari` 不支持的情况：

- 通过 `MessageChannel` 进行通行
- 执行 `requestIdleCallback` 过程中将空闲加载的方法添加到任务中，并通过 `post2` 向 `post1` 发起会话
- `port1` 提取 `tasks` 队列的方法交给包装方法 `idleCall`，将指定空闲对象作为 `props` 回传并执行按需加载的方法

写过一个空闲创建 DOM 的演示 [[查看](https://codepen.io/levi0001/pen/ZEPJKrW)]

> 疑问：`qiankuan` 使用了空闲加载的方法，但是加载的方法是微任务，并没有用到用到 `requestIdleCallback` 中的 `timeRemaining` 和 `didTimeout`，这样还是立即执行啊，并没有利用空闲时间

#### 2.2. `autoDowngradeForLowVersionBrowser` 沙箱的降级处理

目录：`apis.ts` - `autoDowngradeForLowVersionBrowser` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/apis.ts#L26)]

**参数：**

- `configuration` 启动配置信息，即 `frameworkConfiguration`

只提取两个属性：`sandbox` 沙箱，默认 `true`；`singular` 是否为单例模式

**使用快照：**

- 如果开启沙箱，但浏览器不支持 `promise`：
- 采用快照沙箱，并在沙箱信息中添加 `loose: true`，如果不是单例模式应用，会发出警告

**新增，关闭快速启动：**

- 如果开启沙箱且支持 `promise`，但不支持 `const` 赋值解构，沙箱模式为 `sandbox.speedy: true`：
- 关闭沙箱快速启动模式：`sandbox.speedy: false`

其他模式均不做处理，将传递过来的配置信息原封返回回去

#### 2.3. `startSingleSpa` 启动应用

目录：`apis.ts` - `registerMicroApps` - `registerApplication` - `app` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/apis.ts#L73)]

启动应用时会调用注册信息 `registerApplication` 中的 `app` 方法，流程如下：

- 设置加载状态：`loader(true);`
- `frameworkStartedDefer.promise` 确保等待调用 `start` 才执行，见注册流程最后一步 [[查看](#1-registermicroapps-注册)]
- 将应用名、`props`等应用信息、启动配置、生命周期传给 `promise` 方法 `loadApp` 来加载应用
- `loadApp` 返回一个方法并执行得到一个包含挂载情况的对象
- 最终返回应用的接入协议

#### 2.3.1. `loadApp` 加载应用

目录：`loader.ts` - `loadApp` [[查看](https://github.com/umijs/qiankun/blob/eeebd3f76aa3a9d026b4f3a4e86682088e6295c1/src/loader.ts#L244)]

**参数：**

- `app`：应用信息
- `configuration`：启动配置
- `lifeCycles`：生命周期

**提取应用 `template` 获取资源：**

- `genAppInstanceIdByName` 根据应用名称配置实例 ID：`appInstanceId`
- 从 `configuration` 中提取单例、沙箱、提取资源的方法等
- 使用 `importEntry` 用提取的信息获取应用 `template` 和脚本执行器，注 ⑥
- `getExternalScripts` 获取额外的 `script`
- 验证应用如果是单例模式，就等待上一个应用卸载后再加载 `prevAppUnmountedDeferred`，注 ⑦

> 注 ⑥：`importEntry`将返回：
>
> - `template` 模板、`execScripts` 执行脚本、`assetPublicPath` 资源路径、`getExternalScripts` 优先执行
> - 其中 `template` 中会注释掉样页面中的 `script`，生成 `execScripts` 用于执行脚本
>
> 注 ⑦：和应用启动 `frameworkStartedDefer` 原理一样，`prevAppUnmountedDeferred.resolve()` 会在 `loadApp` - `parcelConfigGetter` - `unmount` 最后一个 `promise` 中调用

**替换应用内容和样式：**

- 通过 `getDefaultTplWrapper` 替换应用内容 `appContent`，如 `header`、包裹容器
- `strictStyleIsolation` 根据 `sandbox` 判断是否为 `shadowDom` 模式加载样式
- `scopedCSS` 判断是否通过作用域的方式加载样式
- 通过 `createElement` 创建样式元素 `initialAppWrapperElement`，注 ⑧

> 注 ⑧：
>
> - 将上面获得的 `appContent`、`strictStyleIsolation`、`scopedCSS`、`appInstanceId` 传入 `createElement`
> - 根据情况决定是创建 `shadowDom` 还是 `css-module`
> - 如果是 `css-module` 还会将所有 `link` 样式资源转换成 `style`

**渲染应用：**

- 如果应用信息指定了 `container` 提取为 `initialContainer` 作为初始化容器
- 如果应用信息指定了 `render` 提取为 `legacyRender` 用于渲染回调
- 通过 `getRender` 将传递上面的拿到的信息获取一个 `render` 方法
- 第一次加载设置应用可见区域 dom 结构

**创建沙箱容器：**

- 通过 `getAppWrapperGetter` 返回一个函数 `initialAppWrapperGetter`，用于提取沙箱包装器的 DOM
- 声明代理的 `global` 用沙箱代理对象作为全局 `window`
- 声明 `mountSandbox`、`unmountSandbox`，用于在应用挂载和卸载的时候，将沙箱对应的方法添加到队列中
- 声明 `sandboxContainer` 用于获取沙箱实例
- 通过 `createSandboxContainer` 创建容器，并更新声明的对象

在创建沙箱过程中声明了两个对象：

- `useLooseSandbox`：根据 `sandbox.loose` 判断，`true` 即快照沙箱，`false` 则采用 `proxy` 模式
- `speedySandbox`：根据 `sandbox.speedy` 决定是否开启快速启动模式

**在沙箱中运行脚本：**

先提取生命周期对应的 `hook`

- 通过 `getAddOns` 将代理的 `global` 注入属性，如：`__POWERED_BY_QIANKUN__` 等，注 ⑨
- 然后将自定义的生命周期和注入的属性一同合并为一个对象，并解构为不同的 `hook`

> 注 ⑨：按照生命周期注入 `global` 对应的方法，然后加将对应的 `hook` （如：`async beforeLoad() {}`）作为挂载时任务队列执行

**挂载应用：**

- 通过 `execHooksChain` 先将 `beforeLoad` 这组方法拍平了执行
- 通过 `execScripts` 在沙箱中执行脚本，注 ⑩
- 将拿到的对象通过 `getLifecyclesFromExports` 获取接入应用的导出协议，注 ⑪
- 从 `getMicroAppStateActions` 获取发布和订阅的方法
- 添加一个 `syncAppWrapperElement2Sandbox` 用于在挂载过程中更新 `initialAppWrapperElement`
- 最后返回一个带有 `mount`、`unmount` 等属性对象的方法
- 返回的方法用于给 `registerApplication` 在 `app` 函数中调用并将接入协议提供给 `single-spa`

> 注 ⑪：来自 `importEntry`：
>
> - `execScripts` 会先将获取到应用中的 `script`，作为 `string` 提取出来
> - 如果是 `entry` 入口文件会先记录一下原始的 `global` 内容
> - 然后通过 `geval` 直接编译 `script`
>
> 在 `geval` 中：
>
> - 先通过 `with` 包裹沙箱的 `global` 作为代理的 `window`，这样沙箱内所有的 `window` 都指向 `proxy` 了
> - 同时注入：`Array`、`ArrayBuffer` 等对象
> - 技术之后就可以从 `global` 中提取最后新增的属性作为接入协议
>
> 注 ⑪：接入协议包括 `bootstrap`、`mount`、`unmount`、`update`，通过获取在 `window`（这里的 `window` 也可能是一个代理对象）最后新增的属性，拿到对应的脚本执行后拿到协议

最后分别对返回对象中的 `mount` 和 `unmount` 中的队列补充一个说明：

**`mount`队列顺序：**

- 开发环境检查是否支持 `Performance` 并标记测量和分析代码的执行时间和性能
- 如果是单例模式只有在前一个应用卸载后才能继续挂载
- 通过 `getAppWrapperGetter` 返回一个函数 `appWrapperGetter`，用于挂载时作为应用外部的容器，注 ⑫
- 添加 `mount hook`, 确保每次应用加载前容器 `dom` 结构已经设置完毕，注 ⑬
- 执行挂载沙箱 `mountSandbox`
- 加载应用前，将 `beforeMount` 拍平挨个执行
- 调用子应用挂载方法 `mount`，传递应用信息、自定义 `props`，`appWrapperGetter` 返回的容器，订阅和发布方法
- 挂载之后完成渲染
- 将 `afterMount` 拍平挨个执行
- 如果是单例模式更新 `prevAppUnmountedDeferred`，以便卸载的时候 `resolve`
- 标记整个挂载消耗的性能

> 注 ⑫：拿到的是 `DOM` 或 `shadowDom`
>
> 注 ⑬：应用会在卸载的时候销毁元素（容器），再次挂载的时候需要重新创建。应用一旦加载成功后就不再需要加载，每次挂载的时候，会重新执行 `getAppWrapperGetter` 获取一个容器解析的方法、将应用挂载到容器 `DOM` 里

**`unmount`队列顺序：**

- 将 `beforeUnmount` 拍平挨个执行
- 调用子应用卸载方法 `unmount`，传递应用信息、自定义 `props`，`appWrapperGetter` 返回的容器
- 执行卸载沙箱 `mountSandbox`
- 将 `afterUnmount` 拍平挨个执行
- 卸载应用容器 `DOM` 元素
- 如果是单例模式，`prevAppUnmountedDeferred` 执行 `resolve` 以便下一个应用挂载

至此 `qiankun` 的注册和启动流程大致整理完毕

---- 分割线 ----
