import { ref } from 'vue'
import { defineStore } from 'pinia'

interface ShowLoader {
    state: boolean;
    mediaId: number | undefined;
  }

export const useGlobalVarsStore = defineStore('globalVars', () => {
  //Variables de estado
  const showLoader = ref<ShowLoader[]>([]);
  const photoPreviewSize = ref<'small' | 'medium' | 'large'>('medium');
  const downloadPhotoSize = ref<'small' | 'medium' | 'large' | 'original'>('medium');
  const downloadVideoSize = ref<'sd' | 'hd' | 'fullHd' | 'qHd'| '4kQhd'>('sd');

  return { showLoader, photoPreviewSize, downloadPhotoSize, downloadVideoSize }
})