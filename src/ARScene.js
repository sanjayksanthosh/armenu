import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARSceneMarker() {
  const mountRef = useRef(null);
  const [arStarted, setArStarted] = useState(false);

  useEffect(() => {
    if (!arStarted) return; // only run when user clicks "Start AR"

    let mindarThree, renderer, scene, camera;

    const startAR = async () => {
      const { MindARThree } = window;

      mindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // your marker file
      });

      ({ renderer, scene, camera } = mindarThree);

      // Lights
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Anchor on marker (index 0)
      const anchor = mindarThree.addAnchor(0);

      // Load 3D model
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
  }, [arStarted]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Container for AR */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Start Button (shows until clicked) */}
      {!arStarted && (
        <button
          onClick={() => setArStarted(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "15px 30px",
            fontSize: "18px",
            borderRadius: "10px",
            border: "none",
            background: "#ff5722",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Start AR
        </button>
      )}
    </div>
  );
}
