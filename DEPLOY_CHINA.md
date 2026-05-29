# 玄机命理会馆：中国境内客户上线方案

## 推荐路线

你服务中国境内客户，建议第一版使用：

```text
腾讯云轻量应用服务器 / 阿里云 ECS
Node.js 20
PM2
Nginx
DeepSeek API
人工微信收款
```

这个路线不依赖 Vercel，也不需要美国手机号。

## 必须准备

```text
1. 国内云账号：腾讯云或阿里云
2. 服务器：2 核 2G 起步，Ubuntu 22.04 或 24.04
3. 域名：建议在同一家云厂商购买
4. ICP 备案：网站放在中国大陆服务器必须做
5. 公安联网备案：ICP备案通过并上线后继续做
6. DeepSeek API Key：上线前重新生成
7. 微信收款码：已放在 public/payments/wechat-pay.jpg
```

## 服务器部署命令

登录服务器后：

```bash
sudo apt update
sudo apt install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

上传或拉取项目后：

```bash
cd ai-mystic-site
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Nginx 反向代理

创建配置：

```bash
sudo nano /etc/nginx/sites-available/xuanji-mingli
```

填入：

```nginx
server {
    listen 80;
    server_name 你的域名;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用：

```bash
sudo ln -s /etc/nginx/sites-available/xuanji-mingli /etc/nginx/sites-enabled/xuanji-mingli
sudo nginx -t
sudo systemctl reload nginx
```

## 服务器环境变量

在服务器项目目录创建 `.env.local`：

```text
OPENAI_API_KEY=你的新 DeepSeek Key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
NEXT_PUBLIC_APP_URL=https://你的域名
```

如果暂时没有 Supabase，可以先不填 Supabase 变量。

## Docker 部署

如果服务器使用 Docker：

```bash
docker build -t xuanji-mingli .
docker run -d --name xuanji-mingli --restart always -p 3000:3000 --env-file .env.local xuanji-mingli
```

## 当前 MVP 边界

```text
1. 免费次数暂时按浏览器本地记录，不是按真实账号。
2. 报告保存暂时本地优先，未接 Supabase 前不能跨设备同步。
3. 收款是人工微信收款，不是微信支付自动回调。
4. 内容必须标注娱乐和自我探索，不作为专业决策依据。
```
