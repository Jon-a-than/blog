<script lang="ts" setup>
const content = useContent()
console.log(content)
const route = useRoute()
</script>

<template>
  <NuxtLayout>
    <TOC :toc="content.toc" />
    <ContentDoc tag="article" />
  </NuxtLayout>
</template>
