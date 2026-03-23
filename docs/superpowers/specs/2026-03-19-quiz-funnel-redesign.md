# Quiz Funnel Redesign — QOS Landing

## Overview

Redesign the quiz funnel in `Quiz.vue` to improve conversion by adding a value showcase and integrated paywall with pricing. The landing page (`Landing.vue`) is not modified.

## Problem

The current quiz funnel (12 screens) redirects users to `qos.plus` after completion, where they see a paywall. This loses momentum — the user leaves the experience they were engaged with. Additionally, the funnel doesn't showcase platform features, bonuses, or social proof before asking for payment.

## Solution

Restructure the funnel into 3 phases: Quiz (data collection) → Value Showcase (build desire) → Paywall (convert). Remove one redundant screen (Social Proof Break), add 5 new screens (Feature Showcase, Bonuses, Social Proof Wall, Paywall, Transaction Abandonment).

## Target Audience

Kazakh high school students (15-17 years old) preparing for SAT. Parents often make the purchase decision but the student goes through the funnel.

## Monetization Model

Paid-only (no free trial). Three subscription plans:

| Plan | Price | Per month | Discount |
|------|-------|-----------|----------|
| Monthly | 5 800 ₸ | 5 800 ₸ | — |
| Quarterly | 9 800 ₸ | ~3 267 ₸ | -44% |
| Annual | 28 000 ₸ | ~2 333 ₸ | -60% |

Payment via Polar.sh. Promo code support needed.

---

## New Flow: 3 Phases, 15 Screens

### Phase 1: Quiz — Data Collection (8 screens, ~90 sec)

Collect personalization data. Keep existing screens with one removal.

| # | Screen | Status | Notes |
|---|--------|--------|-------|
| 1 | Hook | Keep as-is | "Набери свой максимум на SAT" |
| 2 | Experience | Keep as-is | Beginner / Tried / Took SAT |
| 3 | Current Score | Keep as-is | Conditional: only if "Took SAT". Slider 800-1600 |
| 4 | Target Score | Keep as-is | 1200 / 1300 / 1400 / 1500 with motivation hints |
| 5 | Deadline | Keep as-is | SAT dates + "undecided" + "after august" |
| 6 | Pains | Keep as-is | Multi-select: reading, math, time, strategy, practice, motivation |
| 7 | Daily Time | Keep as-is | 15min / 30min / 1hour / 2hours |
| 8 | Emotional Anchor | Keep as-is | University / Abroad / Scholarship / Self |

**Removed:** Social Proof Break (moved to Phase 2 as Social Proof Wall, where it impacts purchase decision).

### Phase 2: Value Showcase — Build Desire (5 screens)

Show the user what they get before showing the price.

| # | Screen | Status | Purpose |
|---|--------|--------|---------|
| 9 | Loader | Keep as-is | Animated plan creation with checklist, 75% interrupt question, review carousel |
| 10 | Result Card | Keep as-is | Personalized plan summary: current → target score, days until exam, focus areas, daily time, plan features |
| 11 | Feature Showcase | **NEW** | Personalized platform features based on quiz answers |
| 12 | Bonuses | **NEW** | Community, flashcards, practice tests, reflection |
| 13 | Social Proof Wall | **NEW** | Metrics (89%, +150, 4.9★) + student reviews |

#### Screen 11: Feature Showcase

Personalized based on the user's selected pains. One "hero" feature (dark card, prominent) is chosen dynamically. Four secondary features shown in a 2x2 grid below.

**Personalization logic:**

| User's primary pain | Hero feature | Accent |
|---------------------|-------------|--------|
| Math | Математический AI-алгоритм | Pattern detection, +120 Math score |
| Reading | Vocabulary Flashcards | 2,000+ words, spaced repetition |
| Time / Don't know where to start | Умный план | Adaptive daily plan, saves time |
| Lack of practice | Безлимитные Practice Tests | Full mock exams + review |
| Motivation | Telegram-комьюнити | Support, live sessions, mentors |

If multiple pains selected, use the first one in the list above that matches.

**Copy:**
- Title: "Вот что тебя ждёт внутри"
- Subtitle: "Персонально под твою цель — {targetScore}+"
- Hero badge: "⭐ Главное для тебя"
- CTA: "Продолжить →"

**Secondary features (always shown):**
- 📝 Безлимитные тесты — Reading, Writing, Math
- 📊 Трекер прогресса — Рост в реальном времени
- 🧠 Умный план — Адаптируется каждый день
- 🔄 Рефлексия — Анализ после сессий

