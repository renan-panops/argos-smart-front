<template>
  <q-page>
    <div
      class="tw-fixed tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-flex tw-flex-col tw-items-center"
    >
      <q-btn
        class="active:tw-scale-110 tw-transition-all"
        round
        icon="add"
        color="primary"
        size="xl"
      />
      <strong class="tw-pt-4 text-primary tw-text-lg tw-uppercase">Adicionar svg</strong>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useLocal } from 'src/stores/local';
import { onBeforeMount } from 'vue';

defineOptions({
  name: 'IndexPage',
});

const localStore = useLocal();

onBeforeMount(async () => {
  const res = await localStore.getLocal();
});
</script>
