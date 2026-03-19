# Quiz Funnel Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the quiz funnel into 3 phases (Quiz → Value Showcase → Paywall) by removing one screen, adding 5 new screens, and updating the navigation flow.

**Architecture:** All changes are in a single file: `src/components/Quiz.vue`. The STEPS array, navigation functions, template, data, and animations are all co-located there. New screens follow the exact same patterns as existing ones (template block with `v-else-if`, data arrays, GSAP animation function, entry in the `animators` map).

**Tech Stack:** Vue 3 (Composition API), GSAP, Tailwind CSS, canvas-confetti

**Spec:** `docs/superpowers/specs/2026-03-19-quiz-funnel-redesign.md`

**Rollback:** `git reset --hard pre-redesign`

---

### Task 1: Update STEPS array and navigation

Remove `socialProof` and `prePaywall`, add new step keys. Update all navigation-related code.

**Files:**
- Modify: `src/components/Quiz.vue:704-732` (STEPS, NO_HEADER_STEPS, PROGRESS_MAP, NO_BACK_STEPS)

- [ ] **Step 1: Update STEPS array**

Replace the STEPS array (line 704-717) with:

```javascript
const STEPS = [
  'hook',
  'experience',
  'currentScore',  // conditional — only for "took"
  'targetScore',
  'deadline',
  'pains',
  'dailyTime',
  'anchor',
  'loader',
  'result',
  'featureShowcase',
  'bonuses',
  'socialProofWall',
  'paywall',
]
```

- [ ] **Step 2: Update NO_HEADER_STEPS**

Replace line 720 with:

```javascript
const NO_HEADER_STEPS = ['hook', 'loader', 'result', 'featureShowcase', 'bonuses', 'socialProofWall', 'paywall']
```

- [ ] **Step 3: Update PROGRESS_MAP**

Replace lines 723-732. Remove `socialProof: 35` and `anchor: 90`. Adjust values now that there's one fewer quiz step:

```javascript
const PROGRESS_MAP = {
  experience: 15,
  currentScore: 20,
  targetScore: 30,
  deadline: 45,
  pains: 60,
  dailyTime: 75,
  anchor: 90,
}
```

- [ ] **Step 4: Update NO_BACK_STEPS**

Replace line 764. Disable back on all post-quiz screens:

```javascript
const NO_BACK_STEPS = ['hook', 'experience', 'loader', 'result', 'featureShowcase', 'bonuses', 'socialProofWall', 'paywall']
```

- [ ] **Step 5: Add `hasSeenAbandonment` flag and `selectedPlan` state**

After the `answers` reactive object (line 750), add:

```javascript
const hasSeenAbandonment = ref(false)
const showAbandonment = ref(false)
const selectedPlan = ref('quarterly')
const promoCode = ref('')
```

- [ ] **Step 6: Update `goToPrePaywall` → `goToFeatureShowcase`**

Replace `goToPrePaywall` function (line 1098-1103):

```javascript
function goToFeatureShowcase() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'featureShowcase'
}
```

- [ ] **Step 7: Update Result Card CTA click handler**

In the template, find the Result Card's CTA button (line 648) and change `@click="goToPrePaywall"` to `@click="goToFeatureShowcase"`.

- [ ] **Step 8: Add navigation functions for new screens**

After `goToFeatureShowcase`, add:

```javascript
function goToBonuses() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'bonuses'
}

function goToSocialProofWall() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'socialProofWall'
}

function goToPaywall() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'paywall'
}

function handlePaywallBack() {
  if (!hasSeenAbandonment.value) {
    hasSeenAbandonment.value = true
    showAbandonment.value = true
  } else {
    slideDirection.value = 'backward'
    currentStep.value = 'socialProofWall'
  }
}

function dismissAbandonment() {
  showAbandonment.value = false
}

function goToPlatformWithDiscount() {
  window.location.href = 'https://qos.plus/lms/practice/sat'
}
```

