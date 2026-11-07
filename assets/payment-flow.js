/** Plan charge math and provider choice. No network. No secrets. */

export function inr(paise) {
  if (!Number.isInteger(paise) || paise < 0) throw new Error("amount");
  const rupees = String(paise / 100);
  if (rupees.includes(".")) throw new Error("amount");
  let rest = rupees;
  let grouped = "";
  if (rest.length > 3) {
    grouped = rest.slice(-3);
    rest = rest.slice(0, -3);
    while (rest.length > 2) {
      grouped = rest.slice(-2) + "," + grouped;
      rest = rest.slice(0, -2);
    }
    grouped = rest + "," + grouped;
  } else grouped = rest;
  return "₹" + grouped;
}

export function findPlan(catalog, id) {
  return (catalog.plans || []).find(p => p.id === id) || null;
}

export function normalizeCycle(plan, cycle) {
  if (!plan || plan.charge === "one-time") return "once";
  if (cycle === "yearly" && Number.isInteger(plan.yearlyPaise)) return "yearly";
  return "monthly";
}

/** Lines a buyer should see before any payment control. */
export function breakdown(plan, cycle) {
  const use = normalizeCycle(plan, cycle);
  if (use === "once") {
    return {
      cycle: "once",
      lines: [{ when: "One-time", label: plan.name, paise: plan.amountPaise }]
    };
  }
  if (use === "yearly") {
    return {
      cycle: "yearly",
      lines: [
        { when: "Once, in advance for the year", label: "Yearly plan", paise: plan.yearlyPaise },
        { when: "One-time", label: "Setup", paise: 0, note: "Waived on the yearly price published for this plan." }
      ]
    };
  }
  const lines = [
    { when: plan.months ? `Each month, in advance, for ${plan.months} months` : "Each month, in advance", label: "Monthly plan", paise: plan.amountPaise },
    { when: "One-time, separate from the monthly charge", label: "Setup", paise: plan.setupPaise, note: plan.setupPaise === 0 ? "No setup fee on this plan." : "" }
  ];
  return { cycle: "monthly", lines };
}

function httpsUrl(value) {
  return typeof value === "string" && /^https:\/\/[^\s]+$/.test(value);
}

/**
 * Razorpay hosted link first, then Cashfree hosted link, then an order API.
 * Empty or non-https values stay inactive. This does not create a charge.
 */
export function decide(config, plan, cycle) {
  const cfg = config || {};
  const links = cfg.links || {};
  const use = normalizeCycle(plan, cycle);
  const key = use === "yearly" ? plan.id + ":yearly" : plan.id;
  const razorpay = (links.razorpay || {})[key];
  const cashfree = (links.cashfree || {})[key];
  if (httpsUrl(razorpay)) return { state: "hosted", provider: "razorpay", url: razorpay };
  if (httpsUrl(cashfree)) return { state: "hosted", provider: "cashfree", url: cashfree };
  if (httpsUrl(cfg.orderApi)) return { state: "order-api", provider: cfg.preferred === "cashfree" ? "cashfree" : "razorpay", url: cfg.orderApi };
  return { state: "unavailable", provider: null, url: null };
}

/** A provider response may open a hosted page only when it explicitly says checkout is active. */
export function interpretOrderResponse(body) {
  if (!body || body.ok !== true || body.checkoutActive !== true) {
    return { state: "unavailable", provider: null, url: null };
  }
  if (httpsUrl(body.url) && (body.provider === "razorpay" || body.provider === "cashfree")) {
    return { state: "hosted", provider: body.provider, url: body.url };
  }
  return { state: "unavailable", provider: null, url: null };
}

export function statusMessage(status) {
  if (status === "cancel") {
    return "You left before paying. This site has not charged you.";
  }
  if (status === "failed") {
    return "The return link says the payment did not go through. This site has not charged you. A message from this page is not a bank receipt.";
  }
  if (status === "success" || status === "paid") {
    return "This page cannot confirm a payment. A return link is not proof that money moved. We confirm a payment only after it shows in the provider account. Nothing here has charged you.";
  }
  return "";
}
