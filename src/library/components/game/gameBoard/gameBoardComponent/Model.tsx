import { ModelProps } from "@library/types/gameboard/GameboardTypes.ts";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial.js";

const Model = ({
    modelPath,
    position,
    scale,
    rotation,
    color,
  }: ModelProps & { color: string }) => {
    const { nodes } = useGLTF(modelPath) as unknown as { nodes: any };
  
    // Function to find the appropriate mesh in the GLTF model
    const applyMaterialToMeshes = (
        //ts-ignore
      nodes: any,
      color: string
    ) => {
      Object.keys(nodes).forEach((key) => {
       // console.log("MODEL: "+ color.toString()  + "nodes[key]: " + key.toString());
        if (nodes[key].isMesh) {
          nodes[key].material = new MeshStandardMaterial({ color });
        }
      });
    };
  
    useEffect(() => {

      applyMaterialToMeshes(nodes, color);
    }, [nodes, color]);
  
    return (
      <group
        position={position}
        scale={scale}
        rotation={rotation}
        castShadow 
        receiveShadow 
      >
        {Object.keys(nodes).map((key) => {
          if (nodes[key].isMesh) {
            return (
              <mesh
                key={nodes[key].name}
                geometry={nodes[key].geometry}
                material={nodes[key].material}
              />
            );
          }
          return null;
        })}
      </group>
    );
  };

  export default Model;
  