import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera;

    const startAR = async () => {
      // Renderer with AR support
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      mountRef.current.appendChild(renderer.domElement);

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
      scene.add(camera);

      // Lights
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load 3D Model
      const loader = new GLTFLoader();
      loader.load("/models/pizza.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, -2); // place 2m in front of camera
        scene.add(model);
      });

      // ✅ Add AR Button (to start camera + AR session)
      document.body.appendChild(
        renderer.xr.getButton({ requiredFeatures: ["hit-test"] })
      );

      // Render Loop
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    startAR();

    return () => {
      if (renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
