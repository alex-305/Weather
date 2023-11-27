<template>
<head>
Weather
</head>

<div>
  <NavigationBar/>
  <br>
  <div>
    <RouterView/>
  </div>
</div>


</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';


</script>


<style>

</style>