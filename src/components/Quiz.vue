<template>
  <div
    ref="quizContainer"
    class="quiz-page min-h-screen font-sans relative bg-white"
  >

    <!-- Background: Static grid (faint) -->
    <div class="fixed inset-0 z-0 opacity-25 overflow-hidden pointer-events-none">
      <div class="quiz-grid-layer">
        <GridPattern />
      </div>
    </div>

    <!-- Background: Glowing orbs (static, GPU-accelerated) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFDDC1]/50 blur-[80px] will-change-transform" />
      <div class="absolute left-[-10%] bottom-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/50 blur-[80px] will-change-transform" />
    </div>

    <!-- Content container -->
    <div class="relative z-10 max-w-[480px] mx-auto min-h-screen">

    <!-- Floating back button for headerless screens -->
    <button
      v-if="showFloatingBack"
      class="absolute top-5 left-3 z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
      @click="goBack"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <!-- ==================== HEADER (visible on quiz steps only) ==================== -->
    <header
      v-if="showHeader"
      class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div class="px-5 py-3 flex items-center gap-4">
        <!-- Back -->
        <button
          v-if="canGoBack"
          class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700 flex-shrink-0"
          @click="goBack"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div v-else class="w-9 flex-shrink-0"></div>

        <!-- Logo -->
        <svg class="h-7 w-auto text-custom-main flex-shrink-0" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>

        <!-- Progress bar -->
        <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-custom-main rounded-full transition-all duration-700 ease-out"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <!-- Step counter -->
        <span class="text-xs text-gray-400 font-medium flex-shrink-0 tabular-nums">
          {{ progressPercent }}%
        </span>
      </div>
    </header>

    <!-- ==================== SCREENS ==================== -->
    <div class="relative z-10" :class="showHeader ? 'overflow-hidden' : ''">
      <Transition :name="transitionName" mode="out-in" @after-enter="onStepEnter">

        <!-- ========== SCREEN 1: HOOK ========== -->
        <div v-if="currentStep === 'hook'" key="hook" class="step-content">
          <div class="px-5 py-8 min-h-dvh flex flex-col text-center items-center justify-center">
            <!-- Headline -->
            <h1 ref="hookTitle" class="text-[2rem] md:text-4xl lg:text-5xl font-extrabold text-custom-dark leading-[1.1] mb-5 mt-8 opacity-0">
              <span class="inline-block font-black tabular-nums transition-colors duration-200" :style="{ color: hookScoreColor }">{{ hookAnimatedScore }}+</span> на SAT<br>с персональным<br><span class="text-custom-main">ИИ-тьютором</span>
            </h1>

            <!-- Subtitle -->
            <p ref="hookSub" class="text-base md:text-lg text-gray-500 mb-6 md:mb-8 leading-relaxed opacity-0">
              Пройдите тест и мы просканируем твои знания за 5 минут, найдём скрытые пробелы и построим маршрут к ВУЗу мечты.
            </p>

            <!-- Social proof pills -->
            <div ref="hookProof" class="flex items-center gap-4 md:gap-6 mb-8 opacity-0">
              <div class="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <span class="text-amber-400 text-sm">&#9733;</span>
                <span class="text-sm font-semibold text-gray-800">4.9</span>
                <span class="text-xs text-gray-400">оценка</span>
              </div>
              <div class="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <span class="text-custom-main text-sm font-bold">2,800+</span>
                <span class="text-xs text-gray-400">учеников</span>
              </div>
            </div>

            <!-- CTA -->
            <div ref="hookCta" class="pt-4 opacity-0">
              <button class="btn-3d !text-base md:!text-lg !px-10 !py-4" @click="startQuiz">
                Получить план &rarr;
              </button>
              <div class="flex items-center justify-center gap-5 mt-4">
                <span class="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  Абсолютно бесплатный тест
                </span>
                <span class="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  Занимает меньше 5 минут
                </span>
              </div>
            </div>

            <!-- Login link -->
            <div ref="hookLogin" class="mt-8 opacity-0">
              <a href="https://qos.plus/login" class="text-sm text-gray-400 hover:text-custom-main transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-custom-main">
                Уже есть аккаунт? Войти
              </a>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 2: EXPERIENCE ========== -->
        <div v-else-if="currentStep === 'experience'" key="experience" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Какой у тебя опыт с SAT?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Подберем правильный уровень старта
            </p>

            <div ref="experienceCards" class="space-y-3 md:space-y-4">
              <button
                v-for="(option, i) in experienceOptions"
                :key="option.value"
                class="quiz-card w-full text-left opacity-0"
                :class="answers.experience === option.value ? 'quiz-card-selected' : ''"
                :data-index="i"
                @click="selectExperience(option.value)"
              >
                <span class="text-xl w-8 text-center flex-shrink-0">{{ option.icon }}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-base md:text-lg">{{ option.label }}</div>
                  <div class="text-sm text-gray-500 mt-0.5">{{ option.desc }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 2.1: CURRENT SCORE ========== -->
        <div v-else-if="currentStep === 'currentScore'" key="currentScore" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Какой балл был в последний раз?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Примерный результат теста или пробника
            </p>

            <!-- Score display -->
            <div ref="scoreDisplay" class="text-center mb-8 opacity-0">
              <span class="text-6xl md:text-7xl font-bold text-custom-main tabular-nums score-number">
                {{ answers.currentScore }}
              </span>
            </div>

            <!-- Slider -->
            <div ref="scoreSlider" class="px-2 opacity-0">
              <input
                type="range"
                :min="800"
                :max="1600"
                :step="10"
                v-model.number="answers.currentScore"
                class="quiz-slider w-full"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <span>800</span>
                <span>1200</span>
                <span>1600</span>
              </div>
            </div>

            <div ref="scoreCta" class="mt-auto pt-6 flex justify-center opacity-0">
              <button class="quiz-next-btn" @click="goNext">Далее</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 3: TARGET SCORE ========== -->
        <div v-else-if="currentStep === 'targetScore'" key="targetScore" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Какой балл хочешь получить?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Выбери цель — мы построим маршрут
            </p>

            <div ref="targetCards" class="space-y-3">
              <button
                v-for="(option, i) in targetOptions"
                :key="option.value"
                class="target-card w-full opacity-0"
                :class="answers.targetScore === option.value ? 'target-card-selected' : ''"
                :data-index="i"
                @click="selectTarget(option.value)"
              >
                <div class="target-score-num" :class="answers.targetScore === option.value ? 'target-score-num-active' : ''">
                  {{ option.value }}+
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-gray-600 text-sm font-medium">{{ option.desc }}</div>
                </div>
                <div v-if="option.badge" class="target-badge">{{ option.badge }}</div>
              </button>
            </div>

          </div>
        </div>

        <!-- ========== SCREEN 5: DEADLINE ========== -->
        <div v-else-if="currentStep === 'deadline'" key="deadline" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-10">
              Когда планируешь сдавать?
            </h2>

            <div ref="deadlineCards" class="space-y-3 md:space-y-4">
              <button
                v-for="(option, i) in deadlineOptions"
                :key="option.value"
                class="quiz-card w-full text-left opacity-0"
                :class="answers.deadline === option.value ? 'quiz-card-selected' : ''"
                @click="selectDeadline(option)"
              >
                <span class="text-xl w-8 text-center flex-shrink-0">{{ option.icon }}</span>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 text-base md:text-lg">{{ option.label }}</div>
                  <div v-if="option.days" class="text-sm text-custom-main font-medium mt-0.5">
                    До экзамена {{ option.days }} дней
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 6: PAIN POINTS ========== -->
        <div v-else-if="currentStep === 'pains'" key="pains" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Что мешает больше всего?
            </h2>
            <p class="text-gray-500 text-center mb-2">
              Выбери все, что подходит
            </p>

            <!-- Multi-select hint -->
            <div class="flex items-center justify-center gap-2 mb-8 md:mb-10">
              <div class="flex gap-1">
                <span class="w-4 h-4 rounded border-2 border-custom-main bg-custom-blue flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 text-custom-main" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="w-4 h-4 rounded border-2 border-custom-main bg-custom-blue flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 text-custom-main" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="w-4 h-4 rounded border-2 border-gray-200 bg-white"></span>
              </div>
              <span class="text-xs text-gray-400 font-medium">Можно несколько</span>
            </div>

            <div ref="painCards" class="space-y-2">
              <button
                v-for="(option, i) in painOptions"
                :key="option.value"
                class="pain-card w-full text-left opacity-0"
                :class="answers.pains.includes(option.value) ? 'pain-card-selected' : ''"
                @click="togglePain(option.value)"
              >
                <!-- Checkbox -->
                <span class="pain-checkbox flex-shrink-0" :class="answers.pains.includes(option.value) ? 'pain-checkbox-checked' : ''">
                  <svg v-if="answers.pains.includes(option.value)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="text-xl w-8 text-center flex-shrink-0">{{ option.icon }}</span>
                <div class="font-semibold text-gray-900 text-sm leading-tight">{{ option.label }}</div>
              </button>
            </div>

            <!-- Selected count -->
            <Transition name="toast">
              <p v-if="answers.pains.length > 0" class="text-center text-sm text-custom-main font-medium mt-5">
                Выбрано: {{ answers.pains.length }}
              </p>
            </Transition>

            <div class="mt-auto pt-6 flex justify-center">
              <button
                class="quiz-next-btn"
                :class="answers.pains.length === 0 ? 'opacity-40 cursor-not-allowed' : ''"
                :disabled="answers.pains.length === 0"
                @click="goNext"
              >Далее</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 7: TIME PER DAY ========== -->
        <div v-else-if="currentStep === 'dailyTime'" key="dailyTime" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Сколько времени в день готов заниматься?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Честный ответ — реальный план
            </p>

            <div ref="timeCards" class="space-y-3 md:space-y-4">
              <button
                v-for="(option, i) in timeOptions"
                :key="option.value"
                class="quiz-card w-full text-left relative opacity-0"
                :class="answers.dailyTime === option.value ? 'quiz-card-selected' : ''"
                @click="selectTime(option.value)"
              >
                <span class="text-xl w-8 text-center flex-shrink-0">{{ option.icon }}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-base md:text-lg">{{ option.label }}</div>
                  <div class="text-sm text-gray-500 mt-0.5">{{ option.desc }}</div>
                </div>
                <span
                  v-if="option.popular"
                  class="absolute top-3 right-3 text-[10px] md:text-xs font-bold text-custom-main bg-custom-blue px-2.5 py-1 rounded-full"
                >Популярный выбор</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 8: EMOTIONAL ANCHOR ========== -->
        <div v-else-if="currentStep === 'anchor'" key="anchor" class="step-content">
          <div class="px-5 py-8 min-h-[calc(100dvh-56px)] flex flex-col">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Что для тебя изменится с высоким баллом?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Выбери главное
            </p>

            <div ref="anchorCards" class="space-y-3 md:space-y-4">
              <button
                v-for="(option, i) in anchorOptions"
                :key="option.value"
                class="quiz-card w-full text-left opacity-0"
                :class="answers.anchor === option.value ? 'quiz-card-selected' : ''"
                @click="selectAnchor(option.value)"
              >
                <span class="text-xl w-8 text-center flex-shrink-0">{{ option.icon }}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-base md:text-lg">{{ option.label }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 9: LOADER ========== -->
        <div v-else-if="currentStep === 'loader'" key="loader" class="step-content">
          <div class="relative min-h-screen">
            <div class="min-h-screen flex flex-col items-center justify-center px-4 py-6 md:py-10">

            <div class="max-w-md w-full">

              <!-- Pulsing orb with rings -->
              <div ref="loaderSpinner" class="flex justify-center mb-5 md:mb-8 opacity-0">
                <div class="loader-orb-wrap">
                  <div class="loader-ring loader-ring-1"></div>
                  <div class="loader-ring loader-ring-2"></div>
                  <div class="loader-orb">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Animated title letters -->
              <div ref="loaderTitle" class="flex justify-center mb-1.5 opacity-0">
                <div class="loader-letters">
                  <span v-for="(letter, i) in loaderLetters" :key="i"
                    class="loader-letter"
                    :style="{ animationDelay: (i * 0.08) + 's' }"
                  >{{ letter === ' ' ? '\u00A0' : letter }}</span>
                </div>
              </div>

              <!-- Status text -->
              <div ref="loaderStatus" class="text-center mb-5 opacity-0">
                <p class="text-gray-500 text-xs md:text-sm min-h-[20px]">
                  {{ loaderStatusText }}
                </p>
              </div>

              <!-- 75% Interruption popup overlay -->
              <Teleport to="body">
                <Transition name="popup">
                  <div v-if="loaderInterrupted" class="fixed inset-0 z-[100] flex items-center justify-center px-4" @click.self="">
                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                    <div class="popup-card relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-2xl max-w-sm w-full">
                      <div class="w-10 h-10 mx-auto mb-4 rounded-full bg-custom-main/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-custom-main" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-gray-900 font-bold text-base md:text-lg mb-1">
                        Какой раздел подтянуть первым?
                      </p>
                      <p class="text-gray-400 text-xs mb-5">Это поможет нам расставить приоритеты</p>
                      <div class="flex flex-col gap-2.5">
                        <button
                          v-for="opt in interruptOptions"
                          :key="opt.value"
                          class="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all border-2"
                          :class="answers.prioritySection === opt.value
                            ? 'bg-custom-main text-white border-custom-main scale-[0.98]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-custom-main/40 hover:bg-custom-main/5'"
                          @click="answerInterrupt(opt.value)"
                        >{{ opt.label }}</button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </Teleport>

              <!-- Animated progress bar with glow -->
              <div ref="loaderBarWrap" class="mb-4 md:mb-6 opacity-0">
                <div class="loader-bar-track">
                  <div
                    ref="loaderBar"
                    class="loader-bar-fill"
                    style="width: 0%"
                  ></div>
                </div>
                <div class="flex justify-between items-center mt-2 px-0.5">
                  <p class="text-gray-400 text-[11px] tabular-nums font-medium">{{ loaderPercent }}%</p>
                  <p class="text-gray-300 text-[10px] tracking-wide uppercase">подготовка плана</p>
                </div>
              </div>

              <!-- Live checklist -->
              <div ref="loaderChecklist" class="space-y-1.5 md:space-y-2.5 mb-5 md:mb-8 opacity-0">
                <div v-for="(item, i) in loaderChecklistItems" :key="i"
                  class="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-500"
                  :class="loaderPercent >= item.at
                    ? 'bg-white shadow-sm border border-gray-100'
                    : 'opacity-30'"
                >
                  <div class="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    :class="loaderPercent >= item.at
                      ? 'bg-emerald-500'
                      : 'bg-gray-200'"
                  >
                    <svg v-if="loaderPercent >= item.at" class="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-xs md:text-sm transition-colors duration-500"
                    :class="loaderPercent >= item.at ? 'text-gray-800 font-medium' : 'text-gray-400'"
                  >{{ item.text }}</span>
                </div>
              </div>

              <!-- Review carousel -->
              <div ref="loaderReviews" class="opacity-0">
                <Transition name="review-fade" mode="out-in">
                  <div :key="currentReviewIndex" class="flex items-start gap-2.5 bg-white/80 border border-gray-100 rounded-xl px-3 md:px-4 py-3 shadow-sm">
                    <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-custom-main/10 flex items-center justify-center">
                      <span class="text-amber-400 text-[10px] md:text-xs">&#9733;</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-gray-700 text-xs md:text-sm leading-relaxed">
                        &laquo;{{ reviews[currentReviewIndex].text }}&raquo;
                      </p>
                      <p class="text-gray-400 text-[10px] md:text-xs mt-1 font-medium">{{ reviews[currentReviewIndex].author }}</p>
                    </div>
                  </div>
                </Transition>
              </div>

            </div>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 9.5: EMAIL CAPTURE ========== -->
        <div v-else-if="currentStep === 'emailCapture'" key="emailCapture" class="step-content">
          <div class="px-5 pt-14 pb-28 min-h-dvh flex flex-col">
            <h2 ref="emailTitle" class="text-[28px] font-black text-gray-900 text-center leading-tight mb-3 opacity-0">
              Твой результат готов
            </h2>
            <p ref="emailSub" class="text-[15px] text-gray-500 text-center leading-relaxed mb-6 opacity-0">
              Укажи почту, чтобы сохранить результат и получить персональный план подготовки
            </p>
            <div ref="emailForm" class="w-full opacity-0">
              <input
                v-model="emailAddress"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-4 rounded-xl border border-gray-200 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-custom-main focus:ring-1 focus:ring-custom-main/20"
              />
            </div>
          </div>

          <!-- Sticky CTA -->
          <div ref="emailCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
            <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3 text-center">
              <button
                class="btn-3d w-full !text-base !py-4 transition-opacity"
                :class="{ 'opacity-40 pointer-events-none': !isValidEmail }"
                :disabled="!isValidEmail"
                @click="submitEmail"
              >Продолжить &rarr;</button>
              <p class="text-[12px] text-gray-400 mt-2">Добавление почты подтверждает ваше согласие с <a href="/terms" target="_blank" class="underline hover:text-custom-main transition-colors">публичной офертой</a> и <a href="/privacy" target="_blank" class="underline hover:text-custom-main transition-colors">политикой конфиденциальности</a></p>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 10: RESULT ========== -->
        <div v-else-if="currentStep === 'result'" key="result" class="step-content">
          <div class="px-5 pt-14 pb-28 min-h-dvh flex flex-col">

            <!-- Header -->
            <div ref="resultHeader" class="text-center mb-5 opacity-0">
              <h2 class="text-2xl font-bold text-gray-900">Твой персональный план готов</h2>
            </div>

            <!-- SVG Chart: С нами / Без нас -->
            <div ref="resultCard" class="relative mb-4 opacity-0">
              <div class="bg-white rounded-2xl p-4 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <svg class="w-full" viewBox="0 0 460 240" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="resultSystemGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#1E40AF"/>
                      <stop offset="100%" stop-color="#10B981"/>
                    </linearGradient>
                    <filter id="resultLineGlow"><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#1E40AF" flood-opacity="0.4"/></filter>
                    <clipPath id="resultChaosClip"><rect ref="resultChaosClipRect" x="0" y="0" width="0" height="240" /></clipPath>
                  </defs>

                  <!-- Grid lines -->
                  <line x1="30" y1="60" x2="420" y2="60" stroke="#F0F0F5" stroke-width="1"/>
                  <line x1="30" y1="120" x2="420" y2="120" stroke="#F0F0F5" stroke-width="1"/>
                  <line x1="30" y1="180" x2="420" y2="180" stroke="#F0F0F5" stroke-width="1"/>

                  <!-- Chaos path -->
                  <path ref="resultChaosPath" :d="resultChaosPathD" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="8 6" clip-path="url(#resultChaosClip)"/>

                  <!-- System line -->
                  <line ref="resultSystemPath" x1="50" y1="200" x2="340" y2="35" stroke="url(#resultSystemGrad)" stroke-width="3" stroke-linecap="round" stroke-dasharray="380" stroke-dashoffset="380" filter="url(#resultLineGlow)"/>

                  <!-- End dot -->
                  <circle ref="resultEndDot" cx="340" cy="35" r="7" fill="#10B981" opacity="0"/>

                  <!-- Labels -->
                  <g ref="resultBadge" opacity="0">
                    <text x="340" y="22" text-anchor="middle" font-size="13" font-weight="800" fill="#10B981">С нами</text>
                  </g>
                  <g ref="resultChaosLabel" opacity="0">
                    <text :x="resultChaosEnd.x + 12" :y="resultChaosEnd.y + 4" text-anchor="start" font-size="13" font-weight="800" fill="#EF4444">Без нас</text>
                  </g>
                  <g ref="resultChaosEndLabel" opacity="0">
                    <text :x="resultChaosEnd.x - 2" :y="resultChaosEnd.y - 18" text-anchor="end" font-size="10" font-weight="600" fill="#9CA3AF">Потолок</text>
                    <text :x="resultChaosEnd.x - 2" :y="resultChaosEnd.y - 29" text-anchor="end" font-size="11" font-weight="700" fill="#EF4444">~{{ Math.round((answers.currentScore + (answers.targetScore - answers.currentScore) * 0.4) / 50) * 50 }}</text>
                  </g>

                  <!-- Start dot -->
                  <circle cx="50" cy="200" r="4" fill="#F87171" opacity="0.8"/>
                  <!-- Chaos end dot -->
                  <circle ref="resultChaosEndDot" :cx="resultChaosEnd.x" :cy="resultChaosEnd.y" r="5" fill="#DC2626" opacity="0"/>
                </svg>
              </div>

              <!-- Start label -->
              <div ref="resultStartLabel" class="absolute z-10" style="left: -4px; bottom: -12px;">
                <div class="bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl">
                  <span class="block text-[9px] font-semibold text-red-400 tracking-widest uppercase">Старт</span>
                  <span class="block text-lg font-extrabold text-red-600 leading-tight">{{ answers.currentScore }}</span>
                </div>
              </div>

              <!-- Goal label -->
              <div ref="resultEndLabel" class="absolute z-10" style="right: -4px; top: -12px;">
                <div class="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                  <span class="block text-[9px] font-semibold text-emerald-400 tracking-widest uppercase">Цель</span>
                  <span class="block text-lg font-extrabold text-emerald-600 leading-tight">{{ answers.targetScore }}+</span>
                </div>
              </div>
            </div>

            <!-- Score badge -->
            <div ref="resultBadgeEl" class="flex justify-center mb-5 opacity-0">
              <div class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-2 rounded-full border border-emerald-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                +{{ (answers.targetScore || 1300) - answers.currentScore }} баллов
              </div>
            </div>

            <!-- Three compact personalization rows -->
            <div ref="resultRows" class="space-y-2 mb-5 opacity-0">
              <div v-if="daysUntilExam" class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <span class="text-lg">📅</span>
                <span class="text-sm text-gray-700 font-medium">{{ daysUntilExam }} дней до экзамена</span>
              </div>
              <div v-if="answers.pains.length" class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <span class="text-lg">🎯</span>
                <span class="text-sm text-gray-700 font-medium">Фокус: {{ answers.pains.slice(0, 2).map(painLabel).join(', ') }}</span>
              </div>
              <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <span class="text-lg">⏱</span>
                <span class="text-sm text-gray-700 font-medium">{{ timeLabel(answers.dailyTime) }} ежедневных занятий</span>
              </div>
            </div>

            <!-- Motivation -->
            <div ref="resultMotivation" class="bg-custom-blue rounded-xl px-4 py-3 mb-5 opacity-0">
              <p class="text-sm text-custom-main font-medium text-center">{{ anchorMotivation }}</p>
            </div>

            <!-- Social proof -->
            <div ref="resultSocial" class="flex items-center justify-center gap-3 mb-4 opacity-0">
              <div class="flex -space-x-2">
                <div class="w-6 h-6 rounded-full bg-custom-main text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">A</div>
                <div class="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">K</div>
                <div class="w-6 h-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">M</div>
              </div>
              <p class="text-xs text-gray-500"><span class="font-semibold text-gray-700">2,800+ учеников</span> уже занимаются по плану</p>
            </div>


          </div>

          <!-- Sticky CTA -->
          <div ref="resultCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
            <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3 text-center">
              <button class="btn-3d w-full !text-base !py-4" @click="goToFeatureShowcase">
                Начать подготовку &rarr;
              </button>
              <p class="text-xs text-gray-400 mt-2">Бесплатно &middot; Без обязательств</p>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 11: FEATURE SHOWCASE ========== -->
        <div v-else-if="currentStep === 'featureShowcase'" key="featureShowcase" class="step-content">
          <div class="px-5 pt-14 pb-28 min-h-dvh flex flex-col">

            <!-- Title -->
            <h2 ref="featTitle" class="text-[28px] font-black text-gray-900 text-center leading-tight mb-3 opacity-0">
              Как платформа поможет набрать 1500+
            </h2>

            <!-- JHU credential -->
            <div ref="featSub" class="flex flex-col items-center justify-center gap-0 mb-3 opacity-0">
              <img src="/jhu-logo.svg" alt="Johns Hopkins University" class="h-[50px] w-auto" />
              <span class="text-[15px] font-medium text-gray-600 mt-1">Создано студентами Johns Hopkins · Методология College Board</span>
            </div>

            <!-- Hero feature card — green accent -->
            <div ref="featHero" class="feat-hero-card rounded-2xl p-5 mb-4 opacity-0">
              <div class="flex items-start gap-3 mb-2">
                <span class="text-2xl leading-none mt-0.5">🎯</span>
                <h3 class="text-[20px] font-bold text-gray-900 leading-snug">Система знает, где ты теряешь баллы</h3>
              </div>
              <p class="text-[15px] text-gray-500 leading-relaxed mb-3 pl-[42px]">Находит слабые темы и даёт задания именно по ним.</p>
              <div class="pl-[42px]">
                <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[13px] font-bold px-3 py-1.5 rounded-full border border-emerald-100">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  В среднем +240 баллов за 2 месяца
                </span>
              </div>
            </div>

            <!-- Secondary features -->
            <div ref="featGrid" class="space-y-2.5">
              <div class="feat-secondary-card opacity-0">
                <span class="feat-icon">📋</span>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-[15px] text-gray-900 mb-0.5">Твой план на каждый день</h4>
                  <p class="text-[14px] text-gray-500 leading-relaxed">Не нужно думать, что делать. Открыл — задания ждут. 30 минут — и день закрыт.</p>
                </div>
              </div>
              <div class="feat-secondary-card opacity-0">
                <span class="feat-icon">🧠</span>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-[15px] text-gray-900 mb-0.5">Разбор каждой ошибки с AI</h4>
                  <p class="text-[14px] text-gray-500 leading-relaxed">AI не даёт ответ, а ведёт к пониманию. Как репетитор.</p>
                </div>
              </div>
              <div class="feat-secondary-card opacity-0">
                <span class="feat-icon">🃏</span>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-[15px] text-gray-900 mb-0.5">Слово непонятно? Одно нажатие</h4>
                  <p class="text-[14px] text-gray-500 leading-relaxed">Добавь в карточки — AI даст значение. Система напомнит повторить.</p>
                </div>
              </div>
              <div class="feat-secondary-card opacity-0">
                <span class="feat-icon">♾️</span>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-[15px] text-gray-900 mb-0.5">Бесконечная практика</h4>
                  <p class="text-[14px] text-gray-500 leading-relaxed">Вопросы не заканчиваются. База обновляется, уровень подстраивается под тебя.</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Sticky CTA -->
          <div ref="featCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
            <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3">
              <button class="btn-3d w-full !text-base !py-4" @click="goToSocialProofWall">Продолжить &rarr;</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 12: SOCIAL PROOF WALL ========== -->
        <div v-else-if="currentStep === 'socialProofWall'" key="socialProofWall" class="step-content">
          <div class="px-5 pt-14 pb-28 min-h-dvh flex flex-col">
            <h2 ref="spwTitle" class="text-[28px] font-black text-gray-900 text-center leading-tight mb-5 opacity-0">
              Они уже это сделали
            </h2>
            <!-- Metrics row -->
            <div ref="spwMetrics" class="flex gap-2 mb-6 opacity-0">
              <div class="flex-1 text-center bg-white rounded-xl py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="text-2xl font-extrabold text-custom-main"><span ref="spwCounter89">0</span>%</div>
                <div class="text-[11px] text-gray-500 mt-0.5">достигают цели</div>
              </div>
              <div class="flex-1 text-center bg-white rounded-xl py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="text-2xl font-extrabold text-custom-main">+<span ref="spwCounter150">0</span></div>
                <div class="text-[11px] text-gray-500 mt-0.5">средний рост</div>
              </div>
              <div class="flex-1 text-center bg-white rounded-xl py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="text-2xl font-extrabold text-amber-500">★ <span ref="spwCounter49">0</span></div>
                <div class="text-[11px] text-gray-500 mt-0.5">оценка</div>
              </div>
            </div>

            <!-- Reviews — compact vertical list -->
            <div ref="spwReviews" class="space-y-2.5 mb-5 opacity-0">
              <!-- Review 1: Адилет -->
              <div class="bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="flex items-center gap-2.5 mb-2">
                  <img src="/adilet.jpg" alt="Адилет" class="w-9 h-9 rounded-full object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-[14px] text-gray-900 leading-tight">Адилет</p>
                    <div class="text-amber-400 text-[10px] leading-tight">★★★★★</div>
                  </div>
                  <span class="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">1210 → 1540</span>
                </div>
                <p class="text-[13px] text-gray-600 leading-snug">«Занимался по 40 минут в день, даже не напрягался особо. Через 2 месяца — 1540. Сам в шоке.»</p>
              </div>
              <!-- Review 2: Айганым -->
              <div class="bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="flex items-center gap-2.5 mb-2">
                  <img src="/aiganym.png" alt="Айганым" class="w-9 h-9 rounded-full object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-[14px] text-gray-900 leading-tight">Айганым</p>
                    <div class="text-amber-400 text-[10px] leading-tight">★★★★★</div>
                  </div>
                  <span class="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">1240 → 1520</span>
                </div>
                <p class="text-[13px] text-gray-600 leading-snug">«Мне говорили что 1500+ нереально без репетитора. Ну вот, 1520)) Спасибо за разборы ошибок, реально помогло»</p>
              </div>
              <!-- Review 3: Арнур -->
              <div class="bg-white rounded-xl px-4 py-3 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm">
                <div class="flex items-center gap-2.5 mb-2">
                  <img src="/arnur.png" alt="Арнур" class="w-9 h-9 rounded-full object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-[14px] text-gray-900 leading-tight">Арнур</p>
                    <div class="text-amber-400 text-[10px] leading-tight">★★★★★</div>
                  </div>
                  <span class="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">1260 → 1530</span>
                </div>
                <p class="text-[13px] text-gray-600 leading-snug">«Раньше не знал за что браться, тут просто открываешь и делаешь. За 3 месяца с 1260 до 1530 дошёл»</p>
              </div>
            </div>

            <!-- University roller -->
            <div ref="spwUnis" class="mb-4 opacity-0">
              <p class="text-[13px] text-gray-400 text-center mb-3">Наши ученики поступили в:</p>
              <LogoCloud :logos="universities" custom-class="grayscale" />
            </div>
          </div>

          <!-- Sticky CTA -->
          <div ref="spwCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
            <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3 text-center">
              <button class="btn-3d w-full !text-base !py-4" @click="goToQosHub">Продолжить &rarr;</button>
              <p class="text-[12px] text-gray-400 mt-2">Без обязательств, отмени в любой момент</p>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 13: QOS HUB ========== -->
        <div v-else-if="currentStep === 'qosHub'" key="qosHub" class="step-content">
          <div class="px-5 pt-14 pb-28 min-h-dvh flex flex-col">
            <!-- Title -->
            <h2 ref="hubTitle" class="text-[28px] font-black text-gray-900 text-center leading-tight mb-2 opacity-0">
              Окружи себя единомышленниками
            </h2>
            <!-- Subtitle -->
            <div ref="hubSub" class="text-center mb-5 opacity-0">
              <p class="text-[17px] font-semibold text-gray-700 leading-snug mb-1.5">QOS Hub — закрытое комьюнити для тех, кто поступает в топ-вузы мира</p>
              <p class="text-[13px] text-gray-400">Бесплатно при подписке QOS Plus · Навсегда</p>
            </div>

            <!-- Hero block — Telegram-style -->
            <div ref="hubHero" class="rounded-2xl p-5 mb-5 opacity-0" style="background: linear-gradient(145deg, #082CAE, #1E40AF);">
              <!-- Fake chat bubbles -->
              <div class="space-y-2 mb-4">
                <div class="flex items-end gap-2">
                  <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">A</div>
                  <div class="bg-white/15 rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[75%]">
                    <p class="text-[12px] text-white/90">Кто-нибудь знает deadlines для Cornell ED? 🤔</p>
                  </div>
                </div>
                <div class="flex items-end gap-2 justify-end">
                  <div class="bg-white/25 rounded-2xl rounded-br-md px-3.5 py-2 max-w-[75%]">
                    <p class="text-[12px] text-white">1 ноября! Я подавала в прошлом году, могу помочь с эссе 💪</p>
                  </div>
                  <div class="w-7 h-7 rounded-full bg-emerald-400/30 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">D</div>
                </div>
                <div class="flex items-end gap-2">
                  <div class="w-7 h-7 rounded-full bg-amber-400/30 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">M</div>
                  <div class="bg-white/15 rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[75%]">
                    <p class="text-[12px] text-white/90">Новый гайд по стипендиям уже в канале! 🔥</p>
                  </div>
                </div>
              </div>
              <!-- Stats row -->
              <div class="flex gap-2">
                <div class="flex-1 text-center bg-white/10 rounded-xl py-2.5">
                  <div class="text-lg font-extrabold text-white">500+</div>
                  <div class="text-[10px] text-white/60">участников</div>
                </div>
                <div class="flex-1 text-center bg-white/10 rounded-xl py-2.5">
                  <div class="text-lg font-extrabold text-white">50+</div>
                  <div class="text-[10px] text-white/60">статей</div>
                </div>
                <div class="flex-1 text-center bg-white/10 rounded-xl py-2.5">
                  <div class="text-lg font-extrabold text-white">weekly</div>
                  <div class="text-[10px] text-white/60">новый контент</div>
                </div>
              </div>
            </div>

            <!-- What's inside -->
            <div ref="hubCards" class="space-y-2 mb-5">
              <div class="bg-white rounded-xl px-4 py-3.5 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm flex items-center gap-3 opacity-0">
                <span class="text-lg flex-shrink-0">🎤</span>
                <span class="text-[15px] text-gray-800 font-medium">Эфиры с теми, кто уже поступил</span>
              </div>
              <div class="bg-white rounded-xl px-4 py-3.5 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm flex items-center gap-3 opacity-0">
                <span class="text-lg flex-shrink-0">📚</span>
                <span class="text-[15px] text-gray-800 font-medium">Статьи и гайды каждую неделю</span>
              </div>
              <div class="bg-white rounded-xl px-4 py-3.5 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm flex items-center gap-3 opacity-0">
                <span class="text-lg flex-shrink-0">👥</span>
                <span class="text-[15px] text-gray-800 font-medium">Общайся с теми, кто тоже готовится</span>
              </div>
              <div class="bg-white rounded-xl px-4 py-3.5 border border-gray-100 border-b-2 border-b-gray-200 shadow-sm flex items-center gap-3 opacity-0">
                <span class="text-lg flex-shrink-0">🎬</span>
                <span class="text-[15px] text-gray-800 font-medium">Записи всех мероприятий</span>
              </div>
            </div>

            <!-- Accent -->
            <div ref="hubAccent" class="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center mb-4 opacity-0">
              <p class="text-[14px] text-emerald-700 font-semibold">🎁 Подарок при подписке — доступ навсегда, даже если отменишь</p>
            </div>
          </div>

          <!-- Sticky CTA -->
          <div ref="hubCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
            <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3">
              <button class="btn-3d w-full !text-base !py-4" @click="goToPaywall">Продолжить &rarr;</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 14: PAYWALL ========== -->
        <div v-else-if="currentStep === 'paywall'" key="paywall" class="step-content">
          <div class="px-5 pt-14 pb-32 min-h-dvh flex flex-col">

              <h2 ref="pwTitle" class="text-[28px] font-black text-gray-900 text-center leading-tight mb-2 opacity-0">
                {{ paywallTitle }}
              </h2>
              <p ref="pwSub" class="text-[15px] text-gray-500 text-center leading-relaxed mb-5 opacity-0">
                Каждый день без подготовки — минус баллы на экзамене
              </p>

              <!-- Guarantee -->
              <div ref="pwGuarantee" class="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 opacity-0">
                <span class="text-lg">🛡️</span>
                <span class="text-[14px] font-semibold text-emerald-700">Гарантия результата — или вернём деньги</span>
              </div>

              <!-- Plan cards -->
              <div ref="pwPlans" class="space-y-3 mb-4 opacity-0">
                <div v-for="plan in subscriptionPlans" :key="plan.id"
                     class="paywall-plan"
                     :class="{ 'paywall-plan-selected': selectedPlan === plan.id }"
                     @click="selectedPlan = plan.id">
                  <div v-if="plan.badge" class="paywall-plan-badge">{{ plan.badge }}</div>
                  <div class="paywall-radio" :class="{ 'paywall-radio-active': selectedPlan === plan.id }">
                    <span v-if="selectedPlan === plan.id" class="paywall-radio-dot"></span>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-base">{{ plan.label }}</div>
                    <div class="text-xs text-gray-500">{{ plan.perMonth }}</div>
                  </div>
                  <div class="text-right flex items-center gap-1.5">
                    <span v-if="plan.discount" class="inline-block bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">{{ plan.discount }}</span>
                    <div>
                      <div v-if="plan.oldPrice" class="text-xs text-gray-400 line-through">{{ plan.oldPrice }}{{ isKZ ? ' ₸' : '' }}</div>
                      <div class="text-lg font-extrabold">{{ plan.price }}{{ isKZ ? ' ₸' : '' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bonus line -->
              <div ref="pwBonus" class="flex items-center justify-center gap-2 mb-4 opacity-0">
                <span class="text-base">🎁</span>
                <span class="text-[13px] text-gray-600 font-medium">+ QOS Hub — закрытое комьюнити навсегда</span>
              </div>

              <!-- Promo code -->
              <div ref="pwPromo" class="opacity-0">
                <button v-if="!showPromoInput" @click="showPromoInput = true" class="text-[13px] text-custom-main font-medium text-center w-full">
                  Есть промокод?
                </button>
                <div v-else class="flex gap-2">
                  <input v-model="promoCode" class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-custom-main transition-colors" placeholder="Промокод">
                  <button class="bg-custom-main text-white font-bold text-sm px-5 rounded-xl">OK</button>
                </div>
              </div>

            <!-- Sticky CTA -->
            <div ref="pwCta" class="fixed bottom-0 left-0 right-0 z-50 opacity-0">
              <div class="max-w-[480px] mx-auto px-5 pb-6 pt-3 text-center">
                <button class="btn-3d w-full !text-base !py-4" @click="goToPlatform">Продолжить &rarr;</button>
                <p class="text-[12px] text-gray-400 mt-2">Без обязательств, отмени в любой момент</p>
                <p class="mt-3">
                  <a href="https://qos.plus/login" class="text-[13px] text-custom-main font-medium hover:underline">Уже оплатил?</a>
                </p>
              </div>
            </div>

            <!-- Payment Method modal -->
            <Transition name="toast">
              <div v-if="showPaymentMethod" class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-auto" @click.self="showPaymentMethod = false">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-8 shadow-2xl">
                  <button @click="showPaymentMethod = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
                  <h3 class="text-[20px] font-black text-center mb-1">{{ isKZ ? 'Способ оплаты' : 'Payment method' }}</h3>
                  <p class="text-[14px] text-gray-500 text-center mb-4">{{ isKZ ? 'Выбери удобный способ' : 'Choose your preferred method' }}</p>

                  <!-- Email input -->
                  <div class="mb-3">
                    <input
                      v-model="paymentEmail"
                      type="email"
                      placeholder="Email"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-custom-main transition-colors"
                    />
                  </div>

                  <!-- Phone input for Kaspi -->
                  <!-- <div v-if="isKZ && showKaspiPhoneInput" class="mb-3"> -->
                    <div v-if="true" class="mb-3">
                    <input
                      v-model="kaspiPhone"
                      type="tel"
                      placeholder="8 700 123 45 67"
                      maxlength="11"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-custom-main transition-colors"
                    />
                  </div>

                  <!-- Error message -->
                  <p v-if="paymentError" class="text-red-500 text-sm text-center mb-3">{{ paymentError }}</p>

                  <div class="space-y-3">
                    <button @click="payWithCard" :disabled="isPaymentLoading" class="w-full flex items-center gap-4 bg-white border border-gray-200 border-b-2 border-b-gray-200 rounded-xl px-5 py-4 hover:border-custom-main transition-colors disabled:opacity-50">
                      <span class="text-2xl">💳</span>
                      <div class="text-left">
                        <p class="font-bold text-[15px] text-gray-900">{{ isKZ ? 'Картой' : 'Card' }}</p>
                        <p class="text-[12px] text-gray-400">Visa, Mastercard</p>
                      </div>
                      <svg class="w-5 h-5 text-gray-300 ml-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>

                    <!-- v-if="isKZ" -->
                    <button v-if="true" @click="payWithKaspi" :disabled="isPaymentLoading" class="w-full flex items-center gap-4 bg-white border border-gray-200 border-b-2 border-b-gray-200 rounded-xl px-5 py-4 hover:border-custom-main transition-colors disabled:opacity-50">
                      <img src="/kaspi-logo.svg" alt="Kaspi" class="w-8 h-8 object-contain" />
                      <div class="text-left">
                        <p class="font-bold text-[15px] text-gray-900">Kaspi</p>
                        <p class="text-[12px] text-gray-400">Kaspi Pay, QR, перевод</p>
                      </div>
                      <svg class="w-5 h-5 text-gray-300 ml-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Transaction Abandonment overlay -->
            <Transition name="toast">
              <div v-if="showAbandonment" class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-auto" @click.self="dismissAbandonment">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-8 shadow-2xl">
                  <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
                  <h3 class="text-[22px] font-black text-center mb-1">Подожди! 🎁</h3>
                  <p class="text-[14px] text-gray-500 text-center mb-5">Специальное предложение — только сейчас</p>

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

                  <button class="btn-3d w-full !text-base !py-4" @click="goToPlatformWithDiscount">Забрать скидку &rarr;</button>
                  <p class="text-center text-[14px] text-custom-main font-medium mt-4 cursor-pointer" @click="goToPlatform">
                    Нет, спасибо — перейти на платформу
                  </p>
                </div>
              </div>
            </Transition>

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

          </div>
        </div>

      </Transition>
    </div>

    </div><!-- /White card container -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import GridPattern from './ui/GridPattern.vue'
import LogoCloud from './ui/LogoCloud.vue'
import { initPostHog, capture, identify } from '../composables/usePostHog'

const router = useRouter()

// ==================== STEP MANAGEMENT ====================

// Step flow order (string keys for clarity)
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
  'emailCapture',
  'result',
  'featureShowcase',
  'socialProofWall',
  'qosHub',
  'paywall',
]

// Steps that skip the header + progress bar
const NO_HEADER_STEPS = ['hook', 'loader', 'emailCapture', 'result', 'featureShowcase', 'socialProofWall', 'qosHub', 'paywall']

// Progress % mapped per step (excluding hook)
const PROGRESS_MAP = {
  experience: 15,
  currentScore: 20,
  targetScore: 30,
  deadline: 45,
  pains: 60,
  dailyTime: 75,
  anchor: 90,
}

// Debug: jump to any step via ?step=result
const _debugStep = new URLSearchParams(window.location.search).get('step')
const _isDebug = _debugStep && STEPS.includes(_debugStep)

const currentStep = ref(_isDebug ? _debugStep : 'hook')
const slideDirection = ref('forward')
const isAnimating = ref(true) // blocks clicks until entrance animation finishes

// ==================== ANSWERS ====================
const answers = reactive({
  experience: _isDebug ? 'tried' : null,
  currentScore: _isDebug ? 1050 : 1100,
  targetScore: _isDebug ? 1400 : null,
  motivation: null,       // from target score card
  deadline: _isDebug ? 'March 8, 2025' : null,
  deadlineDate: _isDebug ? '2025-06-07' : null,
  pains: _isDebug ? ['reading', 'math'] : [],
  dailyTime: _isDebug ? '1hour' : null,
  anchor: _isDebug ? 'scholarship' : null,
  prioritySection: null,  // from loader interruption
})

const hasSeenAbandonment = ref(false)
const showAbandonment = ref(false)
const selectedPlan = ref('quarterly')
const promoCode = ref('')
const showPromoInput = ref(false)
const showPaymentMethod = ref(false)

// ==================== PAYMENT STATE ====================
const visitorCountry = ref(sessionStorage.getItem('visitor_country') || null)
const discountApplied = ref(false)
const isPaymentLoading = ref(false)
const paymentError = ref('')
const kaspiPhone = ref('')
const kaspiToken = ref(null)
const showKaspiConfirm = ref(false)
const showKaspiPhoneInput = ref(false)
const paymentEmail = ref('')
let kaspiPollInterval = null
const kaspiPollMessage = ref('Ожидание подтверждения...')

// ==================== COMPUTED ====================

const showHeader = computed(() => !NO_HEADER_STEPS.includes(currentStep.value))

const progressPercent = computed(() => PROGRESS_MAP[currentStep.value] || 0)

const transitionName = computed(() =>
  slideDirection.value === 'forward' ? 'slide-left' : 'slide-right'
)

const quizContainer = ref(null)

const NO_BACK_STEPS = ['hook', 'experience', 'loader', 'emailCapture', 'result']

const canGoBack = computed(() => {
  if (NO_BACK_STEPS.includes(currentStep.value)) return false
  return true
})

const showFloatingBack = computed(() => {
  return NO_HEADER_STEPS.includes(currentStep.value) && !NO_BACK_STEPS.includes(currentStep.value)
})

// ==================== OPTIONS DATA ====================

const experienceOptions = [
  { value: 'beginner', icon: '\u{1F331}', label: 'Новичок', desc: 'Еще не начинал подготовку' },
  { value: 'tried', icon: '\u{1F4D8}', label: 'Готовился, но без системы', desc: 'Решал задания самостоятельно' },
  { value: 'took', icon: '\u{1F3AF}', label: 'Уже сдавал SAT', desc: 'Есть результат — хочу поднять балл' },
]

const targetOptions = [
  { value: 1500, desc: 'Ivy League, топ-стипендии', badge: 'TOP' },
  { value: 1400, desc: 'Конкурентное преимущество', badge: null },
  { value: 1300, desc: 'Большинство вузов открыты', badge: null },
  { value: 1200, desc: 'Уверенный фундамент', badge: null },
]

const deadlineOptions = computed(() => {
  const dates = [
    { label: 'SAT — 9 мая 2026', date: '2026-05-09', icon: '\u{1F4C5}' },
    { label: 'SAT — 6 июня 2026', date: '2026-06-06', icon: '\u{1F4C5}' },
    { label: 'SAT — 22 августа 2026', date: '2026-08-22', icon: '\u{1F4C5}' },
  ]
  const today = new Date()
  const specific = dates
    .filter(d => new Date(d.date) > today)
    .map(d => {
      const diff = Math.ceil((new Date(d.date) - today) / (1000 * 60 * 60 * 24))
      return { value: d.label, days: diff, icon: d.icon, label: d.label, date: d.date }
    })

  // "Не определился" first, then specific dates, then "После августа"
  const options = [
    { value: 'undecided', icon: '\u{1F914}', label: 'Еще не определился', days: null, date: null },
    ...specific,
    { value: 'after-august', icon: '\u{1F4C5}', label: 'После августа', days: null, date: null },
  ]
  return options
})

const painOptions = [
  { value: 'reading', icon: '\u{1F4D6}', label: 'Сложные тексты на английском' },
  { value: 'math', icon: '\u{1F4D0}', label: 'Теряю баллы на Math' },
  { value: 'time', icon: '\u{23F0}', label: 'Не хватает времени на подготовку' },
  { value: 'practice', icon: '\u{1F4DD}', label: 'Мало реальной практики' },
  { value: 'motivation', icon: '\u{1F629}', label: 'Сложно держать мотивацию' },
]

const timeOptions = [
  { value: '15min', icon: '\u{26A1}', label: '15 минут', desc: 'Быстрые задания', popular: false },
  { value: '30min', icon: '\u{1F550}', label: '30 минут', desc: 'Одна секция за раз', popular: false },
  { value: '1hour', icon: '\u{1F525}', label: '1 час', desc: 'Полноценная практика', popular: true },
  { value: '2hours', icon: '\u{1F680}', label: '2+ часа', desc: 'Интенсивный режим', popular: false },
]

const anchorOptions = [
  { value: 'university', icon: '\u{1F393}', label: 'Поступлю в университет мечты' },
  { value: 'abroad', icon: '\u{2708}\u{FE0F}', label: 'Уеду учиться за границу' },
  { value: 'scholarship', icon: '\u{1F4B0}', label: 'Получу стипендию' },
  { value: 'self', icon: '\u{1F4AA}', label: 'Докажу себе, что могу' },
]

const interruptOptions = [
  { value: 'reading', label: 'Reading & Writing' },
  { value: 'math', label: 'Math' },
  { value: 'both', label: 'Оба одинаково' },
]

const reviews = [
  { text: '1180 \u2192 1420 за 2.5 месяца. Каждый день по 40 минут — и результат', author: 'Алихан, Алматы' },
  { text: 'Думал Math не вытяну, в итоге 760. Стратегия решает', author: 'Давид, Астана' },
  { text: 'С 1050 до 1340. Самое полезное — ежедневные мини-тесты', author: 'Амина, Шымкент' },
  { text: 'Родители не верили, а я сдала на 1510. Спасибо QOS PLUS!', author: 'Дана, Алматы' },
]

// Loader state
const loaderPercent = ref(0)
const loaderStatusText = ref('')
const loaderInterrupted = ref(false)
const currentReviewIndex = ref(0)
const loaderLetters = computed(() => 'Создаем твой план'.split(''))

const loaderChecklistItems = computed(() => [
  { at: 5, text: `Анализ уровня: ${answers.currentScore} баллов` },
  { at: 25, text: `Маршрут до ${answers.targetScore || 1300}+ баллов` },
  { at: 45, text: `Фокус: ${answers.pains.length ? answers.pains.slice(0, 2).map(painLabel).join(', ') : 'все разделы'}` },
  { at: 65, text: `Темп: ${timeLabel(answers.dailyTime)} в день` },
  { at: 85, text: 'Финальная оптимизация стратегии' },
])
let loaderTween = null
let reviewInterval = null

const planFeatures = [
  'AI-стратегия для ' + (answers.targetScore || 1300) + '+ баллов',
  'Ежедневные задания под твои слабые места',
  'Адаптивные пробные тесты',
  'Мгновенный разбор каждой ошибки',
]

// Feature Showcase: hero feature selected by user's primary pain
const PAIN_TO_HERO = {
  math:       { icon: '🧮', title: 'Математический AI-алгоритм', desc: 'Наш собственный алгоритм, обученный на тысячах SAT задач. Видит паттерны твоих ошибок и закрывает пробелы.', stat: 'Средний рост: +120 по Math' },
  reading:    { icon: '🃏', title: 'Vocabulary Flashcards', desc: '2,000+ SAT-слов с интервальным повторением. Система запоминает, какие слова ты знаешь, и фокусируется на пробелах.', stat: '+85 баллов по Reading за 6 недель' },
  time:       { icon: '🧠', title: 'Умный план', desc: 'Адаптивный план, который экономит время. Каждый день — только то, что двигает балл вверх.', stat: 'Экономит до 40% времени на подготовку' },
  practice:   { icon: '📝', title: 'Безлимитные Practice Tests', desc: 'Полные пробники SAT с детальным разбором каждого ответа. Практикуйся сколько хочешь.', stat: 'Безлимитный доступ к пробникам' },
  motivation: { icon: '💬', title: 'Telegram-комьюнити', desc: 'Закрытое сообщество студентов. Эфиры, разборы задач, поддержка менторов — ты не один.', stat: '2,800+ учеников в сообществе' },
}

const ALL_SECONDARY_FEATURES = [
  { key: 'tests', icon: '📝', title: 'Безлимитные тесты', desc: 'Reading, Writing, Math' },
  { key: 'tracker', icon: '📊', title: 'Трекер прогресса', desc: 'Рост в реальном времени' },
  { key: 'plan', icon: '🧠', title: 'Умный план', desc: 'Адаптируется каждый день' },
  { key: 'reflection', icon: '🔄', title: 'Рефлексия', desc: 'Анализ после сессий' },
]

// Map hero titles to secondary keys for deduplication
const HERO_TO_SECONDARY_KEY = {
  'Безлимитные Practice Tests': 'tests',
  'Умный план': 'plan',
}

const anchorMotivation = computed(() => {
  switch (answers.anchor) {
    case 'university': return '2,800+ учеников уже готовятся к поступлению с QOS PLUS'
    case 'abroad': return 'Ученики QOS PLUS поступают в вузы 12 стран'
    case 'scholarship': return 'Высокий SAT — твой главный аргумент для стипендии'
    case 'self': return '89% наших учеников превышают свою цель'
    default: return '2,800+ учеников уже занимаются на платформе'
  }
})

const daysUntilExam = computed(() => {
  if (!answers.deadlineDate) return null
  const diff = Math.ceil((new Date(answers.deadlineDate) - new Date()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
})

const paywallTitle = computed(() => {
  const target = answers.targetScore || 1300
  if (daysUntilExam.value) {
    return `До ${target}+ осталось ${daysUntilExam.value} дней`
  }
  return `Твой план к ${target}+ готов`
})

const targetMotivation = computed(() => {
  switch (answers.targetScore) {
    case 1200: return 'Четкая цель. За 2-3 месяца реально.'
    case 1300: return 'Крепкий балл. У нас есть стратегия.'
    case 1400: return 'Серьезная заявка. 73% наших учеников с такой целью достигают ее.'
    case 1500: return 'Топ-цель. Мы знаем, как туда добраться.'
    default: return ''
  }
})

const heroFeature = computed(() => {
  // Priority order for matching pains
  const priorityOrder = ['math', 'reading', 'time', 'practice', 'motivation']
  const match = priorityOrder.find(p => answers.pains.includes(p))
  return PAIN_TO_HERO[match] || PAIN_TO_HERO['time']
})

const secondaryFeatures = computed(() => {
  const heroTitle = heroFeature.value.title
  const excludeKey = HERO_TO_SECONDARY_KEY[heroTitle]
  if (excludeKey) {
    return ALL_SECONDARY_FEATURES.filter(f => f.key !== excludeKey)
  }
  return ALL_SECONDARY_FEATURES
})

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
  // USD pricing for non-KZ
  if (discountApplied.value) {
    return [
      { id: 'yearly', label: '12 months', perMonth: '$2.92/mo', price: '$34.99', oldPrice: '$49.99', discount: '-30%', rawPrice: 34.99 },
      { id: 'quarterly', label: '3 months', perMonth: '$3.50/mo', price: '$10.49', oldPrice: '$14.99', discount: '-30%', rawPrice: 10.49 },
      { id: 'monthly', label: '1 month', perMonth: '$5.59/mo', price: '$5.59', oldPrice: '$7.99', discount: '-30%', rawPrice: 5.59 },
    ]
  }
  return [
    { id: 'yearly', label: '12 months', perMonth: '$4.17/mo', price: '$49.99', oldPrice: null, rawPrice: 49.99 },
    { id: 'quarterly', label: '3 months', perMonth: '$5.00/mo', price: '$14.99', oldPrice: null, badge: 'Most popular', rawPrice: 14.99 },
    { id: 'monthly', label: '1 month', perMonth: '$7.99/mo', price: '$7.99', oldPrice: null, rawPrice: 7.99 },
  ]
})

// ==================== NAVIGATION ====================

function getNextStep(from) {
  const idx = STEPS.indexOf(from)
  if (idx === -1) return STEPS[0]
  let next = STEPS[idx + 1]
  // Skip currentScore if not "took"
  if (next === 'currentScore' && answers.experience !== 'took') {
    next = STEPS[idx + 2]
  }
  return next || from
}

function getPrevStep(from) {
  const idx = STEPS.indexOf(from)
  if (idx <= 0) return from
  let prev = STEPS[idx - 1]
  // Skip currentScore going back if not "took"
  if (prev === 'currentScore' && answers.experience !== 'took') {
    prev = STEPS[idx - 2]
  }
  return prev || from
}

function goNext() {
  if (isAnimating.value) return
  if (currentStep.value === 'currentScore') {
    capture('quiz_current_score_set', { current_score: answers.currentScore })
  } else if (currentStep.value === 'pains') {
    capture('quiz_pains_selected', { pains: answers.pains, pains_count: answers.pains.length })
  }
  isAnimating.value = true
  slideDirection.value = 'forward'
  const next = getNextStep(currentStep.value)
  currentStep.value = next
}

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

// ==================== SCREEN ACTIONS ====================

function startQuiz() {
  if (isAnimating.value) return
  capture('quiz_started')
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'experience'
}

function selectExperience(value) {
  if (isAnimating.value) return
  capture('quiz_experience_selected', { experience: value })
  answers.experience = value
  isAnimating.value = true
  setTimeout(() => {
    if (value === 'took') {
      slideDirection.value = 'forward'
      currentStep.value = 'currentScore'
    } else {
      answers.currentScore = 1000
      slideDirection.value = 'forward'
      currentStep.value = 'targetScore'
    }
  }, 350)
}

function selectTarget(value) {
  if (isAnimating.value) return
  capture('quiz_target_selected', { target_score: value })
  answers.targetScore = value
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('targetScore')
  }, 350)
}

