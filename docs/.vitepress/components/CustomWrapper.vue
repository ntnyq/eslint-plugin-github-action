<script setup lang="ts">
defineProps<{
  type: 'correct' | 'incorrect'
}>()
</script>

<template>
  <div class="relative p-2">
    <slot />
    <div
      v-if="type === 'incorrect'"
      class="absolute -left-2 top-1 bg-red:20 text-red px-2 py-0.5 rounded-lg flex gap-1 items-center"
    >
      <div class="i-ri:close-line" />
      <span>incorrect</span>
    </div>
    <div
      v-if="type === 'correct'"
      class="absolute -left-2 top-1 bg-green:20 text-green px-2 py-0.5 rounded-lg flex gap-1 items-center"
    >
      <div class="i-ri:check-line" />
      <span>correct</span>
    </div>
  </div>
</template>