If the hero feature overlaps with a secondary feature (e.g., hero is "Practice Tests" and it's also in the grid), show only 3 secondary cards instead of 4 — simply omit the duplicate.

#### Screen 12: Bonuses

Frame as "free extras included with subscription" — the user is getting more than they pay for.

**Copy:**
- Title: "А ещё ты получишь"
- Subtitle: "Бонусы к подписке — бесплатно"

**Hero bonus (prominent card):**
- 💬 Telegram-комьюнити
- Badge: "Навсегда" (even after subscription ends)
- Description: Закрытое сообщество. Эфиры, разборы задач, гайды по поступлению в топ-вузы мира, Q&A с менторами.

**Secondary bonuses (2x2 grid):**
- 🃏 Flashcards — 2,000+ SAT-слов
- 📋 Practice Tests — Полные пробники SAT
- 🎯 Личный план — Под твой уровень и цель
- 🔄 Рефлексия — Анализ после занятий

**Price anchor:** "Ценность бонусов: ~50 000 ₸"

CTA: "Продолжить →"

#### Screen 13: Social Proof Wall

Last screen before prices. Maximize trust.

**Metrics row (horizontal, with animated counters):**
- 89% достигают цели
- +150 средний рост
- ★ 4.9 оценка

**Reviews (3 cards, vertically stacked):**

| Text | Author | Result |
|------|--------|--------|
| «1180 → 1420 за 2.5 месяца. Каждый день по 40 минут — и результат» | Алихан, Алматы | +240 баллов |
| «Родители не верили, а я сдала на 1510. Спасибо QOS PLUS!» | Дана, Алматы | 1510 баллов |
| «С 1050 до 1340. Самое полезное — ежедневные мини-тесты» | Амина, Шымкент | +290 баллов |

**Footer:** "2,800+ учеников уже на платформе"

CTA: "Продолжить →"
Sub-CTA: "Без обязательств, отмени в любой момент"

### Phase 3: Paywall — Convert (2 screens)

| # | Screen | Status | Purpose |
|---|--------|--------|---------|
| 14 | Paywall | **NEW** | Pricing plans, promo code, purchase |
| 15 | Transaction Abandonment | **NEW** | Discount offer if user tries to leave |

#### Screen 14: Paywall

Design follows the ielts.gg pattern (clean, minimal, radio-button plan selection).

**Copy:**
- Title: "Твой план подготовки к {targetScore}+ готов"
- Subtitle: "Начни сегодня — увидишь рост через неделю"
- Social badges: "2,800+ учеников" and "4.9 ★ оценка"
- "Без обязательств, отмени в любой момент"

**Plan cards (radio selection):**

| Plan | Label | Per month | Price | Badge |
|------|-------|-----------|-------|-------|
| Monthly | 1 месяц | 5 800 ₸/мес | 5 800 ₸ | — |
| Quarterly | 3 месяца | 3 267 ₸/мес | 9 800 ₸ (was 17 400 ₸) | Самый популярный |
| Annual | 12 месяцев | 2 333 ₸/мес | 28 000 ₸ (was 69 600 ₸) | -60% |

Quarterly pre-selected by default.

**Promo code:** Input field + "OK" button.

**CTA:** "Продолжить →" (yellow 3D button)
**Sub-CTA:** "Безопасная оплата через Polar.sh"
**Link:** "Уже оплатил?"

**On CTA click:** Redirect to `https://qos.plus/lms/practice/sat` (no in-app payment in this iteration — user completes purchase on the platform side).

**"Уже оплатил?" link:** Redirects to `https://qos.plus/login`

#### Screen 15: Transaction Abandonment

Appears as a bottom sheet overlay on the Paywall screen. Triggers when the user presses the browser back button or the quiz's own back button on the paywall screen. Shows at most once per session (tracked via a reactive flag). Note: `beforeunload` is unreliable on mobile browsers, so we do not depend on it.

**Copy:**
- Title: "Подожди! 🎁"
- Subtitle: "Специальное предложение — только сейчас"

**Offer:**
- -30% on annual plan: 28 000 ₸ → 19 600 ₸/год (1 633 ₸/мес)
- Quarterly without discount as price anchor: 9 800 ₸

**CTA:** "Забрать скидку →"
**Exit link:** "Нет, спасибо — перейти на платформу" → redirects to `qos.plus/lms/practice/sat`

---

## Design Guidelines

- Follow existing Quiz.vue design patterns — white background, Inter font, clean cards
- Use QOS design system colors: `#082CAE` (main blue), `#F0E46A` (CTA yellow), `#EDF3FA` (light blue bg), `#F6F6F6` (card bg)
- Yellow 3D button with glare animation for all primary CTAs
- Mobile-first (375px base), responsive up to desktop
- GSAP animations consistent with existing quiz screens (fade-up entrances, staggered cards)
- Paywall plan cards follow ielts.gg style (radio buttons, badges, strikethrough prices)

## Technical Notes

- All new screens are added to `Quiz.vue` — no new components needed
- STEPS array updated with new step keys: `featureShowcase`, `bonuses`, `socialProofWall`, `paywall`, `transactionAbandonment`
- `socialProof` step removed from STEPS array
- Feature Showcase personalization uses existing `answers.pains` array
- Transaction abandonment triggers on back button press (quiz back or browser back) on the paywall screen; shows once per session via `hasSeenAbandonment` flag
- Promo code field is visual-only in this iteration (not wired to backend)
- No analytics in this iteration (PostHog to be added later)
- Payment integration with Polar.sh is out of scope for this iteration — CTA redirects to qos.plus for now

## Out of Scope

- PostHog analytics integration
- Polar.sh payment integration within the landing page
- A/B testing infrastructure
- Landing page changes
- Trial toggle (no free trial model)
