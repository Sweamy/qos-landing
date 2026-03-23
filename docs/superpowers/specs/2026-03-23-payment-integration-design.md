# Payment Integration Design

**Date:** 2026-03-23
**Status:** Approved

## Overview

Connect the landing page (Quiz.vue) to the LMS payment backend, with IP-based currency/payment method selection: Kazakhstan IPs get Tenge pricing + Kaspi option, all others get USD pricing + Polar only. Prices adjust dynamically based on the existing abandonment discount (-30%).

## Architecture

```
Landing (qos.plus)                         LMS Backend (qos.plus/api/*)
┌──────────────┐                          ┌──────────────────────────┐
│  Quiz.vue    │──GET get_visitor_country──│  landing_api.py          │
│              │◄─── { country_code }──────│                          │
│              │                           │  get_visitor_country()   │
│  Paywall     │──POST landing_create_sub──│  - IP → country lookup   │
│  (₸ or $)    │◄─── checkout_url / status─│                          │
│              │                           │  landing_create_sub()    │
│  Kaspi modal │                           │  - find/create user      │
│  (phone)     │                           │  - validate price        │
│              │                           │  - call Kaspi or Polar   │
└──────────────┘                          └──────────────────────────┘
```

Both services share the `qos.plus` domain — no CORS needed.

## IP Geolocation

### Endpoint: `get_visitor_country` (GET, allow_guest)

- Extracts client IP from `X-Real-IP` / `X-Forwarded-For` headers (set by Traefik)
- Server-side lookup using `geoip2` + MaxMind GeoLite2-Country database (free)
- Returns `{ "country_code": "KZ" }`
- Landing caches result in `sessionStorage` (display purposes only — server independently validates region based on payment method: kaspi=KZT prices, polar=USD prices)

### Landing behavior

| Country | Currency | Prices (monthly/quarterly/yearly) | Payment methods |
|---------|----------|-----------------------------------|-----------------|
| KZ      | ₸ (Tenge) | 5,800 / 9,800 / 28,000 ₸       | Kaspi + Card (Polar) |
| Other   | $ (USD)   | $7.99 / $14.99 / $49.99         | Card (Polar) only |

## Payment Flow

### Endpoint: `landing_create_subscription` (POST, allow_guest)

**Input:**
```json
{
  "email": "user@example.com",
  "phone": "87001234567",
  "plan": "monthly|quarterly|yearly",
  "price": 5800,
  "payment_method": "kaspi|polar",
  "discount_applied": true
}
```
- `phone` required only when `payment_method=kaspi`

**Server logic:**
1. Validate inputs (email format, phone format if Kaspi, plan is valid)
2. Validate price against known valid values (anti-tampering, see below). Price list selected by payment method: kaspi→KZT, polar→USD
3. Find user by email or create new user (random password, mark as pending activation)
4. **Duplicate check:** if user already has an active subscription (Kaspi or Polar), return `{ "status": "error", "code": "already_subscribed" }`
5. **Idempotency:** if user has a pending Kaspi subscription for the same plan, return existing payment status instead of creating a new one
6. If Kaspi: call ApiPay with validated price → return `{ "status": "pending", "token": "<opaque-uuid>", "message": "confirm_in_kaspi_app" }`
7. If Polar: create checkout session with correct product ID → return `{ "status": "redirect", "checkout_url": "..." }`

**CSRF:** Frappe whitelisted APIs with `allow_guest=True` are exempt from CSRF token checks. Rate limiting + input validation serve as compensating controls.

**Rate limiting:** ~5 requests per IP per hour.

### Price Validation (anti-tampering)

Server maintains a whitelist of valid prices:

**Kaspi (KZT):**
| Plan | Original | Discounted (-30%) |
|------|----------|--------------------|
| Monthly | 5,800 | 4,060 |
| Quarterly | 9,800 | 6,860 |
| Yearly | 28,000 | 19,600 |

**Polar (USD):**
| Plan | Original | Discounted (-30%) |
|------|----------|--------------------|
| Monthly | $7.99 | $5.59 |
| Quarterly | $14.99 | $10.49 |
| Yearly | $49.99 | $34.99 |

If `discount_applied=true`, server checks price matches discounted value. If `false`, checks original. Rejects anything else.

### Kaspi flow
```
User selects plan → clicks Kaspi → enters phone → submit
→ landing_create_subscription(kaspi, phone, price)
→ Server: create user, call ApiPay
→ Landing: show "Confirm in Kaspi app" screen
→ Landing polls GET landing_check_payment_status(token) every 4s
→ User confirms in Kaspi → ApiPay webhook → subscription active
→ Poll detects active → redirect to /lms/practice/sat
→ If no confirmation after 5 min → show "Payment not received" with retry option
```

