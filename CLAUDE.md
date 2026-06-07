# 宁波编程·AI教育知识库

## 项目简介

面向课程顾问/招生人员的内部参考资料网站，方便快速查找政策依据、竞赛数据、科技特长生招生详情及学区划分信息，以便与家长沟通。

- **框架**: [Astro](https://astro.build) 6.x（静态站点生成器）
- **构建模式**: `output: 'static'`，完全静态导出
- **搜索**: astro-pagefind（客户端全文搜索）
- **内容验证**: Zod 4.x
- **部署**: Vercel（主） / GitHub Pages（备）
- **站点 URL**: `https://xiaoxiaoshengmingli.github.io/ningbo-knowledge-base/`

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器（localhost:4321） |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run preview` | 本地预览构建后的站点 |

## 目录结构

```
src/
  components/         # Astro 组件（CategoryCard, FilterSidebar 等）
  content/            # 内容 JSON 数据（4 个文件）
    policies.json     #   政策文件
    competitions.json #   竞赛信息
    admissions.json   #   科技特长生招生
    districts.json    #   学区信息
  data/               # 元数据
    categories.json   #   类别定义
    tags.json         #   受控标签词汇表
  layouts/            # 布局组件
    BaseLayout.astro  #   全局外壳（导航栏、主区域、页脚）
    DocLayout.astro   #   文章详情布局（面包屑、两列、相关推荐）
  lib/
    content.ts        #   内容加载/查询函数
    schema.ts         #   Zod 内容模式定义
  pages/              # 页面路由
    index.astro, 404.astro, search.astro
    policies/, competitions/, admissions/, districts/  (各含 index.astro + [slug].astro)
    tags/[tag].astro
  styles/
    global.css        #   全局样式（深色主题、卡片、响应式）
```

## 代码风格

### 内容管理
- 所有内容以 **JSON 文件** 形式存储在 `src/content/`，**非 Markdown**
- 内容正文以 **HTML 字符串** 存储，页面通过 `set:html` 渲染
- 提交前用 Zod schema（`src/lib/schema.ts`）验证 JSON 结构完整性
- 条目字段：`id, slug, title, summary, content, category, tags, source, sourceUrl, publishDate, lastUpdated`
- 各类别特有字段见 `schema.ts` 中的扩展 schema

### HTML 内容规范
- 内容正文使用语义化标签：`<h3>`、`<table>`、`<ul>/<ol>`、`<p>`
- 高亮类名：`<span class="highlight">`（紫色）、`.hl-green`、`.hl-gold`、`.hl-red`、`.hl-blue`
- 信息框：`<div class="highlight-box">`（紫色/顾问话术）、`<div class="warn-box">`（琥珀色/重要提示）
- 每篇文章末尾用 `highlight-box` 包裹「顾问沟通要点」

### TypeScript / Astro
- 严格模式（`astro/tsconfigs/strict`）
- 路径别名 `@/*` → `src/*`
- 组件使用 `.astro` 文件，无客户端 UI 框架
- `getStaticPaths()` 为每个内容条目预渲染静态页面

### Git
- 提交信息使用中文，前缀标注类型：`fix:`、`feat:`、`chore:`、`docs:`
- 示例：`feat: 新增鄞州区2025年学区划分数据`

## 注意事项

### 路径与部署
- 站点部署在子路径 `/ningbo-knowledge-base/` 下，所有内部链接 / 图片路径**必须**通过 Astro 的 `import.meta.env.BASE_URL` 拼接或使用 Astro `<a href={...}>` 相对路径
- 不要使用硬编码的绝对路径（如 `/images/xxx`），否则在 GitHub Pages 子路径下会 404
- 修改 `astro.config.mjs` 中的 `base` 配置时需同步更新所有资源引用

### 内容管理
- 不要混用 Markdown 和 HTML 内容格式 — 统一使用 HTML 字符串
- 添加新的内容类别时需：新建 JSON 文件 → 在 `schema.ts` 中定义 Zod schema → 在 `content.ts` 中添加 loader → 创建 `pages/[category]/` 路由
- 标签须来自 `src/data/tags.json` 的受控词汇表，不要随意创建新标签
- `slug` 字段须确保唯一且 URL 友好（英文小写 + 连字符）

### 搜索
- Pagefind 索引在 `astro build` 时自动生成
- 新增/修改内容后务必重新构建以更新搜索索引

### 依赖
- 保持依赖精简：当前仅 `astro`, `astro-pagefind`, `marked`, `zod`
- 添加新依赖前评估必要性，避免引入大型 UI 框架
