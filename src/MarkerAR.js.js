import React from "react";

export default function MarkerAR() {
  return (
    <a-scene
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Marker: Hiro pattern */}
      <a-marker preset="hiro">
        {/* 3D object anchored on marker */}
        <a-box position="0 0.5 0" material="color: red"></a-box>
      </a-marker>

      {/* Camera */}
      <a-entity camera></a-entity>
    </a-scene>
  );
}