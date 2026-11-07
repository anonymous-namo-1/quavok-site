import assert from "node:assert/strict";
import fs from "node:fs";
import { breakdown, decide, findPlan, inr, interpretOrderResponse, statusMessage } from "../assets/payment-flow.js";
import { createOrder } from "./create-order.mjs";

const catalog = JSON.parse(fs.readFileSync(new URL("../assets/plans.json", import.meta.url), "utf8"));
const empty = { preferred: "razorpay", fallback: "cashfree", orderApi: "", links: { razorpay: {}, cashfree: {} } };

assert.equal(inr(299900), "₹2,999");
assert.equal(inr(499900), "₹4,999");
assert.equal(inr(999900), "₹9,999");
assert.equal(inr(1499900), "₹14,999");
assert.equal(inr(1999900), "₹19,999");
assert.equal(inr(2499900), "₹24,999");
assert.equal(inr(249900), "₹2,499");
assert.equal(inr(4999000), "₹49,990");
assert.equal(inr(9999000), "₹99,990");
assert.equal(inr(19999000), "₹1,99,990");
assert.equal(inr(0), "₹0");

const starter = findPlan(catalog, "starter");
const pilot = findPlan(catalog, "pilot_starter");
const audit = findPlan(catalog, "audit");
assert.equal(breakdown(starter, "monthly").lines[0].paise, 499900);
assert.equal(breakdown(starter, "monthly").lines[1].paise, 999900);
assert.equal(breakdown(starter, "yearly").lines[0].paise, 4999000);
assert.equal(breakdown(starter, "yearly").lines[1].paise, 0);
assert.equal(breakdown(pilot, "yearly").cycle, "monthly");
assert.equal(breakdown(audit, "yearly").cycle, "once");
assert.equal(breakdown(findPlan(catalog, "managed"), "monthly").lines[1].paise, 2499900);
assert.equal(findPlan(catalog, "pilot_growth").amountPaise, 499900);
assert.equal(catalog.plans.some(p => p.yearlyPaise && p.id.startsWith("pilot")), false);

assert.equal(decide(empty, starter, "monthly").state, "unavailable");
assert.equal(decide({ ...empty, links: { razorpay: { starter: "http://evil.example/pay" }, cashfree: {} } }, starter, "monthly").state, "unavailable");
assert.equal(decide({ ...empty, links: { razorpay: { starter: "javascript:alert(1)" }, cashfree: {} } }, starter, "monthly").state, "unavailable");
const both = decide({
  ...empty,
  links: {
    razorpay: { starter: "https://rzp.example/starter" },
    cashfree: { starter: "https://cf.example/starter" }
  }
}, starter, "monthly");
assert.equal(both.provider, "razorpay");
const fallback = decide({
  ...empty,
  links: { razorpay: {}, cashfree: { "starter:yearly": "https://cf.example/year" } }
}, starter, "yearly");
assert.equal(fallback.provider, "cashfree");
assert.equal(decide({ ...empty, orderApi: "https://orders.example/pay" }, starter, "monthly").state, "order-api");

assert.equal(interpretOrderResponse({ ok: true, checkoutActive: false, url: "https://rzp.example/x", provider: "razorpay" }).state, "unavailable");
assert.equal(interpretOrderResponse({ ok: true, checkoutActive: true, url: "http://rzp.example/x", provider: "razorpay" }).state, "unavailable");
assert.equal(interpretOrderResponse({ ok: true, checkoutActive: true, url: "https://rzp.example/x", provider: "razorpay" }).provider, "razorpay");
assert.match(statusMessage("success"), /cannot confirm/i);
assert.match(statusMessage("cancel"), /not charged/i);
assert.match(statusMessage("failed"), /not charged/i);

assert.equal(createOrder({}).body.checkoutActive, false);
assert.equal(createOrder({ RAZORPAY_KEY_ID: "rzp_test_x", RAZORPAY_KEY_SECRET: "secret" }).status, 503);
assert.equal(createOrder({ RAZORPAY_KEY_ID: "rzp_test_x", RAZORPAY_KEY_SECRET: "secret" }).body.error, "order_api_not_deployed");
assert.equal(createOrder({ CASHFREE_CLIENT_ID: "id", CASHFREE_CLIENT_SECRET: "secret" }).body.provider, "cashfree");

const home = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const pricing = fs.readFileSync(new URL("../pricing/index.html", import.meta.url), "utf8");
const payJs = fs.readFileSync(new URL("../assets/payments.js", import.meta.url), "utf8");
for (const needle of ["₹2,999", "₹4,999", "₹9,999", "₹14,999", "₹19,999", "₹24,999", "₹49,990", "₹99,990", "₹1,99,990", "₹2,499"]) {
  assert.ok(home.includes(needle), needle + " missing on homepage");
  assert.ok(pricing.includes(needle), needle + " missing on pricing page");
}
assert.match(home, /pay\/\?plan=starter&amp;cycle=monthly|pay\/\?plan=starter&cycle=monthly/);
assert.match(home, /pay\/\?plan=audit/);
assert.match(home, /Ask about this plan/);
assert.match(home, /Chat on WhatsApp/);
assert.match(home, /wa\.me\/919041315226\?text=Hi%20Quavok%2C%20I%27d%20like%20to%20discuss%20a%20WhatsApp%20workflow/);
assert.match(home, /Ask about pilot availability/);
assert.match(home, /7–14 working days/);
assert.match(home, /Free 15-minute fit-check/);
assert.match(home, /separate from the ₹2,999 Audit/);
assert.doesNotMatch(home, /Most popular|Never miss|1 to 2 weeks|Confirm on WhatsApp|href="book\/">[\s\S]{0,80}Chat on WhatsApp/);
assert.doesNotMatch(payJs, /key_secret|KEY_SECRET|rzp_live|rzp_test|cfsk_/i);
assert.match(payJs, /orderApi:\s*""/);
assert.match(payJs, /links:\s*\{\s*razorpay:\s*\{\s*\},\s*cashfree:\s*\{\s*\}/);
assert.match(fs.readFileSync(new URL("../assets/checkout.js", import.meta.url), "utf8"), /does not start/i);

const book = fs.readFileSync(new URL("../book/index.html", import.meta.url), "utf8");
assert.match(book, /Request this time on WhatsApp/);
assert.match(book, /not a confirmed appointment/);
assert.match(book, /Nothing is sent until you press Send/);
assert.match(book, /mailto:hello@quavok.com/);
assert.doesNotMatch(book, /Confirm on WhatsApp|usually within a few working hours/);
assert.match(book, /I'd like to request a free 15-minute fit-check/);

const ship = fs.readFileSync(new URL("../shipping/index.html", import.meta.url), "utf8");
assert.match(ship, /not currently a delivery channel/);
assert.doesNotMatch(ship, /in your <a href="\.\.\/account\/">Quavok account<\/a>/);

const pay = fs.readFileSync(new URL("../pay/index.html", import.meta.url), "utf8");
assert.match(pay, /Payment status and invoice enquiries/);
assert.match(pay, /Ask about an invoice/);
assert.match(pay, /Email an invoice enquiry/);
assert.match(pay, /Online checkout is not yet available/);
assert.doesNotMatch(pay, /Ask for a payment link|Pay Quavok securely/);

const account = fs.readFileSync(new URL("../account/index.html", import.meta.url), "utf8");
assert.match(account, /Account status/);
assert.match(account, /does not sign you in/);
assert.doesNotMatch(account, /Sign in to see your Quavok plan/);

console.log("payment checks passed");
