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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
  directionalLight.position.set(5, 10, 7.5)
  scene.add(directionalLight)

  // Laad het head.glb model
  const loader = new GLTFLoader()
  loader.load(
      '/models/head6.glb',
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
