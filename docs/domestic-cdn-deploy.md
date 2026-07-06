# 国内 OSS/COS + CDN 部署

本项目的推荐生产链路：

```text
GitHub 仓库更新
  -> GitHub Actions 每天/手动运行 generate-portfolio.mjs
  -> 生成 src/data/githubData.json
  -> vite build
  -> 部署 dist 到国内 OSS/COS + CDN
  -> 用户访问国内 CDN 静态页面
```

## 为什么这样做

- GitHub Actions 在海外环境中拉取 GitHub API 和调用 DeepSeek 更稳定。
- 前端页面只读取构建后的静态文件，不会在用户浏览器里请求 GitHub API。
- 国内用户访问 OSS/COS + CDN，比直接访问 GitHub Pages 更稳定。
- `vite.config.js` 默认使用相对资源路径 `./`，同一份 `dist` 可同时用于 GitHub Pages 项目页和国内 CDN。
- GitHub 仓库封面图会在 Actions 构建期缓存到 `public/github-covers/`，用户访问页面时从你的站点/CDN 加载图片，不再直连 GitHub 图片域名。

## GitHub Actions 配置

默认 workflow 会继续部署 GitHub Pages 作为备用地址。

如果要额外同步到国内对象存储，在仓库：

```text
Settings -> Secrets and variables -> Actions
```

新增 Variables：

| 名称 | 示例 | 说明 |
| --- | --- | --- |
| `DOMESTIC_DEPLOY_ENABLED` | `true` | 开启国内对象存储同步 |
| `DOMESTIC_S3_PROVIDER` | `Alibaba` 或 `TencentCOS` | rclone 的 S3 provider |
| `DOMESTIC_S3_ENDPOINT` | `https://oss-cn-hangzhou.aliyuncs.com` | OSS/COS 的 S3 兼容 endpoint |
| `DOMESTIC_S3_REGION` | `oss-cn-hangzhou` 或 `ap-shanghai` | 区域 |
| `DOMESTIC_S3_BUCKET` | `your-bucket` | Bucket 名称 |
| `DOMESTIC_S3_PREFIX` | 留空或 `portfolio` | 部署到 bucket 子目录时填写 |

新增 Secrets：

| 名称 | 说明 |
| --- | --- |
| `DOMESTIC_S3_ACCESS_KEY_ID` | 对象存储访问密钥 ID |
| `DOMESTIC_S3_SECRET_ACCESS_KEY` | 对象存储访问密钥 Secret |

## CDN 设置建议

- CDN 源站指向 OSS/COS bucket。
- 如果 `DOMESTIC_S3_PREFIX` 为空，CDN 直接回源 bucket 根目录。
- 如果 `DOMESTIC_S3_PREFIX=portfolio`，CDN 需要把访问路径映射到该子目录，或直接使用 `/portfolio/` 访问。
- 给 `index.html` 设置较短缓存或不缓存；`assets/*` 可以设置长缓存。

## 验证

部署成功后检查：

```text
https://你的国内域名/
```

或：

```text
https://你的国内域名/portfolio/
```

如果页面白屏，优先打开浏览器控制台确认是否有 `assets/*.js` 或 `assets/*.css` 404。
