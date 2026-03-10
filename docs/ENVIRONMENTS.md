# 环境配置说明

## 环境文件

项目支持三种环境配置，通过环境变量文件控制：

### 1. 开发环境 (`.env.development`)
```bash
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_CONSOLE_LOG=true
```

### 2. 测试环境 (`.env.test`)
```bash
VITE_APP_ENV=test
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_CONSOLE_LOG=true
```

### 3. 生产环境 (`.env.production`)
```bash
VITE_APP_ENV=production
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_CONSOLE_LOG=false
```

## 使用方式

### 开发阶段
```bash
# 启动开发服务器（默认开发环境）
pnpm dev

# 启动开发服务器（测试环境）
pnpm dev:test
```

### 构建阶段
```bash
# 构建生产版本（禁用开发者工具和 console）
pnpm build:app

# 构建测试版本（启用开发者工具和 console）
pnpm build:app:test
```

## 功能控制

### 开发者工具
- **开发/测试环境**: 启用
  - ✅ F12 打开开发者工具
  - ✅ Ctrl+Shift+I 打开开发者工具
  - ✅ Ctrl+Shift+J 打开控制台
  - ✅ 右键菜单
  - ✅ Ctrl+U 查看源代码
  
- **生产环境**: 禁用
  - ❌ 所有开发者工具快捷键
  - ❌ 右键菜单
  - ❌ 控制台日志

### 控制台日志
- **开发/测试环境**: 启用所有 console 输出
- **生产环境**: 禁用所有 console 输出（防止信息泄露）

## 环境变量说明

| 变量名 | 说明 | 开发环境 | 测试环境 | 生产环境 |
|--------|------|----------|----------|----------|
| `VITE_APP_ENV` | 当前环境标识 | development | test | production |
| `VITE_ENABLE_DEVTOOLS` | 是否启用开发者工具 | true | true | false |
| `VITE_ENABLE_CONSOLE_LOG` | 是否启用控制台日志 | true | true | false |

## 注意事项

1. **默认行为**:
   - `pnpm dev` 默认使用开发环境配置
   - `pnpm build:app` 默认使用生产环境配置

2. **测试环境用途**:
   - 用于 QA 测试
   - 保留开发者工具便于调试
   - 构建产物接近生产环境

3. **生产环境发布**:
   - 始终使用 `pnpm build:app` 构建
   - 禁用所有开发者工具和控制台
   - 防止敏感信息泄露

4. **临时调试**:
   - 可以修改 `.env.production` 临时启用开发者工具
   - 重新构建后生效
   - 发布前记得改回 `false`
