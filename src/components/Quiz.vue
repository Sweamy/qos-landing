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

    <!-- ==================== HEADER (visible on quiz steps only) ==================== -->
    <header
      v-if="showHeader"
      class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
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
        <div v-if="currentStep === 'hook'" key="hook" class="step-content flex items-center justify-center">
          <div class="max-w-lg mx-auto px-6 py-12 md:py-20 text-center">
            <!-- Logo -->
            <div ref="hookLogo" class="mb-8 opacity-0">
              <svg class="h-14 md:h-16 w-auto text-custom-main mx-auto" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>
            </div>

            <!-- Headline -->
            <h1 ref="hookTitle" class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight opacity-0">
              Набери свой максимум<br>на <span class="text-custom-main">SAT</span>
            </h1>

            <!-- Subtitle -->
            <p ref="hookSub" class="text-base md:text-lg text-gray-500 mb-8 max-w-md mx-auto opacity-0">
              Пройди короткий квиз — получи стратегию подготовки под себя
            </p>

            <!-- Social proof pills -->
            <div ref="hookProof" class="flex items-center justify-center gap-4 md:gap-6 mb-10 opacity-0">
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
            <div ref="hookCta" class="opacity-0">
              <button class="btn-3d !text-base md:!text-lg !px-10 !py-4" @click="startQuiz">
                Получить мой план &rarr;
              </button>
              <p class="text-xs text-gray-400 mt-4">Займет 1 минуту</p>
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
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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
                <span class="text-2xl md:text-3xl w-10 text-center flex-shrink-0">{{ option.icon }}</span>
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
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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

            <div ref="scoreCta" class="mt-10 flex justify-center opacity-0">
              <button class="quiz-next-btn" @click="goNext">Далее</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 3: TARGET SCORE ========== -->
        <div v-else-if="currentStep === 'targetScore'" key="targetScore" class="step-content">
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Какой балл хочешь получить?
            </h2>
            <p class="text-gray-500 text-center mb-8 md:mb-10">
              Выбери цель — мы построим маршрут
            </p>

            <div ref="targetCards" class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <button
                v-for="(option, i) in targetOptions"
                :key="option.value"
                class="target-card opacity-0"
                :class="answers.targetScore === option.value ? 'target-card-selected' : ''"
                :data-index="i"
                @click="selectTarget(option.value)"
              >
                <div class="text-3xl md:text-4xl font-bold tabular-nums" :class="answers.targetScore === option.value ? 'text-custom-main' : 'text-gray-800'">
                  {{ option.value }}+
                </div>
                <div class="text-sm text-gray-500 mt-1.5">{{ option.desc }}</div>
                <div v-if="option.badge" class="target-badge">{{ option.badge }}</div>
              </button>
            </div>

            <!-- Dynamic motivation toast -->
            <Transition name="toast">
              <div
                v-if="answers.targetScore && targetMotivation"
                class="mt-6 flex items-start gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-custom-main/10"
              >
                <span class="text-xl flex-shrink-0 mt-0.5">&#x1F4A1;</span>
                <p class="text-sm md:text-base text-gray-700">{{ targetMotivation }}</p>
              </div>
            </Transition>

            <div class="mt-8 flex justify-center">
              <button
                class="quiz-next-btn"
                :class="!answers.targetScore ? 'opacity-40 cursor-not-allowed' : ''"
                :disabled="!answers.targetScore"
                @click="goNext"
              >Далее</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 5: DEADLINE ========== -->
        <div v-else-if="currentStep === 'deadline'" key="deadline" class="step-content">
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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
                <span class="text-2xl md:text-3xl w-10 text-center flex-shrink-0">{{ option.icon }}</span>
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
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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

            <div ref="painCards" class="grid grid-cols-2 gap-2 md:gap-3">
              <button
                v-for="(option, i) in painOptions"
                :key="option.value"
                class="pain-card text-left opacity-0"
                :class="answers.pains.includes(option.value) ? 'pain-card-selected' : ''"
                @click="togglePain(option.value)"
              >
                <!-- Checkbox -->
                <span class="pain-checkbox flex-shrink-0" :class="answers.pains.includes(option.value) ? 'pain-checkbox-checked' : ''">
                  <svg v-if="answers.pains.includes(option.value)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="text-lg md:text-2xl w-7 md:w-9 text-center flex-shrink-0">{{ option.icon }}</span>
                <div class="font-semibold text-gray-900 text-xs md:text-sm leading-tight">{{ option.label }}</div>
              </button>
            </div>

            <!-- Selected count -->
            <Transition name="toast">
              <p v-if="answers.pains.length > 0" class="text-center text-sm text-custom-main font-medium mt-5">
                Выбрано: {{ answers.pains.length }}
              </p>
            </Transition>

            <div class="mt-6 flex justify-center">
              <button
                class="quiz-next-btn"
                :disabled="answers.pains.length === 0"
                @click="goNext"
              >Далее</button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 7: TIME PER DAY ========== -->
        <div v-else-if="currentStep === 'dailyTime'" key="dailyTime" class="step-content">
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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
                <span class="text-2xl md:text-3xl w-10 text-center flex-shrink-0">{{ option.icon }}</span>
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
          <div class="max-w-2xl mx-auto px-4 py-5 md:py-16">
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
                <span class="text-2xl md:text-3xl w-10 text-center flex-shrink-0">{{ option.icon }}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-base md:text-lg">{{ option.label }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== SCREEN 9: LOADER ========== -->
        <div v-else-if="currentStep === 'loader'" key="loader" class="step-content">
          <div class="fixed inset-0 overflow-y-auto bg-white/70 backdrop-blur-sm z-20">
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

              <!-- 75% Interruption question — above progress, visible immediately -->
              <Transition name="toast">
                <div v-if="loaderInterrupted" class="bg-white border border-custom-main/20 rounded-2xl p-4 md:p-5 text-center shadow-lg shadow-custom-main/5 mb-5">
                  <p class="text-gray-900 font-semibold text-sm md:text-base mb-3">
                    Какой раздел подтянуть первым?
                  </p>
                  <div class="flex gap-2">
                    <button
                      v-for="opt in interruptOptions"
                      :key="opt.value"
                      class="flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all border-2"
                      :class="answers.prioritySection === opt.value
                        ? 'bg-custom-main text-white border-custom-main'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-custom-main/40'"
                      @click="answerInterrupt(opt.value)"
                    >{{ opt.label }}</button>
                  </div>
                </div>
              </Transition>

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

        <!-- ========== SCREEN 10: RESULT ========== -->
        <div v-else-if="currentStep === 'result'" key="result" class="step-content">
          <div class="fixed inset-0 overflow-y-auto bg-white/60 backdrop-blur-sm z-20">
            <div class="min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-12">

              <!-- Header -->
              <div ref="resultHeader" class="text-center mb-6 md:mb-8 opacity-0">
                <svg class="h-10 w-auto text-custom-main mx-auto mb-4" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Твой персональный план готов</h2>
              </div>

              <!-- Result Card -->
              <div ref="resultCard" class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden opacity-0">

                <!-- Transformation visual -->
                <div class="bg-gradient-to-b from-custom-blue to-white pt-8 pb-5 px-6 text-center">
                  <div class="flex items-center justify-center gap-4 mb-3">
                    <div class="text-center">
                      <div class="text-xs text-gray-400 mb-1">Сейчас</div>
                      <div ref="resultFromScore" class="text-3xl md:text-4xl font-bold text-gray-400 tabular-nums">{{ answers.currentScore }}</div>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-8 h-8 text-custom-main" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-400 mb-1">Цель</div>
                      <div ref="resultToScore" class="text-3xl md:text-4xl font-bold text-custom-main tabular-nums">{{ answers.targetScore }}+</div>
                    </div>
                  </div>
                  <div class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    +{{ (answers.targetScore || 1300) - answers.currentScore }} баллов
                  </div>
                </div>

                <!-- Summary -->
                <div class="px-6 py-5 space-y-3">

                  <!-- Days until exam -->
                  <div v-if="daysUntilExam" class="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3">
                    <span class="text-xl">&#x1F4C5;</span>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ daysUntilExam }} дней до экзамена</div>
                      <div class="text-xs text-gray-500">{{ answers.deadline }}</div>
                    </div>
                  </div>

                  <!-- Focus areas -->
                  <div v-if="answers.pains.length" class="flex items-start gap-3 bg-custom-blue rounded-xl px-4 py-3">
                    <span class="text-xl mt-0.5">&#x1F3AF;</span>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">Фокус: {{ answers.pains.slice(0, 2).map(painLabel).join(', ') }}</div>
                      <div class="text-xs text-gray-500">Персональный план по слабым местам</div>
                    </div>
                  </div>

                  <!-- Daily commitment -->
                  <div class="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3">
                    <span class="text-xl">&#x23F1;</span>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ timeLabel(answers.dailyTime) }} ежедневных занятий</div>
                      <div class="text-xs text-gray-500">Персональный темп подготовки</div>
                    </div>
                  </div>

                  <!-- What's inside the plan -->
                  <div class="border-t border-gray-100 pt-4 mt-4">
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Что внутри твоего плана</h4>
                    <div class="space-y-2.5">
                      <div v-for="item in planFeatures" :key="item" class="flex items-center gap-2.5">
                        <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        <span class="text-sm text-gray-700">{{ item }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Personalized motivation -->
                  <div class="bg-custom-blue rounded-xl px-4 py-3 mt-3">
                    <p class="text-sm text-custom-main font-medium">{{ anchorMotivation }}</p>
                  </div>

                  <!-- Social proof -->
                  <div class="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div class="flex -space-x-2">
                      <div class="w-7 h-7 rounded-full bg-custom-main text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">A</div>
                      <div class="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">K</div>
                      <div class="w-7 h-7 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">M</div>
                    </div>
                    <p class="text-xs text-gray-500">
                      <span class="font-semibold text-gray-700">2,800+ учеников</span> уже занимаются по плану
                    </p>
                  </div>
                </div>

                <!-- CTA -->
                <div class="px-6 pb-6 pt-2">
                  <button class="btn-3d w-full !text-base md:!text-lg !py-4" @click="goToFeatureShowcase">
                    Начать подготовку &rarr;
                  </button>
                  <p class="text-center text-xs text-gray-400 mt-3">Бесплатно &middot; Без обязательств</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import GridPattern from './ui/GridPattern.vue'

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
  'result',
  'featureShowcase',
  'bonuses',
  'socialProofWall',
  'paywall',
]

