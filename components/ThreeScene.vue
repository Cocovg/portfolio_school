<template>
  <div ref="sceneContainer" class="w-full h-screen" />
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted } from 'vue'
import { usePathPoints } from '@/composables/usePathPoints.js'

const sceneContainer = ref(null)

let targetCameraPos = null


onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 1, 4)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.physicallyCorrectLights = true
  sceneContainer.value.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

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


  // Load head.glb
  const loader = new GLTFLoader()
  loader.load('/models/glass7.glb', (gltf) => {
    const model = gltf.scene
    model.scale.set(1, 1, 1)
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.4
        child.material.roughness = 0.3
      }
    })
    scene.add(model)
  })

  // Add path points
  const { pointsA, pointsB, pathA, pathB } = usePathPoints()

  // Draw curves (optional, for visuals)
  const drawCurve = (points, color) => {
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const curveMaterial = new THREE.LineBasicMaterial({ color })
    const curveLine = new THREE.Line(curveGeometry, curveMaterial)
    scene.add(curveLine)
  }

  drawCurve(pathA.getPoints(50), 0xff0000)
  drawCurve(pathB.getPoints(50), 0x0000ff)

  // Add clickable points (spheres)
  const clickablePoints = []
  const createPointMarker = (pos, id, color = 0xffffff) => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshStandardMaterial({ color })
    )
    sphere.position.copy(pos)
    sphere.userData = { id }
    clickablePoints.push(sphere)
    scene.add(sphere)
  }

  pointsA.forEach((pt, i) => createPointMarker(pt, `A-${i}`, 0xff0000))
  pointsB.forEach((pt, i) => createPointMarker(pt, `B-${i}`, 0x0000ff))

  // Raycaster for clicking points
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const onClick = (event) => {
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(clickablePoints)

  if (intersects.length > 0) {
    const clicked = intersects[0].object
    const targetPos = new THREE.Vector3().copy(clicked.position).add(new THREE.Vector3(0, 0.5, 1.5)) // camera offset
    targetCameraPos = targetPos
  }
}


  renderer.domElement.addEventListener('click', onClick)

  // Animate
  const animate = () => {
  requestAnimationFrame(animate)

  // Smooth camera movement
  if (targetCameraPos) {
    const lerpSpeed = 0.05
    camera.position.lerp(targetCameraPos, lerpSpeed)

    // Stop lerping when close enough
    if (camera.position.distanceTo(targetCameraPos) < 0.01) {
      targetCameraPos = null
    }

    camera.lookAt(0, 0.5, 0) // Keep looking at center of model
  }

  controls.update()
  renderer.render(scene, camera)
}

  animate()

  // Animation loop
  const lightAnimate = () => {
    requestAnimationFrame(lightAnimate)
    
    const time = Date.now() * 0.001
    pointLight1.position.x = Math.sin(time) * 5
    pointLight1.position.z = Math.cos(time) * 5
    
    pointLight2.position.x = Math.sin(time + Math.PI) * 5
    pointLight2.position.z = Math.cos(time + Math.PI) * 5
    
    controls.update()
    renderer.render(scene, camera)
  }

  lightAnimate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>
