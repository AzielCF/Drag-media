<template>
    <div class="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-40">
      <svg class="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
        <circle cx="12" cy="12" r="10" stroke-dasharray="80" stroke-dashoffset="60" fill="none" stroke="url(#gradient)"></circle>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #34db9b; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #4dc0b5; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
      <p class="m-0 text-sm">Descargando...</p>
    </div>
  </template>
  