/* Public payment settings for the static site.
   Razorpay is preferred. Cashfree is the fallback.
   Leave every link empty until a coordinator pastes a real hosted payment link.
   NEVER put a key secret, webhook secret, or Cashfree secret in this file.
   orderApi stays empty until that service is actually deployed. */
window.QUAVOK_PAYMENTS = {
  preferred: "razorpay",
  fallback: "cashfree",
  orderApi: "",
  links: {
    razorpay: {},
    cashfree: {}
  }
};
