import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARMarkerScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    let mindarThree, renderer, scene, camera;

    const startAR = async () => {
      const { MindARThree } = window;

      mindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // your compiled marker file
      });

      ({ renderer, scene, camera } = mindarThree);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const anchor = mindarThree.addAnchor(0); // first marker in .mind file

      const loader = new GLTFLoader();
      loader.load("/models/pizza.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
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
