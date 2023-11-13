<script lang="ts" setup>
interface TocItem {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

interface Toc {
  title: string
  depth: number
  searchDepth: number
  links: TocItem[]
}

defineProps<{ toc: Toc }>()

</script>

<template>
  <ul>
    {{ toc }}
  </ul>
</template>
