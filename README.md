# 个人项目作品集网站

一个基于 **Vue 3 + Vite + Tailwind CSS** 构建的现代化个人项目作品集网站，面向求职展示、项目复盘、技术能力呈现与个人品牌建设。网站重点突出 **AI 应用开发、Vibe Coding、Web 全栈项目、效率工具与技术分享**，支持中英文双语切换、深浅色主题、项目独立详情页、多媒体项目展示和打印版在线简历。

> **两大新特性**
> - 🎨 **双视觉主题，配置一键切换**：经典 Cyber 多分区版 ↔ 无限画廊作品墙（深暖底 3D 倾斜卡片墙）。改 `src/config/siteConfig.js` 一个字段即可整站换肤。
> - 🤖 **GitHub 准实时自动同步**：GitHub Actions 定时拉取你的公开仓库 → DeepSeek 生成中英文案 → 自动更新项目卡片与「GitHub 动态」板块。详见 [docs/github-sync.md](docs/github-sync.md)。

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
├── .github/
│   └── workflows/
│       └── refresh.yml                # CI：定时拉 GitHub 数据 + 构建 + 部署 Pages
├── docs/
│   ├── portfolio-requirements.md      # 项目需求与开发记录文档
│   └── github-sync.md                 # GitHub 自动同步机制说明与启用步骤
├── scripts/
│   └── generate-portfolio.mjs         # GitHub 拉取 + DeepSeek 文案生成器（零依赖）
├── public/
│   └── resume.html                    # 可打印在线简历页面
├── src/
│   ├── assets/                        # 静态资源
│   ├── components/                    # 页面组件
│   │   ├── ...（经典版各 Section 组件，见下）
│   │   ├── GalleryHome.vue            # 【画廊版】无限画廊作品墙 + GitHub 动态板块
│   │   ├── ProjectDetailsPage.vue     # 独立项目详情页（经典版）
│   │   └── SkillsSection.vue          # 技能工具箱模块 等
│   ├── config/
│   │   └── siteConfig.js              # 站点配置：主题切换 + GitHub 同步设置
│   ├── data/
│   │   ├── locale.js                  # 国际化状态与详情页状态控制
│   │   ├── portfolioData.js           # 手填数据（个人信息/技能/经历/博客 + 项目兜底）
│   │   ├── githubData.json            # GitHub 自动生成数据（CI 写入，回退用空占位）
│   │   └── portfolio.js               # 统一数据出口：自动数据优先，回退手填
│   ├── App.vue                        # 应用根组件（按 siteConfig.theme 分流主题）
│   ├── main.js                        # 应用入口
│   └── style.css                      # 全局样式与 Tailwind 引入
├── 启动开发服务器.bat                  # 双击启动开发服务器（Windows）
├── .gitignore                         # Git 忽略规则
├── index.html                         # Vite HTML 入口与 SEO Meta
├── package.json                       # 项目依赖与脚本
├── postcss.config.js                  # PostCSS 配置
├── tailwind.config.js                 # Tailwind CSS 配置
└── vite.config.js                     # Vite 配置（支持 GitHub Pages base 路径）
```

---

## 快速开始

### 🚀 最简单：双击启动（Windows 推荐）

直接双击项目根目录的 **`启动开发服务器.bat`** 即可：
- 首次运行会自动安装依赖；
- 自动拉起 Vite 并**打开浏览器**；
- 关闭弹出的命令窗口即停止服务。

> 想要更顺手：右键 `启动开发服务器.bat` → 发送到 → 桌面快捷方式，以后桌面双击即可启动。

### 命令行方式

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动开发服务器

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
  "preview": "vite preview",
  "generate": "node scripts/generate-portfolio.mjs"
}
```

- `npm run dev`：启动本地开发环境。
- `npm run build`：生成生产环境静态文件。
- `npm run preview`：本地预览构建后的站点。
- `npm run generate`：手动拉取 GitHub 数据并生成 `src/data/githubData.json`（需配 `DEEPSEEK_API_KEY` 环境变量；详见 GitHub 自动同步章节）。

