#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  倒计时挂件 - 打包脚本"
echo "========================================"
echo ""

cd "$PROJECT_DIR"

echo "[1/3] 清理旧的构建文件..."
rm -rf dist
rm -rf src-tauri/target/release
echo ""

echo "[2/3] 构建前端资源..."
pnpm build
echo ""

echo "[3/3] 打包 Tauri 应用..."
pnpm tauri build
echo ""

echo "========================================"
echo "  ✅ 打包完成！"
echo "========================================"
echo ""
echo "安装包位置:"
echo "  $PROJECT_DIR/src-tauri/target/release/bundle/"
echo ""
