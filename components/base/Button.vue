<script lang="ts" setup>
defineProps<{
  prefixIcon?: string
}>()
</script>

<template>
  <button type="button" class="bg-transparent border-none flex items-center">
    <slot name="prefix">
      <i v-if="prefixIcon" :class="prefixIcon" />
    </slot>
    <slot name="default" />
    <slot name="suffix" />
  </button>
</template>