function selectDeadline(option) {
  if (isAnimating.value) return
  capture('quiz_deadline_selected', { deadline: option.value, deadline_date: option.date })
  answers.deadline = option.value
  answers.deadlineDate = option.date || null
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('deadline')
  }, 350)
}

function togglePain(value) {
  if (isAnimating.value) return
  const idx = answers.pains.indexOf(value)
  if (idx === -1) {
    answers.pains.push(value)
  } else {
    answers.pains.splice(idx, 1)
  }
}

function selectTime(value) {
  if (isAnimating.value) return
  capture('quiz_daily_time_selected', { daily_time: value })
  answers.dailyTime = value
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('dailyTime')
  }, 350)
}

function selectAnchor(value) {
  if (isAnimating.value) return
  capture('quiz_anchor_selected', { anchor: value })
  answers.anchor = value
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('anchor')
  }, 350)
}

function startLoader() {
  loaderPercent.value = 0
  loaderInterrupted.value = false
  currentReviewIndex.value = 0

  // Review carousel
  reviewInterval = setInterval(() => {
    currentReviewIndex.value = (currentReviewIndex.value + 1) % reviews.length
  }, 3500)

  // Realistic multi-segment progress: bursts, pauses, slowdowns
  const obj = { val: 0 }
  const tl = gsap.timeline({
    onUpdate: () => {
      loaderPercent.value = Math.round(obj.val)
      updateLoaderStatus(obj.val)
      if (loaderBar.value) loaderBar.value.style.width = obj.val + '%'
    },
    onComplete: () => {
      loaderInterrupted.value = true
    }
  })

  // 0→18: fast burst (feels like it starts working immediately)
  tl.to(obj, { val: 18, duration: 1.2, ease: 'power2.out' })
  // 18→26: slow crawl (analyzing...)
    .to(obj, { val: 26, duration: 1.8, ease: 'power1.inOut' })
  // 26→42: medium speed
    .to(obj, { val: 42, duration: 1.5, ease: 'none' })
  // 42→48: stall (feels like heavy computation)
    .to(obj, { val: 48, duration: 1.6, ease: 'power3.in' })
  // 48→63: quick burst again
    .to(obj, { val: 63, duration: 1.0, ease: 'power2.out' })
  // 63→70: slow near the interruption
    .to(obj, { val: 70, duration: 1.4, ease: 'power1.in' })
  // 70→75: crawl to pause point
    .to(obj, { val: 75, duration: 1.5, ease: 'power2.in' })

  loaderTween = tl
}

