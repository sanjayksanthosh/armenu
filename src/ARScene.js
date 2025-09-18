import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ARSceneMarker() {
  const mountRef = useRef(null);
  const [mindarThree, setMindarThree] = useState(null);
  const [arStarted, setArStarted] = useState(false);

  useEffect(() => {
    let localMindarThree;

    if (arStarted && mountRef.current) {
      const { MindARThree } = window;

      localMindarThree = new MindARThree({
        container: mountRef.current,
        imageTargetSrc: "/targets/marker.mind", // your marker file
      });

      setMindarThree(localMindarThree);

      const { renderer, scene, camera } = localMindarThree;

      // Lights
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Marker anchor
      const anchor = localMindarThree.addAnchor(0);

      // Load model
      const loader = new GLTFLoader();
      loader.load("/models/pizza.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        anchor.group.add(model);
      });

      localMindarThree.start().then(() => {
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      });
    }

    return () => {
      if (localMindarThree) localMindarThree.stop();
    };
  }, [arStarted]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

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
