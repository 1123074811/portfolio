# 个人项目作品集网站

一个基于 **Vue 3 + Vite + Tailwind CSS** 构建的现代化个人项目作品集网站，面向求职展示、项目复盘、技术能力呈现与个人品牌建设。网站重点突出 **AI 应用开发、Vibe Coding、Web 全栈项目、效率工具与技术分享**，支持中英文双语切换、深浅色主题、项目独立详情页、多媒体项目展示和打印版在线简历。

---

## 项目亮点

### 1. 现代化作品集首页

网站采用单页作品集结构，包含以下主要模块：

- **Hero 首屏展示**：个人定位、打字机动效、核心行动按钮。
- **关于我**：展示个人简介、开发理念、能力标签与成长方向。
- **精选项目**：以卡片网格形式展示 AI、全栈、效率工具、创意实验等项目。
- **开发工具箱**：展示前端、后端、AI 工程化与效率工具能力栈。
- **技术分享**：展示个人技术方法论、项目复盘、Vibe Coding 思考。
- **成长轨迹**：展示教育、实践、项目、竞赛等经历。
- **联系我**：提供邮箱复制、邮件直达、GitHub、Gitee、技术博客入口。
- **页脚监控面板**：模拟访客统计、实时在线人数和服务状态，增强极客感。

### 2. 独立项目详情页

项目卡片点击后进入独立的项目详情页，而不是弹窗。详情页采用 Case Study 风格，展示：

- 项目大图 / 视频轮播 Banner。
- 项目背景与定位。
- 核心功能列表。
- 技术亮点列表。
- 个人贡献说明。
- 技术栈标签。
- 项目规格信息。
- 在线预览与源码链接。

该设计更适合求职场景中的项目深度展示，也更接近真实产品官网或项目案例页的表达方式。

### 3. 多媒体轮播展示

项目数据支持 `media` 字段，可配置图片和视频：

```js
media: [
  {
    type: "video",
    url: "https://example.com/demo.mp4",
    poster: "https://example.com/poster.jpg"
  },
  {
    type: "image",
    url: "https://example.com/screenshot.jpg"
  }
]
```

详情页会自动识别媒体类型：

- `image` 渲染为高清图片。
- `video` 渲染为 HTML5 视频播放器。
- 多个媒体资源会自动启用左右切换按钮、底部指示点和类型徽章。
- 切换时使用 Vue `<transition>` 实现淡入淡出动画。

### 4. 中英文双语国际化

项目内置轻量级国际化实现，位于：

```text
src/data/locale.js
```

主要能力：

- 使用 Vue `ref` 管理当前语言状态。
- 支持中文 `zh` 与英文 `en`。
- 使用 `localStorage` 持久化用户语言偏好。
- 各组件根据 `locale` 动态渲染中英文内容。
- 项目数据中使用 `title/titleEn`、`description/descriptionEn` 等字段承载双语内容。

### 5. 在线打印版简历

项目提供独立的打印版简历页面：

```text
public/resume.html
```

访问路径：

```text
/resume.html
```

可直接通过浏览器 `Ctrl + P` 或 `Cmd + P` 打印为 PDF，适合作为离线投递材料。

### 6. Vercel 自动化部署友好

项目为 Vite 静态站点，天然适配 Vercel、Netlify、GitHub Pages 等静态部署平台。

推荐 Vercel 配置：

- **Framework Preset**：Vite
- **Install Command**：`npm install` 或 `npm ci`
- **Build Command**：`npm run build`
- **Output Directory**：`dist`

推送到 GitHub 后，Vercel 可自动监听 `main` 分支更新并完成 CI/CD 构建部署。

---

## 技术栈

### 前端框架

- **Vue 3**：Composition API、响应式状态管理。
- **Vite**：极速开发服务器与生产构建。
- **Tailwind CSS**：原子化 CSS，实现响应式、深浅色主题和复杂视觉样式。
- **Lucide Vue Next**：现代化线性图标库。

### 工程配置

- **PostCSS**：CSS 处理链。
- **Autoprefixer**：自动补全浏览器兼容前缀。
- **ES Modules**：项目使用 `type: module`。

---

## 目录结构

```text
portfolio/
├── docs/
│   └── portfolio-requirements.md      # 项目需求与开发记录文档
├── public/
│   └── resume.html                    # 可打印在线简历页面
├── src/
│   ├── assets/                        # 静态资源
│   ├── components/                    # 页面组件
│   │   ├── AboutSection.vue           # 关于我模块
│   │   ├── BlogSection.vue            # 技术分享模块
│   │   ├── ContactSection.vue         # 联系模块
│   │   ├── ExperienceSection.vue      # 成长轨迹模块
│   │   ├── Footer.vue                 # 页脚与访客监控面板
│   │   ├── HeroSection.vue            # 首屏展示与打字机动效
│   │   ├── Navbar.vue                 # 顶部导航与语言切换
│   │   ├── ProjectCard.vue            # 项目卡片
│   │   ├── ProjectDetailsPage.vue     # 独立项目详情页
│   │   ├── ProjectFilter.vue          # 项目分类筛选
│   │   ├── ProjectModal.vue           # 历史弹窗详情组件，当前主流程已改为独立详情页
│   │   ├── ProjectSection.vue         # 项目列表模块
│   │   └── SkillsSection.vue          # 技能工具箱模块
│   ├── data/
│   │   ├── locale.js                  # 国际化状态与详情页状态控制
│   │   └── portfolioData.js           # 个人信息、项目、技能、经历、博客等数据
│   ├── App.vue                        # 应用根组件
│   ├── main.js                        # 应用入口
│   └── style.css                      # 全局样式与 Tailwind 引入
├── .gitignore                         # Git 忽略规则
├── index.html                         # Vite HTML 入口与 SEO Meta
├── package.json                       # 项目依赖与脚本
├── postcss.config.js                  # PostCSS 配置
├── tailwind.config.js                 # Tailwind CSS 配置
└── vite.config.js                     # Vite 配置
```

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

