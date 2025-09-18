import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MindARThree } from "mind-ar/three"; // ✅ correct import for Vercel

export default function ARSceneMarker() {
  const mountRef = useRef(null);

  useEffect(() => {
    let mindarThree, renderer, scene, camera;

    const startAR = async () => {
      mindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // marker definition file
      });

      ({ renderer, scene, camera } = mindarThree);

      // Lights
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Marker anchor
      const anchor = mindarThree.addAnchor(0);

      // Load model
      const loader = new GLTFLoader();
      loader.load("/models/pizza.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, 0);
        anchor.group.add(model);
      });

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
