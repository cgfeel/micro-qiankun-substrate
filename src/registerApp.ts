import { registerMicroApps, start } from "qiankun";

const customProps = { num: 1, util: {} };

const loader = (loading: boolean) => {
    console.log("加载状态", loading);
}

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

start();