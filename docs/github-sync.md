# GitHub 自动同步机制

让作品集**准实时**反映你的 GitHub：定时拉取公开仓库 → DeepSeek 生成中英文案 → 自动更新项目卡片与「GitHub 动态」板块。

## 工作原理

```
GitHub Actions（每天 cron / push / 手动触发）
  └─ scripts/generate-portfolio.mjs
       1. 拉 profile + 公开仓库（按活跃排序）
       2. 智能筛选：排除 fork / 归档 / 无 README，按 star+活跃取前 N
       3. 逐仓库取 README + languages + topics
       4. 增量缓存（仓库没变就不重复调 AI，省钱）
       5. DeepSeek 读 README → 生成中英 title/subtitle/description/highlights + 自动归类
       6. 汇总语言占比 / 最近活跃 / followers
       7. 写出 src/data/githubData.json
  └─ vite build → 部署到 GitHub Pages
```

数据合并见 `src/data/portfolio.js`：**GitHub 自动数据优先，没有则回退手填的 `portfolioData.js`**。
技能 / 履历 / 求职意向 / 邮箱等 GitHub 拿不到的，始终来自 `portfolioData.js`。

## 启用步骤（一次性）

### 1. 填真实 GitHub 登录名
`src/config/siteConfig.js` → `github.username` 改成你主页 URL `github.com/<这里>` 的那段（只能英文/数字/连字符）。
> ⚠️「哈基聪」是显示名，不是登录名——登录名在你 GitHub 头像菜单 → 个人主页 URL 里。

### 2. 配置仓库 Secret / Variable
仓库 → Settings → Secrets and variables → Actions：
- **Secrets** 新增 `DEEPSEEK_API_KEY` = 你的 DeepSeek API Key（https://platform.deepseek.com）
- **Variables**（可选）：
  - `GITHUB_USERNAME` = 登录名（覆盖配置文件，方便不改代码）
  - `VITE_BASE` = `/<仓库名>/`（**项目页**部署必填，如 `/portfolio/`；若是 `username.github.io` 用户主页则留空）

> `GITHUB_TOKEN` 无需手动配，Actions 自动注入（读公开仓库足够）。

### 3. 开启 GitHub Pages
仓库 → Settings → Pages → Source 选 **GitHub Actions**。

### 4. 触发
推送到 `main`，或 Actions 页面手动 `Run workflow`。之后每天自动重建。

## 本地测试

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-xxx"; $env:GITHUB_USERNAME="你的登录名"; npm run generate
npm run dev
```

无 `DEEPSEEK_API_KEY` 时脚本会退回用仓库 description/README 摘要充当文案（预留了 AI 接口，配上 key 即升级）。

## 调参

`src/config/siteConfig.js` → `github.filter`：
- `maxProjects` 生成几个项目卡片
- `includeTopics: ['portfolio']` 只生成打了某 topic 的仓库（完全可控哪些入选）
- `excludeRepos: ['练手仓库名']` 强制排除
- `excludeForks / excludeArchived / requireDescriptionOrReadme` 开关
