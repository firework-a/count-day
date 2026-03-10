# 倒计时挂件 - Count Day

一款基于 Tauri + React 开发的桌面倒计时挂件应用，支持多个倒计时项目、智能节假日识别、下班倒计时、薪资计算等功能。

![License](https://img.shields.io/github/license/firework-a/count-day)
![Tauri](https://img.shields.io/badge/Tauri-2.0-24C8DB?logo=tauri)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)

![应用预览](/public/time-card.png)

## ✨ 功能特性

### 🕐 核心功能

- **实时时钟** - 显示当前时间和日期
- **多倒计时支持** - 同时显示多个倒计时项目
- **智能节假日** - 自动识别工作日、周末和法定节假日
- **下班倒计时** - 显示距离下班还有多少分钟
- **薪资计算** - 实时计算今日已赚工资（窝囊费）

### 🎨 外观定制

- **主题切换** - 支持浅色/深色/自动模式
- **纯黑模式** - OLED 屏幕友好
- **背景透明度** - 自由调节背景透明度
- **字体选择** - 支持自定义字体
- **颜色定制** - 可自定义文字和边框颜色

### 💬 智能提示语

- **时段识别** - 根据时间显示不同提示（早安/午安/晚安）
- **每日轮换** - 每天显示不同类型的提示语
- **丰富内容** - 200+ 条提示语，包含：
  - 🌅 时段问候（早/中/晚/夜间）
  - 💪 激励名言
  - 🏃 健康提醒
  - 🧘 正念冥想
  - 😄 幽默段子
  - 🍂 季节相关

### 🪟 窗口功能

- **贴边隐藏** - 可贴靠屏幕边缘自动收起
- **悬停探头** - 鼠标悬停时自动探出
- **窗口置顶** - 支持始终置顶
- **拖拽移动** - 可自由拖动位置
- **透明背景** - 支持透明背景，更好地融入桌面

## 📦 安装

### 从发布页下载

前往 [Releases](https://github.com/firework-a/count-day/releases) 下载最新版本的安装包：

- **Windows**: `.exe` (NSIS) 或 `.msi` 安装包

### 源码构建

```bash
# 克隆项目
git clone https://github.com/firework-a/count-day.git
cd count-day

# 安装依赖
pnpm install

# 开发模式
pnpm tauri dev

# 打包构建
pnpm tauri build
# 或使用打包脚本
./scripts/build.bat  # Windows
./scripts/build.sh   # Linux/Mac
```

## 🔧 构建要求

- **Node.js** >= 18
- **pnpm** >= 8
- **Rust** >= 1.70
- **Tauri CLI** >= 2.0

## 📁 项目结构

```
count-day/
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   │   ├── Clock/         # 时钟组件
│   │   ├── CountdownList/ # 倒计时列表
│   │   ├── Suggestion/    # 智能提示语
│   │   ├── HoverRegions/  # 悬停交互区域
│   │   ├── DockControl/   # 贴边控制
│   │   └── SettingsModal/ # 设置弹窗
│   ├── utils/             # 工具函数
│   │   ├── settings.ts    # 设置管理
│   │   └── holidays.ts    # 节假日数据
│   ├── styles/            # 全局样式
│   └── App.tsx            # 主应用组件
├── src-tauri/             # Tauri 后端源码
│   ├── src/               # Rust 源码
│   ├── icons/             # 应用图标
│   └── tauri.conf.json    # Tauri 配置
├── scripts/               # 构建脚本
│   ├── build.bat          # Windows 打包脚本
│   └── build.sh           # Linux/Mac 打包脚本
└── package.json           # 项目配置
```

## 🚀 使用说明

### 基本操作

| 操作               | 说明             |
| ------------------ | ---------------- |
| 拖动中间区域       | 移动挂件位置     |
| 点击右上角设置图标 | 打开偏好设置     |
| 点击右上角置顶图标 | 切换窗口置顶状态 |
| 点击右上角收起图标 | 贴边隐藏挂件     |
| 鼠标悬停隐藏的挂件 | 挂件自动探出     |

### 设置项说明

| 设置项                        | 说明                         |
| ----------------------------- | ---------------------------- |
| **发薪日**                    | 设置每月发薪日期，计算日薪   |
| **日薪金额**                  | 输入月薪，自动计算日薪和时薪 |
| **工作时间**                  | 设置上下班时间               |
| **主题模式** - 浅色/深色/自动 |
| **纯黑模式** - OLED 屏幕省电  |
| **背景透明度** - 0-100%       |
| **字体选择** - 支持系统字体   |

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm tauri dev

# 代码检查
pnpm lint

# 修复代码风格
pnpm lint:fix
```

## 🌍 环境配置

项目支持多种环境配置，详见 [环境配置文档](docs/ENVIRONMENTS.md)

```bash
# 开发环境（启用开发者工具）
pnpm tauri dev

# 测试环境构建（启用开发者工具）
pnpm build:app:test

# 生产环境构建（禁用开发者工具）
pnpm build:app
```

## 📝 技术栈

- **应用框架**
  - Tauri 2.0

- **前端**
  - React 19
  - TypeScript
  - Vite 7
  - Sass
  - date-fns
  - Lucide Icons

- **后端**
  - Rust

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [React](https://react.dev/) - 前端框架
- [date-fns](https://date-fns.org/) - 日期处理库
- [Lucide](https://lucide.dev/) - 图标库

---

**Made with VsCode ❤️ by Firework-a**
