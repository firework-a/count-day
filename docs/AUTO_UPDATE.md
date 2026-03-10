# 自动更新配置指南

## 配置步骤

### 1. 生成签名密钥（已完成）

私钥和密碼已配置在 `.env` 文件中：
```bash
TAURI_SIGNING_PRIVATE_KEY=your_private_key
TAURI_SIGNING_PRIVATE_KEY_PASSWORD=your_password
```

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 secrets：

```
TAURI_SIGNING_PRIVATE_KEY = (你的私钥，从.env 文件复制)
TAURI_SIGNING_PRIVATE_KEY_PASSWORD = 1314521as
```

### 3. 发布新版本

#### 方法一：使用 GitHub Actions（推荐）

1. 更新 `package.json` 中的版本号：
```json
{
  "version": "0.1.3"  // 修改这里
}
```

2. 提交并推送：
```bash
git add package.json
git commit -m "chore: bump version to 0.1.3"
git push
```

3. 创建标签：
```bash
git tag v0.1.3
git push origin v0.1.3
```

4. GitHub Actions 会自动：
   - 构建应用
   - 生成 `latest.json`
   - 创建 Release Draft
   - 上传所有文件

5. 在 GitHub Releases 页面编辑并发布 Draft

#### 方法二：手动发布

1. 本地构建：
```bash
pnpm build:app
```

2. 构建完成后，`dist/latest.json` 会自动生成

3. 手动上传到 GitHub Releases：
   - `count-day.exe`
   - `count-day_0.1.3_x64_zh-CN.msi`
   - `count-day_0.1.3_x64-setup.exe`
   - `latest.json`

### 4. latest.json 格式

自动生成的 `latest.json` 格式：

```json
{
  "version": "0.1.3",
  "notes": "count-day",
  "pub_date": "2024-01-01T00:00:00.000Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "",
      "url": "https://github.com/firework-a/count-day/releases/download/v0.1.3/count-day_0.1.3_x64-setup.exe"
    }
  }
}
```

## 用户更新流程

1. 打开应用 → 设置 → 系统设置
2. 点击"检查更新"
3. 如果有新版本，弹出确认对话框
4. 确认后自动下载并安装
5. 重启应用完成更新

## 注意事项

1. **版本号规则**：
   - 必须使用语义化版本（major.minor.patch）
   - Git 标签必须以 `v` 开头（如 `v0.1.3`）

2. **签名安全**：
   - ⚠️ 不要将私钥提交到 Git
   - ⚠️ `.env` 文件已在 `.gitignore` 中

3. **更新检查**：
   - 应用会访问 GitHub Releases 检查更新
   - 需要网络连接

## 本地测试

本地构建时会自动生成 `latest.json`：

```bash
pnpm build
# 输出：✅ Generated latest.json for version 0.1.2
#       Output: dist/latest.json
```

可以在设置中测试更新功能（需要配置正确的更新源）。
