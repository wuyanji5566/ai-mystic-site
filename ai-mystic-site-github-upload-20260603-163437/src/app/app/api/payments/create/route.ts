export async function POST() {
  return Response.json({
    mode: "demo",
    unlockMode: "self_service",
    message:
      "当前是 MVP 演示支付接口。完整版报告为 19.9 元，四维追问室为 9.9 元。扫码付款后由用户点击确认按钮自助打开对应服务；真实上线时这里需要接微信支付、支付宝或 Stripe，并在支付成功回调后解锁报告或追问室。",
    requiredKeys: [
      "STRIPE_SECRET_KEY",
      "STRIPE_PRICE_ID",
      "WECHAT_PAY_MCH_ID",
      "WECHAT_PAY_API_KEY",
      "ALIPAY_APP_ID",
    ],
  });
}
