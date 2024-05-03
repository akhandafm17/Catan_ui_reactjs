import { MeshStandardMaterial, Vector3 } from "three/src/Three.js";
import { generateHexagonGridPositions, resourceColors } from "./HexagonGrid.tsx";
import { useGLTF } from "@react-three/drei";
import { BuildingPlots } from "@library/types/board/BuildingPlots.ts";
import { BoardSize, BoatData, BoatLocation, CornerIDsWithCoordsType, RenderBoatProps, ResourceColors } from "@library/types/gameboard/GameboardTypes.ts";
import { Boat } from "@library/types/board/Boat.ts";
import { generateCornerIDs, generateHexagonCornerPositions } from "./HexagonTile.tsx";


function getIdByCoordinates(x: number, y: number, boardSize: BoardSize): number | null {
    const boardArrayMap: { [key in BoardSize]: (number | 'X')[][] } = {
      small: [
        ['X', 'X', 0, 1, 2, 3, 4, 5, 6, 'X', 'X'],
        ['X', 7, 8, 9, 10, 11, 12, 13, 14, 15, 'X'],
        [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
        ['X', 38, 39, 40, 41, 42, 43, 44, 45, 46, 'X'],
        ['X', 'X', 47, 48, 49, 50, 51, 52, 53, 'X', 'X']
      ],
      medium: [
        ['X', 'X', 'X', 0, 1, 2, 3, 4, 5, 6, 'X', 'X', 'X'],
        ['X', 'X', 7, 8, 9, 10, 11, 12, 13, 14, 15, 'X', 'X'],
        ['X', 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 'X'],
        [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
        [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
        ['X', 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 'X'],
        ['X', 'X', 64, 65, 66, 67, 68, 69, 70, 71, 72, 'X', 'X'],
        ['X', 'X', 'X', 73, 74, 75, 76, 77, 78, 79, 'X', 'X', 'X']
      ],
      large: [
        ['X', 'X', 'X', 0, 1, 2, 3, 4, 5, 6, 7, 8, 'X', 'X', 'X'],
        ['X', 'X', 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 'X', 'X'],
        ['X', 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 'X'],
        [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
        [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
        ['X', 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 'X'],
        ['X', 'X', 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 'X', 'X'],
        ['X', 'X', 'X', 87, 88, 89, 90, 91, 92, 93, 94, 95, 'X', 'X', 'X']
      ]
    };
  
    const boardArray = boardArrayMap[boardSize];
  
    for (let row = 0; row < boardArray.length; row++) {
      for (let col = 0; col < boardArray[row].length; col++) {
        if (row === y && col === x && typeof boardArray[row][col] === 'number') {
          return boardArray[row][col] as number;
        }
      }
    }
  
    return null;
  }

function getNearestTileGridPosition(cornerId: number, boardArray: number[][]): [number, number, number] | null {
    const hexagonWidth = 79.07500076293945;
    const hexagonHeight = 91.30799865722656;
    const middleHexCorners: [number, number, number][] = [
      [1, 35, 5],
      [30, 18, 5],
      [30, -14, 5],
      [1, -33, 5],
      [-26, -16, 5],
      [-26, 17, 5],
    ];
    const hexagonCenters = generateHexagonGridPositions(0, 0, 0, hexagonWidth, hexagonHeight, boardArray);
    
    const hexagonCorners = generateHexagonCornerPositions(hexagonCenters, middleHexCorners);
    const cornerIDsWithCoords = generateCornerIDs(hexagonCorners);
  
    const cornerPosition = cornerIDsWithCoords[cornerId];
    if (!cornerPosition) {
      return null; // Corner ID is not found
    }
  
    let nearestTilePosition: [number, number, number] | null = null;
    let minDistance = Number.MAX_VALUE;
  
    hexagonCenters.forEach(center => {
      const distance = new Vector3(cornerPosition[0], cornerPosition[1], cornerPosition[2]).distanceTo(new Vector3(...center));
      if (distance < minDistance) {
        minDistance = distance;
        nearestTilePosition = center;
      }
    });
    return nearestTilePosition;
  }

function calculateBoatPosition(
    cornerIDsWithCoords: CornerIDsWithCoordsType,
    startCornerId: number,
    endCornerId: number,
    boardArray: number[][]
  ): [number, number] {
    const startCoords = cornerIDsWithCoords[startCornerId];
    const endCoords = cornerIDsWithCoords[endCornerId];
  
    if (!startCoords || !endCoords) {
      throw new Error('Start or end coordinates are not defined');
    }
  
    const middelpunttegel = getNearestTileGridPosition(startCornerId, boardArray);
    const middelpuntstraat = findMidpoint(
      new Vector3(startCoords[0], startCoords[1], startCoords[2]),
      new Vector3(endCoords[0], endCoords[1], endCoords[2])
    );
  
    const x1 = middelpunttegel ? middelpunttegel[0] : 0;
    const y1 = middelpunttegel ? middelpunttegel[1] : 0;
    const x2 = middelpuntstraat.x;
    const y2 = middelpuntstraat.y;
  
    
  
  
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const distanceToMove = -45; // Negative value to move away from  middelpunttegel
  
    const moveX = (deltaX / dist) * distanceToMove;
    const moveY = (deltaY / dist) * distanceToMove;
  
    const newX = x2 + moveX;
    const newY = y2 + moveY;
  
    return [newX, newY];
  }
  
  
  
  
  function processBoatData(boats: BoatLocation[]): Record<number, BoatData> {
    const boatPairs: Record<number, BoatData> = {};
  
    boats.forEach(({ boat, x, y }) => {
      const startCornerId = getIdByCoordinates(y, x, 'small');
      if (!boatPairs[boat.id]) {
        // Start position for this boat
        if (startCornerId !== null) {
          boatPairs[boat.id] = { startCornerId: startCornerId.toString(), endCornerId: '', boat: boat, x: 0, y: 0 } ;
        }
      } else {
        // End position for this boat (assuming it has not been set yet)
        if (!boatPairs[boat.id].endCornerId) {
         
            const endCornerId = getIdByCoordinates(y, x, 'small');
            if (endCornerId !== null) {
              boatPairs[boat.id].endCornerId = endCornerId.toString();
            }
        
        }
      }
    });
  
    return boatPairs;
  }
  
function extractBoatData(buildingPlots: BuildingPlots[][] | undefined = []): BoatData[] {
    const boatsData: BoatData[] = [];
    if (buildingPlots) {
      buildingPlots.forEach((row, x) => {
        row.forEach((plot, y) => {
          if (plot && plot.boat ) {
            boatsData.push({
              x: x,
              y: y,
              boat: plot.boat as unknown as Boat,
              startCornerId: "",
              endCornerId: ""
            });
          }
        });
      });
    }
  
    return boatsData;
  }
  
  
  function findMidpoint(corner1: Vector3, corner2: Vector3): Vector3 {
    return new Vector3(
      (corner1.x + corner2.x) / 2,
      (corner1.y + corner2.y) / 2,
      (corner1.z + corner2.z) / 2
    );
  }
  
export function RenderBoat({  cornerIDsWithCoords, startCornerId, endCornerId, boardArray, boat }: RenderBoatProps) {
    const startCoords = cornerIDsWithCoords[parseInt(startCornerId)];
    const endCoords = cornerIDsWithCoords[parseInt(endCornerId)];
  
    if (!startCoords || !endCoords) {
      return null;
    }
  
    const bootPos = calculateBoatPosition(cornerIDsWithCoords, parseInt(startCornerId), parseInt(endCornerId), boardArray);
    const boatX = bootPos[0];
    const boatY = bootPos[1];
    const boatZ = 0;
  
    const boatVector = new Vector3(boatX, boatY, boatZ);
  
    //Boat Color
    const resourceType = boat.resource || 'wildcard';
    const boatColor = resourceColors[resourceType.toLowerCase() as keyof ResourceColors] || "#864AF9";
  
    const { nodes } = useGLTF("/assets/boat.glb") as unknown as { nodes: any };
    const scale: [number, number, number] = [0.06, 0.06, 0.06];
    const boatRotation: [number, number, number] = [0, 0, 90];
    const material = new MeshStandardMaterial({ color: boatColor });
   
  
    return (
      <>
      <group position={boatVector.toArray()} scale={scale} rotation={boatRotation} castShadow receiveShadow>
        {Object.keys(nodes).map((key) => {
          if (nodes[key].isMesh) {
            return (
              <mesh key={key} geometry={nodes[key].geometry} material={material} />
            );
          }
          return null;
        })}
      </group>
      
      <mesh position={startCoords as unknown as Vector3}>
          <sphereGeometry args={[4, 16, 0]} />
          <meshStandardMaterial color={boatColor} />
        </mesh>
  
        {/* Sphere at endCoords */}
        <mesh position={endCoords as unknown as Vector3}>
          <sphereGeometry args={[4, 16, 0]} />
          <meshStandardMaterial color={boatColor} />
        </mesh>
     
      </>
    );
  }

  export { extractBoatData, processBoatData, getIdByCoordinates, getNearestTileGridPosition, calculateBoatPosition, findMidpoint}