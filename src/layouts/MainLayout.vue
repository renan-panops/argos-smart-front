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
          flat
          color="primary"
          @click="uiStore.toggleTheme()"
        >
          <q-tooltip :delay="1000">
            {{ $q.dark.isActive ? 'Tema claro' : 'Tema escuro' }}
          </q-tooltip>
        </q-btn>

        <!-- MARK: Botão menu -->
        <q-btn
          class="tw-ml-2"
          color="primary"
          flat
          @click="isMenuOpen = !isMenuOpen"
          round
        >
          <q-icon
            color="primary"
            name="chevron_left"
            size="md"
            :data-open="isMenuOpen"
            class="data-[open=true]:-tw-rotate-180 tw-transition-transform"
          />
          <q-tooltip
            :delay="1000"
            class="tw-whitespace-nowrap"
          >
            {{ isMenuOpen ? 'Fechar menu' : 'Abrir menu' }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- MARK: Menu -->
    <div
      :data-open="isMenuOpen"
      :data-dark="$q.dark.isActive"
      class="tw-z-10 tw-shadow tw-fixed tw-right-4 tw-top-1/2 -tw-translate-y-1/2 tw-w-96 tw-rounded-3xl tw-bg-neutral-300 data-[dark=true]:tw-bg-neutral-900 data-[open=true]:tw-translate-x-0 tw-translate-x-[150%] tw-transition-all tw-ease-in-out tw-duration-300 tw-p-4"
    >
      <!-- Select -->
      <div class="tw-rounded-xl bg-secondary tw-px-3 tw-flex-grow">
        <q-select
          color="primary"
          :options="options"
          label="Pavimento"
          round
          borderless
        />
      </div>

      <!-- Pavimento -->
      <div class="tw-pt-3">
        <span class="text-primary">Total de Vagas no pavimento</span>
        <ul class="bg-secondary tw-rounded-xl tw-p-3">
          <li>Disponíveis: 53</li>
          <li>Disponíveis: 53</li>
          <li>Disponíveis: 53</li>
        </ul>
      </div>

      <!-- Total -->
      <div class="tw-pt-3">
        <span class="text-primary">Total de Vagas</span>
        <ul class="bg-secondary tw-rounded-xl tw-p-3">
          <li>Disponíveis: 53</li>
          <li>Disponíveis: 53</li>
          <li>Disponíveis: 53</li>
        </ul>
      </div>
    </div>

    <!-- MARK: Página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useLocal } from 'src/stores/local';
import { useUi } from 'src/stores/ui';
import { onBeforeMount, ref } from 'vue';

const localStore = useLocal();
const uiStore = useUi();
const $q = useQuasar();
const isMenuOpen = ref(false);
const options = ['foo', 'bar'];

defineOptions({
  name: 'MainLayout',
});

onBeforeMount(async () => {
  const res = await localStore.getLocal();
});
</script>
