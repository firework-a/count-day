import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.scss";

// 根据环境变量控制是否启用开发者工具
// Vite 的 define 会直接替换为布尔值
const enableDevTools = import.meta.env.VITE_ENABLE_DEVTOOLS === true || import.meta.env.VITE_ENABLE_DEVTOOLS === 'true';
const enableConsoleLog = import.meta.env.VITE_ENABLE_CONSOLE_LOG === true || import.meta.env.VITE_ENABLE_CONSOLE_LOG === 'true';

// 如果禁用了控制台日志，则覆盖 console 方法
if (!enableConsoleLog) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// 如果禁用了开发者工具，则禁用右键菜单和快捷键
if (!enableDevTools) {
  // 禁用右键菜单
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  // 禁用开发者工具快捷键
  document.addEventListener('keydown', (event) => {
    // F12
    if (event.key === 'F12') {
      event.preventDefault();
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
      event.preventDefault();
    }
    // Ctrl+Shift+J / Cmd+Option+J
    if (event.ctrlKey && event.shiftKey && event.key === 'J') {
      event.preventDefault();
    }
    // Ctrl+Shift+C / Cmd+Option+C
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault();
    }
    // Ctrl+U (查看源代码)
    if (event.ctrlKey && event.key === 'U') {
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
