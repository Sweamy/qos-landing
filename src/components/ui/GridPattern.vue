<template>
  <svg class="w-full h-full pointer-events-none">
    <defs>
      <pattern
        id="grid-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          :stroke-width="strong ? '1' : '1'"
          :class="strong ? 'text-black' : 'text-gray-300/80'"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
</template>

<script setup>
defineProps({
  strong: {
    type: Boolean,
    default: false
  }
})
</script>
