# 庄方宜 · 个人档案网站

一个可以直接部署到 **GitHub Pages** 的纯静态个人简历网站（零依赖、零构建），
视觉风格参考《明日方舟：终末地》的工业科幻 HUD 界面。

主题人物：**庄方宜** —— 宏山科学院研究人员 / 武陵科学发展区管代 / 息壤新材项目负责人天师。

---

## 一、目录结构

```
.
├── index.html                       # 页面结构（全部简历内容）
├── styles.css                       # 终末地风格样式（深色工业 + 荧光黄绿 HUD）
├── script.js                        # 交互：开机动画 / 雷达图 / 滚动揭示 / HUD
├── assets/
│   ├── avatar.jpg                   # 庄方宜头像（首页人物卡）
│   ├── favicon.jpg                  # 站点图标
│   ├── gift-balloon.jpg             # 龙泡泡气球（06 喜欢的礼物）
│   └── chibi.png                    # 庄方宜Q版（06 兴趣与个人生活，已抠底透明）
├── .nojekyll                        # 关闭 Jekyll，保证静态资源原样发布
├── .github/workflows/deploy-pages.yml  # 推送到 main 自动部署到 Pages
├── .gitignore
└── LICENSE
```

---

## 二、部署到 GitHub Pages（二选一）

### 方式 A：自动部署（推荐，已配好 GitHub Actions）

1. 在 GitHub 新建一个仓库，例如 `zhuang-fangyi-cv`。
2. 把本目录所有文件推送到 `main` 分支：

   ```bash
   git init
   git add .
   git commit -m "feat: 庄方宜个人档案站点"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/zhuang-fangyi-cv.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages**，把 **Source** 设为 **GitHub Actions**。
4. 推送后 `.github/workflows/deploy-pages.yml` 会自动构建并发布，
   访问地址：`https://<你的用户名>.github.io/zhuang-fangyi-cv/`

### 方式 B：分支直出（不用 Actions）

**Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root`**，保存即可。
（仓库根目录就是站点根目录，无需任何构建步骤。）

### 换成自己的域名

在仓库根目录新增文件 `CNAME`，内容为你的域名（如 `cv.example.com`），
然后在域名服务商处添加 CNAME 记录指向 `<你的用户名>.github.io`。

---

## 三、本地预览

```bash
# 任选一种
python -m http.server 8080
npx serve .
```

然后访问 `http://localhost:8080/`。
（直接双击 `index.html` 也能看，但建议用本地服务器以贴近线上效果。）

调试用参数：`index.html?noboot=1` 可跳过开机动画。

---

## 四、内容与样式速查

| 想改什么 | 改哪里 |
| --- | --- |
| 文案 / 章节 / 图片引用 | `index.html` |
| 主色（荧光黄绿 `--lime`、青绿 `--teal`、警示红 `--red`） | `styles.css` 顶部 `:root` |
| 综合体检测试数值（雷达图 + 进度条） | `script.js` 中 `values` / `index.html` 里 `--v` |
| 打字机文案 | `script.js` 中 `words` |
| 开机自检日志 | `script.js` 中 `lines` |

---

## 五、说明

页面为个人简历/角色档案演示用途，素材来源于角色档案资料。
字体通过 Google Fonts CDN 加载（Chakra Petch / JetBrains Mono / Noto Sans SC），
离线环境下会自动回退到系统字体，不影响布局与功能。

## 许可证

代码部分采用 MIT 许可证，详见 `LICENSE`。角色相关素材版权归原作者所有。