// Steps that skip the header + progress bar
const NO_HEADER_STEPS = ['hook', 'loader', 'result', 'featureShowcase', 'bonuses', 'socialProofWall', 'paywall']

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

const currentStep = ref('hook')
const slideDirection = ref('forward')
const isAnimating = ref(true) // blocks clicks until entrance animation finishes

// ==================== ANSWERS ====================
const answers = reactive({
  experience: null,
  currentScore: 1100,
  targetScore: null,
  motivation: null,       // from target score card
  deadline: null,
  deadlineDate: null,
  pains: [],
  dailyTime: null,
  anchor: null,           // emotional anchor (screen 8)
  prioritySection: null,  // from loader interruption
})

const hasSeenAbandonment = ref(false)
const showAbandonment = ref(false)
const selectedPlan = ref('quarterly')
const promoCode = ref('')

// ==================== COMPUTED ====================

const showHeader = computed(() => !NO_HEADER_STEPS.includes(currentStep.value))

const progressPercent = computed(() => PROGRESS_MAP[currentStep.value] || 0)

const transitionName = computed(() =>
  slideDirection.value === 'forward' ? 'slide-left' : 'slide-right'
)

const quizContainer = ref(null)

const NO_BACK_STEPS = ['hook', 'experience', 'loader', 'result', 'featureShowcase', 'bonuses', 'socialProofWall', 'paywall']

