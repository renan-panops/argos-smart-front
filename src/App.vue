<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useUi } from './stores/ui';

const uiStore = useUi();

defineOptions({
  name: 'App',
});

onBeforeMount(() => {
  if (uiStore.isDark) {
    uiStore.setThemeDark();
  } else {
    uiStore.setThemeLight();
  }
});
</script>
