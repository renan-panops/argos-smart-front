import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

export const useRedis = defineStore('redis', () => {
  const loading = ref({
    getRedis: false,
  });

  const getRedis = async () => {
    try {
      loading.value.getRedis = true;
      const res = await api.get('/redis/');
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
    pollingTimer.value = 0;
    interval = setInterval(() => {
      if (loading.value.getRedis) return;
      if (pollingTimer.value <= pollingInterval) {
        pollingTimer.value += 0.01;
      }
      if (pollingTimer.value > pollingInterval) {
        pollingTimer.value = 0;
        getRedis();
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
    loading,
  };
});
