import { defineStore } from 'pinia';
import { setCssVar, useQuasar } from 'quasar';
import { ref } from 'vue';

export const useUi = defineStore(
  'ui',
  () => {
    const $q = useQuasar();
    const isDark = ref(false);
    const editSvg = ref(false); // Popup de edição de SVG no inferior da tela
    const addLocation = ref(false); // Dialog de adição de localidade
    const svgText = ref('');

    const setThemeLight = () => {
      setCssVar('secondary', '#FFFFFF');
      $q.dark.set(false);
      isDark.value = false;
    };

    const setThemeDark = () => {
      setCssVar('secondary', '#030303');
      $q.dark.set(true);
      isDark.value = true;
    };

    const toggleTheme = () => {
      if ($q.dark.isActive) {
        setThemeLight();
      } else {
        setThemeDark();
      }
    };

    return {
      toggleTheme,
      setThemeDark,
      setThemeLight,
      isDark,
      editSvg,
      addLocation,
    };
  },
  {
    persist: {
      paths: ['isDark'],
    },
  },
);
