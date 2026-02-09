# AI Daily News 网站部署指南

本指南将帮助您将AI Daily News网站部署到Vercel平台。

## 目录

- [前提条件](#前提条件)
- [方法一：使用Vercel CLI部署](#方法一使用vercel-cli部署)
- [方法二：使用GitHub部署](#方法二使用github部署)
- [自定义域名配置](#自定义域名配置)
- [常见问题](#常见问题)
- [自动更新部署](#自动更新部署)

---

## 前提条件

### 1. 安装必要工具

确保您已安装以下工具：

```bash
# Node.js (版本 >= 18)
node --version

# Git
git --version

# Vercel CLI
npm i -g vercel
```

### 2. 准备Vercel账号

1. 访问 [Vercel官网](https://vercel.com) 注册账号
2. 建议使用GitHub账号登录，以便后续集成

---

## 方法一：使用Vercel CLI部署

### 步骤1：登录Vercel

```bash
# 在终端中登录
vercel login

# 按照提示完成登录（会打开浏览器）
```

### 步骤2：进入项目目录

```bash
cd ~/.openclaw/workspace/ai-daily-news

# 初始化Git（如果是第一次部署）
git init
git add .
git commit -m "Initial commit: AI Daily News website"
```

### 步骤3：部署到Vercel

```bash
# 首次部署
vercel

# 或者使用 --prod 参数直接部署到生产环境
vercel --prod
```

### 步骤4：配置项目

在部署过程中，Vercel会提示您配置项目：

```
? Set up and deploy? [Y/n] Y
? Which scope do you want to deploy to? <your-username>
? Link to existing project? [y/N] N
? What's your project's name? ai-daily-news
? In which directory is your code located? ./
```

### 步骤5：部署完成

部署完成后，Vercel会显示类似以下信息：

```
✅  Production: https://ai-daily-news.vercel.app [copied to clipboard]
✅  Preview: https://ai-daily-news-<random>.vercel.app [copied to clipboard]
```

访问显示的URL即可查看您的网站！

---

## 方法二：使用GitHub部署

### 步骤1：创建GitHub仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `ai-daily-news`
   - Description: "AI Daily News - 每日AI新闻网站"
   - 设置为 Public 或 Private
4. 点击 "Create repository"

### 步骤2：推送代码到GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/<your-username>/ai-daily-news.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤3：连接Vercel与GitHub

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 在 "Import Git Repository" 部分找到您的GitHub仓库
4. 点击 "Import"

### 步骤4：配置项目设置

在项目配置页面：

```
Framework Preset:        Other / None
Build Command:           (留空)
Output Directory:        .
Install Command:         (留空)
```

### 步骤5：部署

点击 "Deploy" 按钮开始部署。

部署完成后，Vercel会提供：
- **生产环境URL**: `https://ai-daily-news.vercel.app`
- **预览URL**: 每次Git push都会自动更新

---

## 自定义域名配置

### 通过Vercel添加域名

1. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中打开您的项目
2. 点击 "Settings" → "Domains"
3. 输入您的自定义域名（如 `ai-news.example.com`）
4. 点击 "Add"

### 配置DNS记录

根据域名提供商的不同，添加以下DNS记录：

| 记录类型 | 名称 | 值 |
|---------|------|-----|
| CNAME | www | cname.vercel-dns.com |
| CNAME | @ | cname.vercel-dns.com |

### 示例：阿里云DNS配置

1. 登录阿里云控制台
2. 进入 "云解析DNS"
3. 选择您的域名
4. 添加记录：
   - 记录类型: CNAME
   - 主机记录: www
   - 记录值: cname.vercel-dns.com
   - TTL: 10分钟

### 示例：Cloudflare配置

1. 登录Cloudflare Dashboard
2. 选择您的域名
3. 进入 "DNS" → "Records"
4. 添加记录：
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy status: 关闭（橙色云朵变灰）

---

## 常见问题

### Q1: 网站加载缓慢？

**解决方案：**
- Vercel全球CDN加速，首次加载可能需要几秒钟
- 后续访问会使用缓存，速度会快很多

### Q2: 图片和静态资源无法加载？

**解决方案：**
- 检查文件路径是否正确
- 确保文件已提交到Git仓库
- 检查 `vercel.json` 中的输出目录配置

### Q3: 如何更新网站内容？

**方法1：使用GitHub（推荐）**
```bash
# 本地修改后
git add .
git commit -m "Update content"
git push origin main

# Vercel会自动部署更新
```

**方法2：使用Vercel CLI**
```bash
vercel --prod
```

### Q4: 如何添加真实的新闻API？

编辑 `js/app.js` 文件，替换模拟数据：

```javascript
// 找到 loadNews 函数，替换为真实API调用
async function loadNews() {
    try {
        // 使用真实的新闻API
        const response = await fetch('https://your-news-api.com/v1/news');
        const data = await response.json();
        state.news = processNewsData(data);
        renderNews();
    } catch (error) {
        console.error('Error loading news:', error);
    }
}
```

**推荐的免费新闻API：**
- [NewsAPI](https://newsapi.org)
- [Hacker News API](https://github.com/HackerNews/API)
- [ArXiv API](http://export.arxiv.org/api/query)

### Q5: 部署后网站显示空白？

**解决方案：**
1. 检查浏览器控制台错误（F12 → Console）
2. 确保 `index.html` 文件存在且路径正确
3. 检查 `vercel.json` 配置
4. 尝试清除浏览器缓存

---

## 自动更新部署

### 配置GitHub Actions自动部署

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Install Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'

            - name: Install dependencies
              run: npm install

            - name: Deploy to Vercel
              uses: amondnet/vercel-action@v20
              with:
                  vercel-token: ${{ secrets.VERCEL_TOKEN }}
                  vercel-org-id: ${{ secrets.ORG_ID }}
                  vercel-project-id: ${{ secrets.PROJECT_ID }}
                  vercel-args: '--prod'
```

### 获取Vercel令牌

1. 访问 [Vercel Account Settings](https://vercel.com/account/tokens)
2. 点击 "Create Token"
3. 设置令牌名称和权限
4. 复制生成的令牌

### 配置GitHub Secrets

在GitHub仓库中：
1. 进入 "Settings" → "Secrets and variables" → "Actions"
2. 添加以下Secrets：
   - `VERCEL_TOKEN`: 您的Vercel访问令牌
   - `ORG_ID`: Vercel组织ID（从API获取）
   - `PROJECT_ID`: Vercel项目ID（从项目设置获取）

---

## 项目结构

```
ai-daily-news/
├── index.html              # 主页面
├── vercel.json             # Vercel配置
├── DEPLOYMENT_GUIDE.md     # 部署指南（本文档）
├── css/
│   └── style.css          # 样式文件
├── js/
│   └── app.js             # 主要逻辑
└── images/
    └── (图片文件)
```

---

## 下一步优化建议

1. **添加真实数据源**
   - 集成NewsAPI获取真实新闻
   - 集成arXiv API获取最新论文
   - 添加Hacker News技术动态

2. **SEO优化**
   - 添加Open Graph标签
   - 生成 sitemap.xml
   - 添加 meta description

3. **性能优化**
   - 压缩CSS和JavaScript
   - 使用懒加载优化图片
   - 添加 service worker 离线支持

4. **用户功能**
   - 添加新闻订阅功能
   - 实现用户收藏功能
   - 添加分享到社交媒体

---

## 联系与支持

如果您在部署过程中遇到问题：

1. 查看 [Vercel文档](https://vercel.com/docs)
2. 搜索 [Vercel社区](https://github.com/vercel/vercel/discussions)
3. 查看本文档的常见问题部分

---

**祝您部署顺利！** 🚀

生成时间：2024年
