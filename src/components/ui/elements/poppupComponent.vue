<script lang="ts" setup>
defineProps({
    id: String,
    title: String,
    subtitle: String
})
</script>
<template>
    <div :id="id" popover class="flex flex-col w-9/12 max-w-2xl m-auto top-14
     rounded-md h-fit bg-[#353535]">
        <button :popovertarget="id" class="absolute border-none top-6 right-5 cursor-pointer"
            popovertargetaction="hide">
            <svg xmlns="http://www.w3.org/2000/svg" color="currentColor" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="flex flex-col px-5">
            <div v-if="title" class="w-full mt-3 pb-2">
                <h3 class="text-2xl">{{ title }}</h3>
                <span v-if="subtitle" class="pt-1 opacity-70">{{ subtitle }}</span>
            </div>
            <div>
                <slot/>
            </div>
        </div>
    </div>
</template>
<style scoped>
[popover]:popover-open {
    opacity: 1;
    transform: scaleX(1);
}

[popover] {

    /* Final state of the exit animation */
    opacity: 0;
    transform: scaleX(0);

    transition:
        opacity 0.3s,
        transform 0.3s,
        overlay 0.3s allow-discrete,
        display 0.3s allow-discrete;
}

/* Needs to be after the previous [popover]:popover-open rule
to take effect, as the specificity is the same */
@starting-style {
    [popover]:popover-open {
        opacity: 0;
        transform: scaleX(0);
    }
}

[popover]::backdrop {
    top: 41px;
    backdrop-filter: blur(0px);
    background-color: rgb(0 0 0 / 0%);
    transition:
        display 0.3s allow-discrete,
        overlay 0.3s allow-discrete,
        background-color 0.3s;
}

[popover]:popover-open::backdrop {
    backdrop-filter: blur(4px);
    background-color: rgb(0 0 0 / 40%);
}

@starting-style {
    [popover]:popover-open::backdrop {
        backdrop-filter: blur(0px);
        background-color: rgb(0 0 0 / 0%);
    }
}
</style>