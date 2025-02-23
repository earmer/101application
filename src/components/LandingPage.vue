<template>
  <div class="relative flex items-center justify-center h-screen text-white">
    <img :src="logoImage" alt="Logo" class="logo w-1/3 absolute" />
    <div class="relative z-10 flex flex-col items-start">
      <h1 class="intro text-6xl">{{ $t('intro') }}</h1>
      <h2 class="slogan text-3xl text-gray-400">{{ $t('slogan') }}</h2>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  data() {
    return {
      logoImage: require('@/assets/background.svg'),
    };
  },
  mounted() {
    gsap.fromTo(".logo",
      { y: -20, opacity: 0 },
      { duration: 6, y: 0, opacity: 1, ease: "elastic.out(1, 0.5)" }
    );
    gsap.from(".intro", { duration: 1, opacity: 0, delay: 0.2, ease: "power2" });
    gsap.from(".slogan", { duration: 0.5, opacity: 0, delay: 0.5, ease: "power2" });
  },
};
</script>

<style scoped>
.intro {
  font-weight: 500;
}

.slogan {
  -webkit-text-stroke: 0.5px black;
  paint-order: stroke fill;
}
</style>