- [ ] **Step 9: Verify the app builds**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`
Expected: Build succeeds (template still references old screens that will be updated in next tasks — some warnings are OK, but no hard errors from JS changes)

- [ ] **Step 10: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "refactor: update STEPS array and navigation for new funnel flow"
```

---

### Task 2: Add Feature Showcase data and personalization logic

Add the hero feature mapping and secondary features data.

**Files:**
- Modify: `src/components/Quiz.vue` (data section, ~line 862-874)

- [ ] **Step 1: Add hero feature mapping**

After the `prePayFeatures` array (line 874), add:

```javascript
// Feature Showcase: hero feature selected by user's primary pain
const PAIN_TO_HERO = {
  math:       { icon: '\u{1F9EE}', title: 'Математический AI-алгоритм', desc: 'Наш собственный алгоритм, обученный на тысячах SAT задач. Видит паттерны твоих ошибок и закрывает пробелы.', stat: 'Средний рост: +120 по Math' },
  reading:    { icon: '\u{1F0CF}', title: 'Vocabulary Flashcards', desc: '2,000+ SAT-слов с интервальным повторением. Система запоминает, какие слова ты знаешь, и фокусируется на пробелах.', stat: '+85 баллов по Reading за 6 недель' },
  time:       { icon: '\u{1F9E0}', title: 'Умный план', desc: 'Адаптивный план, который экономит время. Каждый день — только то, что двигает балл вверх.', stat: 'Экономит до 40% времени на подготовку' },
  strategy:   { icon: '\u{1F9E0}', title: 'Умный план', desc: 'Не знаешь с чего начать? Алгоритм построит маршрут от твоего уровня до цели.', stat: 'Персональный маршрут за 30 секунд' },
  practice:   { icon: '\u{1F4DD}', title: 'Безлимитные Practice Tests', desc: 'Полные пробники SAT с детальным разбором каждого ответа. Практикуйся сколько хочешь.', stat: 'Безлимитный доступ к пробникам' },
  motivation: { icon: '\u{1F4AC}', title: 'Telegram-комьюнити', desc: 'Закрытое сообщество студентов. Эфиры, разборы задач, поддержка менторов — ты не один.', stat: '2,800+ учеников в сообществе' },
}

const ALL_SECONDARY_FEATURES = [
  { key: 'tests', icon: '\u{1F4DD}', title: 'Безлимитные тесты', desc: 'Reading, Writing, Math' },
  { key: 'tracker', icon: '\u{1F4CA}', title: 'Трекер прогресса', desc: 'Рост в реальном времени' },
  { key: 'plan', icon: '\u{1F9E0}', title: 'Умный план', desc: 'Адаптируется каждый день' },
  { key: 'reflection', icon: '\u{1F504}', title: 'Рефлексия', desc: 'Анализ после сессий' },
]

// Map hero titles to secondary keys for deduplication
const HERO_TO_SECONDARY_KEY = {
  'Безлимитные Practice Tests': 'tests',
  'Умный план': 'plan',
}
```

- [ ] **Step 2: Add computed properties for Feature Showcase**

After the `targetMotivation` computed (line 901), add:

```javascript
const heroFeature = computed(() => {
  // Priority order for matching pains
  const priorityOrder = ['math', 'reading', 'time', 'strategy', 'practice', 'motivation']
  const match = priorityOrder.find(p => answers.pains.includes(p))
  return PAIN_TO_HERO[match] || PAIN_TO_HERO['strategy']
})

const secondaryFeatures = computed(() => {
  const heroTitle = heroFeature.value.title
  const excludeKey = HERO_TO_SECONDARY_KEY[heroTitle]
  if (excludeKey) {
    return ALL_SECONDARY_FEATURES.filter(f => f.key !== excludeKey)
  }
  return ALL_SECONDARY_FEATURES
})
```

- [ ] **Step 3: Add subscription plans data**

After the computed properties, add:

