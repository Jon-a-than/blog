<template>
  <div class="overflow-y-hidden h-100vh flex flex-col">
    <slot name="header">
      <Header />
    </slot>
    <div class="flex-1 flex overflow-y-auto scrollbar-slim pa-4">
      <aside class="lg:w-64 show-not-null">
        <slot name="left" />
      </aside>
      <div class="flex-1">
        <slot name="main-header" />
        <main class="pa-4 rounded-4 bg-primary-2 dark:bg-primary-7">
          <slot />
        </main>
      </div>

      <aside class="sm:w-64 show-not-null">
        <slot name="right" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1024px) {
  .show-not-null:not(:has(*)) {
    display: none;
  }
}
</style>
