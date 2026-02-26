<template>
  <div
    ref="containerRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :class="['relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-white', customClass]"
  >
    <!-- Background Static Grid (faint) -->
    <div class="absolute inset-0 z-0 opacity-30 transition-opacity duration-500 overflow-hidden">
      <div class="grid-animated-layer">
        <GridPattern />
      </div>
    </div>

    <!-- Interactive Grid Mask (follows cursor) -->
    <div
      class="absolute inset-0 z-10 opacity-90 transition-opacity duration-300 pointer-events-none overflow-hidden"
      :style="{
        maskImage: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        WebkitMaskImage: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`
      }"
    >
      <div class="grid-animated-layer">
        <GridPattern strong />
      </div>
    </div>

    <!-- Glowing Background Orbs (Screenshot Match) -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Top Right Warm Orange -->
      <div class="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFDDC1]/60 blur-[120px]" />
      <!-- Bottom Left Bright Blue -->
      <div class="absolute left-[-10%] bottom-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/60 blur-[120px]" />
    </div>

    <!-- Content Slot -->
    <div class="relative z-20 w-full flex-1 flex flex-col pointer-events-auto">
      <slot></slot>
    </div>

    <!-- Bottom gradient for clean edge -->
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridPattern from './GridPattern.vue'

defineProps({
  customClass: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
const mouseX = ref(-1000) // start off-screen
const mouseY = ref(-1000)
const isHovering = ref(false)

const handleMouseMove = (e) => {
  if (!containerRef.value) return
  // Use requestAnimationFrame to throttle mouse updates and avoid reactivity overhead
  requestAnimationFrame(() => {
    const rect = containerRef.value.getBoundingClientRect()
    mouseX.value = e.clientX - rect.left
    mouseY.value = e.clientY - rect.top
    isHovering.value = true
  })
}

const handleMouseLeave = () => {
  isHovering.value = false
}
</script>

<style scoped>
.grid-animated-layer {
  position: absolute;
  inset: -100px; /* Oversized to prevent clipping during animation */
  width: calc(100% + 200px);
  height: calc(100% + 200px);
  animation: gridMove 15s linear infinite;
  will-change: transform;
}

@keyframes gridMove {
  0% {
    transform: translate(-40px, -40px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
