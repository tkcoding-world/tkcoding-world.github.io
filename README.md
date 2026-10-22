# tkcoding-world.github.io

GitHub Pages 站点。`push` 到 `master` 后，workflow 会把 `public/` 与 `src/` 拷贝到 `dist/` 并发布，无需构建步骤。

## TK UI

`src/tk/` 下的轻量 UI 框架：零依赖、无需构建，gzip 后约 8KB（CSS ≈ 6.5KB，JS ≈ 1.9KB）。

```
src/
├── tk/
│   ├── tk.css        # 样式（必需）
│   └── tk.js         # 交互（可选：暗色切换、导航折叠、标签页、对话框、通知、滚动渐显）
├── index.html        # 站点首页（玻璃卡片）
├── tkui.html         # TK UI 介绍 + 主题色实时预览
└── examples/
    ├── components.html   # 组件总览与用法（indigo）
    ├── landing.html      # 产品落地页（orange，自定义圆角）
    ├── dashboard.html    # 后台仪表盘（emerald，侧边栏布局）
    └── blog.html         # 博客文章（rose，衬线字体）
```

### 使用

```html
<html lang="zh-CN" style="--tk-primary:#0ea5e9">   <!-- 或 data-primary="rose" -->
<head>
  <link rel="stylesheet" href="tk/tk.css">
  <script src="tk/tk.js"></script>
</head>
```

### 主题

| 方式 | 写法 |
| --- | --- |
| 整页自定义颜色 | `<html style="--tk-primary:#hex">` |
| 整页预设 | `<html data-primary="…">`：indigo / blue / sky / teal / emerald / amber / orange / rose / pink / violet / slate |
| 局部区域 | `<div class="theme" style="--tk-primary:#hex">` |
| 运行时 | `TK.setPrimary('#hex')` |
| 明暗模式 | 默认跟随系统；`<html data-mode="dark|light">` 强制；`<button data-tk-mode>` 切换并记忆 |

悬停色、浅色背景、焦点环等由 `color-mix()` 自动从主色派生。还可覆盖 `--tk-radius`、`--tk-font`、`--tk-on-primary` 等变量（见 `tk.css` 顶部）。

### 组件速查

- 布局：`.container(.narrow)` `.section(.alt)` `.grid`（`--min` `--gap` 自动换行）`.grid.cols-2/3/4` `.row` `.stack` `.layout > .sidebar + main`
- 导航：`.navbar > .container.navbar-inner > .brand + .nav-toggle[data-tk-nav] + .nav-menu`
- 按钮：`.btn` + `primary soft outline ghost danger` / `sm lg pill block icon loading`
- 内容：`.card(.hover)` `.card-media` `.card-footer` `.icon-box` `.stat` `.badge` `.alert` `.avatar` `.progress` `.spinner` `[data-tip]`
- 状态色：`.success .warning .danger .info`（用于 badge / alert / progress / toast）
- 表单：原生 `input/select/textarea` 自动美化，`.field` `.hint` `.check` `input.switch` `.input-group`
- 交互：`.tabs > .tab-list > .tab[data-tab=id]` + `.tab-panel#id`；`details.accordion`；`[data-tk-open=id]` + `dialog.modal` + `[data-tk-close]`；`[data-tk-toast="消息"][data-type]` 或 `TK.toast()`；`.reveal`

完整示例见 `src/examples/components.html`。

浏览器要求：支持 `color-mix()` 的现代浏览器（Chrome 111+、Safari 16.2+、Firefox 113+）。
