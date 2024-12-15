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
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Load the model using GLTFLoader
    const loader = new GLTFLoader();
    let model;
    let modelGltf;
    let mixer = null;
    let clock = new THREE.Clock();
    loader.load(
      robo,
      (gltf) => {
        // Model loaded successfully
        modelGltf = gltf;
        model = gltf.scene;
        model.position.set(0, 0, 0); // Optional: Adjust model position
        // let clip = mixer.clipAction(modelGltf.animations[0], model);
        // clip.play();
        scene.add(model);
           // Setup animation mixer
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.play();
            });
          }
        // Update state when model is loaded
        setIsModelLoaded(true);
        // mixer =  new THREE.AnimationMixer(model);
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
    camera.position.set(0,0,1);
    const animate = function () {
      requestAnimationFrame(animate);

      if (isModelLoaded && mixer) {
        // Once the model is loaded, update controls and render
        controls.update();
        
        const delta = clock.getDelta();
        mixer.update(delta);
        renderer.render(scene, camera);
        
      }
    };

    
    // let clip = mixer.clipAction(glb.animations[0], glb.scene);
    // clip.play();

	// use the following once the loader has loaded the model
	// if (modelGltf.animations.length > 0) {
		// mixer = new THREE.AnimationMixer( modelGltf.scene );
		// modelGltf.animations.forEach( clip => { mixer.clipAction( clip ).loop = THREE.LoopRepeat; } );
		// mixer.clipAction( modelGltf.animations[ 0 ] ).play();
	// }

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
