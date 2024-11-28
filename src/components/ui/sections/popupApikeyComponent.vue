<script setup lang="ts">
import inputApikeyComponent from '../../inputApikeyComponent.vue'
import iconLogo from '../icons/logo.vue'

</script>
<template>
    <div class="configApiPopup flex flex-col items-center justify-center">
        <header class="w-full py-5">
            <div class="flex flex-wrap justify-center">
                <iconLogo class="h-10 pr-2"/> 
                <h1 class="text-4xl">DRAG MEDIA</h1>
            </div>
            <h3 class="text-md pt-2">¡Bienvenido, ingrese su Api Key de <a target="_blank"
                    href="https://www.pexels.com/es-es/api/">Pexels,</a> <a target="_blank" href="https://unsplash.com/developers">Unsplash</a> ó <a target="_blank" href="https://pixabay.com/service/about/api/">Pixabay</a> para funcionar!</h3>
        </header>
        <main class="w-full">
            <inputApikeyComponent/>
        </main>
    </div>
</template>