<script lang="ts" setup>
defineProps<{
  title: string
  to: string
  prefixIcon?: string
}>()
</script>

<template>
  <NuxtLink :to="to" class="decoration-none text-inherit inline-flex items-center font-500">
    <slot>
      <i v-if="prefixIcon" :class="prefixIcon" />
    </slot>
    <slot>
      {{ title }}
    </slot>
  </NuxtLink>
</template>
