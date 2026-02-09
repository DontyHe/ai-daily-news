# 🤖 AI Daily News - 每日AI新闻网站

![AI Daily News](https://img.shields.io/badge/AI-Daily%20News-purple?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

一个专注于人工智能领域的每日新闻网站，提供最新的AI新闻、论文和技术动态。

## ✨ 功能特性

- 📰 **每日AI新闻** - 精选AI行业重大新闻和突破
- 📚 **最新论文** - 追踪arXiv最新发布的研究论文
- 🛠️ **工具推荐** - 推荐好用的AI工具和应用
- 🔍 **智能搜索** - 快速搜索新闻、论文和主题
- 🏷️ **分类筛选** - 按类别筛选新闻内容
- 🌙 **深色模式** - 保护眼睛的深色主题
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **快速加载** - 静态页面，极速体验

## 🚀 快速开始

### 本地预览

```bash
# 进入项目目录
cd ~/.openclaw/workspace/ai-daily-news

# 使用Python启动本地服务器
python3 -m http.server 8000

# 或者使用Node.js
npx serve .

# 在浏览器中打开
# http://localhost:8000
```

### 在线部署

网站已配置好Vercel部署，支持一键部署：

#### 方法1: Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 方法2: GitHub集成
1. 将代码推送到GitHub仓库
2. 在Vercel中导入GitHub仓库
3. 自动部署完成

详细部署指南请参考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📁 项目结构

```
ai-daily-news/
├── index.html              # 🏠 主页面
├── README.md               # 📖 项目说明
├── DEPLOYMENT_GUIDE.md     # 🚀 部署指南
├── vercel.json             # ⚡ Vercel配置
├── .gitignore              # 📝 Git忽略文件
├── css/
│   └── style.css          # 🎨 样式文件
├── js/
│   └── app.js             # 💻 主要逻辑
└── images/
    └── (图片资源)
```

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代CSS特性（Flexbox、Grid、变量）
- **JavaScript ES6+** - 原生JavaScript
- **Vercel** - 静态网站托管

## 📊 包含的页面模块

1. **导航栏** - Logo、导航链接、深色模式切换
2. **英雄区域** - 搜索框、日期显示
3. **新闻模块** - 分类筛选、新闻卡片列表
4. **论文模块** - 排序功能、论文卡片列表
5. **工具推荐** - AI工具展示卡片
6. **关于页面** - 网站介绍和功能特性
7. **页脚** - 快速链接、订阅表单

## 🎨 设计特点

### 响应式设计
- 桌面端：完整三栏布局
- 平板端：两栏自适应
- 移动端：单栏堆叠布局

### 深色模式
- 系统主题自动检测
- 手动切换开关
- 偏好设置本地存储

### 动画效果
- 平滑的过渡动画
- 卡片悬停效果
- 加载动画
- 返回顶部按钮

## 📱 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Android Chrome 80+

## 🔧 自定义配置

### 修改网站信息

编辑 `index.html` 中的元数据：

```html
<meta name="description" content="您的网站描述">
<title>您的网站标题</title>
```

### 修改颜色主题

编辑 `css/style.css` 中的CSS变量：

```css
:root {
    --primary-color: #6366f1;  /* 主色调 */
    --secondary-color: #8b5cf6; /* 次要色 */
    /* 其他颜色变量 */
}
```

### 添加新分类

在 `js/app.js` 中添加分类选项：

```javascript
const categoryNames = {
    llm: '大语言模型',
    robotics: '机器人',
    cv: '计算机视觉',
    nlp: '自然语言处理',
    your_new_category: '新分类名称'  // 添加新分类
};
```

### 集成真实API

默认使用模拟数据。要使用真实数据，修改 `js/app.js`：

```javascript
// 新闻API示例 (NewsAPI.org)
async function loadNews() {
    const response = await fetch(
        'https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_API_KEY'
    );
    const data = await response.json();
    // 处理并渲染数据
}

// 论文API示例 (arXiv)
async function loadPapers() {
    const response = await fetch(
        'http://export.arxiv.org/api/query?search_cat=cs.AI&sort=submitted&sort_order=desc'
    );
    // 解析并渲染数据
}
```

## 📈 性能优化

- ⚡ 纯静态页面，加载速度极快
- 💾 本地缓存深色模式偏好
- 🎯 懒加载图片（需要图片懒加载功能时）
- 📦 最小化CSS和JS文件（生产环境）

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志

### Version 1.0.0 (2024)
- ✨ 初始版本发布
- 📰 新闻模块
- 📚 论文模块
- 🛠️ 工具推荐模块
- 🌙 深色模式
- 🔍 搜索功能
- 🏷️ 分类筛选
- 📱 响应式设计
- 🚀 Vercel部署配置

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vercel](https://vercel.com) - 优秀的静态网站托管平台
- [Font Awesome](https://fontawesome.com) - 图标库
- [Unsplash](https://unsplash.com) - 封面图片

## 📞 联系方式

- 项目链接: [https://github.com/your-username/ai-daily-news](https://github.com/your-username/ai-daily-news)
- 问题反馈: [Issues](https://github.com/your-username/ai-daily-news/issues)

---

<p align="center">
  用 ❤️ 构建 |  Powered by AI Daily News
</p>
