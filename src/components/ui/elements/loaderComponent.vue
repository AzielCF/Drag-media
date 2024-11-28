<template>
    <div class="absolute top-0 left-0 h-full w-full overflow-hidden bg-fixed flex flex-col items-center justify-center  text-white z-40" style="background-color: hsla(0, 0%, 0%, 0.6)">


    <div class="flex flex-col h-full items-center justify-center">
      <svg class="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
        <circle cx="12" cy="12" r="10" stroke-dasharray="80" stroke-dashoffset="60" fill="none" stroke="url(#gradient)"></circle>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #34db9b; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #4dc0b5; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
      <p class="text-white opacity-100 m-0 text-sm">Descargando...</p>
    </div>
  </div>
  </template>
  
  