### Endpoint: `landing_check_payment_status` (GET, allow_guest)

**Input:** `token` (an opaque short-lived token returned from `landing_create_subscription`, not the raw Kaspi payment ID — prevents enumeration attacks)
**Output:** `{ "status": "pending|active|failed" }`
- Server maps token → Kaspi Subscription, returns current status
- Token is a random UUID stored alongside the subscription record, valid for 10 minutes
- Rate limited: ~30 requests per IP per minute
- Pending Kaspi subscriptions with no payment after 10 minutes are marked expired by a scheduled task, allowing clean retries

### Polar flow (KZ card or non-KZ)
```
User selects plan → clicks Card → submit
→ landing_create_subscription(polar, price)
→ Server: create user, create Polar checkout (original or discounted product ID)
→ Landing: redirect to Polar checkout URL
→ User pays → Polar webhook → subscription active
→ Polar redirects to /lms/practice/sat?checkout=success
```

## Abandonment Discount

Existing Quiz.vue behavior: when user tries to navigate back from paywall, -30% discount activates. This is purely a frontend state. The discounted prices are passed to the API, and the server validates them.

Discount applies to both KZ and non-KZ users.

## LMS Changes

### New file: `landing_api.py`
Two guest endpoints as described above.

### Kaspi Settings
Update default prices: 5,800 / 9,800 / 28,000 ₸ (match landing).

### Polar Settings
Add 3 new fields for discounted product IDs:
- `discounted_monthly_product_id`
- `discounted_quarterly_product_id`
- `discounted_yearly_product_id`

User will create 6 total products in Polar dashboard (3 original + 3 discounted) and configure the IDs.

### Dependencies
- `geoip2` Python package for IP geolocation
- MaxMind GeoLite2-Country database (free, ~5MB, needs periodic updates)

## Landing Changes (Quiz.vue)

1. On mount: call `get_visitor_country`, cache in `sessionStorage`
2. Paywall: conditionally render ₸ or $ prices based on country
3. Payment modal: show/hide Kaspi based on country; add phone input for Kaspi
4. Replace `window.location.href` redirects with actual `fetch()` calls to `landing_create_subscription`
5. Pass correct price (original vs discounted) and `discount_applied` flag
6. Add post-payment "Confirm in Kaspi" screen for Kaspi flow
7. Polar flow: redirect to `checkout_url` from API response

## Security

- Guest endpoints rate-limited per IP
- Price server-validated against whitelist
- Phone format validated and normalized: accepts `8XXXXXXXXXX`, `7XXXXXXXXXX`, `+7XXXXXXXXXX` — server normalizes to the format ApiPay expects
- Email format validated
- No sensitive data stored on landing (all server-side)
- User creation with random password — activation email sent separately
- `discount_applied` is a client hint — any user who inspects the API can claim the discount. This is acceptable since the discount is a marketing tool, not a security boundary.

## Error Responses

All endpoints return a consistent error shape:
```json
{ "status": "error", "code": "error_code", "message": "Human-readable message" }
```

| Code | Trigger | Frontend behavior |
|------|---------|-------------------|
| `invalid_email` | Bad email format | Show validation error |
| `invalid_phone` | Bad phone format (Kaspi) | Show validation error |
| `invalid_price` | Price doesn't match whitelist | Show generic error |
| `invalid_plan` | Unknown plan type | Show generic error |
| `already_subscribed` | User has active subscription | Show "You already have an active plan" with link to LMS |
| `payment_provider_error` | Kaspi/Polar API failure | Show "Payment temporarily unavailable, try again later" |
| `rate_limited` | Too many requests | Show "Too many attempts, please wait" |

## Landing UI Notes

- `subscriptionPlans` in Quiz.vue must become a `computed` property that switches between KZT and USD plans based on cached country
- Add a `discountApplied` ref, set to `true` in `goToPlatformWithDiscount()`. `subscriptionPlans` computed should react to it, showing discounted prices when active
- Payment modal must include an email field (pre-filled from emailCapture step if available) visible for both Kaspi and Card flows, before the phone input
- Abandonment overlay must be currency-aware. USD variant: "$34.99/year (was $49.99), save $15.00" for yearly, etc.
- Submit button disabled after first click, re-enabled on error (prevents double payments)
- Frontend disables Kaspi option for non-KZ users
