<template>
  <q-page>
    <div
      class="tw-fixed tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-flex tw-flex-col tw-items-center"
      v-if="selectedSvg == null"
    >
      <q-btn
        @click="addLocation = true"
        class="active:tw-scale-105 tw-transition-all"
        round
        icon="add"
        color="primary"
        size="xl"
      />
      <strong class="tw-pt-4 text-primary tw-text-lg tw-uppercase">Adicionar pavimento</strong>
    </div>
    <div
      v-else
      @click="handleSvgClick"
      v-html="svgText"
      ref="svgElement"
    />

    <!-- MARK: dialog adição de pavimento (local) -->
    <q-dialog
      @before-hide="handleHideAddLocation"
      v-model="addLocation"
    >
      <div class="bg-secondary tw-p-3 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-3">
        <span class="text-primary tw-text-lg">Configuração de pavimento</span>
        <q-input
          label="Nome do pavimento"
          class="tw-px-2 tw-rounded-xl"
          :class="{
            'tw-bg-neutral-900': $q.dark.isActive,
            'tw-bg-neutral-100': !$q.dark.isActive,
          }"
          dense
          borderless
          v-model="svgName"
        />
        <q-file
          label="SVG da planta baixa"
          class="tw-px-2 tw-rounded-xl"
          :class="{
            'tw-bg-neutral-900': $q.dark.isActive,
            'tw-bg-neutral-100': !$q.dark.isActive,
          }"
          dense
          borderless
          v-model="selectedSvg"
        />
        <div class="tw-flex tw-justify-between tw-gap-3">
          <q-btn
            @click="cancelAdd"
            rounded
            outline
            icon="chevron_left"
            color="primary"
            label="Cancelar"
            class="tw-min-w-36"
          />
          <q-btn
            v-close-popup
            @click="edit = true"
            rounded
            unelevated
            color="primary"
            label="Próximo"
            class="tw-min-w-36"
          />
        </div>
      </div>
    </q-dialog>

    <!-- MARK: Popup confirmar edição -->
    <div
      :data-open="edit"
      :data-dark="$q.dark.isActive"
      class="tw-fixed tw-bottom-4 tw-left-1/2 -tw-translate-x-1/2 tw-bg-neutral-300 tw-p-4 tw-translate-y-[150%] data-[open=true]:tw-translate-y-0 tw-transition-transform tw-ease-in-out tw-rounded-3xl tw-flex tw-flex-col tw-gap-1 data-[dark=true]:tw-bg-neutral-900 tw-shadow"
    >
      <strong class="tw-text-lg text-primary">Editar pavimento {{ svgName }}</strong>
      <span class="tw-text-md">Clique em uma vaga para configurá-la</span>
      <span>Vagas configuradas: <strong class="text-primary">0</strong></span>
      <strong class="tw-text-sm"></strong>
      <div class="tw-flex tw-gap-1">
        <q-btn
          label="Cancelar"
          outline
          color="primary"
          rounded
          class="bg-secondary"
          @click="cancelEdit"
        />
        <q-btn
          label="Salvar Pavimento"
          unelevated
          color="primary"
          rounded
          class="tw-rounded-full"
        />
      </div>
    </div>

    <q-dialog v-model="editElement">
      <div class="bg-secondary tw-p-3 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-3">
        <span class="text-primary tw-text-lg">Configuração de Vaga</span>
        <q-input
          label="ID da Lâmpada"
          class="tw-px-2 tw-rounded-xl"
          :class="{
            'tw-bg-neutral-900': $q.dark.isActive,
            'tw-bg-neutral-100': !$q.dark.isActive,
          }"
          dense
          borderless
        />
        <q-input
          label="Nome da Vaga"
          class="tw-px-2 tw-rounded-xl"
          :class="{
            'tw-bg-neutral-900': $q.dark.isActive,
            'tw-bg-neutral-100': !$q.dark.isActive,
          }"
          dense
          borderless
        />
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
            v-close-popup
            rounded
            unelevated
            color="primary"
            label="Próximo"
            class="tw-min-w-36"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useLocal } from 'src/stores/local';
import { onBeforeMount, ref, watch } from 'vue';

defineOptions({
  name: 'IndexPage',
});

const svgElement = ref(); // Ref da div com v-html
const localStore = useLocal();

const selectedSvg = ref(); // model
const svgText = ref(''); // Conteúdo do v-html
watch(selectedSvg, async () => {
  svgText.value = await selectedSvg.value.text();
});

// MARK: Edição de vaga
const editElement = ref(false); // Popup configurar elemento (vaga)
const selectedSvgElement = ref(); // Ultimo elemento do SVG clicado
/**
 * Lida com um clique em um dos elementos do SVG
 * @param e MouseEvent elemento do svg clicado, ex: rect
 */
const handleSvgClick = (e: MouseEvent) => {
  selectedSvgElement.value = e.target;
  editElement.value = true;
};

const addLocation = ref(false); // Popup de adicionar pavimento
const edit = ref(false); // Menu inferior de edição de pavimento
const svgName = ref(''); // model

/**
 * Lida com o popup de adicionar localização sendo fechado
 */
const handleHideAddLocation = () => {
  if (edit.value) return;
  selectedSvg.value = null;
  svgName.value = '';
};

/**
 * Lida com a adição de localização sendo cancelada
 */
const cancelAdd = () => {
  addLocation.value = false;
  edit.value = false;
  selectedSvg.value = null;
  svgName.value = '';
};

/**
 * Retorna as váriaveis relacionada a adição de um novo SVG e edição aos seus valores inciais
 */
const cancelEdit = () => {
  edit.value = false;
  svgName.value = '';
  selectedSvg.value = null;
};

onBeforeMount(async () => {
  // const res = await localStore.getLocal();
});
</script>
