import { breakdown, decide, findPlan, inr, interpretOrderResponse, normalizeCycle, statusMessage } from "./payment-flow.js";

const WA = "919041315226";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function params() {
  const q = new URLSearchParams(location.search);
  return {
    plan: q.get("plan") || "",
    cycle: q.get("cycle") || "",
    status: q.get("status") || ""
  };
}

function invoiceHref(plan, view) {
  const lines = view.lines.map(l => `${l.label} ${inr(l.paise)} (${l.when})`).join("; ");
  const text = `Hi Quavok, please confirm the invoice and available payment arrangements for my agreed scope. Plan shown on the status page: ${plan.name}. ${lines}. Business: `;
  return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
}

function emailHref(plan, view) {
  const lines = view.lines.map(l => `${l.label} ${inr(l.paise)} (${l.when})`).join("; ");
  const body = `Please confirm the invoice and available payment arrangements for my agreed scope.\nPlan: ${plan.name}. ${lines}.\nBusiness: `;
  return "mailto:hello@quavok.com?subject=" + encodeURIComponent("Invoice enquiry: " + plan.name) + "&body=" + encodeURIComponent(body);
}

function render(catalog, config) {
  const root = document.getElementById("pay-app");
  const q = params();
  const plan = findPlan(catalog, q.plan);
  const note = statusMessage(q.status);
  const choices = catalog.plans.map(p => {
    const cycle = p.charge === "one-time" ? "" : "&amp;cycle=monthly";
    return `<li><a href="?plan=${esc(p.id)}${cycle}">${esc(p.name)}</a></li>`;
  }).join("");

  if (q.plan === "pilot") {
    root.hidden = false;
    root.innerHTML = `${note ? `<p class="note-d" role="status">${esc(note)}</p>` : ""}
      <h2>Pilot pricing</h2>
      <p>These are the published pilot prices. Opening this page does not reserve a spot and does not charge you. A person confirms a spot before any payment. Online checkout is not active.</p>
      <ul>
        <li><a href="?plan=pilot_starter">Pilot Starter, ₹2,499 each month for 3 months, setup waived</a></li>
        <li><a href="?plan=pilot_growth">Pilot Growth, ₹4,999 each month for 3 months, setup waived</a></li>
      </ul>
      <p>Cancel anytime during the pilot. The service stops at the end of the month already paid, and you are not billed again. This page does not bill a fourth month and does not publish a separate renewal price. Standard Starter and Growth prices stay on the <a href="../pricing/">pricing page</a>.</p>
      <p>The free 15-minute fit-check is <a href="../book/">requested separately</a>. Asking about a pilot does not reserve a spot.</p>`;
    return;
  }

  if (!plan) {
    root.hidden = false;
    root.innerHTML = `${note ? `<p class="note-d" role="status">${esc(note)}</p>` : ""}
      <h2>${q.plan ? "That plan is not on the list" : "Choose a plan"}</h2>
      <p>${q.plan ? "Nothing was charged. Pick a published plan." : "Online checkout is not active. Choosing a plan only shows the published charges."}</p>
      <ul>${choices}</ul>
      <p>The free 15-minute fit-check is <a href="../book/">requested separately</a> and is not the ₹2,999 Audit.</p>`;
    return;
  }

  const cycle = normalizeCycle(plan, q.cycle);
  const view = breakdown(plan, cycle);
  const gate = decide(config, plan, cycle);
  const yearlyNote = q.cycle === "yearly" && cycle !== "yearly"
    ? "<p>This plan has no yearly price. The monthly charges below are the published ones.</p>" : "";
  const rows = view.lines.map(l => `<tr><td>${esc(l.label)}</td><td>${esc(l.when)}</td><td>${esc(inr(l.paise))}${l.note ? `<br><span>${esc(l.note)}</span>` : ""}</td></tr>`).join("");
  let action;
  if (gate.state === "hosted") {
    const who = gate.provider === "razorpay" ? "Razorpay" : "Cashfree";
    action = `<p>A hosted ${esc(who)} link is configured for this charge. This site still has not taken a payment. The link opens ${esc(who)}, not a card form on quavok.com.</p>
      <p><a class="btn btn-p" style="color:#fff;text-decoration:none" href="${esc(gate.url)}" rel="noopener noreferrer">Continue on ${esc(who)}</a></p>`;
  } else if (gate.state === "order-api") {
    action = `<p>An order service address is configured. It is not used until you ask, and a charge starts only if that service returns an active hosted link.</p>
      <p><button class="btn btn-p" type="button" id="pay-order">Ask the order service</button></p>
      <p id="pay-order-msg" role="status"></p>`;
  } else {
    action = `<h2>This is an enquiry, not a payment</h2>
      <p>Online card and UPI checkout is not live. Razorpay is the preferred provider and Cashfree is the fallback, and neither has a payment link configured. No order service is deployed. Contact us to confirm your agreed scope, invoice and available payment arrangements before paying. This page does not collect a payment or set up automatic billing.</p>
      <p><a class="btn btn-wa" style="color:#fff;text-decoration:none" href="${esc(invoiceHref(plan, view))}" target="_blank" rel="noopener">Ask about an invoice</a> <a class="btn btn-g" style="text-decoration:none" href="${esc(emailHref(plan, view))}">Email an invoice enquiry</a></p>
      <p class="fine">WhatsApp or email opens with the plan filled in. Nothing is sent until you press send there. Never share your card number, CVV, OTP or UPI PIN in chat or by phone.</p>`;
  }

  root.hidden = false;
  root.innerHTML = `${note ? `<p class="note-d" role="status">${esc(note)}</p>` : ""}
    <h2>${esc(plan.name)}</h2>
    <p>${esc(plan.summary)}</p>
    ${yearlyNote}
    <table><tr><th>Charge</th><th>When</th><th>Amount</th></tr>${rows}</table>
    <p>${esc(plan.billing)}</p>
    <p>These amounts are the published prices. No GST is added. Meta WhatsApp message fees, if any, are separate and passed through at cost.${plan.charge === "recurring" ? ` Above the plan's conversation limit, the published rate is ${esc(inr(catalog.extraConversationPaise))} per extra AI conversation.` : ""}</p>
    ${action}
    <p>Cancellation and refunds follow the <a href="../refund/">refund policy</a>. Monthly plans that are not pilots end 30 days after notice. During a pilot you can cancel anytime and are not billed again after the month already paid. Terms are on the <a href="../terms/">terms page</a>.</p>
    <h2>Other published plans</h2>
    <ul>${choices}</ul>
    <p>Works for the business types on the homepage, including marketing agencies and website agencies. Clinics are one example, not the only one. The free 15-minute fit-check stays on the <a href="../book/">request page</a>.</p>`;

  const button = document.getElementById("pay-order");
  if (button) button.onclick = async () => {
    const msg = document.getElementById("pay-order-msg");
    msg.textContent = "Checking the order service…";
    try {
      const res = await fetch(gate.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: plan.id, cycle })
      });
      const body = await res.json().catch(() => null);
      const next = interpretOrderResponse(body);
      if (next.state === "hosted") location.assign(next.url);
      else msg.textContent = "The order service did not start a payment. You have not been charged from this page.";
    } catch (err) {
      msg.textContent = "The order service could not be reached. You have not been charged from this page.";
    }
  };
}

const staticBlock = document.getElementById("pay-static");
try {
  const catalog = await fetch(new URL("./plans.json", import.meta.url)).then(r => {
    if (!r.ok) throw new Error("plans");
    return r.json();
  });
  if (staticBlock) staticBlock.hidden = true;
  render(catalog, window.QUAVOK_PAYMENTS || {});
} catch (err) {
  if (staticBlock) staticBlock.hidden = false;
}
