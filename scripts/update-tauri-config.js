#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件所在目录（ES 模块方式）
const __dirname = dirname(fileURLToPath(import.meta.url));

// 获取命令行参数
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'production';

// 读取 tauri.conf.json
const configPath = join(__dirname, '..', 'src-tauri', 'tauri.conf.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// 根据模式设置 devtools
const enableDevTools = mode === 'development' || mode === 'test';

// 修改配置
config.app.windows.forEach(window => {
  window.devtools = enableDevTools;
});

// 写回文件
writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

console.log(`Tauri config updated: devtools = ${enableDevTools} (mode: ${mode})`);
