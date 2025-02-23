<template>
    <div>
        <div id="glass"></div>
    </div>
</template>

<script>
import p5 from 'p5';

export default {
    name: 'BackgroundAnimate',
    mounted() {
        new p5(this.sketch);
    },
    methods: {
        sketch(p) {
            let particles = [];
            const numParticles = 10;

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle(p));
                }
            }

            p.draw = () => {
                p.background(20);
                p.colorMode(p.HSB, 360, 100, 100, 1);
                for (let particle of particles) {
                    particle.update();
                    particle.display();
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            }

            class Particle {
                constructor() {
                    this.reset();
                    this.hue = p.random(360);
                    this.hueSpeed = p.random(0.1, 0.2);
                }

                reset() {
                    this.x = p.random(p.width);
                    this.y = p.random(p.height);
                    this.size = p.random(300, 500);
                    this.speedX = p.random(-0.3, 0.3);
                    this.speedY = p.random(-0.3, 0.3);
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.hue = (this.hue + this.hueSpeed) % 360;

                    if (this.x < 0 || this.x > p.width) {
                        this.speedX *= -1;
                        this.speedX += p.random(-0.1, 0.1);
                    }
                    if (this.y < 0 || this.y > p.height) {
                        this.speedY *= -1;
                        this.speedY += p.random(-0.1, 0.1);
                    }
                }

                display() {
                    p.noStroke();
                    p.fill(this.hue, 80, 90, 0.7);
                    p.ellipse(this.x, this.y, this.size);
                }
            }
        }
    }
}
</script>

<style scoped>
#glass {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    backdrop-filter: blur(188px);
    pointer-events: none;
}

canvas {
    display: block;
}
</style>