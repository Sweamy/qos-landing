# Payment Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect landing page payment buttons to LMS backend with IP-based currency selection (KZ=Tenge+Kaspi, other=USD+Polar) and dynamic discount pricing.

**Architecture:** New `landing_api.py` in LMS with 3 guest endpoints. Quiz.vue refactored to call these APIs instead of redirecting. Kaspi Subscription doctype gets a `landing_token` field for secure polling.

**Tech Stack:** Python/Frappe (LMS backend), Vue 3 (landing frontend), geoip2 (IP lookup), ApiPay.kz (Kaspi), Polar API

**Spec:** `docs/superpowers/specs/2026-03-23-payment-integration-design.md`

---

## File Structure

### LMS Backend (`/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/`)

| File | Action | Responsibility |
|------|--------|---------------|
| `landing_api.py` | Create | 3 guest endpoints: `get_visitor_country`, `landing_create_subscription`, `landing_check_payment_status` |
| `doctype/kaspi_settings/kaspi_settings.json` | Modify | Update default prices to 5800/9800/28000 |
| `doctype/polar_settings/polar_settings.json` | Modify | Add 3 discounted product ID fields |
| `doctype/polar_settings/polar_settings.py` | Modify | No change needed (get_polar_settings already works) |
| `doctype/kaspi_subscription/kaspi_subscription.json` | Modify | Add `landing_token` field |
| `doctype/kaspi_subscription/kaspi_subscription.py` | Modify | Add `get_subscription_by_token` helper |
| `hooks.py` | Modify | Add `landing_api.expire_stale_pending_subscriptions` to scheduler |

### Landing Frontend (`/home/olga/myworld/Projects/qos-landing/src/`)

| File | Action | Responsibility |
|------|--------|---------------|
| `components/Quiz.vue` | Modify | Dynamic pricing, API calls, phone input, Kaspi polling screen |

---

## Chunk 1: LMS Backend — Doctype Changes + Geolocation Endpoint

### Task 1: Update Kaspi Settings default prices

**Files:**
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/doctype/kaspi_settings/kaspi_settings.json`

- [ ] **Step 1: Update default prices in kaspi_settings.json**

Change the three default values:
- `monthly_price`: `"3990"` → `"5800"`
- `quarterly_price`: `"6990"` → `"9800"`
- `yearly_price`: `"22990"` → `"28000"`

- [ ] **Step 2: Commit**

```bash
git add lms/lms/doctype/kaspi_settings/kaspi_settings.json
git commit -m "chore: update Kaspi default prices to match landing (5800/9800/28000)"
```

---

### Task 2: Add discounted product IDs to Polar Settings

**Files:**
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/doctype/polar_settings/polar_settings.json`

- [ ] **Step 1: Add 3 new fields to polar_settings.json**

Add to `field_order` after `yearly_product_id`:
- `discounted_products_section`
- `discounted_monthly_product_id`
- `discounted_quarterly_product_id`
- `column_break_5`
- `discounted_yearly_product_id`

Add to `fields` array:
```json
{
  "fieldname": "discounted_products_section",
  "fieldtype": "Section Break",
  "label": "Discounted Products (-30%)"
},
{
  "description": "Polar Product ID for discounted monthly subscription",
  "fieldname": "discounted_monthly_product_id",
  "fieldtype": "Data",
  "label": "Discounted Monthly Product ID"
},
{
  "description": "Polar Product ID for discounted 3-month subscription",
  "fieldname": "discounted_quarterly_product_id",
  "fieldtype": "Data",
  "label": "Discounted Quarterly Product ID"
},
{
  "fieldname": "column_break_5",
  "fieldtype": "Column Break"
},
{
  "description": "Polar Product ID for discounted yearly subscription",
  "fieldname": "discounted_yearly_product_id",
  "fieldtype": "Data",
  "label": "Discounted Yearly Product ID"
}
```

- [ ] **Step 2: Commit**

```bash
git add lms/lms/doctype/polar_settings/polar_settings.json
git commit -m "feat: add discounted product ID fields to Polar Settings"
```

---

### Task 3: Add `landing_token` field to Kaspi Subscription

**Files:**
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/doctype/kaspi_subscription/kaspi_subscription.json`
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/doctype/kaspi_subscription/kaspi_subscription.py`

- [ ] **Step 1: Add `landing_token` and `landing_token_expires` fields to JSON**

Add to `field_order` after `last_webhook_at`:
- `landing_token`
- `landing_token_expires`