const canGoBack = computed(() => {
  if (NO_BACK_STEPS.includes(currentStep.value)) return false
  return true
})

// ==================== OPTIONS DATA ====================

const experienceOptions = [
  { value: 'beginner', icon: '\u{1F331}', label: 'Новичок', desc: 'Еще не начинал подготовку' },
  { value: 'tried', icon: '\u{1F4D8}', label: 'Готовился, но без системы', desc: 'Решал задания самостоятельно' },
  { value: 'took', icon: '\u{1F3AF}', label: 'Уже сдавал SAT', desc: 'Есть результат — хочу поднять балл' },
]

const targetOptions = [
  { value: 1200, desc: 'Уверенный фундамент', badge: null },
  { value: 1300, desc: 'Большинство вузов открыты', badge: null },
  { value: 1400, desc: 'Конкурентное преимущество', badge: null },
  { value: 1500, desc: 'Ivy League, топ-стипендии', badge: 'TOP' },
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
  { value: 'strategy', icon: '\u{1F9E9}', label: 'Не знаю с чего начать' },
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
  strategy:   { icon: '🧠', title: 'Умный план', desc: 'Не знаешь с чего начать? Алгоритм построит маршрут от твоего уровня до цели.', stat: 'Персональный маршрут за 30 секунд' },
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

const subscriptionPlans = [
  { id: 'monthly', label: '1 месяц', perMonth: '5 800 ₸/мес', price: '5 800', oldPrice: null, badge: null },
  { id: 'quarterly', label: '3 месяца', perMonth: '3 267 ₸/мес', price: '9 800', oldPrice: '17 400', badge: 'Самый популярный' },
  { id: 'annual', label: '12 месяцев', perMonth: '2 333 ₸/мес', price: '28 000', oldPrice: '69 600', discount: '-60%' },
]

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
  isAnimating.value = true
  slideDirection.value = 'forward'
  const next = getNextStep(currentStep.value)
  currentStep.value = next
}

