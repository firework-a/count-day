import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { join } from "path";

const host = process.env.TAURI_DEV_HOST;

// 读取 package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // 根据模式加载环境变量
  // 开发模式（dev）或测试模式（test）都启用开发者工具
  const isDevelopment = mode === 'development' || mode === undefined;
  const isTest = mode === 'test';
  const isProduction = mode === 'production';
  const enableDevTools = isDevelopment || isTest;

  return {
    plugins: [react()],

    // 定义全局常量
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_NAME__: JSON.stringify(packageJson.name),
      __APP_REPOSITORY__: JSON.stringify("https://github.com/firework-a/count-day"),
      __APP_ISSUES__: JSON.stringify("https://github.com/firework-a/count-day/issues"),
      // 暴露环境变量给应用
      'import.meta.env.VITE_ENABLE_DEVTOOLS': JSON.stringify(enableDevTools),
      'import.meta.env.VITE_ENABLE_CONSOLE_LOG': JSON.stringify(enableDevTools),
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
          protocol: "ws",
          host,
          port: 1421,
        }
        : undefined,
      watch: {
        // 3. tell Vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
