// composables/usePathPoints.js

import * as THREE from 'three'

export function usePathPoints() {
  // Pad A: rond model, variërende hoogte
  const pathA = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.5, 0.5, 0),
    new THREE.Vector3(0, 1.0, 1.5),
    new THREE.Vector3(-1.5, 0.3, 0),
    new THREE.Vector3(0, 0.8, -1.5),
    new THREE.Vector3(1.5, 0.5, 0),
  ])

  // Pad B: omgekeerd rond model, wisselende z-as en hoogte
  const pathB = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 1.5, 0),
    new THREE.Vector3(0, 0.6, -1.2),
    new THREE.Vector3(1.5, 1.2, 0.5),
    new THREE.Vector3(0, 0.9, 1.7),
    new THREE.Vector3(-1.5, 1.5, 0),
  ])

  const getPathPoints = (path, numPoints = 8) => path.getPoints(numPoints)

  return {
    pathA,
    pathB,
    pointsA: getPathPoints(pathA),
    pointsB: getPathPoints(pathB),
  }
}
