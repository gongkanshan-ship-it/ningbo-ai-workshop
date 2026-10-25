# 宁波 · 律所主任 AI 研修班

蓝白宁波版网站，自适应版（v8）。纯静态 HTML / CSS / JavaScript。

## 手机与电脑适配

- 同一网址按屏幕宽度自动排版，电脑保留横向导航与双栏插画；手机使用可展开导航与单栏内容。
- 两天课表切换等高；课程材料、配置和积分依据弹窗支持窄屏阅读。
- 手机积分榜在表格内部横向滚动，小组列固定，全部分项保留。
- `dist/responsive.css` 最后加载，负责公共布局；课表、名册和积分规则的响应式样式保留在各模块 CSS。
- 已在浏览器中检查 320、375、390、680、768、1024、1440 像素宽度，以及课程、材料、积分和历史入口。未进行微信真机测试。

## 内容状态

- 展示活动首页、两天拟定课表、课程准备、六课介绍、小组名册、积分中心与现场帮助。
- 活动正式日期、真实分组名单、讲师联系方式和正式课堂材料仍待公布。
- 积分数据为清楚标注的虚拟演示记录，尚未接入真实成绩或后台。

## 本地预览

```sh
python3 -m http.server 8770 --bind 127.0.0.1 --directory dist
```

首页入口为 http://127.0.0.1:8770/ 。

## 维护和发布

Vercel 使用 Other / 无框架预设，输出目录 `dist`，无需依赖安装与构建命令；配置见 `vercel.json`。

- `dist/index.html`：页面结构。
- `dist/styles.css`、`schedule.css`、`roster.css`、`scoring.css`、`responsive.css`：样式。
- `dist/app.js`：课程内容和导航；其他同名 JS 文件处理各模块交互。
- `dist/data/schedule.json`：两天拟定课表。
- `dist/data/roster.json`：名册（当前待公布）。
- `dist/data/score-ledger.json`：积分演示与修改历史。
- `dist/downloads/`：课程准备说明和合并 ZIP。
- `dist/assets/`：当前实际使用的三张宁波插画。

发布内容仅在 `dist/` 中。不包含筹备源文档或历次预览截图。
