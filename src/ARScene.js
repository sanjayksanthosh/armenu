import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARSceneMarker() {
  const mountRef = useRef(null);

  useEffect(() => {
    let mindarThree, renderer, scene, camera, anchor;

    // Function to start AR
    const startAR = async () => {
      if (!window.MindARThree) {
        console.error("MindARThree is not loaded!");
        return;
      }

      const { MindARThree } = window;

      mindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // your marker/card file
      });

      ({ renderer, scene, camera } = mindarThree);

      // Lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Anchor for first marker
      anchor = mindarThree.addAnchor(0);

      // Load 3D model
      const loader = new GLTFLoader();
      loader.load(
        "/models/pizza.glb",
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);
          model.position.set(0, 0, 0);
          anchor.group.add(model);
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );

      // Marker found/lost events
      anchor.onTargetFound = () => console.log("Marker found!");
      anchor.onTargetLost = () => console.log("Marker lost!");

      // Start MindAR
      await mindarThree.start();

      // Render loop
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    // Dynamically load MindAR script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/dist/mindar-image-three.prod.js";
    script.async = true;
    script.onload = () => {
      console.log("MindAR script loaded!");
      startAR();
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
      if (mindarThree) mindarThree.stop();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
