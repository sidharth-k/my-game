import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import robo from './assets/robot.glb';

function WorkingThreeScene() {
  const mountRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false); // Track if the model is loaded

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

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Load the model using GLTFLoader
    const loader = new GLTFLoader();
    let model;

    loader.load(
      robo,
      (gltf) => {
        // Model loaded successfully
        model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0); // Optional: Adjust model position

        // Update state when model is loaded
        setIsModelLoaded(true);
        console.log('Model loaded successfully!');
      },
      (xhr) => {
        // Monitor loading progress
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    // Camera position and look-at adjustments
    camera.lookAt(0, 0, 0);

    const animate = function () {
      requestAnimationFrame(animate);

      if (isModelLoaded) {
        // Once the model is loaded, update controls and render
        controls.update();
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isModelLoaded]); // Re-run effect when model is loaded

  return <div ref={mountRef} />;
}

export default WorkingThreeScene;