```javascript
const subscriptionPlans = [
  { id: 'monthly', label: '1 месяц', perMonth: '5 800 ₸/мес', price: '5 800', oldPrice: null, badge: null },
  { id: 'quarterly', label: '3 месяца', perMonth: '3 267 ₸/мес', price: '9 800', oldPrice: '17 400', badge: 'Самый популярный' },
  { id: 'annual', label: '12 месяцев', perMonth: '2 333 ₸/мес', price: '28 000', oldPrice: '69 600', discount: '-60%' },
]
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add feature showcase data, personalization logic, and plan pricing"
```

---

### Task 3: Remove old Social Proof and Pre-Paywall template blocks

Remove the template HTML for screens that no longer exist.

**Files:**
- Modify: `src/components/Quiz.vue` (template section)

- [ ] **Step 1: Remove Social Proof Break template**

Delete the entire `<!-- ========== SCREEN 4: SOCIAL PROOF BREAK ========== -->` block (lines 226-281 approximately — the `v-else-if="currentStep === 'socialProof'"` div and all its contents).

- [ ] **Step 2: Remove Pre-Paywall template**

Delete the entire `<!-- ========== SCREEN 11: PRE-PAYWALL ========== -->` block (lines 658-684 approximately — the `v-else-if="currentStep === 'prePaywall'"` div and all its contents).

- [ ] **Step 3: Remove unused refs and animation functions**

Remove these refs: `proofTitle`, `proofCounters`, `proofReview`, `proofCta`, `counter89`, `counter150`, `counter49`, `prePayTitle`, `prePaySub`, `prePayCards`, `prePayCta`.

Remove these functions: `animateSocialProof`, `animatePrePaywall`.

Remove their entries from the `animators` map in `onStepEnter` (the `socialProof: animateSocialProof` and `prePaywall: animatePrePaywall` lines).

Remove the `prePayFeatures` array.

- [ ] **Step 4: Verify build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "refactor: remove old Social Proof Break and Pre-Paywall screens"
```

---

### Task 4: Add Feature Showcase screen template and animation

**Files:**
- Modify: `src/components/Quiz.vue` (template + script)

- [ ] **Step 1: Add Feature Showcase template**

After the Result screen's closing `</div>`, add the new screen. Follow the exact same patterns as existing screens (centered layout, `opacity-0` elements for GSAP entrance, btn-3d for CTA):

```html
<!-- ========== SCREEN 11: FEATURE SHOWCASE ========== -->
<div v-else-if="currentStep === 'featureShowcase'" key="featureShowcase" class="step-content">
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20">
    <h2 ref="featTitle" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2 opacity-0">
      Вот что тебя ждёт внутри
    </h2>
    <p ref="featSub" class="text-gray-500 text-center mb-8 opacity-0">
      Персонально под твою цель — {{ answers.targetScore || 1300 }}+
    </p>

    <!-- Hero feature -->
    <div ref="featHero" class="w-full max-w-lg rounded-2xl p-5 mb-4 opacity-0"
         style="background: linear-gradient(145deg, #0A1028, #082CAE); color: white;">
      <div class="text-xs uppercase tracking-widest text-custom-input font-bold mb-2">⭐ Главное для тебя</div>
      <h3 class="text-lg font-bold mb-2">{{ heroFeature.title }}</h3>
      <p class="text-sm text-white/70 leading-relaxed mb-3">{{ heroFeature.desc }}</p>
      <span class="inline-block bg-white/15 text-custom-gold text-xs font-semibold px-3 py-1.5 rounded-full">
        {{ heroFeature.stat }}
      </span>
    </div>

    <!-- Secondary features grid -->
    <div ref="featGrid" class="grid grid-cols-2 gap-2 max-w-lg w-full mb-8">
      <div v-for="feat in secondaryFeatures" :key="feat.key"
           class="bg-custom-input-fill rounded-2xl p-4 opacity-0">
        <span class="text-2xl mb-1 block">{{ feat.icon }}</span>
        <h4 class="font-bold text-sm text-gray-900 mb-0.5">{{ feat.title }}</h4>
        <p class="text-xs text-custom-input-text">{{ feat.desc }}</p>
      </div>
    </div>

    <div ref="featCta" class="opacity-0">
      <button class="btn-3d !text-base md:!text-lg !px-10 !py-4" @click="goToBonuses">Продолжить &rarr;</button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add refs**

