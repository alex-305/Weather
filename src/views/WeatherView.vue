<template>
<head>
    <title>Weather</title>
</head>
<div>
    <h1>Weather <button @click="toggleUnit">°{{ unitChar }}</button></h1>
</div>
<div v-if="!weatherData">
    <h3>
        Enter zipcode» 
        <input v-model="zipCode" type="text" @keyup.enter="getWeather">
        <button @click="getWeather" :class="{'goodButton': validZipCode, 'badButton': !validZipCode }">Enter</button>
    </h3>
</div>

<div v-if="weatherData">
    <h3>Weather in {{ weatherData.name }}</h3>
    <p>
        <strong>Temperature»</strong>
        {{ weatherData.main.temp }}°{{ unitChar }}
        <template v-if="weatherData.main.temp != weatherData.main.feels_like">
            but feels like {{ weatherData.main.feels_like }}°{{ unitChar }}
        </template>
    </p>
    <p>
        <strong>Humidity»</strong>
        {{ weatherData.main.humidity }}%
    </p>
    <p>
        <strong>Wind»</strong>
        {{ weatherData.wind.speed }} mph
    </p>
    <button @click="resetData">↺</button>
</div>

<div v-if="errorMessage" class="errorMessage">
    <h3>{{ errorMessage }}</h3>
</div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTempUnitStore } from '../stores/tempUnit';

const zipCode = ref('');
const validZipCode = ref(false);
const countryCode = ref('US')
const weatherData = ref<WeatherData | null>(null);
const apiKey = 'fc24dbcdfc43ffd209657a5881f35a59';
const errorMessage = ref<string | null>(null);

const unitChar = ref(useTempUnitStore().getTempUnit());

watch(() => useTempUnitStore().getTempUnit(), (newTempUnit) => {
    unitChar.value = newTempUnit;
});

watch(zipCode, (zipValue) => {
    if(zipValue.length == 5 ) {
        let allAreNumbers = true;
        
        for(let i = 0; i < 5; i++) {
            if(zipCode.value[i] < '0' || zipCode.value[i] > '9') {
                allAreNumbers = false
            }
        }
        validZipCode.value = allAreNumbers;
    } else {
        validZipCode.value = false;
    }
})
async function getLocation() {
    const apiURL = 'http://api.openweathermap.org/geo/1.0/zip?zip=$'+ zipCode.value + ',' + countryCode.value + '&appid=' + apiKey;
    try {
        const response = await fetch(apiURL);
        if(!response.ok) {
            throw new Error('No location data available. Try again later.');
        }
        const locationData = await response.json();
        return locationData;
    } catch(error) {
        errorMessage.value = error as string;
    }
}

async function getWeather() {
    if(validZipCode.value) {
        if(errorMessage.value) {
            errorMessage.value = null;
        }
        const locationData = await getLocation();
        if(locationData) {
            let unitOfTemp:string = 'F';
            if(unitChar.value == 'C') {
                unitOfTemp = 'metric';
            } else if(unitChar.value == 'F') {
                unitOfTemp = 'imperial';
            }
            const apiURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+locationData.lat+'&lon='+locationData.lon+'&units='+ unitOfTemp +'&appid='+apiKey;
            try {
                const response = await fetch(apiURL);
                if(!response.ok) {
                    throw new Error('No weather data available. Try again later.');
                }
                weatherData.value = await response.json();
            } catch(error) {
                errorMessage.value = error as string;
            }
            if(weatherData.value) {
                weatherData.value.main.temp = Math.round(weatherData.value.main.temp);
                weatherData.value.main.feels_like = Math.round(weatherData.value.main.feels_like);
            }
        }
    }
}

const resetData = () => {
    weatherData.value = null;
    zipCode.value = '';
    validZipCode.value = false;
}

const toggleUnit = () => {
    useTempUnitStore().toggleUnit();
    if(weatherData.value && unitChar.value == 'C') {
        weatherData.value.main.temp = Math.round((weatherData.value.main.temp - 32) * 5/9);
        weatherData.value.main.feels_like = Math.round((weatherData.value.main.feels_like - 32) * 5/9);
    } else if(weatherData.value && unitChar.value == 'F') {
        weatherData.value.main.temp = Math.round((weatherData.value.main.temp * 9/5) + 32);
        weatherData.value.main.feels_like = Math.round((weatherData.value.main.feels_like * 9/5) + 32);
    }
}

</script>

<script lang="ts">

interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
}

</script>

<style>

.errorMessage {
    color: #f28480;
}

</style>