<template>
  <div>
    <slot name="header">
      <Header class="fixed w-full box-border" />
    </slot>
    <div class="flex-1 flex overflow-y-auto">
      <aside class="lg:w-64">
        <slot name="left" />
      </aside>
      <div class="flex-1 sm:px-2 pt-16">
        <slot name="main-header" />
        <main class="pa-4 rounded-4 bg-primary-2 dark:bg-primary-7">
          <slot />
        </main>
      </div>

      <aside class="sm:w-64">
        <slot name="right" />
      </aside>
    </div>
  </div>
</template>