In the refs section, add:

```javascript
const featTitle = ref(null)
const featSub = ref(null)
const featHero = ref(null)
const featGrid = ref(null)
const featCta = ref(null)
```

- [ ] **Step 3: Add animation function**

```javascript
function animateFeatureShowcase() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(featTitle.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(featSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.06)
    .fromTo(featHero.value, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, 0.12)

  const cards = featGrid.value.querySelectorAll('[class*="bg-custom-input-fill"]')
  tl.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
    0.25
  )
  tl.fromTo(featCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.5)
  return tl
}
```

- [ ] **Step 4: Register in animators map**

Add `featureShowcase: animateFeatureShowcase,` to the `animators` object in `onStepEnter`.

- [ ] **Step 5: Verify build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add Feature Showcase screen with personalized hero feature"
```

---

### Task 5: Add Bonuses screen template and animation

**Files:**
- Modify: `src/components/Quiz.vue` (template + script)

- [ ] **Step 1: Add Bonuses template**

After the Feature Showcase screen's closing `</div>`, add:

```html
<!-- ========== SCREEN 12: BONUSES ========== -->
<div v-else-if="currentStep === 'bonuses'" key="bonuses" class="step-content">
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20">
    <h2 ref="bonusTitle" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2 opacity-0">
      А ещё ты получишь
    </h2>
    <p ref="bonusSub" class="text-gray-500 text-center mb-8 opacity-0">
      Бонусы к подписке — бесплатно
    </p>

    <!-- Hero bonus: Community -->
    <div ref="bonusHero" class="w-full max-w-lg rounded-2xl p-5 mb-4 flex items-start gap-3 opacity-0"
         style="background: linear-gradient(145deg, #082CAE, #0B237B); color: white;">
      <span class="text-3xl flex-shrink-0">💬</span>
      <div>
        <h3 class="text-base font-bold mb-1">Telegram-комьюнити</h3>
        <span class="inline-block bg-white/15 text-custom-gold text-[10px] font-semibold px-2 py-0.5 rounded-lg mb-2">Навсегда</span>
        <p class="text-sm text-white/70 leading-relaxed">Закрытое сообщество. Эфиры, разборы задач, гайды по поступлению в топ-вузы мира, Q&A с менторами.</p>
      </div>
    </div>

    <!-- Secondary bonuses -->
    <div ref="bonusGrid" class="grid grid-cols-2 gap-2 max-w-lg w-full mb-4">
      <div class="border border-gray-100 rounded-2xl p-4 text-center bg-white opacity-0">
        <span class="text-2xl block mb-1">🃏</span>
        <h4 class="font-bold text-sm">Flashcards</h4>
        <p class="text-xs text-custom-input-text">2,000+ SAT-слов</p>
      </div>
      <div class="border border-gray-100 rounded-2xl p-4 text-center bg-white opacity-0">
        <span class="text-2xl block mb-1">📋</span>
        <h4 class="font-bold text-sm">Practice Tests</h4>
        <p class="text-xs text-custom-input-text">Полные пробники SAT</p>
      </div>
      <div class="border border-gray-100 rounded-2xl p-4 text-center bg-white opacity-0">
        <span class="text-2xl block mb-1">🎯</span>
        <h4 class="font-bold text-sm">Личный план</h4>
        <p class="text-xs text-custom-input-text">Под твой уровень и цель</p>
      </div>
      <div class="border border-gray-100 rounded-2xl p-4 text-center bg-white opacity-0">
        <span class="text-2xl block mb-1">🔄</span>
        <h4 class="font-bold text-sm">Рефлексия</h4>
        <p class="text-xs text-custom-input-text">Анализ после занятий</p>
      </div>
    </div>

    <p ref="bonusValue" class="text-xs text-custom-input-text mb-6 opacity-0">
      Ценность бонусов: <strong class="text-gray-900">~50 000 ₸</strong>
    </p>

    <div ref="bonusCta" class="opacity-0">
      <button class="btn-3d !text-base md:!text-lg !px-10 !py-4" @click="goToSocialProofWall">Продолжить &rarr;</button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add refs**

