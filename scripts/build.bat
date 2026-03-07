@echo off
chcp 65001 >nul
echo ========================================
echo   倒计时挂件 - 打包脚本 (NSIS)
echo ========================================
echo.

cd /d "%~dp0.."

echo [1/3] 清理旧的构建文件...
if exist "dist" rmdir /s /q "dist"
if exist "src-tauri\target\release" rmdir /s /q "src-tauri\target\release"
echo.

echo [2/3] 构建前端资源...
call pnpm build
if errorlevel 1 (
    echo.
    echo ❌ 前端构建失败！
    exit /b 1
)
echo.

echo [3/3] 打包 Tauri 应用...
call pnpm tauri build
if errorlevel 1 (
    echo.
    echo ❌ Tauri 打包失败！
    exit /b 1
)
echo.

echo ========================================
echo   ✅ 打包完成！
echo ========================================
echo.
echo 安装包位置:
echo   %cd%\src-tauri\target\release\bundle\nsis\
echo.
echo 按任意键退出...
pause >nul
