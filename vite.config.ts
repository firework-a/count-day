import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { join } from "path";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// 读取 package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // 根据模式加载环境变量
  const isTest = mode === 'test';
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],

    // 定义全局常量
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_NAME__: JSON.stringify(packageJson.name),
      __APP_REPOSITORY__: JSON.stringify("https://github.com/firework/count-day"),
      __APP_ISSUES__: JSON.stringify("https://github.com/firework/count-day/issues"),
      // 暴露环境变量给应用
      'import.meta.env.VITE_ENABLE_DEVTOOLS': JSON.stringify(
        isTest ? 'true' : (isProduction ? 'false' : 'true')
      ),
      'import.meta.env.VITE_ENABLE_CONSOLE_LOG': JSON.stringify(
        isTest ? 'true' : (isProduction ? 'false' : 'true')
      ),
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
