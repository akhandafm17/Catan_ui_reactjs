import Model from "./Model.tsx";

function renderRobber(tilesWithPositions: {
    tileNumber: number;
    position: [number, number, number];
  }[], robberPosition: [number, number, number] | null = null) {
  
    const robberTile = tilesWithPositions.find(({ tileNumber }) => tileNumber === 0);
    if (!robberPosition) return null;
    if (!robberTile) return null;
  
    const robberModelPath = "/assets/robber.glb";
    const robberModelScale: [number, number, number] = [1.5, 1.5, 1.5];
    const robberModelRotation: [number, number, number] = [0, 0, 0];
  
    return (
      <Model
        modelPath={robberModelPath}
        position={robberPosition}
        scale={robberModelScale}
        rotation={robberModelRotation} 
        color={"#d3d3d3"}    />
    );
  }

  export default renderRobber;
 