<template>
    <div class="background-container">
        <div ref="baseCanvasContainer" class="canvas-container"></div>
        <div class="glass-overlay"></div>
        <div ref="ditherCanvasContainer" class="canvas-container dither-layer"></div>
    </div>
</template>

<script>
import p5 from 'p5';

export default {
    name: 'BackgroundAnimate',
    data() {
        return {
            baseP5Instance: null,
            ditherP5Instance: null
        }
    },
    mounted() {
        this.baseP5Instance = new p5(this.baseSketch, this.$refs.baseCanvasContainer);
        this.ditherP5Instance = new p5(this.ditherSketch, this.$refs.ditherCanvasContainer);
    },
    beforeUnmount() {
        if (this.baseP5Instance) {
            this.baseP5Instance.remove();
        }
        if (this.ditherP5Instance) {
            this.ditherP5Instance.remove();
        }
    },
    methods: {
        baseSketch(p) {
            // Base animation sketch (gets blurred)
            let particles = [];
            const numParticles = 15; // Reduced from 20 to 15 for better performance
            const scaleFactor = 0.25;
            let lastFrameTime = 0;
            const targetFrameRate = 30; // Cap at 30fps for better performance

            p.setup = () => {
                const canvas = p.createCanvas(
                    p.windowWidth * scaleFactor,
                    p.windowHeight * scaleFactor
                );
                canvas.style('width', '100%');
                canvas.style('height', '100%');
                p.frameRate(targetFrameRate); // Explicitly set frame rate

                // Initialize particles with staggered appearances
                for (let i = 0; i < numParticles; i++) {
                    const particle = new Particle(p);

                    // First particle has no delay, others have random delays
                    if (i > 0) {
                        particle.initialDelay = Math.floor(p.random(0, 60));
                    } else {
                        particle.initialDelay = 0;
                    }

                    particles.push(particle);
                }
            }

            p.draw = () => {
                // Frame rate throttling for consistent performance
                const currentTime = p.millis();
                if (currentTime - lastFrameTime < 1000 / targetFrameRate) {
                    return; // Skip frames to maintain target frame rate
                }
                lastFrameTime = currentTime;

                p.background(10);
                p.colorMode(p.HSB, 360, 50, 90, 1); // Increased saturation and brightness

                // Update and display particles
                for (let i = 0; i < particles.length; i++) {
                    let particle = particles[i];
                    particle.update();
                    particle.display();
                }

                // Reduce the frequency of random state changes to avoid sudden disruptions
                if (p.frameCount % 120 === 0) { // Changed from 30 to 120
                    // Randomly select a particle to change state, but only if it's at a good transition point
                    let candidates = particles.filter(p =>
                        (p.state === 'cycling' && (p.scalePhase < 0.2 || p.scalePhase > Math.PI * 1.8))
                    );

                    if (candidates.length > 0) {
                        let particle = p.random(candidates);
                        particle.prepareNextCycle();
                    }
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(
                    p.windowWidth * scaleFactor,
                    p.windowHeight * scaleFactor
                );
            }

            class Particle {
                constructor() {
                    this.reset(true);
                    this.hue = p.random(360);
                    this.hueSpeed = p.random(-0.8, 0.8);

                    // Properties for appearing/disappearing
                    this.scale = 0.1; // Start at 10% instead of 0
                    this.targetScale = 2;
                    this.scalePhase = Math.asin(0.1); // Start phase at equivalent of scale 0.1
                    this.phaseSpeed = p.random(0.001, 0.003); // Slightly slower overall
                    this.growSpeed = p.random(0.005, 0.008); // Faster growth
                    this.shrinkSpeed = p.random(0.001, 0.002); // Slower shrinking
                    this.state = 'delaying'; // Start in delaying state
                    this.initialDelay = 0; // Will be set after construction
                    this.delayCounter = 0; // Track how long we've been delaying
                }

                reset(newPosition = false) {
                    if (newPosition) {
                        this.x = p.width / 2 + p.random(-p.width / 3, p.width / 3);
                        this.y = p.height / 2 + p.random(-p.height / 3, p.height / 3);
                    }
                    this.size = p.random(150, 450) * scaleFactor; // Smaller size range
                    this.speedX = p.random(-0.3, 0.3) * scaleFactor; // Slower movement
                    this.speedY = p.random(-0.3, 0.3) * scaleFactor;

                    // Reset appearance properties for a new cycle
                    this.scale = 0.4; // Start at 10% instead of 0
                    this.scalePhase = Math.asin(0.4); // Start phase at equivalent of scale 0.1
                    this.phaseSpeed = p.random(0.001, 0.003); // Slower base phase speed
                    this.growSpeed = p.random(0.003, 0.005); // Faster growth
                    this.shrinkSpeed = p.random(0.001, 0.002); // Slower shrinking
                    this.state = 'delaying'; // Start in delaying state
                    this.pauseDuration = p.random(120, 240);
                    this.pauseCounter = 0;
                    this.age = 0;
                    this.delayCounter = 0;
                    this.nextCycleReady = false; // Flag to prepare for next cycle
                }

                prepareNextCycle() {
                    // Only prepare for next cycle if we're near the end or beginning
                    if (this.scalePhase > Math.PI * 1.8) {
                        this.nextCycleReady = true;
                    }
                }

                update() {
                    // Check if we need to delay before starting animation
                    if (this.state === 'delaying') {
                        this.delayCounter++;
                        if (this.delayCounter >= this.initialDelay) {
                            this.state = 'cycling';
                        }
                        return; // Skip all other updates while delaying
                    }

                    // Regular position and hue updates
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.hue = (this.hue + this.hueSpeed) % 360;
                    this.age++;

                    // Wall bounce behavior - simplified for performance
                    if (this.x < p.width * 0.1 || this.x > p.width * 0.9) {
                        this.speedX *= -0.8;
                    }
                    if (this.y < p.height * 0.1 || this.y > p.height * 0.9) {
                        this.speedY *= -0.8;
                    }

                    // Pause at peak logic
                    if (this.scalePhase >= Math.PI * 0.5 && this.scalePhase <= Math.PI * 1.5) {
                        // Around the top of the sine wave
                        if (Math.sin(this.scalePhase) > 0.9) { // Close to peak
                            this.pauseCounter++;
                            if (this.pauseCounter < this.pauseDuration) {
                                return; // Pause at the top, don't update phase
                            }
                        }
                    } else {
                        this.pauseCounter = 0; // Reset pause counter when not at peak
                    }

                    // Progress the phase with variable speed depending on growing or shrinking
                    const currentSin = Math.sin(this.scalePhase);
                    // If growing (sin is increasing)
                    if (currentSin >= 0 && this.scalePhase < Math.PI / 2) {
                        this.scalePhase += this.growSpeed;
                    }
                    // If shrinking (sin is decreasing)
                    else if (currentSin >= 0 && this.scalePhase >= Math.PI / 2) {
                        this.scalePhase += this.shrinkSpeed;
                    }
                    // Negative part of sine - use base speed
                    else {
                        this.scalePhase += this.phaseSpeed;
                    }

                    // Calculate scale with custom easing for faster initial growth and slower final growth
                    let rawScale = Math.sin(this.scalePhase);
                    rawScale = Math.max(0.1, rawScale); // Minimum scale of 10%

                    // Custom easing function: faster 0-40%, slower 40-100%
                    if (rawScale <= 0.4) {
                        // For 10-40% range, accelerate (use power < 1)
                        this.scale = Math.pow((rawScale - 0.1) / 0.3, 0.4) * 0.3 + 0.1;
                    } else {
                        // For 40-100% range, decelerate (use power > 1)
                        const remaining = (rawScale - 0.4) / 0.6; // normalize 0.4-1.0 to 0-1
                        const slowedRemaining = Math.pow(remaining, 1.5); // slow down the upper range
                        this.scale = 0.4 + (slowedRemaining * 0.6); // add to the fast part
                    }

                    // Handle cycle completion
                    if (this.scalePhase >= Math.PI * 2) {
                        if (this.nextCycleReady) {
                            // Complete reset for next cycle
                            this.reset(true);
                            this.initialDelay = Math.floor(p.random(30, 90)); // Shorter subsequent delay
                            this.nextCycleReady = false;
                        } else {
                            // Continue cycling smoothly - just wrap the phase
                            this.scalePhase = this.scalePhase % (Math.PI * 2);
                        }
                    }
                }

                display() {
                    // Don't display anything during delay
                    if (this.state === 'delaying') return;

                    if (this.scale > 0) {
                        p.noStroke();
                        // Medium alpha for balanced contrast
                        const alpha = 0.7 * this.scale;
                        p.fill(this.hue, 75, 85, alpha);
                        p.ellipse(this.x, this.y, this.size * this.scale);
                    }
                }
            }
        },
    }
}
</script>

<style scoped>
.background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.canvas-container {
    width: 100%;
    height: 100%;
}

.glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(160px);
    -webkit-backdrop-filter: blur(160px);
    pointer-events: none;
}

.dither-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    /* Above the glass overlay */
}

/* Firefox-specific fix */
@-moz-document url-prefix() {
    .glass-overlay {
        backdrop-filter: blur(16lvh);
    }
}

canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
}
</style>