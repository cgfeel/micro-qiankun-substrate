# micro-qiankun-substrate

一个 qiankun 基座，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

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

### 搭建基座主应用

目录：`substrate` [[查看](https://github.com/cgfeel/micro-qiankun-substrate)] 当前仓库

3 部完成：

- 在 `src` 下添加注册文件 `registerApps.ts` [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/registerApp.ts)]
- 将 `registerApps.ts` 在入口文件引入 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/index.tsx)]
- 使用 `React-Router` 作为路由劫持，并添加放置容器的 Dom 节点 [[查看](https://github.com/cgfeel/micro-qiankun-substrate/blob/main/src/App.tsx)]

和 ` single-spa` 对比：

- 不再需要按照 `SystemJS` 那样需要将导入资源表和注册信息分别写入
- 不再要求父子应用名和项目完整名称对应
- 在注册应用同时，也暴露了完整的生命周期回调函数
- 在启动应用中支持沙箱等操作
- 操作更简单，只要 3 步骤
- 直接拿现有的框架作为基座，而不是将 `single-spa` 作为基座

### 配置 `React` 子应用

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

和章节不一样的地方：

- 使用 `react-app-rewired` 代替 `@rescripts/cli`，因为 `@rescripts/cli` 依赖和 `react-scripts@5.0.1` 冲突
- 不需要配置 `create-react-app` 的 `cors`，默认支持

### 配置 `Vue` 子应用