function updateLoaderStatus(pct) {
  if (pct < 20) loaderStatusText.value = 'Анализируем твой уровень...'
  else if (pct < 40) loaderStatusText.value = `Строим маршрут от ${answers.currentScore} до ${answers.targetScore}...`
  else if (pct < 60) loaderStatusText.value = 'Подбираем задания под твои сложности...'
  else if (pct < 80) loaderStatusText.value = 'Рассчитываем оптимальный темп...'
  else if (pct < 95) loaderStatusText.value = 'Финальные штрихи...'
  else loaderStatusText.value = 'Готово!'
}

function answerInterrupt(value) {
  capture('quiz_priority_section_selected', { priority_section: value })
  answers.prioritySection = value
  loaderInterrupted.value = false

  // Resume progress 75 → 100 with realistic bursts
  const obj = { val: 75 }
  const tl = gsap.timeline({
    onUpdate: () => {
      loaderPercent.value = Math.round(obj.val)
      updateLoaderStatus(obj.val)
      if (loaderBar.value) loaderBar.value.style.width = obj.val + '%'
    },
    onComplete: () => {
      loaderStatusText.value = 'Готово!'
      setTimeout(() => {
        cleanupLoader()
        slideDirection.value = 'forward'
        currentStep.value = 'emailCapture'
      }, 600)
    }
  })

  // 75→88: quick burst (incorporating the answer)
  tl.to(obj, { val: 88, duration: 1.2, ease: 'power2.out' })
  // 88→94: slow (finishing up)
    .to(obj, { val: 94, duration: 1.5, ease: 'power1.inOut' })
  // 94→98: crawl
    .to(obj, { val: 98, duration: 1.0, ease: 'power2.in' })
  // 98→100: final snap
    .to(obj, { val: 100, duration: 0.4, ease: 'power2.out' })

  loaderTween = tl
}

