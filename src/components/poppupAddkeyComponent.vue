<script lang="ts" setup>
import PoppupComponent from '@/components/ui/elements/poppupComponent.vue'
import buttonComponent from '@/components/ui/elements/buttonComponent.vue'
import inputApikeyComponent from './inputApikeyComponent.vue';

</script>
<template>
    <buttonComponent popovertarget="mypopover" valueName="+ Agregar" class="w-full" />
    <PoppupComponent id="mypopover">
        <div class="w-full my-16">
            <div class="w-full mt-3 pb-3">
                <h3 class="text-2xl">Nueva clave API</h3>
                <span class="pt-1 opacity-70">Añade la clave API de Pexels, Unsplash o Pixabay.</span>
            </div>
            <inputApikeyComponent/>
        </div>
    </PoppupComponent>
</template>
