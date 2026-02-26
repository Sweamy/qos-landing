<template>
  <div class="landing-page bg-[#F5F7FB] min-h-screen font-sans">
    <!-- Floating Pill Nav (Hidden initially, appears on scroll) -->
    <nav
      ref="navBar"
      class="fixed z-50 transition-[transform,opacity] duration-500 left-1/2 -translate-x-1/2 top-4 w-[calc(100%-2rem)] max-w-[1000px] rounded-[32px] bg-[#111827]/95 border border-white/10 shadow-2xl -translate-y-[150%] opacity-0 pointer-events-none"
    >
      <div class="px-5 md:px-8 py-3 flex items-center justify-between">
        <!-- White Logo for Pill -->
        <svg class="h-10 md:h-12 w-auto text-white/95" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>

        <!-- Center Links -->
        <div class="hidden md:flex items-center gap-8 justify-center absolute left-1/2 -translate-x-1/2">
          <a href="#how-it-works" @click.prevent="smoothScrollTo('how-it-works')" class="text-[11px] font-bold tracking-[0.15em] text-white/50 uppercase hover:text-white transition-colors cursor-pointer">Методика</a>
          <a href="#features" @click.prevent="smoothScrollTo('features')" class="text-[11px] font-bold tracking-[0.15em] text-white/50 uppercase hover:text-white transition-colors cursor-pointer">Платформа</a>
          <a href="#demo" @click.prevent="smoothScrollTo('demo')" class="text-[11px] font-bold tracking-[0.15em] text-white/50 uppercase hover:text-white transition-colors cursor-pointer">Демо</a>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 md:gap-4 relative z-10">
          <button class="hidden sm:block text-[11px] font-bold tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase">
            Войти
          </button>
          <RainbowButton @click="goToQuiz" customClass="text-[11px] uppercase tracking-[0.15em] hover:scale-105 transition-transform duration-300 pointer-events-auto shadow-[0_0_20px_rgba(8,44,174,0.4)]">
            ПОЛУЧИТЬ ПЛАН
          </RainbowButton>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section ref="heroSection" class="min-h-screen flex flex-col overflow-hidden relative">
      <TheInfiniteGrid>
      <!-- Static Hero Nav (Original) -->
      <div class="relative w-full z-40">
        <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-5 md:py-8 flex items-center justify-between">
          <!-- Main Color Logo -->
          <svg class="h-10 md:h-12 w-auto text-custom-main" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>

          <div class="flex items-center gap-3">
            <button class="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all bg-transparent">
              Войти
            </button>
          </div>
        </div>
      </div>

      <div ref="heroContent" class="flex-1 flex flex-col items-center justify-center transform-gpu origin-top w-full">
      <div class="max-w-[1200px] w-full mx-auto px-4 md:px-10 pt-0 pb-8 md:pt-4 md:pb-16">
        <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          <!-- Left Side - Copy -->
          <div class="flex-1 text-center lg:text-left">
            <!-- Eyebrow -->
            <div class="inline-flex items-center gap-2 bg-custom-main/10 text-custom-main px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 md:mb-6">
              <svg class="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-xs md:text-sm font-semibold">Выбор №1 для поступающих в ТОП-ВУЗы мира</span>
            </div>

            <!-- Headline -->
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              <span
                class="inline-block font-black tabular-nums transition-colors duration-200"
                :style="{ color: scoreColor }"
              >{{ animatedScore }}+</span> на SAT<br class="hidden md:block" />
              с персональным <span class="text-custom-main">ИИ-тьютором</span>
            </h1>

            <!-- Subhead -->
            <p class="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Алгоритм от студентов Лиги Плюща просканирует твои знания за 5 минут, найдёт скрытые пробелы и построит маршрут к ВУЗу мечты.
            </p>

            <!-- CTA -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button class="btn-3d" @click="goToQuiz">
                Получить план →
              </button>
            </div>

            <!-- Micro trust - under CTA -->
            <div class="mt-4 flex items-center justify-center lg:justify-start gap-5 text-xs md:text-sm text-gray-400">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Абсолютно бесплатный тест
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Занимает меньше 5 минут
              </span>
            </div>
          </div>

          <!-- Right Side - Chaos vs System Graph -->
          <div class="flex-1 w-full max-w-2xl lg:max-w-3xl">
            <!-- Mobile: labels above graph as a row -->
            <div class="flex md:hidden justify-between items-end mb-3 px-1">
              <div ref="startLabelMobile" class="opacity-0 transition-all duration-500">
                <div class="glass-card-red px-3 py-2 rounded-lg">
                  <span class="block text-[8px] font-semibold text-red-400 tracking-widest uppercase">Старт</span>
                  <span class="block text-lg font-extrabold text-red-600 leading-tight">1000</span>
                </div>
              </div>
              <div ref="endLabelMobile">
                <div class="glass-card-green px-3 py-2 rounded-lg">
                  <span class="block text-[8px] font-semibold text-emerald-400 tracking-widest uppercase">Цель</span>
                  <span class="block text-lg font-extrabold text-emerald-600 leading-tight">1540</span>
                </div>
              </div>
            </div>

            <div class="relative">
              <!-- Graph Card -->
              <div ref="graphCard" class="relative bg-white rounded-2xl md:rounded-[28px] p-3 md:p-8 border border-gray-200/50 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)]">
                <svg
                  class="w-full"
                  viewBox="0 0 460 280"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="systemGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#1E40AF"/>
                      <stop offset="100%" stop-color="#10B981"/>
                    </linearGradient>
                    <filter id="lineGlow" x="0" y="0" width="100%" height="100%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#1E40AF" flood-opacity="0.4"/>
                    </filter>
                    <filter id="chaosGlow" x="0" y="0" width="100%" height="100%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#EF4444" flood-opacity="0.4"/>
                    </filter>
                    <clipPath id="chaosClip">
                      <rect ref="chaosClipRect" x="0" y="0" width="0" height="280" />
                    </clipPath>
                  </defs>

                  <!-- Subtle horizontal grid lines -->
                  <line x1="30" y1="70" x2="430" y2="70" stroke="#F0F0F5" stroke-width="1"/>
                  <line x1="30" y1="140" x2="430" y2="140" stroke="#F0F0F5" stroke-width="1"/>
                  <line x1="30" y1="210" x2="430" y2="210" stroke="#F0F0F5" stroke-width="1"/>

                  <!-- Chaos path (bright red, dashed) -->
                  <path
                    ref="chaosPath"
                    :d="chaosPathD"
                    fill="none"
                    stroke="#EF4444"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-dasharray="10 7"
                    clip-path="url(#chaosClip)"
                  />

                  <!-- System straight line (blue → green gradient) with glow -->
                  <line
                    ref="systemPath"
                    x1="55" y1="245" x2="340" y2="35"
                    stroke="url(#systemGradient)"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-dasharray="400"
                    stroke-dashoffset="400"
                    filter="url(#lineGlow)"
                  />

                  <!-- End dot (green, appears with line) -->
                  <circle ref="endDot" cx="340" cy="35" r="8" fill="#10B981" opacity="0"/>

                  <!-- "С нами" label near green end dot -->
                  <g ref="badge" opacity="0">
                    <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="800" fill="#10B981">С нами</text>
                  </g>

                  <!-- "Без нас" label to the right of chaos end dot -->
                  <g ref="chaosLabel" opacity="0">
                    <text :x="chaosEndPoint.x + 14" :y="chaosEndPoint.y + 5" text-anchor="start" font-size="14" font-weight="800" fill="#EF4444">Без нас</text>
                  </g>

                  <!-- Start dot (soft red) -->
                  <circle cx="55" cy="245" r="5" fill="#F87171" opacity="0.8"/>

                  <!-- Chaos end dot (appears instantly when line reaches it) -->
                  <circle ref="chaosEndDot" :cx="chaosEndPoint.x" :cy="chaosEndPoint.y" r="6" fill="#DC2626" opacity="0"/>

                  <!-- Chaos ceiling label (appears with other labels) -->
                  <g ref="chaosEndLabel" opacity="0">
                    <text :x="chaosEndPoint.x - 2" :y="chaosEndPoint.y - 18" text-anchor="end" font-size="10" font-weight="600" fill="#9CA3AF">Потолок</text>
                    <text :x="chaosEndPoint.x - 2" :y="chaosEndPoint.y - 29" text-anchor="end" font-size="11" font-weight="700" fill="#EF4444">~1300</text>
                  </g>

                </svg>
              </div>

              <!-- Desktop: Start Label - near start dot, overlapping card edge -->
              <div ref="startLabel" class="hidden md:block absolute z-10 opacity-0 transition-all duration-500" style="left: 0px; bottom: -20px;">
                <div class="glass-card-red px-5 py-3 rounded-xl">
                  <span class="block text-[10px] font-semibold text-red-400 tracking-widest uppercase">Старт</span>
                  <span class="block text-2xl font-extrabold text-red-600 leading-tight">1000</span>
                </div>
              </div>

              <!-- Desktop: Goal Label - near end dot, overlapping card edge -->
              <div ref="endLabel" class="hidden md:block absolute z-10 transition-all duration-500" style="right: 0px; top: -20px;">
                <div class="glass-card-green px-5 py-3 rounded-xl">
                  <span class="block text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">Цель</span>
                  <span class="block text-2xl font-extrabold text-emerald-600 leading-tight">1540</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      </div>
      </TheInfiniteGrid>
    </section>

    <!-- Pain Points Section -->
    <section class="py-20 md:py-28 px-4 md:px-10 bg-white">
      <div class="max-w-[1200px] mx-auto">
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center mb-4 leading-tight">
          Почему только 2% сдающих<br class="hidden md:block"> набирают <span class="text-red-500">1500+</span>?
        </h2>
        <p class="text-lg md:text-xl text-gray-500 text-center mb-14 md:mb-20">Потому что остальные 98% готовятся вслепую.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- Pain 1 -->
          <div class="relative bg-gray-50 rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-red-200 transition-[border-color] duration-200 hover:shadow-lg group">
            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5" stroke-dasharray="4 2"/>
                <circle cx="12" cy="9" r="2.5" stroke-width="1.5"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 19c0-3.5 2.2-5 5-5s5 1.5 5 5"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Одна программа на всех</h3>
            <p class="text-gray-500 leading-relaxed">Курсы дают одинаковый план каждому. Ты тратишь часы на то, что уже знаешь, и не добираешься до того, что реально тянет балл вниз.</p>
          </div>

          <!-- Pain 2 -->
          <div class="relative bg-gray-50 rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-red-200 transition-[border-color] duration-200 hover:shadow-lg group">
            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12a8 8 0 0 1 14-5.3"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 4v4h-4"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12a8 8 0 0 1-14 5.3"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 20v-4h4"/>
                <path stroke-linecap="round" stroke-width="2.5" d="M10 10l4 4M14 10l-4 4"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Ошибки повторяются</h3>
            <p class="text-gray-500 leading-relaxed">Ты видишь «Неправильно», но не понимаешь почему. Без разбора каждой ошибки те же минус 50 баллов вернутся на экзамене.</p>
          </div>

          <!-- Pain 3 -->
          <div class="relative bg-gray-50 rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-red-200 transition-[border-color] duration-200 hover:shadow-lg group">
            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Прогресс невидим</h3>
            <p class="text-gray-500 leading-relaxed">30 тем в учебнике, и ноль понимания, какая из них - твоё узкое место. Ты работаешь много, а балл стоит на месте.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bridge Section -->
    <section class="py-16 md:py-20 px-4 md:px-10 bg-white border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto text-center">
        <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Что внутри QOS PLUS</span>
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
          Всё, что нужно для 1500+ -<br class="hidden md:block"> в одной платформе
        </h2>

        <!-- Horizontal Flow Animation -->
        <div class="relative max-w-4xl mx-auto mt-8 md:mt-16 mb-8 hidden md:block">
          <!-- Continuous glowing path background line -->
          <div class="absolute top-[30px] left-0 w-full h-[3px] bg-gray-100 rounded-full"></div>
          
          <!-- Animated glowing dash that travels along the line -->
          <div class="absolute top-[30px] left-0 h-[3px] bg-gradient-to-r from-transparent via-custom-main to-transparent w-[150px] animate-flow-cycle z-0 rounded-full blur-[1px]"></div>
          <div class="absolute top-[30px] left-0 h-[3px] bg-gradient-to-r from-transparent via-custom-main to-transparent w-[100px] animate-flow-cycle z-0 rounded-full"></div>

          <!-- Nodes -->
          <div class="relative z-10 flex justify-between items-start">
            
            <!-- Step 1 -->
            <div class="flex flex-col items-center w-32 group">
              <div class="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-[transform,border-color] duration-200 group-hover:border-custom-main group-hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                <svg class="w-7 h-7 text-custom-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <span class="text-[13px] font-bold text-gray-900 tracking-wide uppercase mb-1">Диагностика</span>
              <span class="text-xs text-gray-500">Поиск пробелов</span>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center w-32 group">
              <div class="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-[transform,border-color] duration-200 group-hover:border-custom-main group-hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                <svg class="w-7 h-7 text-custom-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span class="text-[13px] font-bold text-gray-900 tracking-wide uppercase mb-1">Маршрут</span>
              <span class="text-xs text-gray-500">Личный план</span>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center w-32 group">
              <div class="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-[transform,border-color] duration-200 group-hover:border-custom-main group-hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                <svg class="w-7 h-7 text-custom-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </div>
              <span class="text-[13px] font-bold text-gray-900 tracking-wide uppercase mb-1">Практика</span>
              <span class="text-xs text-gray-500">Задания SAT</span>
            </div>

            <!-- Step 4 -->
            <div class="flex flex-col items-center w-32 group">
              <div class="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-[transform,border-color] duration-200 group-hover:border-custom-main group-hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                <svg class="w-7 h-7 text-custom-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-[13px] font-bold text-gray-900 tracking-wide uppercase mb-1">Разбор</span>
              <span class="text-xs text-gray-500">Работа над ошибками</span>
            </div>

          </div>
        </div>

        <!-- Mobile Fallback -->
        <div class="md:hidden mt-8 flex flex-col items-center gap-4">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-custom-main/10 flex items-center justify-center text-custom-main font-bold text-sm">1</div>
             <span class="font-bold text-gray-900">Диагностика</span>
          </div>
          <div class="w-px h-6 bg-gray-200"></div>
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-custom-main/10 flex items-center justify-center text-custom-main font-bold text-sm">2</div>
             <span class="font-bold text-gray-900">Персональный маршрут</span>
          </div>
          <div class="w-px h-6 bg-gray-200"></div>
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-custom-main/10 flex items-center justify-center text-custom-main font-bold text-sm">3</div>
             <span class="font-bold text-gray-900">Адаптивная практика</span>
          </div>
          <div class="w-px h-6 bg-gray-200"></div>
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-custom-main/10 flex items-center justify-center text-custom-main font-bold text-sm">4</div>
             <span class="font-bold text-gray-900">Разбор ошибок с ИИ</span>
          </div>
        </div>

        <p class="text-base md:text-xl font-medium text-gray-500 mt-10 md:mt-16">
          Один цикл — и ты <span class="text-custom-main font-bold">растёшь.</span>
        </p>
      </div>
    </section>

    <!-- Feature 1: Skill Graph (was Feature 3) -->
    <section class="py-20 md:py-32 px-4 md:px-10 bg-gradient-to-b from-white to-[#F0F4FF]">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1 lg:max-w-md">
            <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Умный маршрут</span>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Каждое задание<br>приближает <span class="text-custom-main">к цели</span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
              Ноль лишней работы - только то, что поднимает балл. После каждого ответа маршрут перестраивается: система находит твои слабые точки и направляет именно туда, где прирост будет максимальным прямо сейчас.
            </p>
          </div>

          <!-- Visual: Skill graph with live nodes -->
          <div class="flex-1 w-full">
            <div class="relative p-4 md:p-8">
              <div class="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                <div v-for="(skill, i) in skillTree" :key="i"
                  class="bg-white rounded-xl p-3 shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 cursor-default"
                  :class="skill.locked ? 'opacity-40 border-gray-100' : skill.progress === 100 ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="h-1.5 rounded-full flex-1 mr-2 bg-gray-100 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-1000"
                        :class="skill.progress === 100 ? 'bg-emerald-400' : 'bg-custom-main'"
                        :style="{ width: skill.progress + '%' }"
                      ></div>
                    </div>
                    <svg v-if="skill.progress === 100" class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else-if="skill.locked" class="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                    <span v-else class="text-[10px] font-bold text-custom-main">{{ skill.progress }}%</span>
                  </div>
                  <span class="text-xs md:text-sm font-medium" :class="skill.locked ? 'text-gray-400' : 'text-gray-700'">{{ skill.name }}</span>
                </div>
              </div>
              <!-- "Focus now" indicator -->
              <div class="mt-5 flex items-center justify-center gap-2 bg-custom-main/5 rounded-xl px-4 py-3 border border-custom-main/10">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-main opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-custom-main"></span>
                </span>
                <span class="text-sm font-semibold text-custom-main">Сейчас фокус:</span>
                <span class="text-sm text-gray-600">Quadratics - даст тебе +35 баллов</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 2: AI Tutor -->
    <section class="py-20 md:py-32 px-4 md:px-10 bg-[#F5F7FB]">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div class="flex-1 lg:max-w-md">
            <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Персональный разбор</span>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Застрял - спроси.<br><span class="text-custom-main">Не понял - спроси ещё раз</span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
              ИИ-тьютор разберёт любую ошибку столько раз, сколько нужно: другим языком, с другим примером, шаг за шагом. Никакого стеснения, никакого ожидания - только кристально ясное понимание.
            </p>
          </div>

          <!-- Visual: Chat interface -->
          <div class="flex-1 w-full max-w-lg">
            <div class="bg-white rounded-3xl shadow-xl p-5 md:p-6 border border-gray-100">
              <!-- Question card -->
              <div class="bg-gray-50 rounded-2xl p-4 mb-4">
                <span class="text-xs font-semibold text-custom-main uppercase tracking-wide">Math - Geometry</span>
                <p class="text-gray-900 mt-2 font-medium">A circle has area 49π. What is its circumference?</p>
              </div>

              <div ref="tutorChat" class="space-y-3 max-h-[280px] overflow-y-auto scroll-smooth tutor-chat-scroll" :class="{ 'mb-3': !tutorTyping }">
                <!-- User wrong answer -->
                <div class="flex gap-3 justify-end">
                  <div class="bg-red-50 border border-red-100 rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                    <p class="text-sm text-red-600 font-medium">49π</p>
                  </div>
                </div>
                <!-- AI: correct answer -->
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-xl bg-custom-main flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                    </svg>
                  </div>
                  <div class="bg-custom-blue rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p class="text-sm text-gray-700">Не совсем! Правильный ответ - <span class="font-bold text-emerald-600">14π</span>.</p>
                  </div>
                </div>
                <!-- AI: error explanation -->
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-xl bg-custom-main flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                    </svg>
                  </div>
                  <div class="bg-custom-blue rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p class="text-sm text-gray-700"><span class="font-semibold text-custom-main">Твоя ошибка:</span> ты перепутал площадь с длиной окружности. Area = πr², значит r² = 49 → r = 7. А circumference = 2πr = 2π·7 = <span class="font-bold">14π</span>.</p>
                  </div>
                </div>

                <!-- User follow-up (appears after sending) -->
                <div v-if="tutorSent" class="flex gap-3 justify-end">
                  <div class="bg-gray-100 rounded-2xl rounded-tr-sm p-3 max-w-[75%]">
                    <p class="text-sm text-gray-700 font-medium">{{ tutorUserMsg }}</p>
                  </div>
                </div>
                <!-- AI typing indicator -->
                <div v-if="tutorTyping" class="flex gap-3">
                  <div class="w-8 h-8 rounded-xl bg-custom-main flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                    </svg>
                  </div>
                  <div class="bg-custom-blue rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p class="text-sm text-gray-700">{{ tutorAiResponse }}<span class="inline-block w-0.5 h-4 bg-custom-main ml-0.5 animate-pulse align-middle"></span></p>
                  </div>
                </div>
                <!-- AI finished response -->
                <div v-if="tutorDone" class="flex gap-3">
                  <div class="w-8 h-8 rounded-xl bg-custom-main flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                    </svg>
                  </div>
                  <div class="bg-custom-blue rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p class="text-sm text-gray-700">{{ tutorFullResponse }}</p>
                  </div>
                </div>
              </div>

              <div v-if="!tutorSent" class="mt-4 flex gap-2">
                <input
                  v-model="tutorUserMsg"
                  type="text"
                  class="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-custom-main"
                  @keydown.enter="sendTutorMsg"
                />
                <button class="px-4 py-3 bg-custom-main text-white rounded-xl hover:bg-custom-hover transition-colors" @click="sendTutorMsg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
              <p class="text-[10px] text-gray-300 text-center mt-3">Демонстративный пример работы ИИ-тьютора</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 3: Vocabulary / Spaced Repetition -->
    <section class="py-20 md:py-32 px-4 md:px-10 bg-white">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1 lg:max-w-md">
            <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Запоминание без зубрёжки</span>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Слова, которые остаются<br><span class="text-custom-main">в голове навсегда</span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
              Встретил незнакомое слово - добавь одним нажатием. Перевод подставится сам, а алгоритм интервального повторения напомнит о слове ровно тогда, когда ты вот-вот его забудешь. Не раньше и не позже.
            </p>
          </div>

          <!-- Visual: Flashcard -->
          <div class="flex-1 w-full max-w-xl">
            <div class="relative flex flex-col items-center">
              <!-- Stack cards behind -->
              <div class="absolute top-3 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] h-[calc(100%-24px)] bg-gray-100 rounded-3xl opacity-40"></div>
              <div class="absolute top-1.5 left-1/2 -translate-x-1/2 w-[288px] md:w-[390px] h-[calc(100%-12px)] bg-gray-50 rounded-3xl border border-gray-100 opacity-60"></div>

              <!-- Active flashcard -->
              <div
                class="relative w-[296px] md:w-[400px] cursor-pointer perspective-card z-10"
                @click="flashcardFlipped = !flashcardFlipped"
              >
                <div class="card-inner w-full transition-transform duration-500" :class="{ 'rotate-y-180': flashcardFlipped }">
                  <!-- Front -->
                  <div class="card-face bg-white rounded-3xl border border-gray-200 shadow-xl px-6 py-6 md:px-10 md:py-8 backface-hidden flex flex-col justify-between min-h-[220px] md:min-h-[260px]">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] md:text-xs font-semibold text-custom-main uppercase tracking-widest">SAT Vocabulary</span>
                      <span class="text-[10px] md:text-xs text-gray-300">14 / 86</span>
                    </div>
                    <div class="text-center">
                      <span class="text-3xl md:text-4xl font-bold text-gray-900">Ubiquitous</span>
                      <p class="text-xs md:text-sm text-gray-400 mt-2">adjective · /juːˈbɪk.wɪ.təs/</p>
                    </div>
                    <div class="flex items-center justify-center gap-1.5 text-gray-300">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-6-6m0 0l6-6"/>
                      </svg>
                      <span class="text-xs">нажми, чтобы узнать перевод</span>
                    </div>
                  </div>
                  <!-- Back -->
                  <div class="card-face absolute inset-0 bg-custom-main rounded-3xl shadow-xl px-6 py-6 md:px-10 md:py-8 backface-hidden rotate-y-180 flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-widest">Перевод</span>
                      <span class="text-[10px] md:text-xs text-white/30">14 / 86</span>
                    </div>
                    <div class="text-center">
                      <span class="text-3xl md:text-4xl font-bold text-white">Повсеместный</span>
                      <p class="text-xs md:text-sm text-white/40 mt-2">present, appearing, or found everywhere</p>
                    </div>
                    <div class="flex gap-3">
                      <button class="flex-1 py-3 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors" @click.stop="flashcardFlipped = false">Не помню</button>
                      <button class="flex-1 py-3 rounded-xl bg-emerald-400 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors" @click.stop="flashcardFlipped = false">Помню</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Spaced repetition timeline -->
              <div class="mt-6 flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-gray-100 z-10">
                <span class="text-[10px] font-semibold text-gray-400">Интервалы:</span>
                <span class="w-2 h-2 rounded-full bg-custom-main"></span>
                <span class="text-[10px] text-gray-500">1д</span>
                <span class="w-px h-3 bg-gray-200"></span>
                <span class="w-2 h-2 rounded-full bg-custom-main/60"></span>
                <span class="text-[10px] text-gray-500">3д</span>
                <span class="w-px h-3 bg-gray-200"></span>
                <span class="w-2 h-2 rounded-full bg-custom-main/40"></span>
                <span class="text-[10px] text-gray-500">7д</span>
                <span class="w-px h-3 bg-gray-200"></span>
                <span class="w-2 h-2 rounded-full bg-custom-main/20"></span>
                <span class="text-[10px] text-gray-500">30д</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 4: Exam Simulation -->
    <section class="py-20 md:py-32 px-4 md:px-10 bg-[#F5F7FB]">
      <div class="max-w-[1200px] mx-auto">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div class="flex-1 lg:max-w-md">
            <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Полная симуляция</span>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              В день экзамена -<br><span class="text-custom-main">ноль сюрпризов</span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
              Интерфейс, тайминг, структура - один в один как настоящий SAT. К моменту экзамена формат будет ощущаться привычным, и ты потратишь ноль энергии на стресс - всю направишь на баллы.
            </p>
          </div>

          <!-- Visual: Browser frame with SAT screenshot -->
          <div class="flex-1 w-full max-w-lg">
            <div class="rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white">
              <!-- Browser chrome -->
              <div class="bg-[#E8EAED] px-4 py-2.5 flex items-center gap-3">
                <!-- Traffic lights -->
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
                </div>
                <!-- URL bar -->
                <div class="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 text-xs text-gray-500">
                  <svg class="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span class="truncate">qos.plus/practice</span>
                </div>
              </div>
              <!-- Screenshot area -->
              <div class="relative bg-gray-100">
                <img src="/sat-practice-interface.png" alt="QOS PLUS practice interface" class="w-full block" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <!-- Fallback placeholder if image not loaded -->
                <div class="hidden items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] flex-col gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-400 font-medium">Скриншот SAT Bluebook</span>
                  <span class="text-xs text-gray-300">exam-screenshot.png</span>
                </div>
              </div>
            </div>
            <!-- Caption under browser -->
            <p class="text-center text-xs text-gray-400 mt-3">Интерфейс QOS PLUS - максимально приближен к реальному экзамену</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" class="py-16 md:py-24 px-4 md:px-10 bg-white">
      <div class="max-w-[1200px] mx-auto">
        <div
          class="text-center mb-12 md:mb-16 opacity-0"
          :class="{ 'animate-fade-up': isVisible.demo }"
        >
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Попробуй прямо сейчас
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Реши пример с помощью нашего ИИ-ассистента
          </p>
        </div>

        <div
          class="max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 opacity-0"
          :class="{ 'animate-fade-up': isVisible.demo }"
        >
          <!-- Progress Bar -->
          <div class="h-2 bg-gray-100">
            <div class="h-full w-3/5 bg-gradient-to-r from-custom-main to-custom-input rounded-r-full transition-all duration-500"></div>
          </div>

          <div class="flex flex-col lg:flex-row">
            <!-- Question Panel -->
            <div class="flex-[6] p-6 md:p-8 lg:border-r border-b lg:border-b-0 border-gray-100">
              <div class="flex items-center gap-2 mb-6">
                <span class="bg-custom-main/10 text-custom-main text-xs font-semibold px-3 py-1.5 rounded-lg">Math</span>
                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">Algebra</span>
              </div>

              <div class="text-lg md:text-xl text-gray-900 leading-relaxed mb-8 font-medium">
                If 3x + 7 = 22, what is the value of 6x + 14?
              </div>

              <div class="space-y-3">
                <div
                  v-for="(option, i) in demoOptions"
                  :key="i"
                  class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200"
                  :class="getOptionClasses(option, i)"
                  @click="selectOption(i)"
                >
                  <div
                    class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 text-sm font-semibold"
                    :class="getRadioClasses(option, i)"
                  >
                    <svg v-if="quizSubmitted && i === correctAnswerIndex" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                    <svg v-else-if="option.selected && quizSubmitted && i !== correctAnswerIndex" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else>{{ String.fromCharCode(65 + i) }}</span>
                  </div>
                  <span :class="getTextClasses(option, i)" class="text-base font-medium">{{ option.text }}</span>
                  <span v-if="quizSubmitted && i === correctAnswerIndex && option.selected" class="ml-auto text-xs font-bold text-custom-correct uppercase bg-green-100 px-2 py-1 rounded-lg">Верно!</span>
                  <span v-if="quizSubmitted && i !== correctAnswerIndex && option.selected" class="ml-auto text-xs font-bold text-custom-error uppercase bg-red-100 px-2 py-1 rounded-lg">Неверно</span>
                </div>
              </div>

              <button
                v-if="quizSubmitted"
                @click="resetQuiz"
                class="mt-6 inline-flex items-center gap-2 text-custom-main text-sm font-semibold hover:text-custom-hover transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Попробовать снова
              </button>
            </div>

            <!-- AI Sidebar -->
            <div class="flex-[4] bg-[#F5F7FB] p-6 md:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-2xl bg-custom-main flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-gray-900">ИИ-ассистент</div>
                  <div class="text-xs text-gray-500">Режим подсказок</div>
                </div>
              </div>

              <!-- Chat bubbles -->
              <div class="space-y-4 mb-6">
                <template v-if="!quizSubmitted">
                  <div class="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      Here's a hint: <span class="text-custom-main font-semibold">Notice that 6x + 14 = 2(3x + 7)</span>
                    </p>
                  </div>
                  <div class="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    <p class="text-sm text-gray-700 leading-relaxed">
                      You know that 3x + 7 = 22. Can you use this? 🤔
                    </p>
                  </div>
                </template>

                <template v-else>
                  <div
                    class="rounded-2xl rounded-tl-sm p-4 shadow-sm"
                    :class="isCorrectAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center"
                        :class="isCorrectAnswer ? 'bg-custom-correct' : 'bg-custom-error'"
                      >
                        <svg v-if="isCorrectAnswer" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                        <svg v-else class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </div>
                      <span class="text-sm font-bold" :class="isCorrectAnswer ? 'text-custom-correct' : 'text-custom-error'">
                        {{ isCorrectAnswer ? 'Отлично!' : 'Не совсем верно' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed">
                      {{ aiResponse }}<span v-if="isTyping" class="inline-block w-0.5 h-4 bg-custom-main ml-0.5 animate-pulse"></span>
                    </p>
                  </div>
                </template>
              </div>

              <!-- Action buttons -->
              <div class="space-y-3">
                <button
                  v-if="!quizSubmitted"
                  class="w-full flex items-center justify-center gap-2 bg-custom-main text-white py-3 rounded-xl text-sm font-semibold hover:bg-custom-hover transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Показать решение
                </button>
                <button
                  v-if="!quizSubmitted"
                  class="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Ещё подсказка
                </button>
                <button
                  v-if="quizSubmitted"
                  @click="resetQuiz"
                  class="w-full flex items-center justify-center gap-2 bg-custom-main text-white py-3 rounded-xl text-sm font-semibold hover:bg-custom-hover transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Следующий вопрос
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 md:py-20 px-4 md:px-10 bg-white border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto">
        <h2 class="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Нам доверились более <span class="text-custom-main">2,000+</span> студентов
        </h2>
        <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-bold text-gray-900">+250</span>
            <span class="text-sm text-gray-500">средний рост баллов</span>
          </div>
          <div class="w-px h-10 bg-gray-200 hidden md:block"></div>
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-1 mb-1">
              <svg v-for="i in 5" :key="'star'+i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="text-sm text-gray-500">оценка 5.0 наших продуктов</span>
          </div>
          <div class="w-px h-10 bg-gray-200 hidden md:block"></div>
          <div class="flex flex-col items-center">
            <span class="text-2xl md:text-3xl font-bold text-custom-main font-mono">1590</span>
            <span class="text-sm text-gray-500">балл лучшего студента</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 md:py-28 px-4 md:px-10 bg-gradient-to-b from-white to-[#F8FAFF]">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-14 md:mb-20">
          <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Истории успеха</span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">Реальные результаты<br class="hidden md:block"> наших студентов</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-lg font-bold text-purple-400 shrink-0">ШС</div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Шугыла Сейдахмет</h4>
                <p class="text-sm text-gray-400">Цель: США и Азия</p>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-5">
              <span class="text-sm font-semibold text-red-400 bg-red-50 px-3 py-1 rounded-full">1120</span>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">1500</span>
              <span class="text-xs font-bold text-green-500 ml-1">+380</span>
            </div>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed flex-1">«В начале я думала, что мой потолок - 1400. Было тяжело: вроде умная, а балл на первом Bluebook оказался низким. В QOS я увидела свой реальный прогресс в цифрах. Никакого стресса в классе, только четкая работа над ошибками. Главный инсайт: делайте self-study на платформе, это реально решает!»</p>
          </div>

          <!-- Testimonial 2 -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white shadow-sm flex items-center justify-center text-lg font-bold text-blue-400 shrink-0">ЖБ</div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Жанел Бекболат</h4>
                <p class="text-sm text-gray-400">Цель: Италия, Венгрия, Китай</p>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-5">
              <span class="text-sm font-semibold text-red-400 bg-red-50 px-3 py-1 rounded-full">1290</span>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">1480</span>
              <span class="text-xs font-bold text-green-500 ml-1">+190</span>
            </div>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed flex-1">«До QOS я готовилась в другой школе, но здесь совершенно другой уровень интенсивности. Занятия почти каждый день, кураторские созвоны и крутая платформа. Вначале было страшно от объема, но геймификация и формат домашек затянули. Если понимаете, зачем вам SAT - вам сюда».</p>
          </div>

          <!-- Testimonial 3 (hidden on mobile by default) -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col" :class="showAllTestimonials ? '' : 'hidden md:flex'">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-lg font-bold text-orange-400 shrink-0">АО</div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Алдияр Омарбеков</h4>
                <p class="text-sm text-gray-400">Цель: NU, Венгрия</p>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-5">
              <span class="text-sm font-semibold text-red-400 bg-red-50 px-3 py-1 rounded-full">1150</span>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">1530</span>
              <span class="text-xs font-bold text-green-500 ml-1">+380 за 3 мес.</span>
            </div>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed flex-1">«Пришел с нулем знаний о формате SAT. За три месяца вырос на 380 баллов. Расписание построено так, что ты успеваешь делать все домашки без перегруза. Очень сильная методика: ничего лишнего, только то, что действительно нужно для роста балла».</p>
          </div>

          <!-- Testimonial 4 (hidden on mobile by default) -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col" :class="showAllTestimonials ? '' : 'hidden md:flex'">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-white shadow-sm flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0">ИК</div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Инкар Калиева</h4>
                <p class="text-sm text-gray-400">Flipped Classroom</p>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-5">
              <span class="text-sm font-semibold text-red-400 bg-red-50 px-3 py-1 rounded-full">1090</span>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">1480</span>
              <span class="text-xs font-bold text-green-500 ml-1">+390</span>
            </div>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed flex-1">«Мой первый тест - 1090, я уже думала сдаться и идти на Foundation. Но в QOS крутой формат: всю теорию мы смотрели на видео заранее, а на уроках сразу переходили к жесткой практике. Это невероятно ускоряет прогресс. Математику закрыла полностью!»</p>
          </div>
        </div>

        <!-- "Show more" button - mobile only -->
        <div v-if="!showAllTestimonials" class="mt-6 text-center md:hidden">
          <button
            @click="showAllTestimonials = true"
            class="inline-flex items-center gap-2 text-custom-main font-semibold text-sm hover:text-custom-hover transition-colors"
          >
            Показать ещё
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Logo Cloud Section (Universities) -->
    <section class="py-20 md:py-32 px-4 bg-white relative overflow-hidden border-t border-gray-100">
      <div
        aria-hidden="true"
        class="-top-1/4 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[60vmin] w-[60vmin] rounded-b-full bg-[radial-gradient(ellipse_at_center,rgba(8,44,174,0.04),transparent_60%)]"
      ></div>

      <div class="relative mx-auto max-w-4xl">
        <div class="text-center mb-10">
          <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">География наших выпускников</span>
          <h2 class="font-medium text-gray-900 text-2xl tracking-tight md:text-4xl">
            <span class="text-gray-400">Поступают в лучшие.</span>
            <br />
            <span class="font-bold">Учатся в топовых ВУЗах мира.</span>
          </h2>
        </div>
        
        <div class="mx-auto my-8 h-px max-w-sm bg-gray-200 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud :logos="universities" />

        <div class="mt-8 h-px w-full max-w-3xl mx-auto bg-gray-200 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 md:py-28 px-4 md:px-10 bg-white">
      <div class="max-w-[800px] mx-auto">
        <div class="text-center mb-12 md:mb-16">
          <span class="inline-block text-xs font-semibold tracking-widest uppercase text-custom-main mb-4">Частые вопросы</span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900">Ответы на главные вопросы</h2>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i"
            class="border border-gray-200 rounded-2xl overflow-hidden transition-all"
            :class="openFaq === i ? 'bg-gray-50' : 'bg-white hover:border-gray-300'"
          >
            <button
              class="w-full flex items-center justify-between p-5 md:p-6 text-left"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="text-base md:text-lg font-semibold text-gray-900 pr-4">{{ faq.q }}</span>
              <svg
                class="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': openFaq === i }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div
              class="overflow-hidden transition-[max-height,opacity] duration-300"
              :style="{ maxHeight: openFaq === i ? '300px' : '0px', opacity: openFaq === i ? 1 : 0 }"
            >
              <p class="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 md:py-24 px-4 md:px-10 relative overflow-hidden" style="background: radial-gradient(circle at 70% 50%, #1a3a8f 0%, #082CAE 40%, #051d6e 100%);">
      <div class="absolute inset-0 opacity-10" style="background: repeating-conic-gradient(from 0deg at 70% 50%, transparent 0deg, rgba(255,255,255,0.05) 2deg, transparent 4deg);"></div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
          Узнай свой уровень за 5 минут
        </h2>
        <p class="text-lg md:text-xl text-white/80 mb-10">
          Бесплатный диагностический тест покажет твои пробелы и построит персональный план подготовки.
        </p>
        <button class="btn-3d !text-lg !px-10 !py-4" @click="goToQuiz">
          Получить план →
        </button>
        <div class="mt-6 flex items-center justify-center gap-4 text-sm text-white/50">
          <span>Бесплатно</span>
          <span class="w-1 h-1 rounded-full bg-white/30"></span>
          <span>Без обязательств</span>
          <span class="w-1 h-1 rounded-full bg-white/30"></span>
          <span>Результат сразу</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 md:py-16 px-4 md:px-10 bg-gray-900">
      <div class="max-w-[1200px] mx-auto">
        <!-- Big logo wordmark -->
        <div class="flex flex-col items-center md:items-start mb-10">
          <svg class="h-24 md:h-36 w-auto text-white mb-4" viewBox="0 0 1500 1500" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M391.754 557.633c82.43.261 143.808 36.273 184.14 108.043 28.786-56.344 74.29-91 136.504-103.977 77.79-12.02 141.88 12.183 192.27 72.61 6.875 10.261 13.457 20.714 19.75 31.366 34.738-65.91 89.536-101.73 164.387-107.461 85.488-.101 147.836 37.852 187.043 113.852-41.02 1.871-82.067 2.258-123.145 1.16-35.058-20.398-70.297-20.785-105.718-1.16-12.395 7.746-22.462 17.812-30.208 30.207 89.844.191 179.687.773 269.527 1.742 17.453 79.098-3.847 145.512-63.898 199.238-56.746 43.54-119.481 54.77-188.203 33.692-48.887-18.106-85.676-50.055-110.368-95.844-43.152 75.8-108.597 110.848-196.336 105.137-68.418-9.801-119.148-44.844-152.188-105.137-8.578 15.77-19.035 30.293-31.367 43.566 21.105 21.106 42.211 42.208 63.316 63.313.797.969.606 1.742-.582 2.324-40.504-1.547-80.969-1.547-121.402 0-5.051-5.246-10.281-10.281-15.684-15.101-67.082 22.586-129.43 13.484-187.043-27.301-65.243-54.774-88.286-123.899-69.125-207.375 20.406-67.262 63.972-112.988 130.699-135.18 15.812-4.183 31.691-7.086 47.629-8.715zM389.434 657.543c52.273-1.863 86.93 21.758 103.976 70.867 9.055 47.25-6.629 83.457-47.05 108.625-46.934 20.664-87.403 11.953-121.403-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.437-32.77 64.477-37.176zm348.523 0c52.274-1.863 86.93 21.758 103.977 70.867 9.058 47.25-6.625 83.457-47.051 108.625-46.933 20.664-87.398 11.953-121.402-26.14-25.559-38.711-25.559-77.434 0-116.176 16.945-20.375 38.441-32.77 64.476-37.176zm199.82 145.219c80.551-.192 161.098 0 241.645.582-32.243 43.394-73.68 55.015-124.309 34.851-5.226-2.805-10.261-5.903-15.101-9.293-37.2.18-74.375.18-111.527 0 4.133-8.336 7.231-17.051 9.293-26.14z"/></svg>
          <p class="text-sm text-gray-500 mb-6">QOS PLUS - платформа QOS Education</p>
          <div class="flex items-center gap-6 md:gap-8">
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-800 pt-8">
          <!-- SAT trademark disclaimer -->
          <p class="text-sm text-gray-500 text-center md:text-left mb-4 max-w-2xl">
            SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this product.
          </p>

          <!-- Bottom row -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-3">
            <span class="text-xs text-gray-600">© 2023 ТОО "QOS Education". Все права защищены.</span>
            <span class="text-xs text-gray-700 font-medium tracking-wider">EST 2023</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, h } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import RainbowButton from './ui/RainbowButton.vue'
import LogoCloud from './ui/LogoCloud.vue'
import TheInfiniteGrid from './ui/TheInfiniteGrid.vue'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const goToQuiz = () => router.push('/quiz')

// Sticky nav & Hero GSAP state
const navBar = ref(null)
const heroSection = ref(null)
const heroContent = ref(null)

// Flashcard flip state
const flashcardFlipped = ref(false)
const showAllTestimonials = ref(false)

// AI Tutor demo state
// FAQ data
const openFaq = ref(null)
const faqs = [
  {
    q: 'Чем QOS PLUS отличается от бесплатных ресурсов типа Khan Academy?',
    a: 'Khan Academy даёт общий контент для всех. QOS PLUS строит индивидуальный маршрут: система видит твои пробелы и каждый день подбирает именно те задания, которые быстрее всего поднимут балл. Плюс ИИ-тьютор, который разбирает каждую ошибку лично с тобой.'
  },
  {
    q: 'Мне нужно заниматься каждый день?',
    a: 'Идеально - 30-60 минут в день, 5-6 дней в неделю. Но система подстраивается под твой темп: если пропустил день, маршрут пересчитается. Главное - регулярность, а не количество часов.'
  },
  {
    q: 'Я начинаю с низкого балла (1000-1100). Это для меня?',
    a: 'Да. Skill Graph работает с любого уровня. Многие наши студенты начинали с 1000-1100 и выходили на 1450+. Чем ниже старт, тем быстрее первые 200 баллов роста.'
  },
  {
    q: 'Это автоматический бот или реальные люди?',
    a: 'ИИ-тьютор работает 24/7 и разбирает ошибки мгновенно. За платформой стоит методика команды QOS Education, основанная на опыте выпускников топовых университетов.'
  },
  {
    q: 'Диагностический тест реально бесплатный?',
    a: 'Да, полностью. Ты получишь разбор своих сильных и слабых сторон, персональный Skill Graph и рекомендации - без оплаты и без обязательств.'
  },
  {
    q: 'Подходит ли для подготовки к Digital SAT?',
    a: 'Да. Платформа полностью адаптирована под формат Digital SAT: адаптивная структура, тайминг, типы заданий - всё как на реальном экзамене.'
  }
]

// Universities data
const universities = [
  { name: 'Johns Hopkins University', short: 'JHU' },
  { name: 'Cornell University', short: 'CU' },
  { name: 'UPenn', short: 'UP' },
  { name: 'Nazarbayev University', short: 'NU' },
  { name: 'Duke University', short: 'DU' },
  { name: 'NYU', short: 'NYU' },
  { name: 'MBZUAI', short: 'MBZ' },
  { name: 'KAIST', short: 'KA' },
  { name: 'Bocconi', short: 'BOC' },
  { name: 'Yonsei University', short: 'YU' },
  { name: 'Korea University', short: 'KU' },
  { name: 'HKU', short: 'HKU' },
  { name: 'CUHK Shenzhen', short: 'CU' },
  { name: 'CityU HK', short: 'CIT' },
]

const tutorChat = ref(null)
const tutorUserMsg = ref('А можешь объяснить по-другому?')
const tutorSent = ref(false)
const tutorTyping = ref(false)
const tutorDone = ref(false)
const tutorAiResponse = ref('')
const tutorFullResponse = 'Конечно! Представь пиццу. Площадь круга = πr². У нас площадь 49π, значит r² = 49, то есть радиус = 7. А длина окружности - это "обод" пиццы: C = 2πr = 2 × π × 7 = 14π. Площадь - это то, что внутри, а окружность - то, что по краю!'

const sendTutorMsg = () => {
  if (!tutorUserMsg.value.trim() || tutorSent.value) return
  tutorSent.value = true
  tutorTyping.value = true
  tutorAiResponse.value = ''

  const scrollToBottom = () => {
    if (tutorChat.value) {
      tutorChat.value.scrollTop = tutorChat.value.scrollHeight
    }
  }

  // Scroll to show user message
  nextTick(scrollToBottom)

  const text = tutorFullResponse
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      tutorAiResponse.value = text.substring(0, i + 1)
      i++
      // Auto-scroll as AI types
      scrollToBottom()
    } else {
      clearInterval(typeInterval)
      tutorTyping.value = false
      tutorDone.value = true
      scrollToBottom()
    }
  }, 20)
}

