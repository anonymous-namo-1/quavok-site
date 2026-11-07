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
assert.match(home, /pay\/\?plan=pilot/);
assert.doesNotMatch(payJs, /key_secret|KEY_SECRET|rzp_live|rzp_test|cfsk_/i);
assert.match(payJs, /orderApi:\s*""/);
assert.match(fs.readFileSync(new URL("../assets/checkout.js", import.meta.url), "utf8"), /does not start/i);

console.log("payment checks passed");
