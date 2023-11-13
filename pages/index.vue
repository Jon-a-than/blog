<script lang="ts" setup>
const posts = usePostNavigation()
</script>

<template>
  <NuxtLayout>
    <h1>Home</h1>

    <ul class="pl-0">
      <li v-for="{title, path} of posts" :key="path" class="list-none">
        <ContentQuery v-slot="{ data }" :path="path" find="one" :only="[]">
          <PostCard :title="title" :path="path" :content="(data as any)" />
        </ContentQuery>
      </li>
    </ul>
  </NuxtLayout>
</template>
