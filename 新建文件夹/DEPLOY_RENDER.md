# Render 迁移部署指南

当前 Netlify 因为团队额度超限暂停访问，建议临时迁移到 Render。

## 为什么选 Render

本项目是 Next.js 网站，并且包含 `/api/mystic-report`、`/api/report-followup` 等后端接口，所以要选择 **Web Service**，不要选择 Static Site。

## 需要准备

1. GitHub 仓库：`wuyanji5566/ai-mystic-site`
2. Render 账号：https://render.com
3. DeepSeek API Key

## Render 后台部署步骤

1. 打开 Render Dashboard。
2. 点击右上角 `New +`。
3. 选择 `Blueprint`，如果看不到 Blueprint，就选择 `Web Service`。
4. 连接 GitHub，选择仓库 `wuyanji5566/ai-mystic-site`。
5. 如果使用 Blueprint，Render 会读取项目根目录的 `render.yaml`。
6. 如果手动创建 Web Service，填写：
   - Name：`xuanji-mingli-huiguan`
   - Runtime：`Node`
   - Build Command：`npm ci && npm run build`
   - Start Command：`npm run start`
   - Instance Type：先选 Free 或最低价套餐

## 环境变量

在 Render 的 `Environment` 页面添加：

```text
OPENAI_API_KEY=你的 DeepSeek Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
NEXT_PUBLIC_APP_URL=部署成功后的 Render 网址
NEXT_TELEMETRY_DISABLED=1
```

如果暂时没有 Supabase，可以先不填：

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 部署成功后

Render 会给一个类似这样的地址：

```text
https://xuanji-mingli-huiguan.onrender.com
```

拿到这个地址后，回到 Render 环境变量，把：

```text
NEXT_PUBLIC_APP_URL
```

改成真实 Render 地址，然后点 `Manual Deploy -> Deploy latest commit` 重新部署一次。

## 注意

- Render 免费服务可能会休眠，用户第一次打开会慢一些。
- 如果正式运营，建议后续升级到付费实例，减少冷启动。
- 个人收款码仍然不是自动支付回调，只是用户付款后自助确认打开完整版。
