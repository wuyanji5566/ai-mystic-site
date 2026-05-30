# 玄机命理会馆：海外上线方案

目标：先用海外免费平台生成一个可公开访问的网址，让用户能直接在浏览器打开网站。

## 推荐路线

第一选择：Netlify。

原因：

- 不需要先买服务器。
- 可以先用免费二级域名。
- 适合 Next.js MVP 演示和早期获客。
- 后续可以绑定正式域名。

备用选择：Cloudflare Pages。

说明：Cloudflare Pages 的全球访问速度很好，但 Next.js 动态接口需要更多适配。当前项目有报告生成 API，第一阶段先用 Netlify 更省事。

## 你需要准备

```text
GitHub 账号：wuyanji5566
Netlify 账号
DeepSeek API Key
网站正式名称：玄机命理会馆
客服微信：wuyanji
联系邮箱：18200249873@163.com
```

## 必须配置的环境变量

在 Netlify 后台进入：

```text
Site configuration -> Environment variables
```

添加：

```text
OPENAI_API_KEY=你的 DeepSeek API Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
NEXT_PUBLIC_APP_URL=部署成功后的 Netlify 网址
```

注意：

- `OPENAI_API_KEY` 不能写进页面。
- `.env.local` 只用于本地测试，不能提交到 GitHub。
- 第一次部署前可以先不填 `NEXT_PUBLIC_APP_URL`，拿到正式网址后再补上并重新部署。

## Netlify 后台部署步骤

1. 打开 Netlify 官网并注册账号。
2. 用 GitHub 账号登录。
3. 创建新站点，选择从 GitHub 导入。
4. 选择 `ai-mystic-site` 仓库。
5. 构建命令填写：

```bash
npm run build
```

6. 发布目录填写：

```text
.next
```

7. 添加环境变量。
8. 点击 Deploy。
9. 部署成功后，打开 Netlify 给你的免费网址。

## 本地命令验证

每次准备部署前，先在本地运行：

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
npm.cmd run lint
npm.cmd run build
```

两个命令都通过，再部署。

## CLI 部署方式

如果你已经登录 Netlify，也可以用命令部署：

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
$env:npm_config_cache='D:\项目文件夹\作品集\ai-mystic-site\.npm-cache'
$env:XDG_CONFIG_HOME='D:\项目文件夹\作品集\ai-mystic-site\.netlify-config'
$env:APPDATA='D:\项目文件夹\作品集\ai-mystic-site\.netlify-appdata'
npx.cmd netlify-cli@latest status
npx.cmd netlify-cli@latest deploy --build
```

确认预览站点没问题后，再发布正式版：

```bash
npx.cmd netlify-cli@latest deploy --build --prod
```

如果提示没有登录，先运行：

```bash
npx.cmd netlify-cli@latest login
```

这个命令会打开浏览器，需要你自己完成 Netlify 登录授权。

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
3. 打开报告详情页。
4. 继续追问一次。
5. 尝试点击价格页和人工收款说明。
```

## 搜索引擎收录

网站上线后，还需要做这些事：

```text
1. Google Search Console 添加网站。
2. 提交 /sitemap.xml。
3. Bing Webmaster 添加网站。
4. 提交 /sitemap.xml。
5. 等待搜索引擎抓取。
```

说明：搜索引擎不会保证立刻收录。免费二级域名也能测试收录，但正式做品牌时建议购买独立域名。

## 后续升级顺序

建议不要一次性做太复杂，按这个顺序来：

```text
1. 海外部署公开网址。
2. 接 Supabase，保存真实用户报告。
3. 做登录注册。
4. 做管理员后台，方便人工查看订单和解锁。
5. 接微信支付或支付宝。
6. 购买域名并绑定。
7. 做更多 SEO 页面和内容文章。
```