function goBack() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'backward'
  const prev = getPrevStep(currentStep.value)
  currentStep.value = prev
}

// ==================== SCREEN ACTIONS ====================

function startQuiz() {
  if (isAnimating.value) return
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'experience'
}

function selectExperience(value) {
  if (isAnimating.value) return
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
  answers.targetScore = value
}

function selectDeadline(option) {
  if (isAnimating.value) return
  answers.deadline = option.value
  answers.deadlineDate = option.date || null
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('deadline')
  }, 400)
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
  answers.dailyTime = value
  isAnimating.value = true
  setTimeout(() => {
    slideDirection.value = 'forward'
    currentStep.value = getNextStep('dailyTime')
  }, 350)
}

function selectAnchor(value) {
  if (isAnimating.value) return
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
        currentStep.value = 'result'
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
  isAnimating.value = true
  slideDirection.value = 'forward'
  currentStep.value = 'featureShowcase'
}

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

function goToPlatform() {
  window.location.href = 'https://qos.plus/lms/practice/sat'
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
const resultHeader = ref(null)
const resultCard = ref(null)
const featTitle = ref(null)
const featSub = ref(null)
const featHero = ref(null)
const featGrid = ref(null)
const featCta = ref(null)

function animateHook() {
  const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)', duration: 0.35 } })
  tl.fromTo(hookLogo.value, { opacity: 0, y: -12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 }, 0)
    .fromTo(hookTitle.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.08)
    .fromTo(hookSub.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.15)
    .fromTo(hookProof.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.22)
    .fromTo(hookCta.value, { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 }, 0.28)
    .fromTo(hookLogin.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.35)
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

function animateResult() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(resultHeader.value, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35 }, 0)
  tl.fromTo(resultCard.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.1)

  setTimeout(() => {
    confetti({
      particleCount: 80, spread: 70,
      origin: { y: 0.6 },
      colors: ['#082CAE', '#F0E46A', '#3b5fe0', '#EDF3FA'],
    })
  }, 300)
  return tl
}


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

// Trigger animations AFTER the transition finishes entering
function onStepEnter() {
  isAnimating.value = true
  const animators = {
    hook: animateHook,
    experience: animateExperience,
    currentScore: animateCurrentScore,
    targetScore: animateTargetScore,
    deadline: animateDeadline,
    pains: animatePains,
    dailyTime: animateTime,
    anchor: animateAnchor,
    loader: animateLoader,
    result: animateResult,
    featureShowcase: animateFeatureShowcase,
  }
  const fn = animators[currentStep.value]
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

// Initial animation on mount (hook is first screen, no transition triggers @after-enter)
onMounted(() => {
  isAnimating.value = true
  nextTick(() => {
    requestAnimationFrame(() => {
      const tl = animateHook()
      if (tl && tl.then) {
        tl.then(() => { isAnimating.value = false })
      }
    })
  })
})

onUnmounted(() => {
  cleanupLoader()
})
</script>

<style scoped>
/* Animated grid background — GPU-composited */
.quiz-grid-layer {
  position: absolute;
  inset: -40px;
  width: calc(100% + 80px);
  height: calc(100% + 80px);
  animation: quizGridMove 20s linear infinite;
  will-change: transform;
  transform: translateZ(0);
}
@keyframes quizGridMove {
  0% { transform: translate(-40px, -40px); }
  100% { transform: translate(0px, 0px); }
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
  padding: 16px 20px;
  background: white;
  border-radius: 16px;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
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
  padding: 10px 12px;
  background: white;
  border-radius: 14px;
  border: 2px solid #F3F4F6;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  gap: 6px;
}
@media (min-width: 768px) {
  .pain-card {
    padding: 14px 16px;
    border-radius: 16px;
    gap: 8px;
  }
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
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 2px solid #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
@media (min-width: 768px) {
  .pain-checkbox { width: 20px; height: 20px; border-radius: 6px; }
}
.pain-checkbox-checked {
  background: #082CAE;
  border-color: #082CAE;
}

/* Target score cards */
.target-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: white;
  border-radius: 20px;
  border: 2px solid #F3F4F6;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}
.target-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
.target-card:active {
  transform: translateY(0) scale(0.98);
}
.target-card-selected {
  border-color: #082CAE;
  background: #EDF3FA;
  box-shadow: 0 0 0 3px rgba(8, 44, 174, 0.1);
}
.target-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: white;
  background: linear-gradient(135deg, #082CAE, #3b5fe0);
  padding: 3px 8px;
  border-radius: 6px;
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
</style>
