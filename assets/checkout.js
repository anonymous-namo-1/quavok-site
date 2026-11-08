/* Online checkout via Supabase Edge Function + Cashfree. Hidden unless configured. */
import { phoneField, savePhone } from './phone.js';
const C = window.QUAVOK_CONFIG || {}, box = document.getElementById('checkout');
if (box && C.supabaseUrl && C.supabaseAnonKey) {
  const PLANS = { starter: 'Starter, ₹500/month', pro: 'Pro, ₹2,499/month' };
  box.hidden = false; document.getElementById('paynone').hidden = true;
  box.innerHTML = '<h2>Pay online</h2><p>Sign in first so your plan and invoices show in <a href="../account/">your account</a>. Plans are billed monthly. This page does not start automatic billing. The audit is free. Cancel as per our <a href="../terms/">terms</a>.</p>' +
    `<p>${phoneField('cphone')}</p>` + Object.entries(PLANS).map(([k, v]) => `<p><button class="btn btn-p" type="button" data-plan="${k}">${v}</button></p>`).join('') + '<p id="cmsg" role="status" aria-live="polite"></p>';
  const msg = t => document.getElementById('cmsg').textContent = t;
  box.addEventListener('click', async e => {
    const plan = e.target.dataset?.plan; if (!plan) return;
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const sb = createClient(C.supabaseUrl, C.supabaseAnonKey);
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { location.href = '../account/?next=pay'; return; }
      try { await savePhone(sb, document.getElementById('cphone').value); }
      catch (pe) { msg(pe.message); document.getElementById('cphone').focus(); return; }
      msg('Starting secure checkout…');
      const { data, error } = await sb.functions.invoke('cashfree-checkout', { body: { plan } });
      if (error || !data) throw error || new Error('No response');
      await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
      const cf = window.Cashfree({ mode: C.cashfreeMode === 'production' ? 'production' : 'sandbox' });
      if (data.subscription_session_id) await cf.subscriptionsCheckout({ subsSessionId: data.subscription_session_id, redirectTarget: '_self' });
      else await cf.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
    } catch (err) { msg('Online checkout is unavailable right now. Please message us on WhatsApp and we will send a payment link.'); console.error(err); }
  });
}
