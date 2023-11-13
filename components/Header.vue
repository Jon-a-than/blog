<script lang="ts" setup>
const { navbar } = useAppConfig()

const toggleDark = useToggle(useDark())
</script>

<template>
  <header
    border="b-solid b-1 primary-3 dark:primary-5"
    class="flex justify-between items-center px-8 bg-primary-2 dark:bg-primary-7"
  >
    <h2 class="flex-grow-1 my-0">
      {{ navbar.subtitle }}
    </h2>

    <nav class="flex-grow-3">
      <ul class="flex justify-end list-none gap-x-4 my-3">
        <li v-for="{ title, link, icon } of navbar.navLinks" :key="link">
          <BaseLink class="" :prefix-icon="icon" :title="title" :to="link" />
        </li>
        <li class="flex items-center">
          <BaseButton
            prefix-icon="dark:i-bi-moon-stars-fill i-bi-sun-fill"
            class="cursor-pointer text-base"
            @click="toggleDark()"
          />
        </li>
      </ul>
    </nav>
  </header>
</template>
