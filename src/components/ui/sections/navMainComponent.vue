<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
    <nav class="flex place-content-center items-center text-center h-10 text-sm  sm:text-base md:text-lg max-w-[695px] mx-auto rounded-xl bg-[#2b2b2b] mb-2 md:mb-3 mt-6">
        <RouterLink to="/">Fotos</RouterLink>
        <RouterLink to="/videos">Vídeos</RouterLink>
        <RouterLink to="/settings">Ajustes</RouterLink>
    </nav>
</template>