// Animated score counter
const animatedScore = ref(1000)
const scoreColor = ref('#EF4444') // Start red

// Graph animation refs
const graphCard = ref(null)
const graphAnimated = ref(false)
const chaosPath = ref(null)
const chaosClipRect = ref(null)
const systemPath = ref(null)
const startLabel = ref(null)
const startLabelMobile = ref(null)
const endLabel = ref(null)
const endLabelMobile = ref(null)
const endDot = ref(null)
const badge = ref(null)
const chaosEndDot = ref(null)
const chaosEndLabel = ref(null)
const chaosLabel = ref(null)

// Generate chaotic path with clean sine wave + minimal noise
const chaosPathD = ref('')

// Store chaos endpoint for dynamic dot placement
const chaosEndPoint = reactive({ x: 375, y: 135 })

const generateChaosPath = () => {
  // Both lines start from exact same point (55, 245)
  // Chaos rises gradually - slow at first, then faster, then plateaus
  const startX = 55, startY = 245
  const endX = 375, endY = 135
  const totalX = endX - startX
  const totalY = startY - endY // 110 units of climb

  // System line: (55,245) → (340,35)
  const systemLineY = (px) => 245 + (35 - 245) * ((px - 55) / (340 - 55))

  const pts = []
  const steps = 50
  const stepSize = totalX / steps

  let prevY = startY

  for (let i = 0; i <= steps; i++) {
    const x = startX + i * stepSize
    const t = i / steps

    // S-curve: starts slow, accelerates mid, plateaus at end
    // Using a piecewise approach:
    let progress
    if (t < 0.2) {
      // Slow start - barely rising
      progress = t * t * 2.5 // quadratic, slow
    } else if (t < 0.65) {
      // Mid section - steady climb
      const mid = (t - 0.2) / 0.45
      progress = 0.1 + mid * 0.6
    } else {
      // Plateau - flattening out
      const tail = (t - 0.65) / 0.35
      progress = 0.7 + tail * 0.3 * (1 - tail * 0.5)
    }

    const baseY = startY - totalY * progress

    // Small wobbles, smaller at start and end, bigger in the middle
    const wobbleAmp = Math.sin(t * Math.PI) * 10
    const wobble = Math.sin(t * 20 + i * 0.7) * wobbleAmp * (0.4 + Math.random() * 0.6)

    const noise = (Math.random() - 0.5) * 3

    let y
    if (i === 0) {
      // Force exact start point
      y = startY
    } else {
      y = baseY + wobble + noise

      // Smooth: don't jump too far from previous point
      const maxDelta = 10
      y = Math.max(prevY - maxDelta, Math.min(prevY + maxDelta, y))

      // Never cross above the system line (keep 15px buffer)
      const minY = systemLineY(x) + 15
      y = Math.max(minY, y)
    }

    prevY = y
    pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10])
  }

  // Save endpoint for dot placement
  const lastPt = pts[pts.length - 1]
  chaosEndPoint.x = lastPt[0]
  chaosEndPoint.y = lastPt[1]

  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0]},${pts[i][1]}`
  }

  chaosPathD.value = d
}

const animateGraph = () => {
  // ===== PHASE 1: Both labels appear immediately =====
  if (startLabel.value) {
    startLabel.value.classList.remove('opacity-0')
    startLabel.value.classList.add('opacity-100')
  }
  if (startLabelMobile.value) {
    startLabelMobile.value.classList.remove('opacity-0')
    startLabelMobile.value.classList.add('opacity-100')
  }

  // ===== Chaos draws slowly (0 - 2.2s) =====
  if (chaosClipRect.value) {
    const duration = 2200
    const startTime = performance.now()
    let chaosEndDotShown = false
    const animateClip = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentWidth = eased * 460
      chaosClipRect.value?.setAttribute('width', currentWidth.toString())

      // Show chaos end dot the instant the clip reaches the endpoint
      if (!chaosEndDotShown && currentWidth >= chaosEndPoint.x) {
        chaosEndDotShown = true
        if (chaosEndDot.value) {
          chaosEndDot.value.style.transition = 'opacity 0.15s ease'
          chaosEndDot.value.style.opacity = '1'
        }
      }

      if (progress < 1) requestAnimationFrame(animateClip)
    }
    requestAnimationFrame(animateClip)
  }

  // ===== System line shoots fast (0.6s) - finishes before chaos =====
  setTimeout(() => {
    if (systemPath.value) {
      systemPath.value.style.transition = 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      systemPath.value.style.strokeDashoffset = '0'

      // End dot fade starts slightly before line finishes so they sync visually
      setTimeout(() => {
        if (endDot.value) {
          endDot.value.style.transition = 'opacity 0.15s ease'
          endDot.value.style.opacity = '1'
        }
      }, 320)
    }
  }, 600)

  // ===== All labels appear together shortly before chaos finishes =====
  setTimeout(() => {
    const fade = (el) => {
      if (el) {
        el.style.transition = 'opacity 0.3s ease'
        el.style.opacity = '1'
      }
    }
    fade(badge.value)        // "С нами"
    fade(chaosLabel.value)   // "Без нас"
    fade(chaosEndLabel.value) // "Потолок ~1300" text
  }, 1050)

}

const animateScore = () => {
  const startScore = 1000
  const endScore = 1500
  const duration = 1500 // 1.5 seconds
  const startTime = performance.now()

  // Color interpolation: red (#EF4444) -> blue (#082CAE)
  const startRGB = { r: 239, g: 68, b: 68 }
  const endRGB = { r: 8, g: 44, b: 174 }

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic for smooth deceleration
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    // Animate score
    animatedScore.value = Math.round(startScore + (endScore - startScore) * easeProgress)

    // Animate color
    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * easeProgress)
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * easeProgress)
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * easeProgress)
    scoreColor.value = `rgb(${r}, ${g}, ${b})`

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}


// Feature modal state
const activeFeatureIndex = ref(null)

const openFeatureModal = (index) => {
  activeFeatureIndex.value = index
  document.body.style.overflow = 'hidden'
}

const closeFeatureModal = () => {
  activeFeatureIndex.value = null
  document.body.style.overflow = ''
}

// Icons as components
const FlashcardIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
  ])
}

const ChartIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ])
}

const AIIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
  ])
}

// Visibility state for scroll animations
const isVisible = reactive({
  hero: false,
  features: false,
  howItWorks: false,
  demo: false
})

// Demo options state
const demoOptions = ref([
  { text: '30', selected: false },
  { text: '44', selected: false },
  { text: '58', selected: false },
  { text: '66', selected: false }
])

// Quiz interaction state
const quizSubmitted = ref(false)
const selectedAnswerIndex = ref(null)
const isCorrectAnswer = ref(false)
const aiResponse = ref('')
const isTyping = ref(false)

const correctAnswerIndex = 1

const correctExplanation = "Great job! You recognized that 6x + 14 = 2(3x + 7). Since 3x + 7 = 22, we multiply: 2 × 22 = 44. This factoring trick is very common on the SAT!"

const wrongExplanations = {
  0: "Let's work through this. Notice that 6x + 14 = 2(3x + 7). Since 3x + 7 = 22, we get 2 × 22 = 44. The correct answer is B.",
  2: "Close! You might have added instead of multiplied. Remember: 6x + 14 = 2(3x + 7) = 2 × 22 = 44. Answer is B.",
  3: "Not quite. The key is factoring: 6x + 14 = 2(3x + 7). Since 3x + 7 = 22, the answer is 2 × 22 = 44 (B)."
}

// Typing effect function
let typingTimeoutId = null

const typeText = (text, callback) => {
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId)
    typingTimeoutId = null
  }

  isTyping.value = true
  aiResponse.value = ''
  let index = 0
  const speed = 20

  const typeChar = () => {
    if (index < text.length) {
      aiResponse.value = text.substring(0, index + 1)
      index++
      typingTimeoutId = setTimeout(typeChar, speed)
    } else {
      isTyping.value = false
      typingTimeoutId = null
      if (callback) callback()
    }
  }

  typeChar()
}

const selectOption = (index) => {
  if (quizSubmitted.value) return

  demoOptions.value.forEach((opt, i) => {
    opt.selected = i === index
  })

  selectedAnswerIndex.value = index
  quizSubmitted.value = true
  isCorrectAnswer.value = index === correctAnswerIndex

  const explanation = index === correctAnswerIndex
    ? correctExplanation
    : wrongExplanations[index]

  setTimeout(() => {
    typeText(explanation)
  }, 300)
}

const resetQuiz = () => {
  quizSubmitted.value = false
  selectedAnswerIndex.value = null
  isCorrectAnswer.value = false
  aiResponse.value = ''
  isTyping.value = false
  demoOptions.value.forEach(opt => {
    opt.selected = false
  })
}

// Helper functions for option styling
const getOptionClasses = (option, index) => {
  if (!quizSubmitted.value) {
    if (option.selected) {
      return 'border-custom-main bg-custom-blue cursor-pointer'
    }
    return 'border-gray-200 hover:border-custom-main/50 hover:bg-gray-50 cursor-pointer'
  }

  if (option.selected) {
    if (index === correctAnswerIndex) {
      return 'border-custom-correct bg-green-50 cursor-default'
    }
    return 'border-custom-error bg-red-50 cursor-default'
  }

  if (index === correctAnswerIndex && selectedAnswerIndex.value !== correctAnswerIndex) {
    return 'border-custom-correct bg-green-50/50 cursor-default'
  }

  return 'border-gray-200 cursor-default opacity-50'
}

const getRadioClasses = (option, index) => {
  if (!quizSubmitted.value) {
    if (option.selected) {
      return 'border-custom-main bg-custom-main text-white'
    }
    return 'border-gray-300 text-gray-400'
  }

  if (option.selected) {
    if (index === correctAnswerIndex) {
      return 'border-custom-correct bg-custom-correct text-white'
    }
    return 'border-custom-error bg-custom-error text-white'
  }

  if (index === correctAnswerIndex) {
    return 'border-custom-correct bg-custom-correct text-white'
  }

  return 'border-gray-300 text-gray-300'
}

const getTextClasses = (option, index) => {
  if (!quizSubmitted.value) {
    return 'text-gray-900'
  }

  if (option.selected) {
    if (index === correctAnswerIndex) {
      return 'text-custom-correct'
    }
    return 'text-custom-error'
  }

  if (index === correctAnswerIndex) {
    return 'text-custom-correct'
  }

  return 'text-gray-400'
}

// Features data
const features = [
  {
    title: 'Smart Flashcards',
    description: 'AI-powered spaced repetition optimizes your review schedule based on how well you know each concept.',
    fullDescription: 'Master vocabulary, formulas, and key concepts with our intelligent flashcard system. The AI tracks your memory patterns and schedules reviews at the perfect moment - right before you would forget.',
    highlights: [
      'Spaced repetition algorithm adapts to your learning speed',
      'Create cards from any SAT practice question',
      'Audio pronunciation for vocabulary words',
      'Track mastery level for each concept'
    ],
    icon: FlashcardIcon,
    iconBg: 'bg-custom-main/10',
    iconColor: 'text-custom-main',
    modalBg: 'bg-gradient-to-br from-custom-main to-custom-hover',
    modalImage: '',
    badges: [
      { text: 'Great job!', class: 'bg-white text-custom-main', style: 'top: 20%; left: 10%;' },
      { text: '+15 cards today', class: 'bg-custom-gold text-gray-900', style: 'bottom: 25%; right: 10%;' }
    ]
  },
  {
    title: 'Progress Analytics',
    description: 'Track your improvement with detailed insights, score predictions, and personalized recommendations.',
    fullDescription: 'Get a complete picture of your SAT preparation progress. Our analytics dashboard shows you exactly where you stand, predicts your score, and tells you what to focus on next.',
    highlights: [
      'Real-time score predictions based on your performance',
      'Identify weak areas with detailed breakdowns',
      'Track study streaks and daily goals',
      'Compare progress across different subjects'
    ],
    icon: ChartIcon,
    iconBg: 'bg-custom-correct/10',
    iconColor: 'text-custom-correct',
    modalBg: 'bg-gradient-to-br from-custom-correct to-green-600',
    modalImage: '',
    badges: [
      { text: '+120 points', class: 'bg-white text-custom-correct', style: 'top: 15%; right: 15%;' },
      { text: '85% accuracy', class: 'bg-custom-gold text-gray-900', style: 'bottom: 20%; left: 15%;' }
    ]
  },
  {
    title: 'AI Tutor',
    description: 'Get instant explanations, hints, and step-by-step solutions whenever you need help.',
    fullDescription: 'Never get stuck on a problem again. Our AI tutor provides personalized guidance, breaks down complex concepts, and helps you understand the "why" behind every answer.',
    highlights: [
      'Step-by-step explanations for every question',
      'Hints that guide without giving away answers',
      'Learn problem-solving strategies for each topic',
      'Available 24/7 whenever you need help'
    ],
    icon: AIIcon,
    iconBg: 'bg-custom-orange/20',
    iconColor: 'text-custom-orange',
    modalBg: 'bg-gradient-to-br from-custom-orange to-orange-600',
    modalImage: '',
    badges: [
      { text: 'Here\'s a hint...', class: 'bg-white text-custom-orange', style: 'top: 20%; left: 10%;' },
      { text: '24/7 available', class: 'bg-custom-main text-white', style: 'bottom: 25%; right: 10%;' }
    ]
  }
]

// Skill tree data for personalized learning visual
const skillTree = [
  { name: 'Fractions', progress: 100, locked: false },
  { name: 'Decimals', progress: 100, locked: false },
  { name: 'Percentages', progress: 100, locked: false },
  { name: 'Ratios', progress: 85, locked: false },
  { name: 'Linear Eq.', progress: 100, locked: false },
  { name: 'Quadratics', progress: 60, locked: false },
  { name: 'Functions', progress: 45, locked: false },
  { name: 'Exponents', progress: 100, locked: false },
  { name: 'Radicals', progress: 30, locked: false },
  { name: 'Geometry', progress: 20, locked: false },
  { name: 'Trig', progress: 0, locked: true },
  { name: 'Statistics', progress: 0, locked: true },
]

// Steps data
const steps = [
  {
    title: 'Diagnostic Test',
    description: 'Take a quick assessment to identify your strengths and areas for improvement.'
  },
  {
    title: 'Personal Study Plan',
    description: 'AI creates a custom roadmap targeting your weakest areas first.'
  },
  {
    title: 'Adaptive Practice',
    description: 'Questions adjust in difficulty based on your performance in real-time.'
  }
]

// Custom smooth scroll
const smoothScrollTo = (targetId, duration = 1200) => {
  const target = document.getElementById(targetId)
  if (!target) return

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime = null

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easeProgress = easeOutCubic(progress)

    window.scrollTo(0, startPosition + distance * easeProgress)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

// Intersection Observer
let observer = null
let heroObserver = null

// Escape key handler for modal
const handleEscape = (e) => {
  if (e.key === 'Escape' && activeFeatureIndex.value !== null) {
    closeFeatureModal()
  }
}

onMounted(() => {
  // Add escape key listener
  document.addEventListener('keydown', handleEscape)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Start score animation after a short delay
  if (prefersReducedMotion) {
    animatedScore.value = 1500
    scoreColor.value = '#082CAE'
    Object.keys(isVisible).forEach(key => {
      isVisible[key] = true
    })
    return
  }

  // Setup GSAP animations for Hero & Nav
  if (navBar.value && heroSection.value) {
    // Reveal Pill Nav when scrolling past Hero's entire area
    ScrollTrigger.create({
      trigger: heroSection.value,
      start: 'bottom top', // Trigger when the bottom of hero hits the top of the viewport
      onEnter: () => {
        navBar.value.classList.remove('-translate-y-[150%]', 'opacity-0', 'pointer-events-none')
        navBar.value.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto')
      },
      onLeaveBack: () => {
        navBar.value.classList.add('-translate-y-[150%]', 'opacity-0', 'pointer-events-none')
        navBar.value.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto')
      }
    })
  }

  // Generate chaos path with stochastic noise
  generateChaosPath()

  // Observe graph card - animate only when visible
  const graphObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !graphAnimated.value) {
          graphAnimated.value = true
          setTimeout(animateScore, 200)
          setTimeout(animateGraph, 400)
          graphObserver.disconnect()
        }
      })
    },
    { threshold: 0.3 }
  )
  if (graphCard.value) {
    graphObserver.observe(graphCard.value)
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.section
          if (id && isVisible.hasOwnProperty(id)) {
            isVisible[id] = true
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  const sections = [
    { id: 'features', key: 'features' },
    { id: 'how-it-works', key: 'howItWorks' },
    { id: 'demo', key: 'demo' }
  ]

  sections.forEach(({ id, key }) => {
    const el = document.getElementById(id)
    if (el) {
      el.dataset.section = key
      observer.observe(el)
    }
  })

  setTimeout(() => {
    isVisible.hero = true
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  if (observer) {
    observer.disconnect()
  }
  if (heroObserver) {
    heroObserver.disconnect()
  }
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId)
  }
  // Reset body overflow in case modal was open
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Hidden scrollbar for tutor chat */
.tutor-chat-scroll::-webkit-scrollbar {
  display: none;
}
.tutor-chat-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* University marquee */
.uni-marquee-track {
  animation: uni-scroll 40s linear infinite;
}
.uni-marquee-track:hover {
  animation-play-state: paused;
}
@keyframes uni-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Score label cards */
.glass-card-red {
  background: #fff0f0;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.08);
}

.glass-card-green {
  background: #ecfdf5;
  border: 1.5px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
}

.feature-card {
  will-change: transform;
}

/* Skill Graph Animations */
@keyframes draw {
  from {
    stroke-dasharray: 0 1000;
  }
  to {
    stroke-dasharray: 1000 0;
  }
}

@keyframes draw-slow {
  from {
    stroke-dasharray: 0 1000;
  }
  to {
    stroke-dasharray: 1000 0;
  }
}

@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-draw {
  stroke-dasharray: 0 1000;
  animation: draw 1s ease-out forwards;
}

.animate-draw-slow {
  stroke-dasharray: 0 1000;
  animation: draw-slow 2s ease-out forwards;
}

.animate-pop {
  opacity: 0;
  animation: pop 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* SVG text styling */
.skill-node text {
  font-family: 'Inter', sans-serif;
}

.fill-custom-main {
  fill: #082CAE;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

/* 3D Flashcard flip */
.perspective-card {
  perspective: 800px;
}
.card-inner {
  transform-style: preserve-3d;
}
.card-face {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Exam timer pulse */
.exam-timer {
  animation: timer-pulse 2s ease-in-out infinite;
}
@keyframes timer-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Horizontal Flow Animation */
.animate-flow-cycle {
  animation: flow-cycle 4s linear infinite;
  transform-origin: left center;
  will-change: transform;
}
@keyframes flow-cycle {
  0% { transform: translateX(-150px); }
  100% { transform: translateX(1000px); }
}
</style>
