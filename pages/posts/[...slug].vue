<script lang="ts" setup>
const content = useContent()

const route = useRoute()
</script>

<template>
  <NuxtLayout name="post">
    <TOC :path="$route.path" :navigation="content.navigation" />
    <ContentDoc tag="article" />
  </NuxtLayout>
</template>
