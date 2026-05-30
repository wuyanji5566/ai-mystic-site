# 玄机命理会馆

一个从 0 到 1 搭建的 AI 玄学网站 MVP。

## 已完成能力

- 首页和四维融合报告生成表单
- 紫微斗数、生辰八字、星座、MBTI 融合分析
- 生辰八字入门信息、生肖、星座、年柱、MBTI 倾向
- DeepSeek 真实生成，失败时自动回退演示报告
- 报告自动保存：优先 Supabase，未配置时本地保存
- 报告详情页：`/report/[id]`
- 历史报告页：`/reports`
- 用户中心 MVP：`/account`
- 价格页和演示解锁：`/pricing`
- 隐私政策：`/privacy`
- 专业排盘升级说明：`/professional`
- 部署清单：`/deploy`
- 报告继续深化：`/api/report-followup`
- 详情页继续追问：事业、关系、财富、30 天行动计划、截图分享总结
- 追问历史本地保存：每份报告最多保留最近 12 条追问
- 免费追问限制：未解锁报告可免费追问 1 次
- SEO 基础文件：`/robots.txt`、`/sitemap.xml`
- 正式品牌信息：玄机命理会馆
- 人工收款 MVP：完整版报告 19.9 元，客服微信 wuyanji

## 本地运行

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
npm.cmd run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 需要哪些 Key

真正上线需要这些外部配置：

```text
OPENAI_API_KEY              DeepSeek API Key，真实 AI 报告生成需要
OPENAI_BASE_URL             DeepSeek 接口地址，默认 https://api.deepseek.com
OPENAI_MODEL                DeepSeek 模型，默认 deepseek-v4-flash
SUPABASE_URL                云端保存和跨设备分享需要
SUPABASE_SERVICE_ROLE_KEY   服务端写入/读取 Supabase 需要
STRIPE_SECRET_KEY           Stripe 真实支付需要
STRIPE_PRICE_ID             Stripe 商品价格需要
WECHAT_PAY_MCH_ID           微信支付需要
WECHAT_PAY_API_KEY          微信支付需要
ALIPAY_APP_ID               支付宝需要
NEXT_PUBLIC_APP_URL         部署后的正式网址
```

当前没有 Key 也能跑，但会进入演示模式。

## 当前商业化规则

```text
网站名称：玄机命理会馆
产品定位：紫微 + 八字 + 星座 + MBTI 四维自我分析网站
目标用户：国内与海外用户
免费规则：每个用户免费生成 1 次
完整版价格：19.9 元 / 份
客服微信：wuyanji
联系邮箱：18200249873@163.com
GitHub 账号：wuyanji5566
第一阶段收款：人工微信收款
后续自动支付：微信支付 / 支付宝
```

说明：在没有接 Supabase Auth 前，“每个用户免费 1 次”暂时按当前浏览器本地记录限制。接入真实注册后，会升级为按账号限制。

## DeepSeek 配置

打开 `.env.local`：

```text
OPENAI_API_KEY=你的真实 DeepSeek API Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
```

说明：项目代码仍然使用 OpenAI SDK，因为 DeepSeek 官方接口兼容 OpenAI Chat Completions。这里的 `OPENAI_*` 变量名只是为了复用现有代码，不代表一定只能使用 OpenAI。

## Supabase 云端保存

1. 创建 Supabase 项目。
2. 打开 Supabase SQL Editor。
3. 执行：

```text
D:\项目文件夹\作品集\ai-mystic-site\supabase\schema.sql
```

4. 在 `.env.local` 填入：

```text
SUPABASE_URL=你的 Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
```

5. 重启：

```bash
npm.cmd run dev
```

安全提醒：`SUPABASE_SERVICE_ROLE_KEY` 只能放服务端，不能写成 `NEXT_PUBLIC_`。

## 付费解锁

当前是人工收款 MVP。微信收款码已放在：

```text
public/payments/wechat-pay.jpg
```

用户添加客服微信 `wuyanji`，付款 `19.9 元` 后，由客服协助解锁完整版。

开发阶段仍保留演示解锁码：

```text
MYSTIC2026
```

即可解锁完整版。

真实上线时需要接：

- 国内：微信支付 / 支付宝
- 海外：Stripe

演示支付接口：

```text
POST /api/payments/create
```

## 部署上线

如果服务中国境内客户，建议用：

```text
腾讯云轻量应用服务器 / 阿里云 ECS + Node.js 20 + PM2 + Nginx
```

项目已准备国内服务器部署文件：

```text
DEPLOY_CHINA.md
ecosystem.config.cjs
Dockerfile
netlify.toml
```

国内正式上线通常需要：

```text
域名实名
ICP备案
服务器部署
HTTPS
公安联网备案
```

详细步骤看：

```text
D:\项目文件夹\作品集\ai-mystic-site\DEPLOY_CHINA.md
```

如果只是先演示，也可以用服务器公网 IP 临时访问；如果要绑定正式域名并长期服务中国境内客户，就必须走备案流程。

## 临时公网访问

如果你暂时不买服务器，也不注册部署平台，可以用临时隧道生成一个可分享网址。

先启动网站：

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
npm.cmd run dev
```

再打开第二个 PowerShell 窗口，运行：

```bash
cd D:\项目文件夹\作品集\ai-mystic-site
$env:npm_config_cache='D:\项目文件夹\作品集\ai-mystic-site\.npm-cache'
npx.cmd localtunnel --port 3000
```

它会输出一个类似这样的地址：

```text
https://xxxx.loca.lt
```

这个地址可以发给别人临时访问，但缺点是：

```text
1. 电脑关机或命令停止后，网址就失效。
2. 地址不固定，不适合印在名片或宣传页。
3. 搜索引擎通常不会稳定收录这种临时网址。
4. 正式服务中国境内客户，仍然建议走国内云服务器和备案。
```

## 当前边界

- 八字和紫微斗数仍是 MVP 解读版，不是专业排盘。
- 用户中心是本地身份演示，不是真实账号系统。
- 付费是演示解锁，不是真实支付。
- 配置 Supabase 前，报告链接不能跨设备分享。

## 验证命令

```bash
npm.cmd run lint
npm.cmd run build
```