Add to `fields`:
```json
{
  "fieldname": "landing_token",
  "fieldtype": "Data",
  "hidden": 1,
  "label": "Landing Token",
  "read_only": 1
},
{
  "fieldname": "landing_token_expires",
  "fieldtype": "Datetime",
  "hidden": 1,
  "label": "Landing Token Expires",
  "read_only": 1
}
```

- [ ] **Step 2: Add `get_subscription_by_token` helper to kaspi_subscription.py**

```python
def get_subscription_by_token(token: str) -> "KaspiSubscription | None":
    """Look up a Kaspi subscription by its landing token (for guest polling)."""
    if not token:
        return None

    result = frappe.db.get_value(
        "Kaspi Subscription",
        {"landing_token": token},
        ["name", "landing_token_expires"],
        as_dict=True,
    )

    if not result:
        return None

    # Check token expiry (10 minutes)
    if result.landing_token_expires and result.landing_token_expires < now_datetime():
        return None

    return frappe.get_doc("Kaspi Subscription", result.name)
```

- [ ] **Step 3: Commit**

```bash
git add lms/lms/doctype/kaspi_subscription/
git commit -m "feat: add landing_token field to Kaspi Subscription for guest polling"
```

---

### Task 4: Create `landing_api.py` — geolocation endpoint

**Files:**
- Create: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/landing_api.py`

- [ ] **Step 1: Install geoip2 dependency**

```bash
cd /home/olga/myworld/Projects/qos_lms/apps/lms
pip install geoip2
# Also add to setup.py / pyproject.toml install_requires
```

Download MaxMind GeoLite2-Country database:
```bash
# Place at a known path, e.g. /home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/data/GeoLite2-Country.mmdb
mkdir -p lms/lms/data
# Download from MaxMind (requires free account) or use a cached copy
```

- [ ] **Step 2: Create landing_api.py with get_visitor_country**

```python
# Copyright (c) 2026, QoS LMS and contributors
# For license information, please see license.txt

import os
import uuid

import frappe
from frappe import _
from frappe.utils import now_datetime, add_to_date

# Lazy-load geoip2 reader
_geoip_reader = None


def _get_geoip_reader():
    """Get or initialize the GeoIP2 reader (singleton)."""
    global _geoip_reader
    if _geoip_reader is None:
        try:
            import geoip2.database

            db_path = os.path.join(
                os.path.dirname(__file__), "data", "GeoLite2-Country.mmdb"
            )
            if os.path.exists(db_path):
                _geoip_reader = geoip2.database.Reader(db_path)
        except ImportError:
            frappe.log_error("geoip2 package not installed", "Landing API")
    return _geoip_reader


def _get_client_ip():
    """Extract client IP from request headers (Traefik sets X-Real-IP)."""
    request = frappe.local.request
    if not request:
        return None
    return (
        request.headers.get("X-Real-IP")
        or request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or request.remote_addr
    )


@frappe.whitelist(allow_guest=True)
def get_visitor_country():
    """
    Detect visitor country from IP address.
    Returns { "country_code": "KZ" } or { "country_code": "UNKNOWN" }.
    """
    ip = _get_client_ip()
    if not ip:
        return {"country_code": "UNKNOWN"}

    reader = _get_geoip_reader()
    if not reader:
        return {"country_code": "UNKNOWN"}

    try:
        response = reader.country(ip)
        return {"country_code": response.country.iso_code or "UNKNOWN"}
    except Exception:
        return {"country_code": "UNKNOWN"}
```

- [ ] **Step 3: Commit**

```bash
git add lms/lms/landing_api.py lms/lms/data/
git commit -m "feat: add get_visitor_country endpoint with GeoIP2 lookup"
```

---

## Chunk 2: LMS Backend — Payment Endpoints

### Task 5: Add `landing_create_subscription` endpoint

**Files:**
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/landing_api.py`

- [ ] **Step 1: Add price validation constants and helpers**

Add after the imports in `landing_api.py`:

```python
import re

from lms.lms.doctype.kaspi_settings.kaspi_settings import (
    get_kaspi_base_url,
    get_kaspi_settings,
)
from lms.lms.doctype.kaspi_subscription.kaspi_subscription import (
    create_or_update_kaspi_subscription,
    get_active_kaspi_subscription,
    get_pending_kaspi_subscription,
    get_subscription_by_token,
)
from lms.lms.doctype.polar_settings.polar_settings import (
    get_polar_base_url,
    get_polar_settings,
)
from lms.lms.doctype.polar_subscription.polar_subscription import (
    get_active_subscription as get_active_polar_subscription,
)

import requests


# Valid price whitelist: { payment_method: { plan: { discount: price } } }
VALID_PRICES = {
    "kaspi": {
        "monthly":   {False: 5800,  True: 4060},
        "quarterly": {False: 9800,  True: 6860},
        "yearly":    {False: 28000, True: 19600},
    },
    "polar": {
        "monthly":   {False: 7.99,  True: 5.59},
        "quarterly": {False: 14.99, True: 10.49},
        "yearly":    {False: 49.99, True: 34.99},
    },
}


def _validate_price(payment_method: str, plan: str, price, discount_applied: bool) -> bool:
    """Check that the submitted price matches our whitelist."""
    method_prices = VALID_PRICES.get(payment_method)
    if not method_prices:
        return False
    plan_prices = method_prices.get(plan)
    if not plan_prices:
        return False
    expected = plan_prices.get(bool(discount_applied))
    if expected is None:
        return False
    return abs(float(price) - expected) < 0.01


def _normalize_phone(phone: str) -> str:
    """Normalize KZ phone to 8XXXXXXXXXX format for ApiPay."""
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("+7"):
        phone = "8" + phone[2:]
    elif phone.startswith("7") and len(phone) == 11:
        phone = "8" + phone[1:]
    return phone


def _validate_phone(phone: str) -> bool:
    """Validate normalized phone is 11 digits starting with 8."""
    return bool(phone and len(phone) == 11 and phone.startswith("8") and phone.isdigit())


def _validate_email(email: str) -> bool:
    """Basic email format check."""
    return bool(email and re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def _find_or_create_user(email: str) -> str:
    """Find existing user by email or create a new one with random password."""
    email = email.strip().lower()

    if frappe.db.exists("User", email):
        return email

    # Create new user
    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": email.split("@")[0],
        "enabled": 1,
        "new_password": frappe.generate_hash(length=16),
        "send_welcome_email": 0,
    })
    user.flags.ignore_permissions = True
    user.flags.ignore_password_policy = True
    user.insert(ignore_permissions=True)
    frappe.db.commit()

    return email


def _error(code: str, message: str, http_status=400):
    """Return a standardized error response."""
    frappe.local.response["http_status_code"] = http_status
    return {"status": "error", "code": code, "message": message}
```

- [ ] **Step 2: Add the main `landing_create_subscription` endpoint**