function goToFeatureShowcase() {
  if (isAnimating.value) return
  capture('quiz_result_cta_clicked')
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'featureShowcase'
}

function submitEmail() {
  if (isAnimating.value) return
  capture('quiz_email_submitted', { email: emailAddress.value })
  identify(emailAddress.value)
  paymentEmail.value = emailAddress.value  // Pre-fill for payment modal
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'result'
}

function goToSocialProofWall() {
  if (isAnimating.value) return
  capture('quiz_features_cta_clicked')
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'socialProofWall'
}

function goToQosHub() {
  if (isAnimating.value) return
  capture('quiz_social_proof_cta_clicked')
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'qosHub'
}

function goToPaywall() {
  if (isAnimating.value) return
  capture('quiz_hub_cta_clicked')
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'paywall'
}

function handlePaywallBack() {
  if (!hasSeenAbandonment.value) {
    capture('quiz_paywall_abandonment_shown', { selected_plan: selectedPlan.value })
    hasSeenAbandonment.value = true
    showAbandonment.value = true
  } else {
    capture('quiz_paywall_abandoned')
    slideDirection.value = 'backward'
    currentStep.value = 'socialProofWall'
  }
}

function dismissAbandonment() {
  showAbandonment.value = false
}

function goToPlatformWithDiscount() {
  capture('quiz_discount_accepted')
  showAbandonment.value = false
  discountApplied.value = true
  showPaymentMethod.value = true
}

