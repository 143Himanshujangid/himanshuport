let scene, camera, renderer, particles, stars, galaxyParticles;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let time = 0;

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();
    
    // Perspective camera with better depth
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 50;
    camera.position.y = 10;
    camera.rotation.x = -0.2;

    // Enhanced renderer settings
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Create particle systems
    createMainParticles();
    createStars();
    createGalaxyEffect();
    
    // Add lights
    addLights();

    animate();
}

function createMainParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    const color1 = new THREE.Color(0x00ff88);
    const color2 = new THREE.Color(0x00ccff);

    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 60;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float aScale;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = aScale * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 3.0);
                vec3 finalColor = mix(vec3(0.0), vColor, strength);
                gl_FragColor = vec4(finalColor, strength);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsArray = new Float32Array(starsCount * 3);

    for(let i = 0; i < starsCount * 3; i++) {
        starsArray[i] = (Math.random() - 0.5) * 100;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createGalaxyEffect() {
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 15000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);

    const colorInside = new THREE.Color(0x00ff88);
    const colorOutside = new THREE.Color(0x00ccff);

    for(let i = 0; i < galaxyCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 100;
        const spinAngle = radius * 5;
        const branchAngle = ((i % 3) / 3) * Math.PI * 2;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * (radius * 0.2);
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

        const mixedColor = colorInside.clone().lerp(colorOutside, radius / 100);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyParticles);
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff88, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ccff, 2, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // Enhanced cursor-following movement
    targetX = mouseX * 0.003;
    targetY = mouseY * 0.003;
    
    // Smoother camera movement
    camera.position.x += (targetX - camera.position.x) * 0.2;
    camera.position.y += (-targetY - camera.position.y) * 0.2;
    camera.lookAt(scene.position);

    // More dynamic particle rotation
    particles.rotation.x += (targetY - particles.rotation.x) * 0.1;
    particles.rotation.y += (targetX - particles.rotation.y) * 0.1;

    if(galaxyParticles) {
        galaxyParticles.rotation.x += (targetY - galaxyParticles.rotation.x) * 0.08;
        galaxyParticles.rotation.y += (targetX - galaxyParticles.rotation.y) * 0.08;
    }

    // Enhanced wave animation with more dynamic movement
    const positions = particles.geometry.attributes.position.array;
    for(let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] += Math.sin(time + x * 0.5) * 0.03;
        positions[i] += Math.cos(time + z * 0.5) * 0.03;
        positions[i + 2] += Math.sin(time + x * 0.5) * 0.03;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);

init(); 