```python
@frappe.whitelist(allow_guest=True, methods=["POST"])
def landing_create_subscription(
    email: str,
    plan: str,
    price,
    payment_method: str,
    discount_applied=False,
    phone: str = None,
):
    """
    Guest endpoint: create user + initiate payment from landing page.

    Args:
        email: User email
        plan: "monthly", "quarterly", or "yearly"
        price: Numeric price being charged
        payment_method: "kaspi" or "polar"
        discount_applied: Whether -30% discount is active
        phone: Kaspi phone number (required if payment_method=kaspi)
    """
    # --- Rate limiting (simple IP-based) ---
    ip = _get_client_ip()
    cache_key = f"landing_sub_rate:{ip}"
    attempts = frappe.cache.get_value(cache_key) or 0
    if attempts >= 5:
        return _error("rate_limited", "Too many attempts. Please wait and try again.", 429)
    frappe.cache.set_value(cache_key, attempts + 1, expires_in_sec=3600)

    # --- Input validation ---
    discount_applied = discount_applied in (True, "true", "True", 1, "1")

    if not _validate_email(email):
        return _error("invalid_email", "Invalid email address.")

    if plan not in ("monthly", "quarterly", "yearly"):
        return _error("invalid_plan", "Invalid plan. Must be monthly, quarterly, or yearly.")

    if payment_method not in ("kaspi", "polar"):
        return _error("invalid_payment_method", "Invalid payment method.")

    if not _validate_price(payment_method, plan, price, discount_applied):
        return _error("invalid_price", "Invalid price for selected plan.")

    if payment_method == "kaspi":
        if not phone:
            return _error("invalid_phone", "Phone number is required for Kaspi payment.")
        phone = _normalize_phone(phone)
        if not _validate_phone(phone):
            return _error("invalid_phone", "Invalid phone number. Use format 87001234567.")

    # --- Find or create user ---
    user_email = _find_or_create_user(email)

    # --- Check for existing active subscription ---
    if get_active_polar_subscription(user_email):
        return _error("already_subscribed", "You already have an active subscription.")

    if get_active_kaspi_subscription(user_email):
        return _error("already_subscribed", "You already have an active subscription.")

    # --- Execute payment ---
    if payment_method == "kaspi":
        return _create_kaspi_payment(user_email, phone, plan, float(price), discount_applied)
    else:
        return _create_polar_payment(user_email, plan, discount_applied)


def _create_kaspi_payment(user_email, phone, plan, amount, discount_applied):
    """Create a Kaspi subscription via ApiPay."""
    settings = get_kaspi_settings()
    if not settings.enabled:
        return _error("payment_provider_error", "Kaspi Pay is temporarily unavailable.")

    # Idempotency: return existing pending subscription for same plan
    pending = get_pending_kaspi_subscription(user_email)
    if pending and pending.billing_period == plan:
        return {
            "status": "pending",
            "token": pending.landing_token,
            "message": "confirm_in_kaspi_app",
        }

    # Clean up any old pending subscription
    if pending:
        frappe.delete_doc("Kaspi Subscription", pending.name, ignore_permissions=True)
        frappe.db.commit()

    # Get user full name
    full_name = frappe.db.get_value("User", user_email, "full_name") or user_email

    # Call ApiPay
    base_url = get_kaspi_base_url()
    try:
        response = requests.post(
            f"{base_url}/subscriptions",
            headers={
                "X-API-Key": settings.get_password("api_key"),
                "Content-Type": "application/json",
            },
            json={
                "phone_number": phone,
                "amount": amount,
                "billing_period": plan,
                "description": "SAT Practice Subscription",
                "subscriber_name": full_name,
                "external_subscriber_id": user_email,
                "max_retry_attempts": 3,
                "retry_interval_hours": 24,
                "grace_period_days": 7,
            },
            timeout=30,
        )
    except requests.RequestException:
        return _error("payment_provider_error", "Payment service temporarily unavailable.")

    if response.status_code not in (200, 201):
        frappe.log_error(
            message=f"Kaspi landing subscription failed: {response.text}",
            title="Landing Kaspi Error",
        )
        return _error("payment_provider_error", "Payment service temporarily unavailable.")

    data = response.json()
    subscription_data = data.get("subscription", data)

    # Generate opaque token for polling
    token = str(uuid.uuid4())
    token_expires = add_to_date(now_datetime(), minutes=10)

    # Save phone to user
    frappe.db.set_value("User", user_email, "kaspi_phone", phone)

    # Create local subscription record
    doc = create_or_update_kaspi_subscription(
        user=user_email,
        kaspi_subscription_id=str(subscription_data.get("id")),
        phone_number=phone,
        status="pending",
        billing_period=plan,
        amount=amount,
        webhook_event="landing_subscription_created",
    )

    # Set landing token
    frappe.db.set_value("Kaspi Subscription", doc.name, {
        "landing_token": token,
        "landing_token_expires": token_expires,
    })
    frappe.db.commit()

    return {
        "status": "pending",
        "token": token,
        "message": "confirm_in_kaspi_app",
    }


def _create_polar_payment(user_email, plan, discount_applied):
    """Create a Polar checkout session."""
    settings = get_polar_settings()
    if not settings.enabled:
        return _error("payment_provider_error", "Card payment is temporarily unavailable.")

    # Select correct product ID (original or discounted)
    if discount_applied:
        product_map = {
            "monthly": settings.discounted_monthly_product_id,
            "quarterly": settings.discounted_quarterly_product_id,
            "yearly": settings.discounted_yearly_product_id,
        }
    else:
        product_map = {
            "monthly": settings.monthly_product_id,
            "quarterly": settings.quarterly_product_id,
            "yearly": settings.yearly_product_id,
        }

    product_id = product_map.get(plan)
    if not product_id:
        return _error("payment_provider_error", "Product not configured for this plan.")

    # Build URLs
    site_url = frappe.utils.get_url()
    success_url = f"{site_url}{settings.success_url}"
    cancel_url = f"{site_url}{settings.cancel_url}"

    # Create checkout
    base_url = get_polar_base_url()
    try:
        response = requests.post(
            f"{base_url}/checkouts/",
            headers={
                "Authorization": f"Bearer {settings.get_password('access_token')}",
                "Content-Type": "application/json",
            },
            json={
                "products": [product_id],
                "customer_email": user_email,
                "external_customer_id": user_email,
                "success_url": success_url,
                "cancel_url": cancel_url,
            },
            timeout=30,
        )
    except requests.RequestException:
        return _error("payment_provider_error", "Payment service temporarily unavailable.")

    if response.status_code not in (200, 201):
        frappe.log_error(
            message=f"Polar landing checkout failed: {response.text}",
            title="Landing Polar Error",
        )
        return _error("payment_provider_error", "Payment service temporarily unavailable.")

    data = response.json()
    checkout_url = data.get("url")
    if not checkout_url:
        return _error("payment_provider_error", "Invalid response from payment provider.")

    return {
        "status": "redirect",
        "checkout_url": checkout_url,
    }
```

- [ ] **Step 3: Commit**

