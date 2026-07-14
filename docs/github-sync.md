# GitHub 自动同步机制

让作品集自动反映你的 GitHub：**默认只改 portfolio 一个仓库**，每小时轮询公开仓库 → DeepSeek 生成中英文案 → 更新项目卡片与「GitHub 动态」。  
跨仓即时通知是**可选增强**，不需要给每个仓库都配文件。

## 推荐策略

| 方式 | 要不要改其他仓库 | 延迟 | 建议 |
|---|---|---|---|
| **每小时定时轮询**（默认） | 不要 | 最长约 1 小时 | 日常就用这个 |
| portfolio 自己 push / 手动 | 不要 | 立刻 | 调试时用 |
| 源仓库 `notify-portfolio.yml` | 要（仅关心的仓库） | 几乎立刻 | 1～3 个主推项目可选 |

> 结论：不用每个仓库都配一遍。默认靠 portfolio 自己的高频 cron 覆盖全部公开仓库。

## 工作原理

```
默认（零跨仓配置）
  portfolio/.github/workflows/refresh.yml
    · schedule 每小时一次   ← 主路径：轮询账号下公开仓库
    · push main             ← portfolio 自身更新
    · workflow_dispatch     ← 手动
    · repository_dispatch   ← 可选：个别源仓库即时通知
  └─ scripts/generate-portfolio.mjs
       1. 拉 profile + 公开仓库（按活跃排序）
       2. 智能筛选：排除 fork / 归档 / 无 README，按 star+活跃取前 N
       3. 逐仓库取 README + languages + topics
       4. 增量缓存（仓库没变就不重复调 AI，省钱）
       5. DeepSeek 读 README → 生成中英 title/subtitle/description/highlights + 自动归类
       6. 汇总语言占比 / 最近活跃 / followers
       7. 写出 src/data/githubData.json
  └─ vite build → 部署到 GitHub Pages + 可选同步国内 OSS/COS + CDN
```

数据合并见 `src/data/portfolio.js`：**GitHub 自动数据优先，没有则回退手填的 `portfolioData.js`**。  
技能 / 履历 / 求职意向 / 邮箱等 GitHub 拿不到的，始终来自 `portfolioData.js`。

## 为什么不能“零配置且零延迟”

GitHub Actions **只能监听当前仓库事件**。  
`portfolio` 感知不到 `1123074811/其他仓库` 的 push，除非：

1. **portfolio 自己定时去拉**（默认方案，有延迟）
2. **其他仓库主动通知 portfolio**（可选，需逐仓配置）
3. 自建 GitHub App / 外部 Webhook 服务（过重，不推荐个人作品集）

所以本项目选择：**高频轮询做默认，跨仓 notify 做可选**。

## 启用步骤（只配 portfolio 即可）

### 1. 填真实 GitHub 登录名
`src/config/siteConfig.js` → `github.username` 改成你主页 URL `github.com/<这里>` 的那段（只能英文/数字/连字符）。  
> ⚠️「哈基聪」是显示名，不是登录名。

### 2. 配置 portfolio 仓库 Secret / Variable
仓库 → Settings → Secrets and variables → Actions：

- **Secrets** 新增 `DEEPSEEK_API_KEY` = 你的 DeepSeek API Key（https://platform.deepseek.com）
- **Variables**（可选）：
  - `GITHUB_USERNAME` = 登录名
  - `VITE_BASE` = 自定义资源基础路径（默认 `./`，通常不用）

> `GITHUB_TOKEN` 无需手动配，Actions 自动注入。

### 3. 开启 GitHub Pages
仓库 → Settings → Pages → Source 选 **GitHub Actions**。

### 4. 触发
推送到 `main`，或 Actions 页面手动 `Run workflow`。  
之后**每小时自动重建**，无需给其他仓库加任何文件。

## 可选：个别仓库即时刷新

只在你特别在意“一 push 就上线”的 1～3 个主推项目上配置。

### 1. 创建 Token
fine-grained PAT：只给 `portfolio`，`Actions: Read and write`  
或 classic PAT：至少 `public_repo`

### 2. 在该源仓库配置 Secret
`PORTFOLIO_DISPATCH_TOKEN` = 上面的 PAT

### 3. 复制模板
```text
docs/templates/notify-portfolio.yml
  →  <源仓库>/.github/workflows/notify-portfolio.yml
```

默认目标仓库是 `1123074811/portfolio`。路径不同就改模板里的 `TARGET_REPO`。

### 4. 验证
源仓库 Actions 返回 HTTP **204**，portfolio Actions 出现 `repository_dispatch` 触发的 run。

## 调整轮询频率

改 `.github/workflows/refresh.yml` 的 cron 即可，**仍然只动 portfolio 一个仓库**：

```yaml
schedule:
  - cron: '0 * * * *'      # 每小时（默认）
  # - cron: '*/30 * * * *' # 每 30 分钟
  # - cron: '0 */2 * * *'  # 每 2 小时
  # - cron: '0 22 * * *'   # 每天一次（省 Actions 分钟）
```

说明：
- 更频繁 = 数据更及时，但 Actions 用量更高
- 生成脚本有 AI 增量缓存：仓库内容 hash 没变时不重复调 DeepSeek
- `concurrency.cancel-in-progress: true`：重叠触发只保留最新一次部署
- GitHub 免费仓库的 `schedule` 可能有几分钟延迟，不保证整点准点

## 国内 CDN 部署

```text
GitHub Actions 生成数据和构建 dist -> 同步到国内 OSS/COS -> CDN 回源
```

配置见 `docs/domestic-cdn-deploy.md`。

## 本地测试

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-xxx"; $env:GITHUB_USERNAME="你的登录名"; npm run generate
npm run dev
```

无 `DEEPSEEK_API_KEY` 时会退回用仓库 description/README 摘要充当文案。

### 可选：手动测 repository_dispatch

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/1123074811/portfolio/dispatches \
  -d '{"event_type":"portfolio-refresh","client_payload":{"source_repo":"manual-test"}}'
```

成功时返回 **204**。

## 调参

`src/config/siteConfig.js` → `github.filter`：
- `maxProjects` 生成几个项目卡片
- `includeTopics: ['portfolio']` 只生成打了某 topic 的仓库
- `excludeRepos: ['练手仓库名']` 强制排除
- `excludeForks / excludeArchived / requireDescriptionOrReadme` 开关

## 常见问题

**Q: 其他仓库改了，作品集多久更新？**  
默认最长约 1 小时（下一次整点 cron，外加 GitHub 调度延迟）。想立刻看到：手动 Run workflow，或 push portfolio，或给该仓库加可选 notify。

**Q: 必须给每个仓库都配 notify 吗？**  
不需要。默认只配 portfolio。notify 只是可选加速。

**Q: 跑了但卡片文案几乎没变？**  
正常。AI 增量缓存：README/描述 hash 没变时复用上次文案，stars、活跃时间等元数据仍会刷新。

**Q: 新仓库没出现在作品集？**  
可能被 `siteConfig.github.filter` 过滤（fork/归档/无描述/未进前 N）。调大 `maxProjects` 或调整 topics / exclude。

**Q: 会不会 Actions 跑太勤？**  
每小时一次对个人作品集通常可接受；脚本有缓存，多数时候只是轻量拉 GitHub API + 重建静态站。若要省用量，把 cron 改成每 2 小时或每天一次。
