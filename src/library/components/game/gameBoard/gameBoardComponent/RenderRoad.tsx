import { RenderRoadProps } from "@library/types/gameboard/GameboardTypes.ts";
import { Vector3, Vector2} from "three";
import { Line } from "@react-three/drei";

export function RenderRoad({ cornerIDsWithCoords, startCornerId, endCornerId, color  }: RenderRoadProps) {
    const startCoords = cornerIDsWithCoords[parseInt(startCornerId)];
    const endCoords = cornerIDsWithCoords[parseInt(endCornerId)];
    if (!startCoords || !endCoords) return null;
  
    const points: (number | Vector3 | Vector2 | [number, number, number] | [number, number])[] = [
      [startCoords[0], startCoords[1], startCoords[2]], 
      [endCoords[0], endCoords[1], endCoords[2]] 
    ];
   
    return (
      <Line
        points={points} 
        color={color}
        lineWidth={20}
      />
    );
  }