```bash
git add lms/lms/landing_api.py
git commit -m "feat: add landing_create_subscription endpoint with Kaspi + Polar flows"
```

---

### Task 6: Add `landing_check_payment_status` endpoint + scheduled cleanup

**Files:**
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/lms/landing_api.py`
- Modify: `/home/olga/myworld/Projects/qos_lms/apps/lms/lms/hooks.py`

- [ ] **Step 1: Add polling endpoint to landing_api.py**

```python
@frappe.whitelist(allow_guest=True, methods=["GET"])
def landing_check_payment_status(token: str):
    """
    Poll Kaspi payment status by opaque token (guest-safe).
    Returns { "status": "pending|active|failed" }.
    """
    if not token:
        return _error("invalid_token", "Token is required.")

    subscription = get_subscription_by_token(token)
    if not subscription:
        return {"status": "failed"}

    return {"status": subscription.status}
```

- [ ] **Step 2: Add scheduled task to expire stale pending subscriptions**

```python
def expire_stale_pending_subscriptions():
    """Mark pending Kaspi subscriptions as expired if token has expired (10 min)."""
    stale = frappe.get_all(
        "Kaspi Subscription",
        filters={
            "status": "pending",
            "landing_token_expires": ["<", now_datetime()],
            "landing_token_expires": ["is", "set"],
        },
        pluck="name",
    )
    for name in stale:
        frappe.db.set_value("Kaspi Subscription", name, "status", "expired")
    if stale:
        frappe.db.commit()
```

- [ ] **Step 3: Register scheduled task in hooks.py**

Add to `scheduler_events` in hooks.py, under a `"cron"` key (runs every 10 minutes):

```python
"cron": {
    "*/10 * * * *": [
        "lms.lms.landing_api.expire_stale_pending_subscriptions",
    ],
},
```

- [ ] **Step 4: Commit**

```bash
git add lms/lms/landing_api.py lms/hooks.py
git commit -m "feat: add payment status polling endpoint + stale subscription cleanup"
```

---

## Chunk 3: Landing Frontend — Quiz.vue Changes

### Task 7: Add country detection and reactive pricing

**Files:**
- Modify: `/home/olga/myworld/Projects/qos-landing/src/components/Quiz.vue`

- [ ] **Step 1: Add country ref and fetch on mount**

In the `<script setup>` section, after the existing refs (~line 1118), add:

```javascript
const visitorCountry = ref(sessionStorage.getItem('visitor_country') || null)
const discountApplied = ref(false)
const isPaymentLoading = ref(false)
const paymentError = ref('')
const kaspiPhone = ref('')
const kaspiToken = ref(null)
const showKaspiConfirm = ref(false)
```

In `onMounted`, add the country detection call:

```javascript
if (!visitorCountry.value) {
  fetch('/api/method/lms.lms.landing_api.get_visitor_country')
    .then(r => r.json())
    .then(data => {
      const code = data.message?.country_code || 'UNKNOWN'
      visitorCountry.value = code
      sessionStorage.setItem('visitor_country', code)
    })
    .catch(() => {
      visitorCountry.value = 'UNKNOWN'
    })
}
```

- [ ] **Step 2: Convert `subscriptionPlans` to computed**

Replace the static array at line 1312-1316:

```javascript
const isKZ = computed(() => visitorCountry.value === 'KZ')

