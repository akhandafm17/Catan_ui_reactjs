import  { useContext, useEffect, useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { useParams } from "react-router-dom";
import {Board, HexagonGridProps, House, ResourceColors, Tile} from "@library/types";
import { AccountContext } from "@library/context";
import { useMoveRobber } from "@library/hooks";
import HexagonTile, { generateHexagonCornerPositions } from "./HexagonTile.tsx";
import Model from "./Model.tsx";
import renderRobber from "./RenderRobber.tsx";

const resourceColors: ResourceColors = {
    ore: "#707070",
    wool: "#8FAC8F",
    grain: "#F4D03F",
    brick: "#CB4335",
    lumber: "#196F3D",
    desert: "#DF915E",
    wildcard: "#864AF9"
  };

function processTileList(tileList: Tile[] | any[][]): { [key: number]: string } {
    const tileNumberToResourceMap: { [key: number]: string } = {};
  
    if (Array.isArray(tileList)) {
      if (tileList.length === 0 || Array.isArray(tileList[0])) {
        // Handle any[][]
        processNestedArray(tileList as any[][], tileNumberToResourceMap);
      } else {
        // Handle Tile[]
        processTileArray(tileList as Tile[], tileNumberToResourceMap);
      }
    }
  
    return tileNumberToResourceMap;
  }
  
  function processTileArray(tiles: Tile[], map: { [key: number]: string }) {
    tiles.forEach(tile => processTile(tile, map));
  }
  
  function processNestedArray(tileLists: any[][], map: { [key: number]: string }) {
    tileLists.forEach(row => {
      row.forEach(tile => processTile(tile, map));
    });
  }
  
  function processTile(tile: any, map: { [key: number]: string }) {
    if (tile && tile.tileDiceNumber !== undefined) {
      map[tile.tileDiceNumber] = tile.resourceType ? tile.resourceType.toUpperCase() : "DESERT";
    }
  }
  
  function calculateCoordinates(boardArray: (number | null)[][] & number[][]) {
    let coordinates = [];
    for (let x = 0; x < boardArray.length; x++) {
      for (let y = 0; y < boardArray[x].length; y++) {
        if (boardArray[x][y] !== -1) {
          // Reverse the x-coordinate by subtracting from the maximum x index
          let reversedX = boardArray.length - 1 - x;
          coordinates.push({ tileNumber: boardArray[x][y], x: reversedX, y });
        }
      }
    }
    return coordinates;
  }
  
  function mergeCoordinatesAndTileData(coordinates: [number, number, number][], tileData: {
    tileNumber: number;
    x: number;
    y: number;
  }[]) {
    return coordinates.map((hexagonPosition, index) => {
        const tileInfo = tileData[index];
        if (!tileInfo) {
            console.error(`No tile data found for index ${index}`);
            return null;
        }
        return {
            tileNumber: tileInfo.tileNumber,
            x: tileInfo.x,
            y: tileInfo.y,
            xyz: hexagonPosition
        };
    }).filter(item => item !== null); // Filter out any null entries
  }

  function generateHexagonGridPositions(
    centerX: number,
    centerY: number,
    centerZ: number,
    width: number,
    height: number,
    boardArray: number[][]
  ): [number, number, number][] {
    const sideLength = width / Math.sqrt(3);
    const horizontalDistance = width * 3 / 4;
    const capHeight = sideLength * (1 - Math.cos(Math.PI / 6));
    const verticalDistance = height - (capHeight * 6); //  shrinks the gameboard vertically, else there is too much space between rows
    let positions: [number, number, number][] = [];
  
    const numberOfRows = boardArray.length;
  
    // Find the center row index
    const centerRowIndex = Math.floor(numberOfRows / 2);
  
    boardArray.forEach((rowArray, rowIdx) => {
      const rowOffset = rowIdx - centerRowIndex;
      const rowY = centerY + rowOffset * verticalDistance;
  
      // Calculate the starting X position for the row
      const validHexesInRow = rowArray.filter(n => n !== -1).length;
      const rowXStart = centerX - (validHexesInRow - 1) / 2 * horizontalDistance;
  
      // Iterate over each hexagon in the row
      rowArray.forEach((hex, hexIdx) => {
        if (hex !== -1) {
          const hexX = rowXStart + hexIdx * horizontalDistance;
          positions.push([hexX, rowY, centerZ]);
        }
      });
    });
  
    return positions;
  }

  const assignTileNumbersToGrid = (boardArray: number[][], gridPositions: [number, number, number][]) => {
    // Reverse each row in the boardArray to get the correct order
    const reversedRows = boardArray.map(row => [...row].reverse());
  
    //  filter out the -1 numbers
    const tileNumbers = reversedRows.flat().filter(num => num !== -1);
  
    // Map the tile numbers to the grid positions
    const tilesWithPositions = tileNumbers.map((tileNumber, index) => {
      const position = gridPositions[index]; 
      return {
        tileNumber,
        position
      };
    });
  
    return tilesWithPositions.reverse();
  };
  
function HexagonGrid({
    boardArray,
    addHouse,
    houses,
    handleCornerClick,
    moveRobber,
    onRobberMoved,
    board
  }: HexagonGridProps & {
    boardArray: number[][],
    resourceArray: string[],
    addHouse: (position: [number, number, number]) => void;
    houses: House[];
    handleCornerClick: (x: number, y: number, cornerId: number) => void;
    moveRobber: boolean;
    onRobberMoved: () => void;
    board: Board;
  }) {
  
  const { gameId } = useParams<{ gameId: string }>();
  const {selectedPlayer} = useContext(AccountContext);
  const { mutateMoveRobber } = useMoveRobber();
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
  const tileNumberToResourceMap = board?.tileList ? processTileList(board.tileList as unknown as Tile[][]) : {};
  type Coordinates = { x: number | null; y: number | null };
  const [robberTileBackendCoordinates] = useState<Coordinates>({ x: null, y: null });
  const [isRobberBeingMoved, setIsRobberBeingMoved] = useState(false);
  
  
  //ensures that gridpositions is only calculated once and not on every rerender
  const gridPositions = useMemo(() => {
    return generateHexagonGridPositions(0, 0, 0, hexagonWidth, hexagonHeight, boardArray);
  }, [hexagonWidth, hexagonHeight, boardArray]);
  
  const tilesWithPositions = assignTileNumbersToGrid(boardArray, gridPositions);
  const [robberPosition, setRobberPosition] = useState<[number, number, number] | null>(null);
  
  
  useEffect(() => {
    // Find the initial position for the robber based on 'beingRobbed' property
    const initialRobberTile = board?.tileList?.flat().find(tile => tile?.beingRobbed);
    if (initialRobberTile) {
      const initialRobberTileIndex = tilesWithPositions.findIndex(({ tileNumber }) => 
        tileNumber === initialRobberTile.tileDiceNumber
      );
  
      if (initialRobberTileIndex !== -1) {
        const initialRobberTilePosition = gridPositions[initialRobberTileIndex];
        setRobberPosition([
          initialRobberTilePosition[0], 
          initialRobberTilePosition[1], 
          initialRobberTilePosition[2] + 5 
        ]);
      }
    }
  }, [board?.tileList, tilesWithPositions, gridPositions]);
  
  useEffect(() => {
   
    if (!isRobberBeingMoved && board?.tileList) {
  
      const flattenedTileList = board.tileList.flat();
      // Find the tile where beingRobbed is true
      const robbedTile = flattenedTileList.find(tile => tile?.beingRobbed);
  
      if (robbedTile) {
        // Find the corresponding tile in the hexagon grid
        const hexagonTileIndex = tilesWithPositions.findIndex(({ tileNumber }) => 
          tileNumber === robbedTile.tileDiceNumber
        );
  
        if (hexagonTileIndex !== -1) {
          // Get the position of the tile in the hexagon grid
          const newRobberPosition = gridPositions[hexagonTileIndex];
          setRobberPosition([newRobberPosition[0], newRobberPosition[1], newRobberPosition[2] + 5]); 
  
        }
      }
    }
  }, [board?.tileList, isRobberBeingMoved]);
  
  
  useEffect(() => {
    if (robberTileBackendCoordinates.x !== null && robberTileBackendCoordinates.y !== null) {
      mutateMoveRobber({
        gameId: parseInt(gameId as string),
        x: robberTileBackendCoordinates.x,
        y: robberTileBackendCoordinates.y,
      }, {
        onSuccess: () => {
          setIsRobberBeingMoved(false); // Reset after successful backend update
        },
        onError: () => {
          setIsRobberBeingMoved(false); // Reset even if there's an error
        }
      });
    }
  }, [robberTileBackendCoordinates, gameId, selectedPlayer?.id, mutateMoveRobber]);
  
  const handleRobberMove = (newPosition: [number, number, number]) => {
    setIsRobberBeingMoved(true); // Indicate that the robber is being moved
    setRobberPosition(newPosition); // Update the visual position of the robber
    onRobberMoved(); // Invoke any additional logic needed when the robber moves
  
    const coord = calculateCoordinates(boardArray);
    const mergedData = mergeCoordinatesAndTileData(gridPositions, coord);
  
    // Find the clicked tile based on the 3D position (xyz)
    const clickedTile = mergedData.find(tile => 
      tile && tile.xyz[0] === newPosition[0] && 
      tile.xyz[1] === newPosition[1] && 
      tile.xyz[2] === newPosition[2]
    );
  
    // Update the backend coordinates if a valid tile is clicked
    if (clickedTile && clickedTile.x !== null && clickedTile.y !== null) {
     
  
      // Call mutateMoveRobber with the new coordinates
      mutateMoveRobber({
        gameId: parseInt(gameId as string),
        x: clickedTile.x,
        y: clickedTile.y,
      }, {
        onSuccess: () => {},
        onError: (error) => console.error("ROBBER: Error moving robber: ", error)
      });
    } else {
      console.error("No valid tile found for the clicked position");
    }
  };
  
  
  
  const hexagonsWithModels = tilesWithPositions.map(({ tileNumber}, index) =>  {
   
    const hexagonCorners: number[][][] = generateHexagonCornerPositions(gridPositions, middleHexCorners);
    const hexagonPosition = gridPositions[index];
    const cornerPosition = hexagonCorners[index];
  
    
  let resourceType = tileNumberToResourceMap[tileNumber as keyof typeof tileNumberToResourceMap] || "DESERT"; 
    
    
  if (resourceType === "wildcard" || !resourceType) {
    return null;
  }
  
  
    const modelPath = `/assets/${(resourceType as string).toLowerCase()}.glb`;
    const modelScale: [number, number, number] = [0.7, 0.7, 0.7];
    const modelRotation: [number, number, number] = [0, 0, 78];
    let modelColor = resourceColors[resourceType as keyof ResourceColors] || "#FFFFFF" ;
    if((resourceType as string).toString() === "DESERT"){
      modelColor = resourceColors.desert
    }else if((resourceType as string).toString() === "ORE"){
      modelColor =  resourceColors.ore
    }else if((resourceType as string).toString() === "WOOL"){
      modelColor =  resourceColors.wool
    }else if((resourceType as string).toString() === "GRAIN"){
      modelColor =  resourceColors.grain
    }else if((resourceType as string).toString() === "BRICK"){
      modelColor =  resourceColors.brick
    }else if((resourceType as string).toString() === "LUMBER"){
      modelColor =  resourceColors.lumber
    }
   
    const textColor = isDark(modelColor) ? "white" : "black";
  
    const displayTileNumber = tileNumber >= 0;
  
    const textOffset = 25; 
    const textPosition: [number, number, number] = [hexagonPosition[0], hexagonPosition[1], hexagonPosition[2] + textOffset];
    
  
    return (
      <group key={index}>
        <HexagonTile
          boardArray={boardArray}
          position={[hexagonPosition[0], hexagonPosition[1], hexagonPosition[2]]}
          cornerPositions={cornerPosition.map(([x, y, z]) => [x, y, z])}
          addHouse={addHouse}
          handleCornerClick={handleCornerClick}
          houses={houses}
          moveRobber={moveRobber}
          onRobberMove={handleRobberMove}
            />
        <Model
          modelPath={modelPath}
          position={hexagonPosition}
          scale={modelScale}
          rotation={modelRotation}
          color={modelColor}
        />
        {displayTileNumber &&  tileNumber !== 0 && (
          <Text
            position={textPosition}
            fontSize={30} 
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
              {tileNumber.toString()}
          </Text>
        )}
      </group>
    );
  });
  
  // Helper function to determine if a color is dark
  function isDark(colorHex: string): boolean {
    // Convert hex to RGB and calculate luminance
    const rgb = parseInt(colorHex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 140; 
  }
  
  
    return <>
        {hexagonsWithModels.filter(Boolean)}
        {renderRobber(tilesWithPositions, robberPosition)}
        </>;
  }

  export default HexagonGrid;
  export {processTileList, calculateCoordinates, mergeCoordinatesAndTileData, generateHexagonGridPositions, HexagonGrid, resourceColors};