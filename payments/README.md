# Quavok payments (not deployed)

The public site is static GitHub Pages. It cannot create a Razorpay order or a Cashfree order by itself. `assets/payments.js` ships with empty hosted-link maps and an empty `orderApi`. While those stay empty, `/pay/` tells the visitor that online checkout is not active and does not charge them.

`payments/create-order.mjs` is a reference function for a future server. It is not imported by the website. It always returns HTTP 503 and `checkoutActive: false`, including when environment variables are present, so it cannot move money.

## What is still needed before checkout can be turned on

Check the live account status separately. As of this note, a previous Razorpay account was rejected on 3 November 2026, and Cashfree KYC plus subscriptions activation were still pending. Do not treat either provider as approved until that check is done.

### Preferred: Razorpay hosted payment links

Create one hosted payment link per charge in the Razorpay dashboard, after the merchant account is actually activated. Paste only the `https://` link into `assets/payments.js` under `links.razorpay`. Do not paste the key secret.

| Key | Charge |
| --- | --- |
| `audit` | ₹2,999 once |
| `starter` | ₹4,999 each month |
| `starter:yearly` | ₹49,990 once for the year, setup waived |
| `growth` | ₹9,999 each month |
| `growth:yearly` | ₹99,990 once for the year, setup waived |
| `managed` | ₹19,999 each month |
| `managed:yearly` | ₹1,99,990 once for the year, setup waived |
| `pilot_starter` | ₹2,499 each month for 3 months, setup waived |
| `pilot_growth` | ₹4,999 each month for 3 months, setup waived |

Monthly plans also have a separate one-time setup (Starter ₹9,999, Growth ₹14,999, Managed Ops ₹24,999; pilots ₹0). A single hosted link usually covers one amount. If the provider cannot take the monthly charge and the setup charge as two labelled amounts, do not pretend one link did both. Create a second link or invoice the setup separately and say so on the payment page before enabling it.

Suggested return URLs, which this site already explains without treating them as proof of payment:

- Cancel: `https://quavok.com/pay/?plan=PLAN&cycle=CYCLE&status=cancel`
- Failure: `https://quavok.com/pay/?plan=PLAN&cycle=CYCLE&status=failed`

There is no success page that says “paid”. A return URL can be opened by anyone.

Server-only, if you later replace hosted links with Orders API:

- `RAZORPAY_KEY_ID` (this is the only value that could later be public)
- `RAZORPAY_KEY_SECRET` (never in git or in page JavaScript)
- `RAZORPAY_WEBHOOK_SECRET` (never in git or in page JavaScript)

UPI AutoPay and card mandates are not approved in this setup. Do not enable subscriptions until Razorpay has approved that product for this merchant.

### Fallback: Cashfree hosted payment links

Use Cashfree only when a Razorpay link for that same charge is missing. Paste `https://` links under `links.cashfree` with the same keys as above. Cashfree KYC and subscriptions activation must be confirmed first. Do not put `CASHFREE_CLIENT_SECRET` in the website.

Server-only names, for a later deployed order service:

- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`
- `CASHFREE_ENV` (`sandbox` or `production`)

### Order API

Leave `orderApi` as `""` until a server you control is deployed. A safe response is JSON. The page opens a provider URL only when `ok` is true, `checkoutActive` is true, `provider` is `razorpay` or `cashfree`, and `url` is `https`. Anything else stays on the inactive state.

This repository’s reference function does not meet that bar on purpose. Deploying it as-is would still refuse to charge.