function goToPlatform() {
  capture('quiz_paywall_cta_clicked', { selected_plan: selectedPlan.value })
  showPaymentMethod.value = true
}

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
        plan: selectedPlan.value,
        price: plan.rawPrice,
        payment_method: 'polar',
        discount_applied: discountApplied.value,
        quiz_answers: {
          experience: answers.experience,
          currentScore: answers.currentScore,
          targetScore: answers.targetScore,
          motivation: answers.motivation,
          deadline: answers.deadline,
          deadlineDate: answers.deadlineDate,
          pains: answers.pains,
          dailyTime: answers.dailyTime,
          anchor: answers.anchor,
          prioritySection: answers.prioritySection,
        },
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

  // First click shows phone input, second click submits
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
    // Kaspi always uses KZT prices regardless of visitor location
    const kaspiPrices = discountApplied.value
      ? { monthly: 4060, quarterly: 6860, yearly: 19600 }
      : { monthly: 5800, quarterly: 9800, yearly: 28000 }
    const res = await fetch('/api/method/lms.lms.landing_api.landing_create_subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: paymentEmail.value,
        plan: selectedPlan.value,
        price: kaspiPrices[selectedPlan.value],
        payment_method: 'kaspi',
        discount_applied: discountApplied.value,
        phone: kaspiPhone.value.replace(/\s/g, ''),
        quiz_answers: {
          experience: answers.experience,
          currentScore: answers.currentScore,
          targetScore: answers.targetScore,
          motivation: answers.motivation,
          deadline: answers.deadline,
          deadlineDate: answers.deadlineDate,
          pains: answers.pains,
          dailyTime: answers.dailyTime,
          anchor: answers.anchor,
          prioritySection: answers.prioritySection,
        },
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

function startKaspiPolling(token) {
  let elapsed = 0
  kaspiPollMessage.value = 'Ожидание подтверждения...'

  kaspiPollInterval = setInterval(async () => {
    elapsed += 4
    if (elapsed > 300) {
      clearInterval(kaspiPollInterval)
      kaspiPollInterval = null
      kaspiPollMessage.value = 'Платёж не получен. Попробуйте снова.'
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

function cleanupLoader() {
  if (loaderTween) { loaderTween.kill(); loaderTween = null }
  if (reviewInterval) { clearInterval(reviewInterval); reviewInterval = null }
}

function painLabel(value) {
  const option = painOptions.find(o => o.value === value)
  return option?.label || value
}

function timeLabel(value) {
  const map = { '15min': '15 минут', '30min': '30 минут', '1hour': '1 час', '2hours': '2+ часа' }
  return map[value] || value
}

// ==================== GSAP ANIMATIONS ====================

// Refs
const hookLogo = ref(null)
const hookTitle = ref(null)
const hookSub = ref(null)
const hookProof = ref(null)
const hookCta = ref(null)
const hookLogin = ref(null)
const hookAnimatedScore = ref(1000)
const hookScoreColor = ref('#EF4444')
const experienceCards = ref(null)
const scoreDisplay = ref(null)
const scoreSlider = ref(null)
const scoreCta = ref(null)
const targetCards = ref(null)
const deadlineCards = ref(null)
const painCards = ref(null)
const timeCards = ref(null)
const anchorCards = ref(null)
const loaderSpinner = ref(null)
const loaderTitle = ref(null)
const loaderBarWrap = ref(null)
const loaderBar = ref(null)
const loaderStatus = ref(null)
const loaderChecklist = ref(null)
const loaderReviews = ref(null)
const emailTitle = ref(null)
const emailSub = ref(null)
const emailForm = ref(null)
const emailCta = ref(null)
const emailAddress = ref('')
const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value))

const resultHeader = ref(null)
const resultCard = ref(null)
const resultChaosClipRect = ref(null)
const resultChaosPath = ref(null)
const resultSystemPath = ref(null)
const resultEndDot = ref(null)
const resultBadge = ref(null)
const resultChaosLabel = ref(null)
const resultChaosEndDot = ref(null)
const resultChaosEndLabel = ref(null)
const resultStartLabel = ref(null)
const resultEndLabel = ref(null)
const resultBadgeEl = ref(null)
const resultRows = ref(null)
const resultMotivation = ref(null)
const resultSocial = ref(null)
const resultCta = ref(null)

const resultChaosPathD = ref('')
const resultChaosEnd = reactive({ x: 360, y: 115 })

const generateResultChaosPath = () => {
  const startX = 50, startY = 200
  const endX = 360, endY = 115
  const totalX = endX - startX
  const totalY = startY - endY

  const systemLineY = (px) => 200 + (35 - 200) * ((px - 50) / (340 - 50))

  const pts = []
  const steps = 50
  const stepSize = totalX / steps
  let prevY = startY

  for (let i = 0; i <= steps; i++) {
    const x = startX + i * stepSize
    const t = i / steps
    let progress
    if (t < 0.2) {
      progress = t * t * 2.5
    } else if (t < 0.65) {
      progress = 0.1 + ((t - 0.2) / 0.45) * 0.6
    } else {
      const tail = (t - 0.65) / 0.35
      progress = 0.7 + tail * 0.3 * (1 - tail * 0.5)
    }
    const baseY = startY - totalY * progress
    const wobbleAmp = Math.sin(t * Math.PI) * 8
    const wobble = Math.sin(t * 20 + i * 0.7) * wobbleAmp * (0.4 + Math.random() * 0.6)
    const noise = (Math.random() - 0.5) * 2
    let y
    if (i === 0) { y = startY }
    else {
      y = baseY + wobble + noise
      const maxDelta = 8
      y = Math.max(prevY - maxDelta, Math.min(prevY + maxDelta, y))
      const minY = systemLineY(x) + 12
      y = Math.max(minY, y)
    }
    prevY = y
    pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10])
  }
  const lastPt = pts[pts.length - 1]
  resultChaosEnd.x = lastPt[0]
  resultChaosEnd.y = lastPt[1]
  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) { d += ` L ${pts[i][0]},${pts[i][1]}` }
  resultChaosPathD.value = d
}