---

## 双视觉主题切换

项目内置两套完全不同的视觉风格，共用同一份数据，互不影响。切换只需改 `src/config/siteConfig.js` 一个字段：

```js
export const siteConfig = {
  theme: 'gallery', // 'classic' | 'gallery'
}
```

| 主题 | 说明 |
| --- | --- |
| `classic` | 经典版：Cyber 霓虹暗黑多分区主页（Hero / About / Projects / Skills / Blog / Experience / Contact + 独立详情页） |
| `gallery` | 画廊版：无限画廊作品墙——深暖底 3D 倾斜卡片墙、对角无缝漂移、悬停暂停、点击查看详情，内置「GitHub 动态」板块 |

`App.vue` 根据 `siteConfig.theme` 分流渲染对应主题组件。

---

## GitHub 自动同步

让作品集**准实时**反映 GitHub：GitHub Actions 定时拉取公开仓库 → DeepSeek 生成中英文案 → 自动更新项目卡片与「GitHub 动态」板块（语言占比 / 最近活跃 / followers / star）。

**数据流**：

```
GitHub Actions（每天 cron / push / 手动）
  └─ scripts/generate-portfolio.mjs
        拉仓库 → 智能筛选 → DeepSeek 写中英文案（增量缓存省钱）→ src/data/githubData.json
  └─ vite build → 部署 GitHub Pages（备用）+ 可选同步国内 OSS/COS + CDN
```

**数据合并**（`src/data/portfolio.js`）：GitHub 自动数据优先，没有则回退手填的 `portfolioData.js`；技能 / 履历 / 求职意向等始终手填。任何阶段网站都能正常渲染。

**启用三步**（完整说明见 [docs/github-sync.md](docs/github-sync.md)）：

1. `src/config/siteConfig.js` → `github.username` 填**真实 GitHub 登录名**（主页 URL `github.com/<这里>` 的那段，只能英文/数字/连字符）。
2. 仓库 Settings → Secrets and variables → Actions：Secrets 加 `DEEPSEEK_API_KEY`。
3. Settings → Pages → Source 选 **GitHub Actions**，推送触发。

如果要让国内用户访问更稳定，推荐把构建产物同步到国内 OSS/COS 并挂 CDN。配置方式见 [docs/domestic-cdn-deploy.md](docs/domestic-cdn-deploy.md)。

**本地手动生成**：

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-xxx"; $env:GITHUB_USERNAME="你的登录名"; npm run generate
```

无 `DEEPSEEK_API_KEY` 时会退回用仓库 description / README 摘要充当文案（接口已预留，配上 key 即升级为 AI 文案）。

---

## 内容配置说明

> 接入 GitHub 自动同步后，**项目列表**由 `src/data/githubData.json` 自动生成；下方手填方式作为兜底（首次 CI 跑之前、或未启用同步时生效）。个人信息、技能、经历、博客等仍由 `portfolioData.js` 维护。

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

## 部署到 GitHub Pages（推荐，自带自动同步）

项目已内置 `.github/workflows/refresh.yml`，开箱即用：

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
2. 配置 Secret `DEEPSEEK_API_KEY`。
3. 推送到 `main`，或在 Actions 页面手动 `Run workflow`。

之后每天 UTC 22:00（北京时间次日 06:00）自动重建，拉取最新 GitHub 数据并部署。详见 [docs/github-sync.md](docs/github-sync.md)。

> `GITHUB_TOKEN` 由 Actions 自动注入，无需手动配置（读公开仓库足够）。

### 国内 CDN 部署

项目默认使用 Vite 相对资源路径 `./`，同一份 `dist` 可以部署到 GitHub Pages 项目页，也可以同步到国内 OSS/COS + CDN。

完整配置见：

```text
docs/domestic-cdn-deploy.md
```

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
