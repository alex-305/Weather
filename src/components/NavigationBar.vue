
<template>
<div class="navbar">
    <nav>
        <RouterLink to="/" active-class="active">Weather</RouterLink>
        <RouterLink to="/about" active-class="active">About</RouterLink>
    </nav>
</div>

</template>

<script setup lang="ts">

</script>


<style>
.navbar {
    background-color: #356d6e;
    height: 30px;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
}

.navbar a {
    font-size: 25px;
    font-weight: bold;
    margin-right: 15px;
    text-decoration: none;
    color: #d3e0e0;
}

.active {
    background-color: #356e42;
}

</style>