const animateResultChart = () => {
  // Chaos line draws over 2s
  if (resultChaosClipRect.value) {
    const duration = 2000
    const startTime = performance.now()
    let chaosEndShown = false
    const animateClip = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentWidth = eased * 460
      resultChaosClipRect.value?.setAttribute('width', currentWidth.toString())
      if (!chaosEndShown && currentWidth >= resultChaosEnd.x) {
        chaosEndShown = true
        if (resultChaosEndDot.value) {
          resultChaosEndDot.value.style.transition = 'opacity 0.15s ease'
          resultChaosEndDot.value.style.opacity = '1'
        }
      }
      if (progress < 1) requestAnimationFrame(animateClip)
    }
    requestAnimationFrame(animateClip)
  }
  // System line shoots fast
  setTimeout(() => {
    if (resultSystemPath.value) {
      resultSystemPath.value.style.transition = 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      resultSystemPath.value.style.strokeDashoffset = '0'
      setTimeout(() => {
        if (resultEndDot.value) {
          resultEndDot.value.style.transition = 'opacity 0.15s ease'
          resultEndDot.value.style.opacity = '1'
        }
      }, 320)
    }
  }, 500)
  // Labels appear after lines draw
  setTimeout(() => {
    const fade = (el) => { if (el) { el.style.transition = 'opacity 0.3s ease'; el.style.opacity = '1' } }
    fade(resultBadge.value)
    fade(resultChaosLabel.value)
    fade(resultChaosEndLabel.value)
  }, 900)
}

