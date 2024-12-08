<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PoppupComponent from '@/components/ui/elements/poppupComponent.vue';
import useAppUpdater from '@/modules/useAppUpdater';
import ButtonComponent from './ui/elements/buttonComponent.vue';

const { newVersionAvailable, latestRelease, downloadPageUrl, checkForUpdates } = useAppUpdater();
const buttonRef = ref<HTMLElement | null>(null); // Referencia al botón

const activatePopover = () => {
  // Asegúrate de que el botón esté referenciado y que sea un elemento DOM válido
  const button = buttonRef.value as HTMLButtonElement | null;
  if (button) {
    button.click();
  }
};

// Verificar si hay una nueva versión
onMounted(async () => {
  await checkForUpdates();
  if (newVersionAvailable.value) {
    activatePopover(); // Activa el popover si hay una nueva versión
  }
});
</script>

<template>
  <!-- Referenciamos el botón y lo mantenemos oculto -->
  <button ref="buttonRef" popovertarget="notifyUpdate" style="display: none;"></button>

  <PoppupComponent id="notifyUpdate">
    <div class="w-full my-14 text-gray-50">
      <div class="w-full mt-3 pb-3">
        <h3 class="text-2xl">Nueva actualización disponible v{{ latestRelease }}</h3>
        <span>Le espera mas estabilidad y posibles funcionalidades nuevas.</span>
      </div>
      <div class="flex w-full gap-3">
        <ButtonComponent @click="activatePopover" class=" bg-transparent" valueName="Lo haré después" />
        <a :href="downloadPageUrl" target="_blank"><ButtonComponent valueName="Ir a descarga" /></a>
      </div>
    </div>
  </PoppupComponent>
</template>
