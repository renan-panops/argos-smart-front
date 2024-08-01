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
      @click.middle="advanced = !advanced"
      :data-open="isMenuOpen"
      :data-dark="$q.dark.isActive"
      class="tw-z-10 tw-shadow tw-fixed tw-right-4 tw-top-1/2 -tw-translate-y-1/2 tw-w-96 tw-rounded-3xl tw-bg-neutral-300 data-[dark=true]:tw-bg-neutral-900 data-[open=true]:tw-translate-x-0 tw-translate-x-[150%] tw-transition-transform tw-ease-in-out tw-duration-300 tw-p-4"
    >
      <!-- Select -->
      <div class="tw-rounded-xl bg-secondary tw-px-3 tw-flex-grow">
        <q-select
          v-model="localStore.selectedLocal"
          color="primary"
          :options="localStore.locals"
          option-label="name"
          label="Pavimento"
          label-color="primary"
          round
          borderless
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                Nenhum pavimento encontrado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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

      <!-- Avançado -->
      <q-slide-transition class="tw-mt-2">
        <div v-show="advanced">
          <span class="text-primary">Configurações avançadas do sistema</span><br>
          <p class="tw-pb-2">
            <strong>Atenção:</strong> As configurações abaixos foram pensadas apenas para uso interno,
            erros na configuração podem acarregar em mal funcionamento do sistema.
          </p>
          <div class="tw-flex tw-gap-2 tw-justify-between">
            <q-btn
              :disable="localStore.selectedLocal == null"
              @click="handleOpenDeleteDialog"
              class="bg-secondary tw-flex-grow"
              label="Deletar"
              rounded
              outline
              icon="delete"
              color="negative"
            />
            <q-btn
              @click="uiStore.editSvg = true"
              :disable="localStore.selectedLocal == null"
              class="bg-secondary tw-flex-grow"
              label="Editar"
              rounded
              outline
              icon="edit"
              color="primary"
            />
            <q-btn
              @click="uiStore.addLocation = true"
              class="tw-flex-grow"
              label="Novo"
              rounded
              unelevated
              icon="add"
              color="primary"
            />
          </div>
        </div>
      </q-slide-transition>
    </div>

    <q-dialog
      @hide="handleHideDeleteLocal"
      v-model="deleteLocal"
    >
      <div class="bg-secondary tw-p-3 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-3">
        <span class="text-primary tw-text-lg">Deletar Pavimento</span>
        <p><strong>Atenção!</strong> Ao deletar o pavimento selecionado toda a sua configuração feita anteriormente sera
          perdida, você tem certeza que deseja continuar?</p>
        <div class="tw-flex tw-justify-between tw-gap-3">
          <q-btn
            v-close-popup
            rounded
            outline
            icon="chevron_left"
            color="primary"
            label="Cancelar"
            class="tw-min-w-36"
          />
          <q-btn
            :loading="localStore.loading.deleteLocal"
            @click="handleDeleteLocal"
            rounded
            unelevated
            color="primary"
            :label="deleteCountdown ?? 'Deletar Pavimento'"
            :disable="deleteCountdown != null"
            class="tw-min-w-36"
          />
        </div>
      </div>
    </q-dialog>

    <!-- MARK: Página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useLocal } from 'src/stores/local';
import { useTuyaDevices } from 'src/stores/tuyaDevices';
import { useUi } from 'src/stores/ui';
import { onBeforeMount, ref } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const localStore = useLocal();
const tuyaDevicesStore = useTuyaDevices();
const uiStore = useUi();
const $q = useQuasar();
const isMenuOpen = ref(false);
const advanced = ref(false);
const deleteLocal = ref(false);
const deleteCountdown = ref<number | null>(null);
let deleteTimer: ReturnType<typeof setInterval>;

const handleOpenDeleteDialog = () => {
  deleteLocal.value = true;
  deleteCountdown.value = 5;
  deleteTimer = setInterval(() => {
    if (deleteCountdown.value === 1) {
      deleteCountdown.value = null;
      clearInterval(deleteTimer);
    }
    if (deleteCountdown.value != null) {
      deleteCountdown.value -= 1;
    }
  }, 1000);
};

const handleHideDeleteLocal = () => {
  if (deleteTimer != null) clearInterval(deleteTimer);
  deleteCountdown.value = null;
};

const handleDeleteLocal = async () => {
  if (localStore.selectedLocal == null) return;
  const res = await localStore.deleteLocal(localStore.selectedLocal.id);
  if (res == null) return;
  deleteLocal.value = false;
  await localStore.loadLocals();
};

onBeforeMount(async () => {
  await localStore.loadLocals();
  await tuyaDevicesStore.loadTuyaDevices();
});
</script>
