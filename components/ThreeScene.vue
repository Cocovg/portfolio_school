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
let camera = null
let popupPlane = null
let popupText = null

// Function to create popup content
const createPopupContent = (title, content) => {
  // Create canvas for text
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 512
  canvas.height = 256

  // Set background
  context.fillStyle = 'rgba(255, 255, 255, 0.9)'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Add text
  context.fillStyle = '#000000'
  context.font = 'bold 32px Arial'
  context.fillText(title, 20, 40)

  context.font = '24px Arial'
  context.fillText(content, 20, 80)

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(1, 0.5)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })

  return new THREE.Mesh(geometry, material)
}

onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0D0C1B)

  // Create star field
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 2000 // Number of stars
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // Random positions in a sphere
    const radius = Math.random() * 100 + 50
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 2
    
    positions[i] = radius * Math.sin(theta) * Math.cos(phi)
    positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[i + 2] = radius * Math.cos(theta)
    
    // Random star colors (white to blue-white)
    const color = new THREE.Color()
    color.setHSL(0.6, 0.1, Math.random() * 0.5 + 0.5)
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })
  
  const starField = new THREE.Points(starGeometry, starMaterial)
  scene.add(starField)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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

  const mainLight = new THREE.DirectionalLight(0xff0066, 1.2)
  mainLight.position.set(10, 10, 10)
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x27BEFF, 0.8)
  fillLight.position.set(-10, 0, -10)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xff66ff, 0.6)
  rimLight.position.set(0, 10, -10)
  scene.add(rimLight)

  const pointLight1 = new THREE.PointLight(0xFFF200, 0.8, 15)
  pointLight1.position.set(2, 5, 5)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xff0066, 0.8, 15)
  pointLight2.position.set(-2, -1, -5)
  scene.add(pointLight2)


  // Load head.glb
  const loader = new GLTFLoader()
  loader.load('/models/cry.glb', (gltf) => {
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

  drawCurve(pathA.getPoints(50), 0xffffff)
  drawCurve(pathB.getPoints(50), 0xFFE600)

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

  pointsA.forEach((pt, i) => createPointMarker(pt, `A-${i}`, 0xffffff))
  pointsB.forEach((pt, i) => createPointMarker(pt, `B-${i}`, 0xFFE600))

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
      const targetPos = new THREE.Vector3().copy(clicked.position).add(new THREE.Vector3(0, 0.5, 1.5))
      targetCameraPos = targetPos

      // Remove existing popup if any
      if (popupPlane) {
        scene.remove(popupPlane)
      }

      // Create new popup
      const title = `Point ${clicked.userData.id}`
      const content = `This is a sample content for point ${clicked.userData.id}. You can customize this content as needed.`
      popupPlane = createPopupContent(title, content)
      
      // Position popup above the clicked point
      popupPlane.position.copy(clicked.position)
      popupPlane.position.y += 0.2 // Offset above the point
      
      // Make popup face the camera
      popupPlane.lookAt(camera.position)
      
      scene.add(popupPlane)
    }
  }

  renderer.domElement.addEventListener('click', onClick)

  // Animate
  const animate = () => {
    requestAnimationFrame(animate)

    // Animate stars with slower color changes
    const time = Date.now() * 0.0005 // Slower animation
    const positions = starField.geometry.attributes.position.array
    const colors = starField.geometry.attributes.color.array
    
    for (let i = 0; i < positions.length; i += 3) {
      // Slower flicker effect
      const flicker = Math.sin(time + positions[i] * 0.1) * 0.3 + 0.7
      colors[i] = flicker
      colors[i + 1] = flicker
      colors[i + 2] = flicker
    }
    
    starField.geometry.attributes.color.needsUpdate = true

    // Animate lights
    pointLight1.position.x = Math.sin(time) * 5
    pointLight1.position.z = Math.cos(time) * 5
    
    pointLight2.position.x = Math.sin(time + Math.PI) * 5
    pointLight2.position.z = Math.cos(time + Math.PI) * 5

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

    // Update popup orientation to face camera
    if (popupPlane) {
      popupPlane.lookAt(camera.position)
    }

    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>
