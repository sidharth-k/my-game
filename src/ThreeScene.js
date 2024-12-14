import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import robo from "./assets/robot.glb"

function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();
  
      loader.load(
      robo,
      (gltf) => {
          // Add the loaded model to the scene
          const model = gltf.scene;
          scene.add(model);
          model.position.set(0, 0, 0); // Optional: Adjust model position
      },
      (xhr) => {
          // Optional: Monitor loading progress
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
          console.error('An error occurred:', error);
      }
  );

  camera.lookAt(0, 0, 0);
  camera.position.set(10, 10, 10);

  const animate = function() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}

export default ThreeScene;