const subscriptionPlans = computed(() => {
  if (isKZ.value) {
    if (discountApplied.value) {
      return [
        { id: 'yearly', label: '12 месяцев', perMonth: '1 633 ₸/мес', price: '19 600', oldPrice: '28 000', discount: '-30%', rawPrice: 19600 },
        { id: 'quarterly', label: '3 месяца', perMonth: '2 287 ₸/мес', price: '6 860', oldPrice: '9 800', discount: '-30%', rawPrice: 6860 },
        { id: 'monthly', label: '1 месяц', perMonth: '4 060 ₸/мес', price: '4 060', oldPrice: '5 800', discount: '-30%', rawPrice: 4060 },
      ]
    }
    return [
      { id: 'yearly', label: '12 месяцев', perMonth: '2 333 ₸/мес', price: '28 000', oldPrice: '69 600', discount: '-60%', rawPrice: 28000 },
      { id: 'quarterly', label: '3 месяца', perMonth: '3 267 ₸/мес', price: '9 800', oldPrice: '17 400', badge: 'Самый популярный', rawPrice: 9800 },
      { id: 'monthly', label: '1 месяц', perMonth: '5 800 ₸/мес', price: '5 800', oldPrice: null, rawPrice: 5800 },
    ]
  }
  // USD pricing
  if (discountApplied.value) {
    return [
      { id: 'yearly', label: '12 months', perMonth: '$2.92/mo', price: '$34.99', oldPrice: '$49.99', discount: '-30%', rawPrice: 34.99 },
      { id: 'quarterly', label: '3 months', perMonth: '$3.50/mo', price: '$10.49', oldPrice: '$14.99', discount: '-30%', rawPrice: 10.49 },
      { id: 'monthly', label: '1 month', perMonth: '$5.59/mo', price: '$5.59', oldPrice: '$7.99', discount: '-30%', rawPrice: 5.59 },
    ]
  }
  return [
    { id: 'yearly', label: '12 months', perMonth: '$4.17/mo', price: '$49.99', oldPrice: null, discount: null, rawPrice: 49.99 },
    { id: 'quarterly', label: '3 months', perMonth: '$5.00/mo', price: '$14.99', oldPrice: null, badge: 'Most popular', rawPrice: 14.99 },
    { id: 'monthly', label: '1 month', perMonth: '$7.99/mo', price: '$7.99', oldPrice: null, rawPrice: 7.99 },
  ]
})
```

- [ ] **Step 3: Update `goToPlatformWithDiscount` to set discountApplied**

Replace function at line 1592-1596:

```javascript
function goToPlatformWithDiscount() {
  capture('quiz_discount_accepted')
  showAbandonment.value = false
  discountApplied.value = true
  showPaymentMethod.value = true
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add country detection and reactive currency-aware pricing"
```

---

### Task 8: Update paywall template for dynamic currency

**Files:**
- Modify: `/home/olga/myworld/Projects/qos-landing/src/components/Quiz.vue`

- [ ] **Step 1: Update plan card currency display**

Replace the hardcoded `₸` in the plan card template (lines 931-932):

```html
<div v-if="plan.oldPrice" class="text-xs text-gray-400 line-through">{{ plan.oldPrice }}</div>
<div class="text-lg font-extrabold">{{ plan.price }}</div>
```

(Remove the hardcoded ` ₸` — prices now include currency symbol in the computed data.)

- [ ] **Step 2: Update abandonment overlay to be currency-aware**

Replace the hardcoded abandonment overlay content (lines 1010-1026) with:

```html
<div class="border-2 border-custom-main bg-blue-50 rounded-2xl p-4 text-center mb-3">
  <span class="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg mb-2">-30%</span>
  <template v-if="isKZ">
    <div class="text-xs text-gray-400 line-through">28 000 ₸</div>
    <div class="text-2xl font-extrabold text-custom-main">19 600 <span class="text-sm font-medium">₸/год</span></div>
    <div class="text-[13px] text-gray-500 mt-1">1 633 ₸/мес · экономия 8 400 ₸</div>
  </template>
  <template v-else>
    <div class="text-xs text-gray-400 line-through">$49.99</div>
    <div class="text-2xl font-extrabold text-custom-main">$34.99 <span class="text-sm font-medium">/year</span></div>
    <div class="text-[13px] text-gray-500 mt-1">$2.92/mo · save $15.00</div>
  </template>
</div>

<div class="paywall-plan mb-5">
  <div class="paywall-radio"></div>
  <div class="flex-1">
    <div class="font-bold text-base">{{ isKZ ? '3 месяца' : '3 months' }}</div>
    <div class="text-xs text-gray-500">{{ isKZ ? 'без скидки' : 'no discount' }}</div>
  </div>
  <div class="text-right">
    <div class="text-lg font-extrabold">{{ isKZ ? '9 800 ₸' : '$14.99' }}</div>
  </div>
</div>
```

- [ ] **Step 3: Hide Kaspi button for non-KZ users in payment modal**

Wrap the Kaspi button (lines 988-995) with `v-if="isKZ"`:

```html
<button v-if="isKZ" @click="payWithKaspi" class="w-full flex items-center gap-4 ...">
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: currency-aware paywall and abandonment overlay, hide Kaspi for non-KZ"
```

---

### Task 9: Replace payment redirects with API calls

**Files:**
- Modify: `/home/olga/myworld/Projects/qos-landing/src/components/Quiz.vue`

- [ ] **Step 1: Add email field to payment modal**

Before the payment method buttons in the modal (after line 976), add:

```html
<div class="mb-4">
  <input
    v-model="paymentEmail"
    type="email"
    :placeholder="isKZ ? 'Email' : 'Email'"
    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-custom-main transition-colors"
  />
</div>
```

Add the ref (pre-filled from emailCapture):
```javascript
const paymentEmail = ref('')
```

And in `submitEmail` function or wherever email step completes, sync it:
```javascript
paymentEmail.value = emailAddress.value
```

- [ ] **Step 2: Add phone input (shown when Kaspi selected)**

After the email input, add:

```html
<div v-if="isKZ && showKaspiPhoneInput" class="mb-4">
  <input
    v-model="kaspiPhone"
    type="tel"
    placeholder="8 700 123 45 67"
    maxlength="11"
    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-custom-main transition-colors"
  />
</div>
```

Add ref:
```javascript
const showKaspiPhoneInput = ref(false)
```

- [ ] **Step 3: Replace `payWithCard` and `payWithKaspi` functions**

```javascript
async function payWithCard() {
  if (isPaymentLoading.value) return
  paymentError.value = ''

  if (!paymentEmail.value || !paymentEmail.value.includes('@')) {
    paymentError.value = isKZ.value ? 'Укажите email' : 'Please enter your email'
    return
  }

  isPaymentLoading.value = true
  capture('quiz_payment_initiated', { method: 'card', selected_plan: selectedPlan.value, discount: discountApplied.value })

  try {
    const plan = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
    const res = await fetch('/api/method/lms.lms.landing_api.landing_create_subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: paymentEmail.value,
        plan: selectedPlan.value === 'annual' ? 'yearly' : selectedPlan.value,
        price: plan.rawPrice,
        payment_method: 'polar',
        discount_applied: discountApplied.value,
      }),
    })
    const data = await res.json()
    const result = data.message || data

    if (result.status === 'redirect' && result.checkout_url) {
      window.location.href = result.checkout_url
    } else if (result.status === 'error') {
      paymentError.value = result.message
    } else {
      paymentError.value = isKZ.value ? 'Ошибка оплаты. Попробуйте позже.' : 'Payment error. Please try again.'
    }
  } catch (e) {
    paymentError.value = isKZ.value ? 'Ошибка соединения. Попробуйте позже.' : 'Connection error. Please try again.'
  } finally {
    isPaymentLoading.value = false
  }
}

