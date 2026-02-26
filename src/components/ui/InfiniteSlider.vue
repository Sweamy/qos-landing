<template>
  <div class="relative overflow-hidden" ref="containerRef" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div
      class="flex w-max"
      :style="{
        transform: `translateX(${translation}px)`,
        gap: `${gap}px`
      }"
    >
      <slot></slot>
      <!-- Duplicate slot content for seamless infinite loop -->
      <slot></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  gap: { type: Number, default: 16 },
  speed: { type: Number, default: 25 }, // pixels per second
  speedOnHover: { type: Number },
  reverse: { type: Boolean, default: false }
})

const containerRef = ref(null)
const translation = ref(0)
const isHovered = ref(false)

let animationFrameId = null
let lastTime = 0
let contentWidth = 0

// Simplified approach for Vue: we calculate the width of the slot content
// and animate X translation. CSS-only approaches are often better, 
// but we'll use a requestAnimationFrame loop to match the framer-motion logic based on speed.

const animate = (time) => {
  if (!lastTime) lastTime = time
  const deltaTime = time - lastTime
  lastTime = time

  if (contentWidth > 0) {
    const currentSpeed = isHovered.value && props.speedOnHover !== undefined ? props.speedOnHover : props.speed
    const deltaX = (currentSpeed * deltaTime) / 1000 // pixels to move this frame

    if (props.reverse) {
      translation.value += deltaX
      // If we've scrolled past the first duplicate, snap back
      if (translation.value >= 0) {
        translation.value -= contentWidth + props.gap
      }
    } else {
      translation.value -= deltaX
      // If we've scrolled past the original content, snap back
      if (translation.value <= -(contentWidth + props.gap)) {
        translation.value += contentWidth + props.gap
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Use ResizeObserver or a timeout to get the width of ONE set of children
  setTimeout(() => {
    if (containerRef.value) {
      const container = containerRef.value
      const flexContainer = container.firstElementChild
      // Since we rendered the slot 3 times, content width is roughly 1/3 of the total scroll/client width minus gaps
      // A more robust way is to wrap the original slot in a div and measure it, but this serves the simple use case
      
      // We assume the children elements make up contentWidth
      const children = Array.from(flexContainer.children)
      const originalItemCount = children.length / 3 // because 3 slots
      
      let width = 0
      for(let i=0; i<originalItemCount; i++) {
        width += children[i].offsetWidth
      }
      width += (originalItemCount) * props.gap // exclude one gap? roughly
      
      contentWidth = width
      
      if (props.reverse) {
         translation.value = -(contentWidth + props.gap)
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
  }, 100)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
