import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { reactive } from 'vue';
import { useLocal } from './local';
import { useTuyaDevices } from './tuyaDevices';

type Device = {
  name: string;
  dev_id: string;
  address: string;
  local_key: string;
  version: number;
  local: string;
  // local: {
  //   name: string;
  //   floor_plant: string;
  // };
};

export const useDevice = defineStore('device', () => {
  const tuyaDevicesStore = useTuyaDevices();
  const localStore = useLocal();

  const loading = reactive({
    postDevice: false,
  });

  const postDevice = async (payload: Device) => {
    try {
      loading.postDevice = true;
      const { data } = await api.post('/device/', payload);
      return data;
    } catch (error) {
      console.error(error);
      Notify.create({
        message: 'Erro criando dispositivo',
        type: 'negative',
      });
      return null;
    } finally {
      loading.postDevice = false;
    }
  };

  const createDevice = async (id: string, name: string) => {
    const device = tuyaDevicesStore.tuyaDevices.find((tuyaDevice) => tuyaDevice.id === id);
    if (device == null) {
      Notify.create({
        message: 'Dispositivo não encontrado na rede',
        type: 'negative',
      });
      return null;
    }

    if (localStore.selectedLocal == null) {
      Notify.create({
        message: 'Nenhum pavimento selecionado',
        type: 'negative',
      });
      return null;
    }

    const local_key = await tuyaDevicesStore.getTuyaDevicesLocalKeys(device.id); // TODO: usar desestruturação de objeto

    if (local_key == null) {
      Notify.create({
        message: 'Não foi possível acessar a chave local do dispositivo',
        type: 'negative',
      });
      return null;
    }

    const data: Device = {
      address: device.ip,
      dev_id: device.id,
      local: localStore.selectedLocal.id,
      local_key: local_key.key,
      name,
      version: Number(device.version),
    };

    const res = await postDevice(data);
    return res;
  };

  return {
    createDevice,
  };
});
