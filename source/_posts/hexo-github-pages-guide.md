---
title: 从零搭建 Hexo + GitHub Pages 个人博客
date: 2026-11-13 09:30:00
updated: 2026-11-13 09:30:00
tags:
  - Hexo
  - GitHub Pages
  - 建站
  - 教程
categories:
  - 技术
description: 记录一次完整的建站过程：本地环境、Hexo 站点、Butterfly 主题、GitHub Pages 自动部署，以及期间踩过的坑。
---

## 前言

拥有一个自己的博客，大概是每个程序员的浪漫。可真正动手时，问题往往不是「写什么」，而是「怎么搭」。

这篇文章完整记录了本站的搭建过程：从安装 Node.js、初始化 Hexo，到换主题、写文章，最后托管到 GitHub Pages，并配置 GitHub Actions 实现「推送即发布」。如果你也想拥有一个零成本、可长期维护的个人站点，照着做即可。

## 一、准备环境

只需要三样东西：

| 工具 | 作用 | 说明 |
| --- | --- | --- |
| Node.js | 运行 Hexo | 建议 18 LTS 及以上 |
| Git | 版本管理 | 也是部署工具 |
| GitHub 账号 | 在线托管 | 免费额度足够用 |

验证安装：

```bash
node -v
npm -v
git --version
```

> 小提示：Windows 上如果提示「禁止运行脚本」，可以改用 `npm.cmd`，或执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 之后重开终端。

## 二、安装 Hexo 并初始化站点

先全局安装 Hexo 命令行工具：

```bash
npm install -g hexo-cli
```

然后在空目录中初始化：

```bash
mkdir my-blog && cd my-blog
hexo init .
npm install
```

初始化完成后目录结构大致如下：

```text
my-blog/
├── _config.yml        # 站点主配置
├── _config.butterfly.yml  # 主题配置（使用 Butterfly 时）
├── package.json
├── scaffolds/         # 文章模板
├── source/
│   ├── _posts/        # 文章目录
│   ├── about/         # 关于页
│   ├── tags/          # 标签页
│   └── categories/    # 分类页
└── themes/            # 主题目录
```

本地预览：

```bash
hexo server
# 打开 http://localhost:4000
```

## 三、换一个好看的主题

Hexo 默认主题比较朴素，推荐两款：

- **Butterfly**：卡片式设计，功能丰富，中文文档完善
- **NexT**：经典简洁，配置项多

以 Butterfly 为例，现在支持 npm 安装：

```bash
npm install hexo-theme-butterfly hexo-renderer-pug
```

然后在 `_config.yml` 中设置：

```yaml
theme: butterfly
```

主题配置建议放在根目录的 `_config.butterfly.yml` 中，这样升级主题时不会覆盖你的自定义内容。

## 四、写文章

新建文章：

```bash
hexo new "我的第一篇文章"
```

会在 `source/_posts/` 下生成 `我的第一篇文章.md`，文件开头是 front-matter：

```yaml
---
title: 我的第一篇文章
date: 2026-11-13 09:30:00
tags:
  - 随笔
categories:
  - 生活
---
```

正文用 Markdown 写，代码块、图片、表格都支持。写完后 `hexo clean && hexo generate` 即可重新生成静态文件。

## 五、部署到 GitHub Pages

有两种主流方式，建议用第二种。

### 方式一：本地 hexo deploy

安装部署插件：

```bash
npm install hexo-deployer-git
```

在 `_config.yml` 中配置仓库地址（注意替换成你自己的）：

```yaml
deploy:
  type: git
  repo: https://github.com/ZHshen1949/ZHshen1949.github.io.git
  branch: main
```

然后一条命令发布：

```bash
hexo clean && hexo generate && hexo deploy
```

### 方式二：GitHub Actions 自动部署（推荐）

把源码推送到 GitHub，在仓库的 **Settings → Pages** 中把 Source 设为 **GitHub Actions**，然后添加 `.github/workflows/deploy.yml`，每次 push 自动构建并发布。

完整的 workflow 文件本站已经内置，核心步骤是：

1. checkout 源码
2. `npm ci` 安装依赖
3. `npx hexo generate` 生成静态文件
4. `upload-pages-artifact` + `deploy-pages` 发布

这样做的好处是：本地不需要安装任何部署工具，云端每次都能从源码重新构建，历史版本清晰可追溯。

## 六、几个容易踩的坑

1. **url 与 root 配置错误**：个人主页仓库（`username.github.io`）用 `url: https://username.github.io`、`root: /`；如果是普通仓库，记得补上子路径 `/repo-name/`，否则 CSS、JS 会 404。
2. **分支与 Pages 源不一致**：用 Actions 时，Pages 的 Source 必须是「GitHub Actions」，而不是某个分支。
3. **缓存导致样式没更新**：改完配置先 `hexo clean`，必要时浏览器强制刷新（Ctrl + F5）。
4. **主题安装后没生效**：确认 `theme: butterfly` 且已执行 `npm install hexo-renderer-pug`。
5. **图片路径大小写**：Linux 构建环境区分大小写，本地能显示、线上 404 时优先检查文件名。

## 结语

至此，一个免费、可定制、可长期维护的个人博客就搭建完成了。

真正难的部分从来不是建站，而是**持续写作**。愿你我都能把零散的想法，慢慢积累成一片自己的花园。

---

*本站即使用这套流程搭建，源码可在 GitHub 上找到。*
