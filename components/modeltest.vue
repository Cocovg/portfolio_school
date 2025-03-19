<template>
  <div ref="sceneContainer" class="w-full h-screen" />
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted } from 'vue'

const sceneContainer = ref(null)

onMounted(() => {
  // Setup scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 1, 3)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  sceneContainer.value.appendChild(renderer.domElement)

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enableZoom = true

  // Licht
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xff9966, 1.2)
  mainLight.position.set(10, 10, 10)
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x6699ff, 0.8)
  fillLight.position.set(-10, 0, -10)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xff66ff, 0.6)
  rimLight.position.set(0, 10, -10)
  scene.add(rimLight)

  const pointLight1 = new THREE.PointLight(0x00ff00, 0.8, 15)
  pointLight1.position.set(2, 5, 5)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xff0066, 0.8, 15)
  pointLight2.position.set(-2, 3, -5)
  scene.add(pointLight2)

  // Laad het head.glb model
  const loader = new GLTFLoader()
  loader.load(
      '/models/flowers.glb',
      (gltf) => {
        const model = gltf.scene
        model.scale.set(1, 1, 1) // pas schaal aan indien nodig
        model.position.set(0, 0, 0)
        scene.add(model)
      },
      undefined,
      (error) => {
        console.error('Fout bij laden van head2.glb:', error)
      }
  )

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)
    
    const time = Date.now() * 0.001
    pointLight1.position.x = Math.sin(time) * 5
    pointLight1.position.z = Math.cos(time) * 5
    
    pointLight2.position.x = Math.sin(time + Math.PI) * 5
    pointLight2.position.z = Math.cos(time + Math.PI) * 5
    
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  // Responsief
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>

<style scoped>
/* optioneel */
</style>
