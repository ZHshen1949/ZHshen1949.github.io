# ZHshen 的个人博客

线上地址：**https://zhshen1949.github.io** ｜ 源码仓库：**https://github.com/ZHshen1949/ZHshen1949.github.io**

一个基于 **Hexo** + **Butterfly** 主题、托管在 **GitHub Pages** 上的个人博客。
本地写作 → 推送到 GitHub → GitHub Actions 自动构建发布，全程零成本。

## 技术栈

| 组件 | 版本 / 说明 |
| --- | --- |
| [Hexo](https://hexo.io/) | 8.x，静态博客生成框架 |
| [Butterfly](https://butterfly.js.org/) | 5.7.x，卡片式主题（npm 安装） |
| GitHub Pages | 静态站点托管（免费、支持自定义域名） |
| GitHub Actions | 推送即构建发布，无需本地部署 |
| hexo-generator-searchdb | 本地搜索（`search.json`） |
| [Giscus](https://giscus.app/) | 评论系统（基于 GitHub Discussions，零后端） |
| [FormSubmit](https://formsubmit.co/) | 私信表单转发到站长邮箱（零后端） |

## 快速开始（本地）

前置条件：Node.js ≥ 18、Git。首次使用：

```bash
# 安装依赖
npm install

# 启动本地预览，浏览器打开 http://localhost:4000
npm run server
```

> **Windows 提示**：如果报错“因为在此系统上禁止运行脚本”，请在 PowerShell 中执行
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`，或把命令中的 `npm` 换成 `npm.cmd`。

其它常用命令：

```bash
npm run clean     # 清理缓存与 public/
npm run build     # 生成静态站点到 public/
npm run deploy    # 本地部署（方案二，见下文）
```

## 目录结构

```text
.
├── _config.yml              # 站点主配置（标题、URL、部署方式等）
├── _config.butterfly.yml    # 主题配置（菜单、社交、深色模式、搜索……）
├── package.json             # 依赖与脚本
├── scaffolds/               # 新建文章/页面的模板
├── source/
│   ├── _posts/              # 文章目录（Markdown）
│   ├── _drafts/             # 草稿（可选，默认不渲染）
│   ├── about/index.md       # 关于页
│   ├── tags/index.md        # 标签页
│   ├── categories/index.md  # 分类页
│   └── img/                 # 头像、favicon 等静态图片
├── public/                  # 构建产物（已被 .gitignore 忽略）
└── .github/workflows/deploy.yml   # GitHub Actions 自动部署工作流
```

## 写作

```bash
# 新建文章：source/_posts/文章标题.md
npx hexo new "文章标题"

# 新建草稿，确认后发布
npx hexo new draft "草稿标题"
npx hexo publish "草稿标题"
```

文章开头的 front-matter 常用字段：

```yaml
---
title: 文章标题
date: 2026-11-13 09:30:00
updated: 2026-11-13 09:30:00   # 可选：显示“最后更新”
tags: [Hexo, 教程]             # 标签：多篇文章共享
categories: [技术]              # 分类：支持层级，如 [技术, 前端]
description: 一句话摘要，显示在首页卡片与搜索结果中
cover: /img/cover.png           # 可选：首页卡片封面
top_img: /img/banner.png        # 可选：文章顶部大图
---
```

## ⚠️ 首次使用：把占位信息替换成你自己的

| 文件 | 需要修改的项 |
| --- | --- |
| `_config.yml` | `title`、`subtitle`、`description`、`keywords`、`author`、`url` |
| `_config.butterfly.yml` | `social`（GitHub / RSS）、`aside.card_author`、`footer.custom_text`、`giscus.category_id`（评论必填） |
| `source/about/index.md` | 个人简介、联系方式 |
| `source/message/index.md` | `DM_CONFIG.ownerEmail`（私信必填，见下文） |
| `source/img/avatar.svg` | 头像（可换成自己的图片并同步改 `avatar.img`） |
| `source/img/favicon.svg` | 站点图标 |
| `_config.yml` 的 `deploy.repo` | 仅使用“方案二：本地部署”时需要 |

## 部署方案一：GitHub Actions（推荐）

源码即仓库，GitHub 自动构建并发布，本地无需多余工具。

### 1. 在 GitHub 创建仓库

- **想用 `https://用户名.github.io` 作为网址**：仓库名必须为 `用户名.github.io`。
- **不介意网址带仓库名**：仓库名随意，例如 `blog`，网址为 `https://用户名.github.io/blog/`。
- 免费账号的 Pages 要求仓库为 **Public**。

### 2. 推送源码

```bash
git init
git add .
git commit -m "init: Hexo + Butterfly blog"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 3. 开启 Pages

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
（不要选 “Deploy from a branch”。）

### 4. 修改站点 URL

编辑 `_config.yml`：

```yaml
# 个人主页仓库 username.github.io
url: https://username.github.io
root: /

# 普通仓库（如 blog）
url: https://username.github.io/blog
root: /blog/
```

### 5. 等待自动发布

推送后进入仓库 **Actions** 页面查看进度；构建完成后访问站点即可。
此后每次 `git push` 到 `main` 都会自动重新构建并发布。

## 部署方案二：本地一条命令部署（可选）

适合不想用 Actions、或想部署到别的静态托管平台的场景。

1. 把 `_config.yml` 中的 `deploy.repo` 改成你的仓库地址；
2. 配置凭据：推荐使用 GitHub **Personal Access Token**（勾选 `repo` 权限），
   或配置 SSH 密钥后把 `repo` 写成 `git@github.com:用户名/仓库名.git`；
3. 执行：

```bash
npm run clean
npm run build
npm run deploy
```

> 注意：不要把 Token 明文写进仓库。HTTPS 方式首次推送会弹窗要求账号密码，
> 输入用户名 + Token（不是登录密码）即可，Windows 会记住凭据。

## 自定义域名（可选）

1. 在 `source/` 目录下新建 `CNAME` 文件，内容为你的域名（如 `blog.example.com`）；
2. 域名 DNS 添加 `CNAME` 记录指向 `用户名.github.io`；
3. 仓库 Settings → Pages → 填写 Custom domain，勾选 Enforce HTTPS。

## 评论与私信

博客是纯静态站点，评论和私信都借助第三方服务实现，无需自己维护服务器。

### 评论：Giscus（基于 GitHub Discussions）

访客用 GitHub 账号登录即可评论，数据存在仓库的 Discussions 里，免费、无广告、可随时导出。
首次启用需要在 GitHub 网页完成 3 步：

1. 仓库 **Settings → Features** 勾选 **Discussions**；
2. 打开 [github.com/apps/giscus](https://github.com/apps/giscus) 点 **Install**，选择本仓库授权；
3. 打开 [giscus.app](https://giscus.app)，填入仓库名并选择分类（推荐 `Announcements` 或新建 `Comments`），
   复制生成的 `data-category-id`（形如 `DIC_kwDO...`），填到 `_config.butterfly.yml`：

```yaml
giscus:
  repo: ZHshen1949/ZHshen1949.github.io
  repo_id: R_kgDOVsxX4g      # 已通过 GitHub API 填好，无需改动
  category_id: DIC_kwDO...    # ← 粘贴到这里，评论即生效
```

提交推送后评论即可使用。**未填 `category_id` 时，文章底部会显示一行「评论系统即将上线」的提示**，
不会出现报错组件。

### 私信：FormSubmit 表单直发邮箱

导航栏「私信」页面是一个联系表单：访客填写内容后，通过 [FormSubmit](https://formsubmit.co/)
转发到你的邮箱，不需要注册账号、也不需要后端。

只需改一行：打开 `source/message/index.md`，把 `ownerEmail` 换成你的真实邮箱：

```js
window.DM_CONFIG = {
  ownerEmail: 'you@example.com',  // ← 改成你的邮箱
  mode: 'formsubmit'              // 也可改成 'mailto'（打开访客本地邮件客户端）
}
```

首次有人提交后，FormSubmit 会给你发一封激活邮件，点击其中链接确认即可正常收信
（免费额度约 50 封/月，个人博客足够）。消息不会公开发布，页面已内置蜜罐字段防垃圾机器人。

> 可选升级：若想要「网页内实时聊天」式的私信，Butterfly 还内置 Crisp / Tidio 等客服聊天组件，
> 需注册对应服务后在 `_config.butterfly.yml` 中配置，国内访问稳定性需自行评估。

## 常用命令速查

| 命令 | 作用 |
| --- | --- |
| `npm run server` | 本地预览（默认 4000 端口） |
| `npm run build` | 生成静态文件到 `public/` |
| `npm run clean` | 清理 `public/` 与缓存 |
| `npm run deploy` | 本地部署（方案二） |
| `npx hexo new "标题"` | 新建文章 |
| `npx hexo new page "名称"` | 新建页面，如 `about` |
| `npx hexo clean && npx hexo generate` | 彻底重建 |

## 常见问题（FAQ）

**1. 首页样式丢失、CSS/JS 404？**
`_config.yml` 的 `url` / `root` 与实际部署地址不一致。普通仓库必须把 `root` 设为 `/仓库名/`。

**2. 推送后站点没有更新？**
检查 Actions 是否构建失败；确认 Pages 的 Source 是 GitHub Actions；浏览器强制刷新（Ctrl + F5）。

**3. 中文乱码？**
所有 Markdown 文件保存为 **UTF-8（无 BOM）** 编码。

**4. `npm install` 报“禁止运行脚本”？**
Windows PowerShell 执行策略限制，执行
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 后重开终端，或改用 `npm.cmd`。

**5. 主题配置不生效？**
确认 `_config.yml` 中 `theme: butterfly`，且已安装 `hexo-renderer-pug`；
改完先 `npm run clean` 再重新构建。

**6. 搜索没有结果？**
已内置 `hexo-generator-searchdb`，确认 `_config.butterfly.yml` 中 `search.use: local_search`，
并重新构建生成 `search.json`。

**7. 图片在本地正常、线上 404？**
Linux 构建环境区分大小写，检查路径大小写；推荐以 `/` 开头的绝对路径引用 `source/img/` 下的图片。

**8. `git push` 报 `Failed to connect to github.com port 443`？**
国内网络访问 GitHub 偶发被重置，重试通常即可恢复；若持续失败，可走本地代理推送：

```bash
# 把端口换成你代理软件的 HTTP 端口（Clash 常见 7890 / 7897）
git -c http.proxy=http://127.0.0.1:7897 push

# 想以后默认走代理（用完可用 --unset 移除）
git config --global http.https://github.com.proxy http://127.0.0.1:7897
```

**9. 文章底部没有评论？**
检查三件事：仓库已开启 Discussions、giscus App 已安装到该仓库、`_config.butterfly.yml` 的
`giscus.category_id` 已填写并重新构建部署。

**10. 私信发送失败？**
`source/message/index.md` 里的 `ownerEmail` 还没改成真实邮箱，或 FormSubmit 的激活邮件还没点击确认。

## 维护建议

- 源码推送到 GitHub 本身就是备份；不必提交 `node_modules/` 与 `public/`。
- 定期升级：`npm update`（主题：`npm update hexo-theme-butterfly`）。
- 写文章比折腾主题更重要 —— 先把内容写起来。

## 许可

- 文章内容：CC BY-NC-SA 4.0
- 站点代码：MIT
