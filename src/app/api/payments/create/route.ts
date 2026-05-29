export async function POST() {
  return Response.json({
    mode: "demo",
    unlockCode: "MYSTIC2026",
    message:
      "当前是演示支付接口。真实上线时这里需要接微信支付、支付宝或 Stripe，并在支付成功回调后解锁报告。",
    requiredKeys: [
      "STRIPE_SECRET_KEY",
      "STRIPE_PRICE_ID",
      "WECHAT_PAY_MCH_ID",
      "WECHAT_PAY_API_KEY",
      "ALIPAY_APP_ID",
    ],
  });
}
