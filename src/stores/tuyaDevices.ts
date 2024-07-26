import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { ref } from 'vue';

export type TuyaDevice = {
  ip: string;
  gwId: string;
  uuid: string;
  active: number;
  encrypt: boolean;
  productKey: string;
  version: string;
  token: boolean;
  wf_cfg: boolean;
  clientLink: number;
  name: string;
  key: string;
  mac: string;
  id: string;
  ability: number;
  dev_type: string;
  origin: string;
};

export const useTuyaDevices = defineStore('tuyaDevices', () => {
  const loading = ref({
    getTuyaDevices: false,
    getTuyaDevicesLocalKeys: false,
  });

  /**
   * Lista dispositivos tuya na rede usando chamada a API
   */
  const getTuyaDevices = async (): Promise<TuyaDevice[] | null> => {
    try {
      loading.value.getTuyaDevices = true;
      const { data } = await api.get('/tuya-devices/');
      return data;
    } catch (error) {
      Notify.create({
        message: 'Erro listando dispositivos',
        type: 'negative',
      });
      return null;
    } finally {
      loading.value.getTuyaDevices = false;
    }
  };

  const tuyaDevices = ref<TuyaDevice[]>([]);
  /**
   * Atualiza a lista de dispositivos tuya na variavel tuyaDevices usando a função getTuyaDevices
   */
  const loadTuyaDevices = async () => {
    const res = await getTuyaDevices();
    if (res == null) return;
    tuyaDevices.value = res;
  };

  const getTuyaDevicesLocalKeys = async (deviceId: string) => {
    try {
      loading.value.getTuyaDevicesLocalKeys = true;
      const { data } = await api.get('/tuya-devices/local-keys/', {
        params: {
          device_id: deviceId,
        },
      });
      return data;
    } catch (error) {
      Notify.create({
        message: 'Erro lendo chave do dispositivo',
        type: 'negative',
      });
      return null;
    } finally {
      loading.value.getTuyaDevices = false;
    }
  };

  return {
    loading,
    getTuyaDevices,
    getTuyaDevicesLocalKeys,
    loadTuyaDevices,
    tuyaDevices,
  };
});
