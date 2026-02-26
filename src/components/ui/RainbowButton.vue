<template>
  <button
    :class="computedClasses"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  }
})

const computedClasses = computed(() => {
  return [
    "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-[20px] border-0 bg-[length:200%] px-5 py-2.5 font-bold text-white transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
    "bg-[linear-gradient(#0B101D,#0B101D),linear-gradient(#0B101D_50%,rgba(11,16,29,0.6)_80%,rgba(11,16,29,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
    props.customClass
  ]
})
</script>