async function payWithKaspi() {
  if (isPaymentLoading.value) return
  paymentError.value = ''

  if (!paymentEmail.value || !paymentEmail.value.includes('@')) {
    paymentError.value = 'Укажите email'
    return
  }

  if (!showKaspiPhoneInput.value) {
    showKaspiPhoneInput.value = true
    return
  }

  if (!kaspiPhone.value || kaspiPhone.value.replace(/\s/g, '').length < 10) {
    paymentError.value = 'Введите номер телефона Kaspi'
    return
  }

  isPaymentLoading.value = true
  capture('quiz_payment_initiated', { method: 'kaspi', selected_plan: selectedPlan.value, discount: discountApplied.value })

  try {
    const plan = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
    const res = await fetch('/api/method/lms.lms.landing_api.landing_create_subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: paymentEmail.value,
        plan: selectedPlan.value === 'annual' ? 'yearly' : selectedPlan.value,
        price: plan.rawPrice,
        payment_method: 'kaspi',
        discount_applied: discountApplied.value,
        phone: kaspiPhone.value.replace(/\s/g, ''),
      }),
    })
    const data = await res.json()
    const result = data.message || data

    if (result.status === 'pending' && result.token) {
      kaspiToken.value = result.token
      showPaymentMethod.value = false
      showKaspiConfirm.value = true
      startKaspiPolling(result.token)
    } else if (result.status === 'error') {
      paymentError.value = result.message
    } else {
      paymentError.value = 'Ошибка оплаты. Попробуйте позже.'
    }
  } catch (e) {
    paymentError.value = 'Ошибка соединения. Попробуйте позже.'
  } finally {
    isPaymentLoading.value = false
  }
}
```

- [ ] **Step 4: Add error display in payment modal**

After the email/phone inputs, before the buttons:

```html
<p v-if="paymentError" class="text-red-500 text-sm text-center mb-3">{{ paymentError }}</p>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: replace payment redirects with API calls, add email/phone inputs"
```

---

### Task 10: Add Kaspi confirmation screen with polling

**Files:**
- Modify: `/home/olga/myworld/Projects/qos-landing/src/components/Quiz.vue`

- [ ] **Step 1: Add Kaspi confirmation overlay in template**

After the abandonment overlay (after line 1034), add:

```html
<!-- Kaspi Confirmation overlay -->
<Transition name="toast">
  <div v-if="showKaspiConfirm" class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-auto">
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-8 shadow-2xl text-center">
      <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
      <img src="/kaspi-logo.svg" alt="Kaspi" class="w-16 h-16 mx-auto mb-4" />
      <h3 class="text-[22px] font-black mb-2">Подтвердите оплату</h3>
      <p class="text-[14px] text-gray-500 mb-6">
        Откройте приложение Kaspi и подтвердите платёж
      </p>
      <div class="flex items-center justify-center gap-2 mb-6">
        <div class="w-2 h-2 bg-custom-main rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-500">{{ kaspiPollMessage }}</span>
      </div>
      <button @click="cancelKaspiPolling" class="text-[14px] text-gray-400 hover:text-gray-600 transition-colors">
        Отменить
      </button>
    </div>
  </div>
