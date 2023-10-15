<script lang="ts" setup>
interface Navigation {
  _path: string
  title: string
  children?: Navigation[]
}

defineProps<{ path: string; navigation: Navigation[] }>()

</script>

<template>
  <ul>
    <li />
  </ul>
</template>
