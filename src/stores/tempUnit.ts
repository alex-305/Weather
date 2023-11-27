import {defineStore } from 'pinia';
import { ref } from 'vue';

export const useTempUnitStore = defineStore('tempUnit', () => {
    const tempUnit = ref('F');
    const toggleUnit = () => {
        if(tempUnit.value == 'C') {
            tempUnit.value = 'F';
        } else if(tempUnit.value == 'F') {
            tempUnit.value = 'C';
        }
    }
    const getTempUnit = () => { return tempUnit.value; }

    return{toggleUnit, getTempUnit};
})