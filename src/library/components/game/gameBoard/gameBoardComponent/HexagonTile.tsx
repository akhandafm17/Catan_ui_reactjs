import { generateHexagonGridPositions } from "./HexagonGrid.tsx";
import {  useGLTF } from "@react-three/drei";
import { Box3, Vector3} from "three";

import {
    BoardSize,
 CornerWithIndex,
  HexagonTileProps,
  House,
} from "@library/types";


function getCoordinatesById(id: number, boardSize: BoardSize): { x: number, y: number } | null {
    let boardArray: (number | 'X')[][];
    switch (boardSize) {
      case 'small':
        boardArray = [
          ['X', 'X', 0, 1, 2, 3, 4, 5, 6, 'X', 'X'],
          ['X', 7, 8, 9, 10, 11, 12, 13, 14, 15, 'X'],
          [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
          [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
          ['X', 38, 39, 40, 41, 42, 43, 44, 45, 46, 'X'],
          ['X', 'X', 47, 48, 49, 50, 51, 52, 53, 'X', 'X']
        ];
        break;
      case 'medium':
        boardArray = [
          ['X', 'X', 'X', 0, 1, 2, 3, 4, 5, 6, 'X', 'X', 'X'],
          ['X', 'X', 7, 8, 9, 10, 11, 12, 13, 14, 15, 'X', 'X'],
          ['X', 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 'X'],
          [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
          [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
          ['X', 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 'X'],
          ['X', 'X', 64, 65, 66, 67, 68, 69, 70, 71, 72, 'X', 'X'],
          ['X', 'X', 'X', 73, 74, 75, 76, 77, 78, 79, 'X', 'X', 'X']
        ];
        break;
      case 'large':
        boardArray = [
          ['X', 'X', 'X', 0, 1, 2, 3, 4, 5, 6, 7, 8, 'X', 'X', 'X'],
          ['X', 'X', 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 'X', 'X'],
          ['X', 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 'X'],
          [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
          [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
          ['X', 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 'X'],
          ['X', 'X', 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 'X', 'X'],
          ['X', 'X', 'X', 87, 88, 89, 90, 91, 92, 93, 94, 95, 'X', 'X', 'X']
        ];
        break;
      default:
        return null;
    }
  
    for (let y = 0; y < boardArray.length; y++) {
      for (let x = 0; x < boardArray[y].length; x++) {
        if (boardArray[y][x] === id) {
          return { x, y };
        }
      }
    }
    return null;
  }
  
function generateCornerIDs(hexagonCorners: number[][][]) {
    const rowHeight = 50;
    let idCounter = 0;
    const rows = new Map();
  
    // Flatten the array of hexagon corners
    const allCorners = hexagonCorners.flat();
  
    // Grouping all corners into rows
    allCorners.forEach((corner, index) => {
      const yValue = corner[1];
      const rowKey = Math.floor(yValue / rowHeight);
      if (!rows.has(rowKey)) {
        rows.set(rowKey, []);
      }
      rows.get(rowKey).push({ corner, index });
    });
  
    // Sort rows by Y in descending order
    const sortedRows = Array.from(rows.entries()).sort((a, b) => b[0] - a[0]);
  
    // Create a dictionary for corner IDs with XYZ coordinates
    const cornerIDsWithCoords: { [key: number]: CornerWithIndex } = {};
  
    // Assigning IDs in the order of sorted corners
    sortedRows.forEach(([, rowCorners]) => {
      rowCorners.sort((a: any, b: any) => a.corner[0] - b.corner[0]).forEach(({ corner }: { corner: any }) => {
        cornerIDsWithCoords[idCounter] = corner as CornerWithIndex;
        idCounter++;
      });
    });
  
    return cornerIDsWithCoords;
  }

function findCornerIDByCoordinates(cornerIDsWithCoords: { [key: number]: CornerWithIndex }, clickedCorner: CornerWithIndex) {
    for (const [id, coords] of Object.entries(cornerIDsWithCoords)) {
        if (coords[0] === clickedCorner[0] && coords[1] === clickedCorner[1] && coords[2] === clickedCorner[2]) {
            return id;
        }
    }
    return null;
  }
  
  
  function filterCloseCorners(corners: number[][], threshold: number = 10): number[][] {
  
    const isNearby = (a: number[], b: number[]): boolean => {
      return Math.sqrt(
        Math.pow(a[0] - b[0], 2) +
        Math.pow(a[1] - b[1], 2) +
        Math.pow(a[2] - b[2], 2)
      ) < threshold;
    };
  
    let groups: number[][][] = [];
  
    // Grouping corners
    corners.forEach(corner => {
      let addedToGroup = false;
      for (let group of groups) {
        if (group.some(existingCorner => isNearby(corner, existingCorner))) {
          group.push(corner);
          addedToGroup = true;
          break;
        }
      }
      if (!addedToGroup) {
        groups.push([corner]);
      }
    });
  
    // Merging nearby groups
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
          if (groups[i].some(a => groups[j].some(b => isNearby(a, b)))) {
            groups[i] = [...groups[i], ...groups[j]];
            groups.splice(j, 1);
            merged = true;
            break;
          }
        }
        if (merged) break;
      }
    }
  
  
    // Averaging the coordinates of each group for the final corner
    let filteredCorners: number[][] = groups.map(group => {
      return group.reduce((acc, val) => {
        return acc.map((num, idx) => num + val[idx] / group.length);
      }, [0, 0, 0]);
    });
    return filteredCorners;
  }

function generateHexagonCornerPositions(
    hexagonCenters: [number, number, number][],
    middleHexCorners: [number, number, number][]
  ): number[][][] {
  
    const middleHexCenter = middleHexCorners.reduce((acc, val) => {
      return [acc[0] + val[0] / 6, acc[1] + val[1] / 6, acc[2] + val[2] / 6];
    }, [0, 0, 0]);
  
    const horizontalDistance = Math.abs(middleHexCorners[0][0] - middleHexCorners[3][0]);
  
    const calculateCorners = (center: [number, number, number], rowIndex: number): number[][] => {
      const xOffset = rowIndex % 2 !== 0 ? horizontalDistance / 2 : 0;
  
      return middleHexCorners.map(corner => {
        const x = center[0] + corner[0] - middleHexCenter[0] - xOffset;
        const y = center[1] + corner[1] - middleHexCenter[1];
        const z = center[2];
        return [x, y, z];
      });
    };
  
  
    // Collect all corners in a single array
    let allCorners: CornerWithIndex[] = [];
    hexagonCenters.forEach((center, index) => {
      calculateCorners(center, index).forEach(corner => {
  
        const cornerWithIndex: CornerWithIndex = [corner[0], corner[1], corner[2], index];
        allCorners.push(cornerWithIndex);
      });
    });
  
  
    const flattenedCorners = allCorners.map(cornerWithIndex => cornerWithIndex.slice(0, 3));
    const filteredCorners = filterCloseCorners(flattenedCorners);
  
    let structuredCorners: number[][][] = Array(hexagonCenters.length).fill(null).map(() => []);
    filteredCorners.forEach((corner, i) => {
      let hexIndex = allCorners[i][3];
      structuredCorners[hexIndex].push(corner as [number, number, number]);
    });
    return structuredCorners;
  }
  
  
  
  
  function HexagonTile({
    boardArray,
    position,
    cornerPositions,
    addHouse,
    houses,
    handleCornerClick,
    moveRobber,
    onRobberMove
  }: HexagonTileProps & {
    boardArray: number[][],
    cornerPositions: [number, number, number][];
    houses: House[];
    handleCornerClick: (x: number, y: number, cornerId: number) => void;
    moveRobber: boolean;
    onRobberMove: (position: [number, number, number]) => void;
  }) {
    const gltf = useGLTF("/assets/base.glb", true) as unknown as {
      nodes: any;
      materials: any;
    };
  
    const scaleFactor = 0.5;
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
  
    
    const handleTileClick = () => {
      if(moveRobber) {
        onRobberMove(position);
      }
    };
  
  
  
  
    try {
      const { nodes, materials } = gltf;
  
      const box = new Box3().setFromObject(nodes.mesh_0);
    
      const size = new Vector3();
      box.getSize(size);
  
      return (
        <group>
          <mesh
            geometry={nodes.mesh_0.geometry}
            material={materials[""]} 
            position={position}
            scale={[scaleFactor, scaleFactor, scaleFactor]}
            onClick={handleTileClick}
          />
  
          {/* clickable corners */}
          {cornerPositions.map((cornerPos, index) => {
    const houseExists = houses.some((house) => {
      return (
        house.cornerIndex === index &&
        JSON.stringify(house.position) === JSON.stringify(cornerPos)
      );
    });
  
  
  
    return (
      <group key={index}>
        {!houseExists && (
          <mesh
            position={cornerPos}
            onClick={() => {
              const gridPositions = generateHexagonGridPositions(0, 0, 0, hexagonWidth, hexagonHeight, boardArray);
              const hexagonCorners: number[][][] = generateHexagonCornerPositions(gridPositions, middleHexCorners);
              const cornerIDsWithCoords = generateCornerIDs(hexagonCorners);
              const cornerID = findCornerIDByCoordinates(cornerIDsWithCoords, [...cornerPos, index]);
  
              const Coordinate = cornerID ? getCoordinatesById(parseInt(cornerID), 'small') : null;
              
  
           
              handleCornerClick(Coordinate?.x as number, Coordinate?.y as number, parseInt(cornerID as string), () => {
                addHouse(cornerPos, index); 
              });
  
  
            }}
          >
            <sphereGeometry args={[4, 16, 0]} />
            <meshStandardMaterial color={"#FFFFFF"} />
          </mesh>
        )}
      </group>
    );
  })}
  
        </group>
      );
    } catch (error) {
      console.error("Error loading GLTF model: ", error);
      return null; 
    }
  }

  export default HexagonTile;
  export { generateHexagonCornerPositions, filterCloseCorners, findCornerIDByCoordinates, generateCornerIDs, getCoordinatesById };