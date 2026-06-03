# 玄机命理会馆：海外上线方案

目标：先用海外平台生成一个可公开访问的网址，让用户能直接在浏览器打开网站。

## 当前推荐路线

第一选择：Render。

原因：

- 当前 Netlify 团队额度已经超限，项目被暂停访问。
- 本项目是 Next.js，并且包含 AI 报告生成接口，适合用 Render Web Service。
- 不需要先买服务器，能先用 Render 免费二级域名。
- 后续可以绑定正式域名。

备用选择：

- Netlify：除非升级团队，否则暂时不能作为主站。
- Cloudflare Pages：性能好，但 Next.js 动态接口需要更多适配，后续再考虑。
- Vercel：Next.js 适配最好，但你之前被手机号验证卡住，暂不作为首选。

## 你需要准备

```text
GitHub 账号：wuyanji5566
Render 账号
DeepSeek API Key
网站正式名称：玄机命理会馆
客服微信：wuyanji
联系邮箱：18200249873@163.com
```

## 必须配置的环境变量

在 Render 后台进入：

```text
Service -> Environment
```

添加：

```text
OPENAI_API_KEY=你的 DeepSeek API Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
NEXT_PUBLIC_APP_URL=部署成功后的 Render 网址
NEXT_TELEMETRY_DISABLED=1
```

暂时没有 Supabase 时，可以先不填：

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

注意：

- `OPENAI_API_KEY` 不能写进页面。
- `.env.local` 只用于本地测试，不能提交到 GitHub。
- 第一次部署前可以先不填 `NEXT_PUBLIC_APP_URL`，拿到 Render 网址后再补上并重新部署。

## Render 后台部署步骤

1. 打开 Render 官网并注册账号。
2. 用 GitHub 账号登录。
3. 点击 `New +`。
4. 优先选择 `Blueprint`，选择仓库 `wuyanji5566/ai-mystic-site`。
5. Render 会读取项目根目录的 `render.yaml`。
6. 如果你选择的是 `Web Service`，手动填写：

```text
Runtime: Node
Build Command: npm ci && npm run build
Start Command: npm run start
```

7. 添加环境变量。
8. 点击 Deploy。
9. 部署成功后，打开 Render 给你的免费网址。
10. 回到 Environment，把 `NEXT_PUBLIC_APP_URL` 改成 Render 网址，再重新部署一次。

## 本地命令验证

每次准备部署前，先在本地运行：

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
npm.cmd run lint
npm.cmd run build
```

两个命令都通过，再部署。

## 上线后检查

部署成功后，逐个打开：

```text
/
/pricing
/privacy
/deploy
/robots.txt
/sitemap.xml
```

再测试：

```text
1. 首页填写资料。
2. 生成一份报告。
3. 点击解锁完整版。
4. 点击“我已完成支付，生成完整报告”。
5. 确认完整报告能展开。
6. 打开报告详情页。
7. 继续追问一次。
```

## 搜索引擎收录

网站上线后，还需要做这些事：

1. 注册 Google Search Console。
2. 添加 Render 网址或正式域名。
3. 提交：

```text
/sitemap.xml
```

4. 注册 Bing Webmaster。
5. 提交同一个 sitemap。
6. 等待搜索引擎收录。

部署成功只是“网站可访问”，搜索到还需要一点时间。
