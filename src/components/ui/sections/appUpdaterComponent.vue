<template>
  <div class="flex flex-col items-center justify-center">
    <template v-if="newVersionAvailable">
      <p>Nueva versión disponible: v{{ latestRelease }}</p>
      <a :href="downloadPageUrl" target="_blank" class="mt-2 w-4/12" ><buttonComponent class="w-full" valueName="Ir a descarga" /></a>
    </template>
    <template v-else>
      <p>¡Felicidades, tienes la versión más reciente!</p>
      <p>Versión actual {{ localPackageVersion }}</p>
    </template>
  </div>
</template>

<script setup>
import buttonComponent from '@/components/ui/elements/buttonComponent.vue';
import useAppUpdater from '@/modules/useAppUpdater';

const { newVersionAvailable, latestRelease, localPackageVersion, downloadPageUrl, checkCacheAndUpdate } = useAppUpdater();

checkCacheAndUpdate();

</script>