```javascript
const bonusTitle = ref(null)
const bonusSub = ref(null)
const bonusHero = ref(null)
const bonusGrid = ref(null)
const bonusValue = ref(null)
const bonusCta = ref(null)
```

- [ ] **Step 3: Add animation function**

```javascript
function animateBonuses() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(bonusTitle.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(bonusSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.06)
    .fromTo(bonusHero.value, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, 0.12)

  const cards = bonusGrid.value.querySelectorAll('[class*="border"]')
  tl.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
    0.25
  )
  tl.fromTo(bonusValue.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.5)
  tl.fromTo(bonusCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.55)
  return tl
}
```

- [ ] **Step 4: Register in animators map**

Add `bonuses: animateBonuses,` to the `animators` object.

- [ ] **Step 5: Verify build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add Bonuses screen with community hero and bonus grid"
```

---

### Task 6: Add Social Proof Wall screen template and animation

**Files:**
- Modify: `src/components/Quiz.vue` (template + script)

- [ ] **Step 1: Add Social Proof Wall template**

After the Bonuses screen's closing `</div>`, add:

```html
<!-- ========== SCREEN 13: SOCIAL PROOF WALL ========== -->
<div v-else-if="currentStep === 'socialProofWall'" key="socialProofWall" class="step-content">
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20">
    <h2 ref="spwTitle" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 opacity-0">
      Они уже это сделали
    </h2>

    <!-- Metrics -->
    <div ref="spwMetrics" class="flex w-full max-w-lg bg-custom-blue rounded-2xl p-4 mb-6 opacity-0">
      <div class="flex-1 text-center border-r border-custom-blue-dark">
        <div class="text-2xl font-extrabold text-custom-main"><span ref="spwCounter89">0</span>%</div>
        <div class="text-[10px] text-custom-input-text mt-1">достигают цели</div>
      </div>
      <div class="flex-1 text-center border-r border-custom-blue-dark">
        <div class="text-2xl font-extrabold text-custom-main">+<span ref="spwCounter150">0</span></div>
        <div class="text-[10px] text-custom-input-text mt-1">средний рост</div>
      </div>
      <div class="flex-1 text-center">
        <div class="text-2xl font-extrabold text-custom-gold-dark">★ <span ref="spwCounter49">0</span></div>
        <div class="text-[10px] text-custom-input-text mt-1">оценка</div>
      </div>
    </div>

    <!-- Reviews -->
    <div ref="spwReviews" class="w-full max-w-lg space-y-2 mb-6">
      <div class="bg-custom-input-fill rounded-2xl p-4 opacity-0">
        <div class="text-custom-orange text-xs mb-1">★★★★★</div>
        <p class="text-sm text-gray-700 italic leading-relaxed">&laquo;1180 &rarr; 1420 за 2.5 месяца. Каждый день по 40 минут — и результат&raquo;</p>
        <p class="text-xs text-custom-input-text mt-2">Алихан, Алматы · <strong class="text-custom-correct">+240 баллов</strong></p>
      </div>
      <div class="bg-custom-input-fill rounded-2xl p-4 opacity-0">
        <div class="text-custom-orange text-xs mb-1">★★★★★</div>
        <p class="text-sm text-gray-700 italic leading-relaxed">&laquo;Родители не верили, а я сдала на 1510. Спасибо QOS PLUS!&raquo;</p>
        <p class="text-xs text-custom-input-text mt-2">Дана, Алматы · <strong class="text-custom-correct">1510 баллов</strong></p>
      </div>
      <div class="bg-custom-input-fill rounded-2xl p-4 opacity-0">
        <div class="text-custom-orange text-xs mb-1">★★★★★</div>
        <p class="text-sm text-gray-700 italic leading-relaxed">&laquo;С 1050 до 1340. Самое полезное — ежедневные мини-тесты&raquo;</p>
        <p class="text-xs text-custom-input-text mt-2">Амина, Шымкент · <strong class="text-custom-correct">+290 баллов</strong></p>
      </div>
    </div>

    <div ref="spwFooter" class="text-center bg-custom-blue rounded-xl px-6 py-3 mb-6 opacity-0">
      <span class="text-sm font-semibold text-custom-main">2,800+ учеников уже на платформе</span>
    </div>

    <div ref="spwCta" class="text-center opacity-0">
      <button class="btn-3d !text-base md:!text-lg !px-10 !py-4" @click="goToPaywall">Продолжить &rarr;</button>
      <p class="text-xs text-custom-input-text mt-3">Без обязательств, отмени в любой момент</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add refs**

