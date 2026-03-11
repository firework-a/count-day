#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件所在目录（ES 模块方式）
const __dirname = dirname(fileURLToPath(import.meta.url));

// 获取命令行参数
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'production';
const restore = args.includes('--restore');

// 读取 package.json 获取版本号
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// 读取 tauri.conf.json
const configPath = join(__dirname, '..', 'src-tauri', 'tauri.conf.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

if (restore) {
  // 恢复模式：重置为开发环境配置
  config.app.windows.forEach(window => {
    window.devtools = true;
  });
  
  // 恢复开发环境的更新端点
  config.plugins.updater.endpoints = [
    "https://github.com/firework-a/count-day/releases/latest/download/latest.json"
  ];
  
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log('✅ Tauri config restored to development mode');
  console.log('   devtools = true');
  console.log('   updater endpoint = latest/download');
} else {
  // 构建模式：根据模式设置 devtools
  const enableDevTools = mode === 'development' || mode === 'test';

  // 修改配置
  config.app.windows.forEach(window => {
    window.devtools = enableDevTools;
  });

  // 更新 updater 端点，使用 package.json 中的版本号
  config.plugins.updater.endpoints = [
    `https://github.com/firework-a/count-day/releases/download/v${version}/latest.json`
  ];

  // 更新 tauri.conf.json 中的版本号
  config.version = version;

  // 写回文件
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  console.log(`Tauri config updated: devtools = ${enableDevTools} (mode: ${mode})`);
  console.log(`Updater endpoint set to: https://github.com/firework-a/count-day/releases/download/v${version}/latest.json`);
  console.log(`Version synced to: ${version}`);

  // 同步 Cargo.toml 版本号
  const cargoTomlPath = join(__dirname, '..', 'src-tauri', 'Cargo.toml');
  let cargoTomlContent = readFileSync(cargoTomlPath, 'utf-8');
  cargoTomlContent = cargoTomlContent.replace(
    /^version = ".*"$/m,
    `version = "${version}"`
  );
  writeFileSync(cargoTomlPath, cargoTomlContent, 'utf-8');

  console.log(`Cargo.toml version synced to: ${version}`);
}
