import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useLocal } from './local';

export type Device = {
  power: boolean;
  color: string;
  action_time: string;
  action: string;
  name: string;
  local: string;
};

export const useRedis = defineStore('redis', () => {
  const loading = ref({
    getRedis: false,
  });

  const devices = ref<Device[]>();

  const getRedis = async () => {
    try {
      loading.value.getRedis = true;
      const { data: res } = await api.get('/redis/');

      // const mockData = [
      //   [
      //     {
      //       power: true,
      //       color: 'red',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'green',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A2',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'yellow',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste2',
      //     },
      //   ],
      //   [
      //     {
      //       power: true,
      //       color: 'red',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'red',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A2',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'yellow',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste2',
      //     },
      //   ],
      //   [
      //     {
      //       power: true,
      //       color: 'green',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'green',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A2',
      //       local: 'teste',
      //     },
      //     {
      //       power: true,
      //       color: 'green',
      //       action_time: '2024-07-31 12:32:23',
      //       action: 'turn_on',
      //       name: 'A1',
      //       local: 'teste2',
      //     },
      //   ],
      // ];

      // const res = mockData[Math.floor(Math.random() * 3)];
      return res;
    } catch (error) {
      console.error(error);
      // Como essa chamada vai ficar em pooling não irei colocar notificação de erro
      return null;
    } finally {
      loading.value.getRedis = false;
    }
  };

  let interval: ReturnType<typeof setInterval>;
  const pollingInterval = 10.0;
  const pollingTimer = ref();
  const startPoolingRedis = () => {
    // Seta as cores iniciais
    getRedis().then((res) => {
      if (res == null) return;
      devices.value = res;
    });

    pollingTimer.value = 0;
    interval = setInterval(async () => {
      if (loading.value.getRedis) return;
      if (pollingTimer.value <= pollingInterval) {
        pollingTimer.value += 0.01;
      }
      if (pollingTimer.value > pollingInterval) {
        pollingTimer.value = 0;
        const res = await getRedis();
        devices.value = res;
      }
    }, 10);
  };

  const stopPollingRedis = () => {
    clearInterval(interval);
  };

  return {
    getRedis,
    startPoolingRedis,
    stopPollingRedis,
    pollingTimer,
    pollingInterval,
    devices,
    loading,
  };
});