```javascript
const spwTitle = ref(null)
const spwMetrics = ref(null)
const spwCounter89 = ref(null)
const spwCounter150 = ref(null)
const spwCounter49 = ref(null)
const spwReviews = ref(null)
const spwFooter = ref(null)
const spwCta = ref(null)
```

- [ ] **Step 3: Add animation function with animated counters**

```javascript
function animateSocialProofWall() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(spwTitle.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(spwMetrics.value, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, 0.1)

  // Animated counters
  const c89 = { val: 0 }
  tl.to(c89, {
    val: 89, duration: 1, ease: 'power2.out',
    onUpdate: () => { if (spwCounter89.value) spwCounter89.value.textContent = Math.round(c89.val) }
  }, 0.15)
  const c150 = { val: 0 }
  tl.to(c150, {
    val: 150, duration: 1, ease: 'power2.out',
    onUpdate: () => { if (spwCounter150.value) spwCounter150.value.textContent = Math.round(c150.val) }
  }, 0.23)
  const c49 = { val: 0 }
  tl.to(c49, {
    val: 4.9, duration: 1, ease: 'power2.out',
    onUpdate: () => { if (spwCounter49.value) spwCounter49.value.textContent = c49.val.toFixed(1) }
  }, 0.31)

  const reviewCards = spwReviews.value.querySelectorAll('[class*="bg-custom-input-fill"]')
  tl.fromTo(reviewCards,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
    0.4
  )
  tl.fromTo(spwFooter.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.65)
  tl.fromTo(spwCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.75)
  return tl
}
```

- [ ] **Step 4: Register in animators map**

Add `socialProofWall: animateSocialProofWall,`

