# 宁波 · 律所主任 AI 研修班

蓝白宁波版网站，第七稿。纯静态 HTML / CSS / JavaScript。

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
- `dist/styles.css`、`schedule.css`、`roster.css`、`scoring.css`：样式。
- `dist/app.js`：课程内容和导航；其他同名 JS 文件处理各模块交互。
- `dist/data/schedule.json`：两天拟定课表。
- `dist/data/roster.json`：名册（当前待公布）。
- `dist/data/score-ledger.json`：积分演示与修改历史。
- `dist/downloads/`：课程准备说明和合并 ZIP。
- `dist/assets/`：当前实际使用的三张宁波插画。

发布内容仅在 `dist/` 中。不包含筹备源文档或历次预览截图。
