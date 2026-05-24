import * as THREE from "three";

const canvas = document.querySelector("[data-scroll-scene]");

if (canvas) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 90);
  camera.position.set(0, 2.4, 10);

  const rig = new THREE.Group();
  scene.add(rig);

  const ambient = new THREE.AmbientLight(0xffffff, 0.76);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x123b55,
    emissive: 0x082635,
    emissiveIntensity: 0.28,
    metalness: 0.7,
    roughness: 0.34,
    transparent: true,
    opacity: 0.55
  });

  const amberMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6b63f,
    emissive: 0xf07324,
    emissiveIntensity: 0.18,
    metalness: 0.45,
    roughness: 0.38,
    transparent: true,
    opacity: 0.34
  });

  const panelGeometry = new THREE.BoxGeometry(1.6, 0.045, 0.82);
  const accentGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.95);

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set((col - 4) * 1.95, -1.2, (row - 3) * 1.08);
      panel.rotation.x = -0.82;
      panel.rotation.z = -0.1;
      rig.add(panel);

      if ((row + col) % 4 === 0) {
        const accent = new THREE.Mesh(accentGeometry, amberMaterial);
        accent.position.set(panel.position.x + 0.74, panel.position.y + 0.03, panel.position.z);
        accent.rotation.copy(panel.rotation);
        rig.add(accent);
      }
    }
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x16b8d4,
    transparent: true,
    opacity: 0.24
  });

  for (let i = 0; i < 18; i += 1) {
    const z = -5 + i * 0.7;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, -1.08, z),
      new THREE.Vector3(10, -1.08, z + 0.7)
    ]);
    rig.add(new THREE.Line(geometry, lineMaterial));
  }

  const particleCount = 160;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 20;
    particlePositions[i * 3 + 1] = Math.random() * 8 - 1.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }

  const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(particlePositions, 3)),
    new THREE.PointsMaterial({
      color: 0xf6b63f,
      size: 0.035,
      transparent: true,
      opacity: 0.5
    })
  );
  scene.add(particles);

  const updateTheme = () => {
    const light = document.documentElement.dataset.theme === "light";
    renderer.setClearColor(light ? 0xe8efec : 0x05080c, light ? 0.1 : 0.16);
    panelMaterial.color.set(light ? 0x74a7b3 : 0x123b55);
    panelMaterial.emissive.set(light ? 0xdff4f6 : 0x082635);
    panelMaterial.opacity = light ? 0.34 : 0.55;
    amberMaterial.opacity = light ? 0.28 : 0.34;
    lineMaterial.color.set(light ? 0x1f6feb : 0x16b8d4);
    lineMaterial.opacity = light ? 0.16 : 0.24;
    particles.material.color.set(light ? 0xf07324 : 0xf6b63f);
    particles.material.opacity = light ? 0.34 : 0.5;
  };

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  let scrollProgress = 0;
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  };

  const clock = new THREE.Clock();
  let frameCount = 0;
  const sampleScenePixels = () => {
    const gl = renderer.getContext();
    const samples = [
      [0.5, 0.5],
      [0.72, 0.38],
      [0.28, 0.68]
    ].map(([x, y]) => {
      const pixel = new Uint8Array(4);
      gl.readPixels(
        Math.floor(renderer.domElement.width * x),
        Math.floor(renderer.domElement.height * y),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel
      );
      return Array.from(pixel);
    });

    canvas.dataset.sceneSample = samples.map((item) => item.join("-")).join("|");
    canvas.dataset.sceneNonblank = String(samples.some((item) => item.some((value) => value > 0)));
  };

  const render = () => {
    const time = clock.getElapsedTime();
    const motion = reduceMotion ? 0 : 1;

    rig.rotation.y = -0.28 + scrollProgress * 0.9 + Math.sin(time * 0.18) * 0.04 * motion;
    rig.rotation.x = -0.18 + scrollProgress * 0.28;
    rig.position.y = -0.2 + scrollProgress * 1.2;
    rig.position.z = -1.8 + scrollProgress * 1.4;

    particles.rotation.y = time * 0.018 * motion + scrollProgress * 0.5;
    particles.position.y = Math.sin(time * 0.22) * 0.12 * motion;

    camera.position.z = 9.4 - scrollProgress * 1.8;
    renderer.render(scene, camera);
    frameCount += 1;
    if (frameCount === 2 || frameCount % 90 === 0) {
      canvas.dataset.sceneReady = "true";
      canvas.dataset.sceneFrames = String(frameCount);
      canvas.dataset.sceneWidth = String(renderer.domElement.width);
      canvas.dataset.sceneHeight = String(renderer.domElement.height);
      sampleScenePixels();
    }
    window.requestAnimationFrame(render);
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("tr-theme-change", updateTheme);

  updateTheme();
  resize();
  updateScroll();
  render();
}
