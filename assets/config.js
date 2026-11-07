/* Public config only. The Supabase anon key is public by design (RLS protects data).
   Never put Razorpay or Cashfree secrets here.
   Payment links live in assets/payments.js and stay empty until a provider is really active.
   Leave supabaseUrl empty to keep accounts hidden. */
window.QUAVOK_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
