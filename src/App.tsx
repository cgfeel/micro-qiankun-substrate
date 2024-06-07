import { loadMicroApp } from "qiankun";
import { BrowserRouter, Link } from "react-router-dom";
import "./App.css";

function App() {
  loadMicroApp({
    name: "custom-static-app",
    entry: "//localhost:30000/?test",
    container: "#yourContainer",
    props: { text: "这是来自父应用透传给子应用的 props" },
  });
  return (
    <div className="App">
      {/** 切换应用的时候 react-router 会进行路由劫持，加载子应用放在容器里 */}
      <BrowserRouter>
        <Link to="/react">React应用</Link> | <Link to="/vue">Vue应用</Link>
      </BrowserRouter>
      <div id="yourContainer"></div>
      <div id="container"></div>
    </div>
  );
}

export default App;