const featTitle = ref(null)
const featSub = ref(null)
const featHero = ref(null)
const featGrid = ref(null)
const featCta = ref(null)

const spwTitle = ref(null)
const spwMetrics = ref(null)
const spwCounter89 = ref(null)
const spwCounter150 = ref(null)
const spwCounter49 = ref(null)
const spwReviews = ref(null)
const spwUnis = ref(null)
const spwCta = ref(null)
const hubTitle = ref(null)
const hubSub = ref(null)
const hubHero = ref(null)
const hubCards = ref(null)
const hubAccent = ref(null)
const hubCta = ref(null)

const universities = [
  { name: 'Johns Hopkins University', short: 'JHU', logo: '/logos/jhu.svg' },
  { name: 'Cornell University', short: 'CU', logo: '/logos/cornell.svg' },
  { name: 'UPenn', short: 'UP', logo: '/logos/upenn.svg' },
  { name: 'Nazarbayev University', short: 'NU', logo: 'https://static.tildacdn.pro/tild3863-3038-4632-b365-363362373130/NU_horizontal_1.png' },
  { name: 'Duke University', short: 'DU', logo: '/logos/duke.svg' },
  { name: 'NYU', short: 'NYU', logo: '/logos/nyu.svg' },
  { name: 'KAIST', short: 'KA', logo: '/logos/kaist.svg' },
  { name: 'Bocconi', short: 'BOC', logo: '/logos/bocconi.svg' },
  { name: 'Yonsei University', short: 'YU', logo: '/logos/yonsei.svg' },
  { name: 'Korea University', short: 'KU', logo: '/logos/korea.svg' },
  { name: 'HKU', short: 'HKU', logo: '/logos/hku.svg' },
  { name: 'CUHK Shenzhen', short: 'CU', logo: '/logos/cuhk.svg' },
  { name: 'CityU HK', short: 'CIT', logo: '/logos/cityu.svg' },
]

const pwTitle = ref(null)
const pwSub = ref(null)
const pwGuarantee = ref(null)
const pwBonus = ref(null)
const pwPlans = ref(null)
const pwPromo = ref(null)
const pwCta = ref(null)

function animateHookScore() {
  const startScore = 1000
  const endScore = 1500
  const duration = 1500
  const startTime = performance.now()
  const startRGB = { r: 239, g: 68, b: 68 }
  const endRGB = { r: 8, g: 44, b: 174 }

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    hookAnimatedScore.value = Math.round(startScore + (endScore - startScore) * eased)
    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * eased)
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * eased)
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * eased)
    hookScoreColor.value = `rgb(${r}, ${g}, ${b})`
    if (progress < 1) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

function animateHook() {
  const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)', duration: 0.35 } })
  tl.fromTo(hookTitle.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0)
    .fromTo(hookSub.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.15)
    .fromTo(hookProof.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.22)
    .fromTo(hookCta.value, { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 }, 0.28)
    .fromTo(hookLogin.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.35)
    .call(animateHookScore, null, 0.2)
  return tl
}

function animateExperience() {
  if (!experienceCards.value) return null
  const cards = experienceCards.value.querySelectorAll('.quiz-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }
  )
}

function animateCurrentScore() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.3 } })
  tl.fromTo(scoreDisplay.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0)
    .fromTo(scoreSlider.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.08)
    .fromTo(scoreCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.15)
  return tl
}

function animateTargetScore() {
  if (!targetCards.value) return null
  const cards = targetCards.value.querySelectorAll('.target-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' }
  )
}

