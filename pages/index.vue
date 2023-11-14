<script lang="ts" setup>
const posts = usePostNavigation()
</script>

<template>
  <NuxtLayout>
    <template #main-header>
      <h1 class="text-center">
        Home Title Slot
      </h1>
    </template>

    <ul class="pl-0 flex flex-wrap gap-4 justify-around">
      <li v-for="{title, path} of posts" :key="path" class="list-none">
        <ContentQuery v-slot="{ data }" :path="path" find="one" :only="[]">
          <PostCard :title="title" :path="path" :content="(data as any)" />
        </ContentQuery>
      </li>
    </ul>
  </NuxtLayout>
</template>
