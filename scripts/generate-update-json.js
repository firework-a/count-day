#!/usr/bin/env node

/**
 * 自动生成 Tauri 更新所需的 latest.json 文件
 * 用于 GitHub Releases 自动更新
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const version = packageJson.version;

// 读取更新日志（从 CHANGELOG.md 或 package.json）
const releaseNotes = packageJson.description || `Release version ${version}`;

// 生成当前日期
const pubDate = new Date().toISOString();

// 生成 latest.json 内容
const latestJson = {
  version: version,
  notes: releaseNotes,
  pub_date: pubDate,
  platforms: {
    'windows-x86_64': {
      signature: '',
      url: `https://github.com/firework-a/count-day/releases/download/v${version}/count-day_${version}_x64-setup.exe`
    }
  }
};

// 输出到 dist 目录（构建输出目录）
const distDir = join(rootDir, 'dist');
const outputPath = join(distDir, 'latest.json');

try {
  writeFileSync(outputPath, JSON.stringify(latestJson, null, 2), 'utf-8');
  console.log(`✅ Generated latest.json for version ${version}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Content: ${JSON.stringify(latestJson, null, 2)}`);
} catch (error) {
  console.error('❌ Failed to generate latest.json:', error.message);
  process.exit(1);
}
