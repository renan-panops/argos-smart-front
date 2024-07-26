import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { ref, watch } from 'vue';

type Local = {
  id: string;
  name: string;
  floor_plant: string;
};

export const useLocal = defineStore(
  'local',
  () => {
    // Estado de loading de todas as actions assincronas
    const loading = ref({
      getLocal: false,
      postLocal: false,
      deleteLocal: false,
    });

    const svgName = ref(''); // afetado pelo selectedLocal
    const svgHtml = ref(''); // usado em um v-html, afetado pelo selectedLocal
    const selectedLocal = ref<Local | null>(null); //* tem side effect de mudar o svg carregado na tela ao ser alterado
    watch(selectedLocal, () => {
      //* side effect de mudar selectedLocal, muda o SVG carregado na tela
      if (selectedLocal.value == null) return;
      svgHtml.value = selectedLocal.value.floor_plant;
      svgName.value = selectedLocal.value.name;
    });

    /**
     * Lista todos os locais (pavimentos)
     */
    const getLocal = async (): Promise<Local[] | null> => {
      try {
        loading.value.getLocal = true;
        const { data } = await api.get<Local[]>('/local/');
        return data;
      } catch (error) {
        console.error(error);
        Notify.create({
          message: 'Erro listando pavimentos',
          type: 'negative',
        });
        return null;
      } finally {
        loading.value.getLocal = false;
      }
    };

    /**
     * Cria um novo local a partir de um nome um svg.
     * Seta loading.postLocal como true, faz chamada post a API retorna os dados ou notifica o erro
     * e seta o loading.postLocal novamente como false
     */
    const postLocal = async (payload: Omit<Local, 'id'>): Promise<Local | null> => {
      try {
        loading.value.postLocal = true;
        const { data } = await api.post<Local>('/local/', payload);
        Notify.create({
          message: 'Pavimento criado com sucesso',
          type: 'positive',
        });
        return data;
      } catch (error) {
        console.error(error);
        Notify.create({
          message: 'Erro criando pavimento',
          type: 'negative',
        });
        return null;
      } finally {
        loading.value.postLocal = false;
      }
    };

    const deleteLocal = async (localId: string) => {
      try {
        loading.value.deleteLocal = true;
        const { data } = await api.delete(`/local/${localId}/`);
        Notify.create({
          message: 'Pavimento deletado',
          type: 'positive',
        });
        return data;
      } catch (error) {
        console.error(error);
        Notify.create({
          message: 'Erro deletando pavimento',
          type: 'negative',
        });
        return null;
      } finally {
        loading.value.deleteLocal = false;
      }
    };

    return {
      loading,
      getLocal,
      postLocal,
      deleteLocal,
      selectedLocal,
      svgHtml,
      svgName,
    };
  },
  {
    persist: {
      paths: ['selectedLocal', 'svgHtml', 'svgName'],
    },
  },
);
