<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['changeCategory'])

const selectCategory = (category) => {
  emit('changeCategory', category)
}
</script>

<template>
  <div class="flex items-center justify-center">
    <!-- Overflow scroll for mobile view, centered list for desktop -->
    <div class="flex items-center space-x-2 overflow-x-auto pb-4 px-4 max-w-full md:pb-0 md:px-0 no-scrollbar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectCategory(cat)"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold font-mono tracking-wide border transition-all duration-200"
        :class="[
          activeCategory === cat 
            ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950 shadow-md' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:border-slate-700'
        ]"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
