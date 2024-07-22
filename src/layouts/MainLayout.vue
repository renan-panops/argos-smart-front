<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary tw-shadow">
      <q-toolbar>

        <!-- MARK: Logo -->
        <q-toolbar-title class="tw-py-2">
          <q-img
            class="tw-w-28 tw-ml-9"
            :src="$q.dark.isActive ? 'logo-dark.svg' : 'logo.svg'"
          />
        </q-toolbar-title>

        <!-- MARK: Botão modo dark -->
        <q-btn
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          round
          outline
          color="primary"
          @click="toggleTheme"
        >
          <q-tooltip delay="1000">
            {{ $q.dark.isActive ? 'Tema claro' : 'Tema escuro' }}
          </q-tooltip>
        </q-btn>
        <q-btn
          class="tw-ml-2"
          :icon="isMenuOpen ? 'close' : 'menu'"
          color="primary"
          flat
          @click="isMenuOpen = !isMenuOpen"
          round
        />
      </q-toolbar>
    </q-header>

    <!-- MARK: Menu -->
    <div
      :data-open="isMenuOpen"
      class="bg-secondary tw-shadow tw-fixed tw-right-4 tw-top-1/2 -tw-translate-y-1/2 tw-w-96 tw-h-96 tw-rounded-3xl data-[open=true]:tw-translate-x-0 tw-translate-x-[150%] tw-transition-all tw-ease-in-out tw-duration-300"
    >
      <q-select
        :options="options"
        label="Pavimento"
        round
        outlined
      />
      <!-- class="data-[open=true]:tw-bg-red-500" -->
    </div>

    <!-- MARK: Página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar, setCssVar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();
const isMenuOpen = ref(false);
const options = ['foo', 'bar'];

const toggleTheme = () => {
  if ($q.dark.isActive) {
    setCssVar('secondary', '#FFFFFF');
  } else {
    setCssVar('secondary', '#030303');
  }
  $q.dark.toggle();
};

defineOptions({
  name: 'MainLayout',
});
</script>
