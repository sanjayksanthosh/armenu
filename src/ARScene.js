import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

export default function ARScene() {
  const mountRef = useRef(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    setRenderer(renderer);

    // Add AR button
    const arButton = ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] });
    document.body.appendChild(arButton);

    // Reticle for hit test visualization
    const reticleGeometry = new THREE.RingGeometry(0.1, 0.11, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    // Load 3D model
    let model = null;
    const loader = new GLTFLoader();
    loader.load(
      "/models/pizza.glb", // Make sure this path is correct and model exists
      (gltf) => {
        model = gltf.scene;
        model.visible = false;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Controller for input
    const controller = renderer.xr.getController(0);
    scene.add(controller);

    // Hit test variables
    let hitTestSource = null;
    let hitTestSourceRequested = false;

    controller.addEventListener("select", () => {
      if (reticle.visible && model) {
        model.position.setFromMatrixPosition(reticle.matrix);
        model.visible = true;
      }
    });

    // Animation loop
    renderer.setAnimationLoop((timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequested) {
          session.requestReferenceSpace("viewer").then((refSpace) => {
            session.requestHitTestSource({ space: refSpace }).then((source) => {
              hitTestSource = source;
            });
          });

          session.addEventListener("end", () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
          });

          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            reticle.visible = true;
            reticle.matrix.fromArray(pose.transform.matrix);
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    });

    // Handle window resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onResize);

      if (renderer && renderer.xr.getSession()) {
        renderer.xr.getSession().end();
      }

      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }

      const arBtn = document.body.querySelector("button[title='Enter AR']");
      if (arBtn) {
        arBtn.remove();
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}