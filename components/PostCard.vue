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
  <div class="flex items-center gap-4">
    <div class="rounded-4 overflow-hidden w-56">
      <img class="w-110%" :src="'https://qingshaner.oss-cn-hangzhou.aliyuncs.com/images/202301021736627.png'">
    </div>
    <div class="flex-1">
      <h2><a :href="path">{{ title }}</a></h2>

      <p>{{ content.description }}</p>
      <p class="flex items-center gap-4">
        <span v-if="content.categories">分类：{{ content.categories.join('>') }}</span>
        <span v-if="content.tags">标签：{{ content.tags.join('+') }}</span>
      </p>
    </div>
  </div>
</template>
