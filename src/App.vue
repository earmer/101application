<template>
  <LandingPage />
  <!-- <OurPrinciples />
  <OurProducts /> -->
</template>

<script>
import LandingPage from './components/LandingPage.vue';
// import OurPrinciples from './components/OurPrinciples.vue';
// import OurProducts from './components/OurProducts.vue';

export default {
  name: 'App',
  components: {
    LandingPage,
    // OurPrinciples,
    // OurProducts,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
