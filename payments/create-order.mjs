/**
 * Reference only. Not a deployed endpoint and not imported by the website.
 * It never calls Razorpay or Cashfree, even if environment variables are present,
 * so running it cannot create a charge, subscription, or payment link.
 */
export function createOrder(env = {}) {
  const razorpay = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
  const cashfree = Boolean(env.CASHFREE_CLIENT_ID && env.CASHFREE_CLIENT_SECRET);
  const provider = razorpay ? "razorpay" : cashfree ? "cashfree" : null;
  if (!provider) {
    return {
      status: 503,
      body: {
        ok: false,
        checkoutActive: false,
        error: "payment_provider_not_configured",
        needed: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "or CASHFREE_CLIENT_ID", "CASHFREE_CLIENT_SECRET"]
      }
    };
  }
  return {
    status: 503,
    body: {
      ok: false,
      checkoutActive: false,
      error: "order_api_not_deployed",
      provider
    }
  };
}