</Transition>
```

- [ ] **Step 2: Add polling logic**

```javascript
let kaspiPollInterval = null
const kaspiPollMessage = ref('Ожидание подтверждения...')

function startKaspiPolling(token) {
  let elapsed = 0
  kaspiPollMessage.value = 'Ожидание подтверждения...'

  kaspiPollInterval = setInterval(async () => {
    elapsed += 4
    if (elapsed > 300) { // 5 minutes
      clearInterval(kaspiPollInterval)
      kaspiPollInterval = null
      kaspiPollMessage.value = 'Платёж не получен'
      return
    }

    try {
      const res = await fetch(`/api/method/lms.lms.landing_api.landing_check_payment_status?token=${encodeURIComponent(token)}`)
      const data = await res.json()
      const status = (data.message || data).status

      if (status === 'active') {
        clearInterval(kaspiPollInterval)
        kaspiPollInterval = null
        capture('quiz_payment_success', { method: 'kaspi' })
        window.location.href = '/lms/practice/sat?checkout=success'
      } else if (status === 'failed') {
        clearInterval(kaspiPollInterval)
        kaspiPollInterval = null
        kaspiPollMessage.value = 'Платёж не получен. Попробуйте снова.'
      }
    } catch (e) {
      // Continue polling on network errors
    }
  }, 4000)
}

function cancelKaspiPolling() {
  if (kaspiPollInterval) {
    clearInterval(kaspiPollInterval)
    kaspiPollInterval = null
  }
  showKaspiConfirm.value = false
  showPaymentMethod.value = true
}
```

- [ ] **Step 3: Clean up polling on unmount**

In the existing `onUnmounted`:

```javascript
onUnmounted(() => {
  cleanupLoader()
  if (kaspiPollInterval) {
    clearInterval(kaspiPollInterval)
  }
})
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add Kaspi payment confirmation screen with polling"
```

---

## Chunk 4: Final Wiring + Manual Testing Checklist

### Task 11: Fix plan ID mapping (`annual` → `yearly`)

**Files:**
- Modify: `/home/olga/myworld/Projects/qos-landing/src/components/Quiz.vue`

- [ ] **Step 1: Update plan IDs in computed to match API expectations**

In the `subscriptionPlans` computed, change all `id: 'annual'` to `id: 'yearly'`. Also update `selectedPlan` default:

```javascript
const selectedPlan = ref('quarterly')  // already correct
```

Verify the `v-for` and `selectedPlan` logic still works with `'yearly'` instead of `'annual'`.

- [ ] **Step 2: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "fix: align plan IDs with API (annual → yearly)"
```

---

### Task 12: Manual testing checklist

**LMS Backend:**
- [ ] Run `bench migrate` to apply doctype changes (new fields)
- [ ] Verify Kaspi Settings shows updated default prices (5800/9800/28000)
- [ ] Verify Polar Settings shows new discounted product ID fields
- [ ] Configure discounted product IDs in Polar Settings (user must create products in Polar dashboard first)
- [ ] Place GeoLite2-Country.mmdb in `lms/lms/data/`
- [ ] Test `get_visitor_country` returns correct country for local/VPN IPs
- [ ] Test `landing_create_subscription` with kaspi + valid phone → returns token
- [ ] Test `landing_create_subscription` with polar → returns checkout_url
- [ ] Test price tampering → returns `invalid_price` error
- [ ] Test duplicate subscription → returns `already_subscribed` error
- [ ] Test rate limiting → returns `rate_limited` after 5 attempts

**Landing Frontend:**
- [ ] Load landing → verify country detection fires and caches
- [ ] KZ IP: verify ₸ prices, Kaspi button visible
- [ ] Non-KZ IP: verify $ prices, Kaspi button hidden
- [ ] Trigger abandonment → verify -30% discount applies to displayed prices
- [ ] Pay with Card (KZ) → verify Polar checkout redirect with correct product
- [ ] Pay with Card (non-KZ) → verify Polar checkout redirect
- [ ] Pay with Kaspi → verify phone input appears → submit → Kaspi confirmation screen
- [ ] Kaspi polling → confirm in Kaspi app → verify redirect to LMS
- [ ] Kaspi timeout → verify "Payment not received" message after 5 min