- [ ] **Step 5: Verify build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add Social Proof Wall with animated counters and reviews"
```

---

### Task 7: Add Paywall screen template, styles, and animation

**Files:**
- Modify: `src/components/Quiz.vue` (template + script + style)

- [ ] **Step 1: Add Paywall template**

After the Social Proof Wall screen's closing `</div>`, add:

```html
<!-- ========== SCREEN 14: PAYWALL ========== -->
<div v-else-if="currentStep === 'paywall'" key="paywall" class="step-content">
  <div class="min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-16">
    <div class="w-full max-w-lg">

      <h2 ref="pwTitle" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2 opacity-0">
        Твой план подготовки к {{ answers.targetScore || 1300 }}+ готов
      </h2>
      <p ref="pwSub" class="text-sm font-semibold text-custom-main text-center mb-4 opacity-0">
        Начни сегодня — увидишь рост через неделю
      </p>

      <!-- Badges -->
      <div ref="pwBadges" class="flex justify-center gap-5 mb-3 opacity-0">
        <div class="flex items-center gap-1">
          <span class="text-custom-gold-dark text-lg">{</span>
          <div>
            <div class="text-sm font-extrabold">2,800+</div>
            <div class="text-[10px] text-custom-input-text">учеников</div>
          </div>
          <span class="text-custom-gold-dark text-lg">}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-custom-gold-dark text-lg">{</span>
          <div>
            <div class="text-sm font-extrabold">4.9 ★</div>
            <div class="text-[10px] text-custom-input-text">оценка</div>
          </div>
          <span class="text-custom-gold-dark text-lg">}</span>
        </div>
      </div>

      <p ref="pwNoCommit" class="text-xs text-custom-input-text text-center mb-5 opacity-0">
        Без обязательств, отмени в любой момент
      </p>

      <!-- Plan cards -->
      <div ref="pwPlans" class="space-y-3 mb-4">
        <div v-for="plan in subscriptionPlans" :key="plan.id"
             class="paywall-plan"
             :class="{ 'paywall-plan-selected': selectedPlan === plan.id }"
             @click="selectedPlan = plan.id">
          <div v-if="plan.badge" class="paywall-plan-badge">{{ plan.badge }}</div>
          <div v-if="plan.discount" class="paywall-discount-badge">{{ plan.discount }}</div>
          <div class="paywall-radio" :class="{ 'paywall-radio-active': selectedPlan === plan.id }">
            <span v-if="selectedPlan === plan.id" class="paywall-radio-dot"></span>
          </div>
          <div class="flex-1">
            <div class="font-bold text-base">{{ plan.label }}</div>
            <div class="text-xs text-custom-input-text">{{ plan.perMonth }}</div>
          </div>
          <div class="text-right">
            <div v-if="plan.oldPrice" class="text-xs text-custom-input-text line-through">{{ plan.oldPrice }} ₸</div>
            <div class="text-lg font-extrabold">{{ plan.price }} <span class="text-sm font-medium">₸</span></div>
          </div>
        </div>
      </div>

      <!-- Promo code -->
      <div ref="pwPromo" class="flex gap-2 mb-0 opacity-0">
        <input v-model="promoCode" class="flex-1 border-2 border-custom-inactive rounded-xl px-4 py-3 text-sm outline-none focus:border-custom-main transition-colors" placeholder="Промокод">
        <button class="bg-custom-main text-white font-bold text-sm px-5 rounded-xl" @click="">OK</button>
      </div>

      <div ref="pwCta" class="opacity-0">
        <button class="btn-3d w-full !text-base md:!text-lg !py-4 mt-5" @click="goToPlatform">Продолжить &rarr;</button>
        <p class="text-center text-xs text-custom-input-text mt-2">Безопасная оплата через Polar.sh</p>
        <p class="text-center mt-4">
          <a href="https://qos.plus/login" class="text-sm text-custom-main font-medium hover:underline">Уже оплатил?</a>
        </p>
      </div>

    </div>

    <!-- Transaction Abandonment overlay -->
    <Transition name="toast">
      <div v-if="showAbandonment" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="dismissAbandonment">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-2xl">
          <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
          <h3 class="text-xl font-extrabold text-center mb-1">Подожди! 🎁</h3>
          <p class="text-sm text-custom-input-text text-center mb-5">Специальное предложение — только сейчас</p>

          <div class="border-2 border-custom-main bg-custom-blue rounded-2xl p-4 text-center mb-3">
            <span class="inline-block bg-custom-correct text-white text-xs font-bold px-3 py-1 rounded-lg mb-2">-30% на год</span>
            <div class="text-xs text-custom-input-text line-through">28 000 ₸</div>
            <div class="text-2xl font-extrabold text-custom-main">19 600 <span class="text-sm font-medium">₸/год</span></div>
            <div class="text-xs text-custom-input-text mt-1">1 633 ₸/мес · экономия 8 400 ₸</div>
          </div>

          <div class="paywall-plan mb-4">
            <div class="paywall-radio"></div>
            <div class="flex-1">
              <div class="font-bold text-base">3 месяца</div>
              <div class="text-xs text-custom-input-text">без скидки</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-extrabold">9 800 <span class="text-sm font-medium">₸</span></div>
            </div>
          </div>

          <button class="btn-3d w-full !text-base !py-4" @click="goToPlatformWithDiscount">Забрать скидку &rarr;</button>
          <p class="text-center text-sm text-custom-main font-medium mt-4 cursor-pointer" @click="goToPlatform">
            Нет, спасибо — перейти на платформу
          </p>
        </div>
      </div>
    </Transition>

  </div>
