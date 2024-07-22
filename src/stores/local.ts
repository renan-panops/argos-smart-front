import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

type Local = {
  id: string;
  name: string;
  floor_plan: string;
};

export const useLocal = defineStore('local', () => {
  // Estado de loading de todas as actions assincronas
  const loading = {
    getLocal: false,
    postLocal: false,
  };

  /**
   * Lista todos os locais (pavimentos)
   */
  const getLocal = async (): Promise<Local | null> => {
    try {
      loading.getLocal = true;
      const { data } = await api.get<Local>('/local/');
      return data;
    } catch (error) {
      console.error(error);
      Notify.create({
        message: 'Erro listando pavimentos',
        type: 'error',
      });
      return null;
    } finally {
      loading.getLocal = false;
    }
  };

  /**
   * Cria um novo local (pavimento)
   */
  const postLocal = async (payload: unknown): Promise<Local | null> => {
    try {
      loading.postLocal = true;
      const { data } = await api.post<Local>('/local/', payload);
      return data;
    } catch (error) {
      console.error(error);
      Notify.create({
        message: 'Erro criando pavimento',
        type: 'error',
      });
      return null;
    } finally {
      loading.postLocal = false;
    }
  };

  return { loading, getLocal };
});