启动后通常访问：

```text
http://localhost:5173
```

### 3. 生产构建

```bash
npm run build
```

构建产物会输出到：

```text
dist/
```

### 4. 本地预览生产构建

```bash
npm run preview
```

---

## 可用脚本

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

- `npm run dev`：启动本地开发环境。
- `npm run build`：生成生产环境静态文件。
- `npm run preview`：本地预览构建后的站点。

---

## 内容配置说明

网站的绝大部分内容由 `src/data/portfolioData.js` 驱动，包括：

- 个人基础信息。
- About 模块内容。
- 项目列表。
- 项目分类。
- 技能分组。
- 经历时间线。
- 技术博客文章。
- 求职目标。

### 添加新项目

在 `portfolioData.projects` 数组中添加对象即可：

```js
{
  id: "example-project",
  title: "中文项目名",
  titleEn: "English Project Name",
  subtitle: "中文副标题",
  subtitleEn: "English subtitle",
  category: "AI 应用",
  categoryEn: "AI Apps",
  description: "中文项目描述",
  descriptionEn: "English description",
  coverImage: "https://example.com/cover.jpg",
  media: [
    {
      type: "image",
      url: "https://example.com/screenshot.jpg"
    },
    {
      type: "video",
      url: "https://example.com/demo.mp4",
      poster: "https://example.com/poster.jpg"
    }
  ],
  techStack: ["Vue 3", "Tailwind CSS"],
  features: ["中文功能点"],
  featuresEn: ["English feature"],
  highlights: ["中文技术亮点"],
  highlightsEn: ["English highlight"],
  role: "中文个人贡献",
  roleEn: "English contribution",
  demoUrl: "#",
  sourceUrl: "#",
  status: "持续迭代",
  statusEn: "Active",
  year: "2026",
  featured: true
}
```

### 项目分类

分类字段需要与 `categories` / `categoriesEn` 对齐，否则筛选时可能无法正确匹配。

---

## 独立项目详情页说明

独立详情页组件位于：

```text
src/components/ProjectDetailsPage.vue
```

入口控制逻辑位于：

```text
src/data/locale.js
```

核心状态：

```js
export const currentProject = ref(null)
```

进入详情页：

```js
openProjectDetails(project)
```

返回作品集：

```js
closeProjectDetails()
```

`App.vue` 会根据 `currentProject` 是否存在决定渲染：

- 存在：渲染 `ProjectDetailsPage`。
- 不存在：渲染首页所有模块。

这种方式保留了单页应用的轻量性，同时实现了类似独立页面的浏览体验。

---

## 国际化说明

国际化配置文件：

```text
src/data/locale.js
```

当前实现适合小型个人站点，特点是简单、直观、无第三方依赖。

如未来网站内容进一步扩大，可以迁移到：

- `vue-i18n`
- JSON 多语言资源文件
- 路由级语言切换，如 `/zh/projects`、`/en/projects`

---

## 深浅色主题

项目使用 Tailwind CSS 的 `dark` 模式类名体系。组件中广泛使用：

```text
dark:bg-*
dark:text-*
dark:border-*
```

用于在亮色与暗色主题下保持一致的视觉层级。

---

## 部署到 Vercel

### 方式一：通过 Vercel 控制台部署

1. 登录 [Vercel](https://vercel.com/)。
2. 使用 GitHub 账号授权。
3. 点击 `Add New` -> `Project`。
4. 选择 GitHub 仓库 `portfolio`。
5. 保持默认 Vite 配置：
   - Build Command：`npm run build`
   - Output Directory：`dist`
6. 点击 Deploy。

### 方式二：CI/CD 自动部署

首次导入项目后，Vercel 会自动绑定 GitHub Webhook：

- 推送到 `main` 分支：自动构建并部署生产环境。
- 新建 Pull Request：自动生成预览链接。
- 构建失败：Vercel 控制台显示错误日志。

---

## 安全说明

项目当前没有硬编码密码、私钥或真实 API Key。

注意事项：

- 不要将 `.env`、`.env.local` 等环境文件提交到 Git。
- 如果未来接入真实大模型 API，应通过服务端代理或 Vercel Environment Variables 管理密钥。
- 前端直接暴露的 API Key 不安全，除非是公开只读、有限权限的密钥。
- 当前 `.gitignore` 已忽略 `node_modules/`、`dist/`、本地环境变量文件等内容。

---

## 适合展示的能力点

这个项目可以在简历和面试中体现以下能力：

- Vue 3 Composition API 实践。
- Tailwind CSS 高质量响应式 UI 设计。
- 组件化工程组织能力。
- 中英文双语内容建模。
- 项目数据驱动渲染。
- 独立项目详情页设计。
- 多媒体轮播和视频展示。
- 静态站点部署与 Vercel CI/CD。
- 个人项目复盘与技术表达能力。

---

## 后续可优化方向

- 引入 `vue-router`，让每个项目拥有真实 URL，例如 `/projects/vibeclip`。
- 将项目内容拆成 Markdown / MDX，方便维护长篇案例复盘。
- 接入真实访问统计服务，如 Umami、Plausible 或 Vercel Analytics。
- 为项目详情页增加 SEO 动态 Meta。
- 增加图片懒加载和视频预加载策略。
- 使用 `vue-i18n` 管理更大规模的多语言内容。
- 增加单元测试和端到端测试。

---

## License

本项目为个人作品集项目，可根据实际需要选择开源协议。若公开使用，建议补充 MIT License 或自定义版权声明。
