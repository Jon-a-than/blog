<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

interface FrontMatter {
  post_img?: string
  description?: string
  categories?: string[]
  tags?: []
}

defineProps<{ title: string, path: string, content: ParsedContent & FrontMatter }>()
</script>

<template>
  <div class="bg-primary-3 dark:bg-primary-5 rounded animate-decoration w-48 gap-4 pa-4 h-xs">
    <div class="h-full flex flex-col overflow-hidden">
      <h2 class="my-0 inline-block pb-2 text-center">
        <i class="i-openmoji-kiwi-fruit text-24 inline-block w-full transition-font transition-duration-500" />

        <span class="bg-no-repeat  bg-gradient-to-b from-primary to-primary">
          <a :href="path" class="text-unset decoration-none">{{ title }}</a>
        </span>
      </h2>

      <p class="flex-1 overflow-auto scrollbar-slim">
        {{ content.description }}
      </p>
      <p class="my-0 flex items-center gap-4">
        <span v-if="content.categories">分类：{{ content.categories.join('>') }}</span>
        <span v-if="content.tags">标签：{{ content.tags.join('+') }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-decoration span{
  transition: background-size 500ms;
  background-size: 0% 0.5em;
  background-position: 0 100%;
}

.animate-decoration:hover span{
  background-size: 100% 0.5em;
}
.animate-decoration:hover i{
  --uno: text-0;
}
</style>
