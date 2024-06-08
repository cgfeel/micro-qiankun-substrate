import { initGlobalState, registerMicroApps, start } from "qiankun";

const action = initGlobalState({ age: 18, name: "levi" });
const customProps = { num: 1, util: {} };

const loader = (loading: boolean) => {
    console.log("加载状态", loading);
}

action.onGlobalStateChange((newValue, oldValue) => {
    console.log("parent state change", newValue, oldValue);
});

registerMicroApps([
    {
        name: "reactApp",
        entry: "//localhost:10000",  // 默认 react 启动的入口是 10000 端口
        activeRule: "/react",  // 当路径是 /react 的时候启动
        container: "#container",
        props: customProps,
        loader
    },
    {
        name: "vueApp",
        entry: "//localhost:20000",  // 默认 react 启动的入口是 10000 端口
        activeRule: "/vue",  // 当路径是 /react 的时候启动
        container: "#container",
        props: customProps,
        loader
    },
], {
    async beforeLoad() {
        console.log("before load");
    },
    async beforeMount() {
        console.log("before mount");
    },
    async afterMount() {
        console.log("after mount");
    },
    async beforeUnmount() {
        console.log("before unmount");
    },
    async afterUnmount() {
        console.log("after unmount");
    }
});

// 样式隔离的几个方式
// css-module、scope 生成一个选择器：.name[data-qiankun="xxxx"] 
// BEM
// css-in-js 通过 `:where` 在不提权情况下设置样式
// shadowDOM 严格隔离

start({
    sandbox: {
        // 实现了动态样式表
        // 缺点 1：子应用的 Dom 元素挂载到了外层，会导致样式不生效
        // 缺点 2：子应用设置样式在 body，会导致样式不生效
        experimentalStyleIsolation: true

        // 将子应用放到 shadom-root 中进行隔离
        // 缺点：完全隔离，无法拿到外层的属性，在当前演示中静态子应用将失效
        // strictStyleIsolation: true,
    }
});