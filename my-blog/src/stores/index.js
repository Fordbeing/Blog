import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAllDataStore = defineStore('allData', () => {
  const state = ref({
    category: '',
    data: [],
  });

  function updateCategory(category) {
    state.value.category = category;
  }

  function updateData(data) {
    state.value.data = data;
  }

  return {
    state,
    updateCategory,
    updateData,
  };
});