function animateDeadline() {
  if (!deadlineCards.value) return null
  const cards = deadlineCards.value.querySelectorAll('.quiz-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' }
  )
}

function animatePains() {
  if (!painCards.value) return null
  const cards = painCards.value.querySelectorAll('.pain-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: 'power3.out' }
  )
}

function animateTime() {
  if (!timeCards.value) return null
  const cards = timeCards.value.querySelectorAll('.quiz-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }
  )
}

function animateAnchor() {
  if (!anchorCards.value) return null
  const cards = anchorCards.value.querySelectorAll('.quiz-card')
  return gsap.fromTo(cards,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }
  )
}

function animateLoader() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(loaderSpinner.value, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0)
    .fromTo(loaderTitle.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.15)
    .fromTo(loaderStatus.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.25)
    .fromTo(loaderBarWrap.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
    .fromTo(loaderChecklist.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.4)
    .fromTo(loaderReviews.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
  startLoader()
  return null
}

function animateEmailCapture() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(emailTitle.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(emailSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.1)
    .fromTo(emailForm.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.2)
    .fromTo(emailCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.3)
  return tl
}

function animateResult() {
  generateResultChaosPath()
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(resultHeader.value, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35 }, 0)
  tl.fromTo(resultCard.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.1)
  tl.fromTo(resultBadgeEl.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
  tl.call(animateResultChart, null, 0.3)
  tl.fromTo(resultRows.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.45)
  tl.fromTo(resultMotivation.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
  tl.fromTo(resultSocial.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.65)
  tl.fromTo(resultCta.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7)

  return tl
}


function animateFeatureShowcase() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(featTitle.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(featSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.06)
    .fromTo(featHero.value, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, 0.12)

  const cards = featGrid.value.querySelectorAll('.feat-secondary-card')
  tl.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
    0.25
  )
  tl.fromTo(featCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.5)
  return tl
}

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
    val: 290, duration: 1, ease: 'power2.out',
    onUpdate: () => { if (spwCounter150.value) spwCounter150.value.textContent = Math.round(c150.val) }
  }, 0.23)
  const c49 = { val: 0 }
  tl.to(c49, {
    val: 4.9, duration: 1, ease: 'power2.out',
    onUpdate: () => { if (spwCounter49.value) spwCounter49.value.textContent = c49.val.toFixed(1) }
  }, 0.31)

  tl.fromTo(spwReviews.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.4)
  tl.fromTo(spwUnis.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.6)
  tl.fromTo(spwCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.7)
  return tl
}

function animateQosHub() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(hubTitle.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(hubSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.08)
    .fromTo(hubHero.value, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, 0.15)

  const cards = hubCards.value.querySelectorAll('[class*="bg-white"]')
  tl.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
    0.35
  )
  tl.fromTo(hubAccent.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.6)
  tl.fromTo(hubCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.7)
  return tl
}

function animatePaywall() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(pwTitle.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .fromTo(pwSub.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.06)
    .fromTo(pwGuarantee.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.12)

  tl.set(pwPlans.value, { opacity: 1 }, 0.2)
  const plans = pwPlans.value.querySelectorAll('.paywall-plan')
  tl.fromTo(plans,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
    0.2
  )
  tl.fromTo(pwBonus.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.42)
  tl.fromTo(pwPromo.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.48)
  tl.fromTo(pwCta.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 0.52)
  return tl
}

const STEP_ANIMATIONS = {
  hook: animateHook,
  experience: animateExperience,
  currentScore: animateCurrentScore,
  targetScore: animateTargetScore,
  deadline: animateDeadline,
  pains: animatePains,
  dailyTime: animateTime,
  anchor: animateAnchor,
  loader: animateLoader,
  emailCapture: animateEmailCapture,
  result: animateResult,
  featureShowcase: animateFeatureShowcase,
  socialProofWall: animateSocialProofWall,
  qosHub: animateQosHub,
  paywall: animatePaywall,
}

// Trigger animations AFTER the transition finishes entering
function onStepEnter() {
  capture('quiz_step_viewed', { step: currentStep.value })
  isAnimating.value = true
  const fn = STEP_ANIMATIONS[currentStep.value]
  if (fn) {
    const tl = fn()
    if (tl && tl.then) {
      tl.then(() => { isAnimating.value = false })
    } else {
      // fallback for animations that don't return a timeline (loader)
      isAnimating.value = false
    }
  }
}

// Initialize PostHog on mount
onMounted(() => {
  initPostHog()
  capture('quiz_viewed')

  // Detect visitor country for currency/payment method selection
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
})

// Initial animation on mount
onMounted(() => {
  // For debug step, Transition won't fire @after-enter (no step change),
  // so we trigger animation manually after DOM is ready
  isAnimating.value = true
  nextTick(() => {
    requestAnimationFrame(() => {
      const fn = STEP_ANIMATIONS[currentStep.value]
      if (fn) {
        const tl = fn()
        if (tl && tl.then) tl.then(() => { isAnimating.value = false })
        else isAnimating.value = false
      } else { isAnimating.value = false }
    })
  })
})

onUnmounted(() => {
  cleanupLoader()
  if (kaspiPollInterval) {
    clearInterval(kaspiPollInterval)
  }
})
</script>

<style scoped>
/* Feature Showcase — Hero card */
.feat-hero-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-left: 4px solid #10B981;
  border-bottom: 2px solid #E5E7EB;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* Feature Showcase — Secondary cards */
.feat-secondary-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: 14px;
  border: 1px solid #EDEEF0;
  border-bottom: 2px solid #E5E7EB;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}
.feat-icon {
  font-size: 20px;
  line-height: 1;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
  margin-top: 1px;
}

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

/* Static grid background */
.quiz-grid-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Step content base */
.step-content {
  min-height: calc(100vh - 57px);
  min-height: calc(100dvh - 57px);
}

/* Quiz cards */
.quiz-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  min-height: 64px;
  background: white;
  border-radius: 14px;
  border: 2px solid #F3F4F6;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}
.quiz-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}
.quiz-card:active {
  transform: translateY(0) scale(0.99);
}
.quiz-card-selected {
  border-color: #082CAE;
  background: #EDF3FA;
  box-shadow: 0 0 0 3px rgba(8, 44, 174, 0.1);
}

/* Next button */
.quiz-next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 40px;
  background: #082CAE;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}
.quiz-next-btn:hover:not(:disabled) {
  background: #0B237B;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(8, 44, 174, 0.3);
}
.quiz-next-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.quiz-next-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Score number bounce */
.score-number {
  display: inline-block;
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Custom range slider */
.quiz-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  outline: none;
}
.quiz-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 32px;
  height: 32px;
  background: #082CAE;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(8, 44, 174, 0.35);
  border: 3px solid white;
  transition: box-shadow 0.2s, transform 0.15s;
}
.quiz-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 3px 18px rgba(8, 44, 174, 0.5);
  transform: scale(1.1);
}
.quiz-slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
}
.quiz-slider::-moz-range-thumb {
  width: 32px;
  height: 32px;
  background: #082CAE;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(8, 44, 174, 0.35);
  border: 3px solid white;
}

/* Pain point multi-select cards */
.pain-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  min-height: 64px;
  background: white;
  border-radius: 14px;
  border: 2px solid #F3F4F6;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  gap: 10px;
}
.pain-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}
.pain-card:active {
  transform: translateY(0) scale(0.99);
}
.pain-card-selected {
  border-color: #082CAE;
  background: #EDF3FA;
  box-shadow: 0 0 0 3px rgba(8, 44, 174, 0.1);
}
.pain-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.pain-checkbox-checked {
  background: #082CAE;
  border-color: #082CAE;
}

/* Target score cards */
.target-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  min-height: 68px;
  background: white;
  border-radius: 14px;
  border: 2px solid #F3F4F6;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}
.target-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}
.target-card:active {
  transform: translateY(0) scale(0.99);
}
.target-card-selected {
  border-color: #082CAE;
  background: #EDF3FA;
  box-shadow: 0 0 0 3px rgba(8, 44, 174, 0.1);
}
.target-score-num {
  font-size: 22px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #1C1C1C;
  background: #F3F4F6;
  border-radius: 10px;
  padding: 6px 12px;
  min-width: 90px;
  text-align: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
}
.target-score-num-active {
  background: #082CAE;
  color: white;
}
.target-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: white;
  background: linear-gradient(135deg, #082CAE, #3b5fe0);
  padding: 4px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}

/* Toast transition */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Social proof stat */
.proof-stat {
  padding: 8px 0;
}

/* Paywall cards */

/* === Loader: Orb with radiating rings === */
.loader-orb-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-orb {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #082CAE 0%, #3b5fe0 50%, #5b8ef5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(8, 44, 174, 0.35);
  animation: loader-orb-pulse 2.5s ease-in-out infinite;
  will-change: transform;
}
.loader-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(8, 44, 174, 0.12);
  animation: loader-ring-expand 3s ease-out infinite;
  will-change: transform, opacity;
}
.loader-ring-1 { width: 52px; height: 52px; animation-delay: 0s; }
.loader-ring-2 { width: 52px; height: 52px; animation-delay: 1.5s; }

@keyframes loader-orb-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes loader-ring-expand {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* === Loader: Letter wave animation === */
.loader-letters {
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-letter {
  font-size: 1.25rem;
  font-weight: 700;
  color: #082CAE;
  animation: loader-letter-wave 2.4s ease-in-out infinite;
  display: inline-block;
}
@media (min-width: 768px) {
  .loader-letter { font-size: 1.5rem; }
}
@keyframes loader-letter-wave {
  0%, 100% { opacity: 0.35; transform: translateY(0); }
  20% { opacity: 1; transform: translateY(-3px) scale(1.08); }
  40% { opacity: 0.6; transform: translateY(0); }
}

/* === Loader: Progress bar with glow === */
.loader-bar-track {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}
.loader-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #082CAE, #3b5fe0);
  position: relative;
  transition: none;
}

/* Review fade transition */
.review-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.review-fade-leave-active {
  transition: all 0.25s ease-in;
}
.review-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.review-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 220ms cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<style>
/* Popup overlay transition (unscoped for Teleport) */
.popup-enter-active {
  transition: opacity 0.3s ease;
}
.popup-enter-active .popup-card {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.popup-leave-active {
  transition: opacity 0.2s ease;
}
.popup-leave-active .popup-card {
  transition: all 0.2s ease-in;
}
.popup-enter-from {
  opacity: 0;
}
.popup-enter-from .popup-card {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
.popup-leave-to {
  opacity: 0;
}
.popup-leave-to .popup-card {
  transform: scale(0.95);
  opacity: 0;
}
</style>
