<template>
  <LandingPage />
  <BackgroundAnimate id="bg_a" />
  <!-- <OurPrinciples />
  <OurProducts /> -->
</template>

<script>
import BackgroundAnimate from './components/BackgroundAnimate.vue';
import LandingPage from './components/LandingPage.vue';
// import OurPrinciples from './components/OurPrinciples.vue';
// import OurProducts from './components/OurProducts.vue';

export default {
  name: 'App',
  components: {
    LandingPage,
    BackgroundAnimate,
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

#bg_a,
#defaultCanvas0 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

#defaultCanvas0 {
  z-index: -2;
}
</style>
