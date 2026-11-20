<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppTabBar from '@/components/AppTabBar.vue'
</script>

<template>
  <AppHeader />

  <main class="app-main">
    <RouterView />
  </main>

  <AppTabBar />
</template>

<style scoped>
.app-main {
  min-height: 100vh;
  padding-top: calc(var(--nav-h) + var(--sp-3));
}

@media (max-width: 767px) {
  .app-main {
    padding-top: var(--sp-2);
  }
}
</style>
