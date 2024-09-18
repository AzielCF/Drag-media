<script setup lang="ts">
defineProps({
    valueName: String,
    disabled: Boolean
})
</script>

<template>
    <button :class="disabled ? 'opacity-40 cursor-not-allowed' : ''"
        class="bg-[#2b2b2b] hover:bg-[#3f3f3f] h-[42px] px-4 outline-none border-none shadow-none rounded-sm cursor-pointer text-gray-50 flex items-center justify-center">
        <div>
            <slot name="icon"></slot>
        </div>{{ valueName }}
    </button>
</template>