</div>
```

- [ ] **Step 2: Add refs**

```javascript
const pwTitle = ref(null)
const pwSub = ref(null)
const pwBadges = ref(null)
const pwNoCommit = ref(null)
const pwPlans = ref(null)
const pwPromo = ref(null)
const pwCta = ref(null)
```

- [ ] **Step 3: Add animation function**

```javascript
function animatePaywall() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(pwTitle.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(pwSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.06)
    .fromTo(pwBadges.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.12)
    .fromTo(pwNoCommit.value, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.18)

  const plans = pwPlans.value.querySelectorAll('.paywall-plan')
  tl.fromTo(plans,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
    0.22
  )
  tl.fromTo(pwPromo.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.45)
  tl.fromTo(pwCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.5)
  return tl
}
```

- [ ] **Step 4: Register in animators map**

Add `paywall: animatePaywall,`

- [ ] **Step 5: Add paywall CSS styles**

In the `<style scoped>` section, add:

```css
/* Paywall plan cards */
.paywall-plan {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px solid #EFF1F3;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.paywall-plan:hover {
  border-color: #D8E6F4;
}
.paywall-plan-selected {
  border-color: #082CAE;
  background: #EDF3FA;
}
.paywall-plan-badge {
  position: absolute;
  top: -11px;
  left: 18px;
  background: #082CAE;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 8px;
}
.paywall-discount-badge {
  position: absolute;
  top: 12px;
  right: 14px;
  background: #339114;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
}
.paywall-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #D8E6F4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.paywall-radio-active {
  border-color: #082CAE;
  background: #082CAE;
}
.paywall-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
```

- [ ] **Step 6: Wire up back button for transaction abandonment**

In the `goBack` function, add a check at the top:

```javascript
function goBack() {
  if (isAnimating.value) return
  // Transaction abandonment on paywall
  if (currentStep.value === 'paywall') {
    handlePaywallBack()
    return
  }
  isAnimating.value = true
  slideDirection.value = 'backward'
  const prev = getPrevStep(currentStep.value)
  currentStep.value = prev
}
```

- [ ] **Step 7: Verify build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`

- [ ] **Step 8: Manually test the full flow in browser**

Run: `cd /Users/sweamy/projects/qos-landing && npm run dev`

Walk through all 14 screens. Verify:
- Quiz screens 1-8 work as before
- Loader completes and goes to Result
- Result CTA goes to Feature Showcase (not old prePaywall)
- Feature Showcase shows personalized hero based on pains
- Bonuses screen shows community + grid
- Social Proof Wall shows animated counters
- Paywall shows plans, radio selection works
- Back button on paywall triggers abandonment overlay (once)
- All CTAs redirect to qos.plus

- [ ] **Step 9: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "feat: add Paywall screen with pricing, transaction abandonment, and plan styles"
```

---

### Task 8: Final cleanup

Remove any leftover references to old screens.

**Files:**
- Modify: `src/components/Quiz.vue`

- [ ] **Step 1: Search for dead references**

Search for any remaining references to `socialProof`, `prePaywall`, `goToPrePaywall`, `prePayFeatures` in the file. Remove any that remain.

- [ ] **Step 2: Verify full build**

Run: `cd /Users/sweamy/projects/qos-landing && npm run build`
Expected: Clean build, no warnings about unused variables

- [ ] **Step 3: Run dev server and test entire flow end-to-end**

Run: `cd /Users/sweamy/projects/qos-landing && npm run dev`

Test the complete flow from Hook to Paywall. Verify all animations, transitions, and CTAs work correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/Quiz.vue
git commit -m "chore: remove dead references to old socialProof and prePaywall screens"
```
