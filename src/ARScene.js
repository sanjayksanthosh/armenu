import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

export default function ARSceneMarker() {
  const mountRef = useRef(null);

  useEffect(() => {
    let mindarThree, renderer, scene, camera, model;

    const startAR = async () => {
      // Initialize MindAR with your marker image
      mindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // marker file
      });

      ({ renderer, scene, camera } = mindarThree);

      // Light
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load 3D model
      const loader = new GLTFLoader();
      loader.load("/models/pizza.glb", (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, 0);
        model.visible = true;
        anchor.group.add(model); // attach model to marker anchor
      });

      // Create anchor for first marker
      const anchor = mindarThree.addAnchor(0); // index 0 = first marker
      anchor.onTargetFound = () => {
        console.log("Marker found!");
      };
      anchor.onTargetLost = () => {
        console.log("Marker lost!");
      };

      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    startAR();

    return () => {
      if (mindarThree) mindarThree.stop();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
