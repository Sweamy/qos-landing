<template>
  <div
    :class="[
      'overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
      customClass
    ]"
  >
    <InfiniteSlider :gap="32" :reverse="reverse" :speed="40" :speedOnHover="20">
      <div 
        v-for="logo in logos" 
        :key="logo.short" 
        class="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-5 py-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_-10px_rgba(8,44,174,0.15)] hover:border-custom-main/20 transition-all whitespace-nowrap"
      >
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 border border-gray-200/50 shadow-inner">
          <span class="text-xs font-black text-custom-main tracking-wider">{{ logo.short }}</span>
        </div>
        <span class="text-base font-bold text-gray-800 tracking-tight pr-2">{{ logo.name }}</span>
      </div>
    </InfiniteSlider>
  </div>
</template>

<script setup>
import InfiniteSlider from './InfiniteSlider.vue'

defineProps({
  logos: {
    type: Array,
    required: true
  },
  customClass: {
    type: String,
    default: ''
  },
  reverse: {
    type: Boolean,
    default: false
  }
})
</script>
