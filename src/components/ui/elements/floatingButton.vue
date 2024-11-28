<template>
    <div
      :class="['fixed bottom-5 right-5 flex flex-col-reverse items-center z-50 button-transition', isVisible ? 'button-visible' : 'button-hidden']"
    >
      <!-- Botón flotante que cambia entre ➕ y ✖️ -->
      <div
        @click="toggleOpen"
        class="w-14 h-14 bg-[#333333] hover:bg-[#242424] text-white rounded-full shadow-2xl  flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300"
      >
        <!-- Cambia el ícono según el estado y anima su rotación -->
        <span
          :class="isOpen ? 'rotate-45 transform transition-transform duration-300' : 'transform transition-transform duration-300'"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
  
      <!-- Opciones desplegadas con animación -->
      <transition name="fade-scale">
        <div v-if="isOpen" class="absolute bottom-16 flex flex-col items-center space-y-2">
          <!-- Opción subir hasta arriba -->
          <div class="relative group">
            <div
              @click="scrollToTop"
              class="bg-[#184939] hover:bg-[#087953] text-white py-2 px-4 rounded-lg shadow-2xl cursor-pointer transition-transform duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>
            <!-- Tooltip -->
            <span
              class="tooltip-left group-hover:opacity-100 opacity-0 absolute left-[-20%] top-1 bg-black text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300"
            >
              Subir hasta arriba
            </span>
          </div>
  
          <!-- Opción Videos -->
          <RouterLink to="/videos">
            <div @click="toggleOpen" class="relative group">
              <div
                class="bg-[#009e69] hover:bg-[#087953] text-white py-2 px-4 rounded-lg shadow-2xl cursor-pointer transition-transform duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z"
                    fill="currentcolor"
                  />
                </svg>
              </div>
              <!-- Tooltip -->
              <span
                class="tooltip-left group-hover:opacity-100 opacity-0 absolute left-[-20%] top-1 bg-black text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300"
              >
                Ir a videos
              </span>
            </div>
          </RouterLink>
  
          <!-- Opción Fotos -->
          <RouterLink to="/">
            <div @click="toggleOpen" class="relative group">
              <div
                class="bg-[#009e69] hover:bg-[#087953] text-white py-2 px-4 rounded-lg shadow-2xl cursor-pointer transition-transform duration-300"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <!-- Tooltip -->
              <span
                class="tooltip-left group-hover:opacity-100 opacity-0 absolute left-[-20%] top-1 bg-black text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300"
              >
                Ir a fotos
              </span>
            </div>
          </RouterLink>
        </div>
      </transition>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { RouterLink } from 'vue-router';
  
  // Estado del botón desplegable
  const isOpen = ref(false);
  const isVisible = ref(false); // Controla la visibilidad del botón según el scroll
  
  // Alterna el estado de abierto/cerrado
  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Función para desplazar hasta arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleOpen();
  };
  
  // Muestra el botón solo si el usuario ha hecho scroll hacia abajo
  const handleScroll = () => {
    isVisible.value = window.scrollY > 100; // Muestra el botón si el scroll es mayor a 100px
  };
  
  // Agrega el event listener cuando el componente se monta y lo remueve cuando se desmonta
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style scoped>
  /* Animaciones para las opciones */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.3s ease;
  }
  
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  
  /* Estilos para los tooltips */
  .tooltip-left {
    transform: translateX(-100%);
    white-space: nowrap;
  }
  
  /* Transición para el botón flotante */
  .button-transition {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .button-hidden {
    opacity: 0;
    transform: translateY(50px); /* Ajusta la distancia según el diseño */
  }
  
  .button-visible {
    opacity: 1;
    transform: translateY(0);
  }
  </style>
  