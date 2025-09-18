import React from "react";
const sceneHTML = `
  <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false; sourceWidth: 640; sourceHeight: 480;" style="width: 100vw; height: 100vh;">
    <a-marker preset="hiro">
      <a-box position="0 0.5 0" material="color: red"></a-box>
    </a-marker>
    <a-entity camera></a-entity>
  </a-scene>
`;
export default function MarkerAR() {
  return <div dangerouslySetInnerHTML={{ __html: sceneHTML }} />;
}
