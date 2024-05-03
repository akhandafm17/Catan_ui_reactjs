import  { useContext, useEffect,  useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { PerspectiveCamera} from "three";
import { useParams } from "react-router-dom";
import styles from './gameboard.module.scss'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress, Alert
} from "@mui/material"
import { AxiosError } from "axios";
import {BuildingPlots, CameraView, House, BoatData, BuildingData, CornerIDsWithCoordsType, TileShort, RoadState, CameraUpdaterProps} from "@library/types";
import { AccountContext } from "@library/context";
import {Gameinformation, TradeAlert, GameSupplies, GameTradePopup, GameDevelopmentPopup, GameMonopolyCardPopup,generateCornerIDs, generateHexagonCornerPositions, getCoordinatesById,generateHexagonGridPositions, HexagonGrid, RenderRoad, RenderBoat, extractBoatData, getIdByCoordinates, processBoatData, RenderHouses} from "@library/components";
import {useGame, useAddSettlements, useAddRoad} from "@library/hooks";

declare module "@react-three/fiber" {
  export interface GLTF {
    nodes: any;
    materials: any;
  }
}

useGLTF.preload("/assets/brick.glb");
useGLTF.preload("/assets/desert.glb");
useGLTF.preload("/assets/ore.glb");
useGLTF.preload("/assets/ship.glb");
useGLTF.preload("/assets/robber.glb");
useGLTF.preload("/assets/grain.glb");
useGLTF.preload("/assets/lumber.glb");
useGLTF.preload("/assets/wool.glb");
useGLTF.preload("/assets/house.glb");

function createBoardFromBackendData(tileData: TileShort[][]): number[][] {
  return tileData.map(row =>
    row.map(tile => tile ? tile.tileDiceNumber : -1)
  );
}

function getResourceBoardFromBackendData(tileData: TileShort[][]): string[] {
  return tileData.flatMap(row =>
    row.map(tile => tile && tile.resourceType ? tile.resourceType.toLowerCase() : "none")
  );
}


function extractBuildingData(buildingPlots: any[][] | undefined = []): BuildingData[] {
  const buildings: BuildingData[] = [];

  if (buildingPlots) {
    buildingPlots.forEach((row, x) => {
      row.forEach((plot, y) => {
        if (plot && plot.building) {
          buildings.push({
            x: x,
            y: y,
            building: plot.building,
            color: plot.building.color
          });
        }
      });
    });
  }

  return buildings;
}


function totalDiceRolls(dice: number[]): number {
  if (!dice) {
    return 0;
  }
  return dice.reduce((a, b) => a + b, 0);
}


function GameBoard() {
  const { gameId } = useParams<{ gameId: string }>();
  const {game, isErrorGame, isLoadingGame} = useGame(parseInt(gameId as string));
  const [houses, setHouses] = useState<House[]>([]);
  const [cornerIDsWithCoords, setCornerIDsWithCoords] = useState<CornerIDsWithCoordsType>({});
  const [boats, setBoats] = useState<Record<number, BoatData>>({});
  const {selectedPlayer} = useContext(AccountContext);
  const { mutateAddingSettlement } = useAddSettlements();
  const { mutateAddingRoad } = useAddRoad();
  const [isTradePopupVisible, setIsTradePopupVisible] = useState(false);
  const [isDevelopmentPopupVisible, setIsDevelopmentPopupVisible] = useState(false);
  const [isMonopolyPopupVisible, setIsMonopolyPopupVisible] = useState(false);


  const toggleTradePopup = () => {
    setIsTradePopupVisible(!isTradePopupVisible);
  };

  const closeTradePopup = () => {
    setIsTradePopupVisible(false);
  };

  const toggleDevelopmentPopup = () => {
    setIsDevelopmentPopupVisible(!isDevelopmentPopupVisible);
  };

  const closeDevelopmentPopup = () => {
    setIsDevelopmentPopupVisible(false);
  };

  const toggleMonopolyPopup = () => {
    setIsMonopolyPopupVisible(!isMonopolyPopupVisible);
  };

  const closeMonopolyPopup = () => {
    setIsMonopolyPopupVisible(false);
  };

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [showRobberDialog, setShowRobberDialog] = useState(false);
  const [moveRobber, setMoveRobber] = useState(false);
  const [addType, setaddType] = useState('');
  const [newBoard, setNewBoard] = useState<number[][]>([]);
  const [newResourceBoard, setNewResourceBoard] = useState<string[]>([]);
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


const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedCorner, setSelectedCorner] = useState({ x: 0, y: 0, cornerId: 0 });

const [placingRoad, setPlacingRoad] = useState(false);



const handleCornerClick = (x: number, y: number, cornerId: number) => {
  if (placingRoad) { 
    handleEndCornerClick(cornerId);
  } else {
  setSelectedCorner({ x, y, cornerId });
  setIsDialogOpen(true);
  }
};

const [showDirtyPlayDialog, setShowDirtyPlayDialog] = useState(false);
const [lengthChecked, setLengthChecked] = useState(false);

const handleInvalidRoadLength = () => {
  setShowDirtyPlayDialog(true);  
  setRoad({ start: null, end: null, color: "#FFC0CB"  }); //reset th end of the road
  setLengthChecked(true);
  setPlacingRoad(false); // Allow the user to start placing a road again
};

const closeDirtyPlayDialog = () => {
  setShowDirtyPlayDialog(false);
  setIsDialogOpen(true); // Open the dialog to choose an action
};


const handleLengthChecked = () => {
  setLengthChecked(true);
};



   

      useEffect(() => {
        if (game && game.board && game.board.tileList) {
          const resourceBoardWithoutNone = getResourceBoardFromBackendData(game.board.tileList as unknown as TileShort[][]).filter(type => type !== "none");
          const updatedBoard = createBoardFromBackendData(game.board.tileList as unknown as TileShort[][]);
          setNewBoard(updatedBoard);
          setNewResourceBoard(resourceBoardWithoutNone);
        }
      }, [game]);
    
      useEffect(() => {
        if (newBoard.length > 0) {
          const gridPositions = generateHexagonGridPositions(0, 0, 0, hexagonWidth, hexagonHeight, newBoard);
          const hexagonCorners = generateHexagonCornerPositions(gridPositions, middleHexCorners);
          setCornerIDsWithCoords(generateCornerIDs(hexagonCorners));
        }
      }, [newBoard]);

    
    
      
      useEffect(() => {
        if (game?.board?.buildingPlots && Object.keys(cornerIDsWithCoords).length > 0) {
          const buildingData = extractBuildingData(game?.board?.buildingPlots as unknown as TileShort[][] ?? [] as unknown as TileShort[][]);
          updateHouses(buildingData);
          const rawBoatData = extractBoatData(game?.board?.buildingPlots as unknown as BuildingPlots[][]);
          const processedBoats = processBoatData(rawBoatData);
          setBoats(processedBoats);
        }
      }, [game?.board?.buildingPlots, cornerIDsWithCoords]);

      const updateHouses = (buildingData: BuildingData[]) => {
        const housesToUpdate = buildingData
          .filter(building => building?.building?.buildingType === "Settlement")
          .map(building => {
            const cornerId = calculateCornerId(building.x, building.y);
            const cornerCoordinates = cornerId !== null ? cornerIDsWithCoords[cornerId] : null;
            return cornerCoordinates ? {
              position: [cornerCoordinates[0], cornerCoordinates[1], 0] as [number, number, number],
              cornerIndex: cornerId,
              color: building.color
            } : null;
          })
          .filter(Boolean); // Filter out null values
      
        setHouses(housesToUpdate.filter(house => house !== null) as House[]);
      };

      function calculateCornerId(x: number, y: number ): number | null {
        const cornerID = getIdByCoordinates(y as number, x as number, 'small');
        return cornerID;
    }
    

  const handleDialogClose = () => {
    setErrorDialogOpen(false);
  };


const [road, setRoad] = useState<RoadState>({ start: null, end: null, color: "#FFC0CB" });
const [roads, setRoads] = useState<{ start: number | null; end: number; color: string }[]>([]);


 

  const placeRoadStart = () => {
    const startCornerId = selectedCorner.cornerId;
    setRoad({ ...road, start: startCornerId });
    setIsDialogOpen(false); 
    setPlacingRoad(true);   
  };

  const handleEndCornerClick = (cornerId: number) => {
    if (road.start !== null && road.start !== cornerId) {
      const length = calculateRoadLength(road.start, cornerId);
      if (length < 33 || length > 36) {
        // Invalid road length
        setShowDirtyPlayDialog(true);  
        setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" }); 
        setPlacingRoad(false); 
      } else {
        const backendCoordinatesRoadStart = road.start !== null ? getCoordinatesById(road.start, 'small') : null;
        const backendCoordinatesRoadEnd = getCoordinatesById(cornerId, 'small');
        // Post addRoad API call
        if (backendCoordinatesRoadStart && backendCoordinatesRoadEnd) {
        
        mutateAddingRoad({
          gameId: parseInt(gameId as string),
          buildingPlotCoordinates1: [backendCoordinatesRoadStart?.y, backendCoordinatesRoadStart?.x],
          buildingPlotCoordinates2: [backendCoordinatesRoadEnd?.y, backendCoordinatesRoadEnd?.x],
        }, {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
          onError: (error) => {
            if ((error as AxiosError)?.response?.status !== 200) {
              setErrorDialogOpen(true);
              setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" }); 
              setPlacingRoad(false);
              
            }
            setIsDialogOpen(false);
          }
        });
  
        // Update roads state and reset road
        setRoads(currentRoads => [...currentRoads, { start: road.start, end: cornerId, color: road.color ?? "#FFC0CB" }]);
        setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" }); // Reset road state
        setPlacingRoad(false); // Reset placingRoad state
      }
      }
    }
  };
  
  

  useEffect(() => {
    if (road.start !== null && road.end !== null) {
      setRoads(currentRoads => [...currentRoads, { start: road.start, end: road.end ?? 0, color: road.color ?? "#FFC0CB" }]);
      setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" });
      setPlacingRoad(false);
    }
  }, [road, setRoads]);


  const calculateRoadLength = (startCornerId: number, endCornerId: number) => {
    const startCoords = cornerIDsWithCoords[startCornerId];
    const endCoords = cornerIDsWithCoords[endCornerId];
    if (!startCoords || !endCoords) return 0;
  
    return Math.sqrt(
      Math.pow(endCoords[0] - startCoords[0], 2) +
      Math.pow(endCoords[1] - startCoords[1], 2) +
      Math.pow(endCoords[2] - startCoords[2], 2)
    );
  };
  
  // Effect to check road length immediately after placement
  useEffect(() => {
    if (road.start !== null && road.end !== null) {
      const length = calculateRoadLength(road.start, road.end);
      if (length < 33 || length > 36) {
        setShowDirtyPlayDialog(true);  
        setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" });
        setPlacingRoad(false);
      } else {
        setRoads(currentRoads => [...currentRoads, { start: road.start, end: road.end ?? 0, color: road.color ?? "#FFC0CB" }]);
        setRoad({ start: null, end: null, color: road.color ?? "#FFC0CB" });
        setPlacingRoad(false);
      }
    }
  }, [road, setRoads, cornerIDsWithCoords]);

  useEffect(() => {
    const newRoads = game?.board?.roads
      .filter(road => road.ownerId !== -1)
      .map(road => {
        const startCoordinates = road.connectedBuildingPlots[0];
        const endCoordinates = road.connectedBuildingPlots[1];
        const startCornerId = getIdByCoordinates((startCoordinates as any).y, (startCoordinates as any).x, 'small');
        const endCornerId = getIdByCoordinates((endCoordinates as any).y, (endCoordinates as any).x, 'small');
        return { start: startCornerId, end: endCornerId, color: road.color  ?? "#FFC0CB" };
      });
  
    if (newRoads && newRoads.length > 0) {
      setRoads(newRoads.map(road => ({ start: road.start, end: road.end ?? 0, color: road.color ?? "#FFC0CB" })));
    }
  }, [game?.board?.roads]);

  useEffect(() => {
    const diceTotal = totalDiceRolls(game?.dice as number[]);
    if (selectedPlayer?.nickName === game?.currentPlayer?.name && diceTotal === 7) {
      
      setShowRobberDialog(true);
    }
  }, [selectedPlayer, game?.currentPlayer, game?.dice]); 
  
  const handleRobberMoved = () => {
    setMoveRobber(false);
  };
  
  

const placeRoad = () => {
  setaddType('road');
  placeRoadStart();
};



  const placeHouse = () => {
    setaddType('house');
    const { x, y, cornerId } = selectedCorner;
    
    mutateAddingSettlement({
      gameId: parseInt(gameId as string),
      x: y,
      y: x,
    }, {
      onSuccess: () => {
        const cornerCoordinates = cornerIDsWithCoords[cornerId];
        if (cornerCoordinates) {
          addHouseWrapper([cornerCoordinates[0], cornerCoordinates[1], 0]);
        }
        setIsDialogOpen(false); 
      },
      onError: (error) => {
        if ((error as AxiosError)?.response?.status === 500) {
          setErrorDialogOpen(true);
        }
        setIsDialogOpen(false);
      }
    });
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  
  const addHouse = (
    position: [number, number, number],
    cornerIndex: number,
    color: string = "#FFC0CB"
  ) => {
    setHouses((currentHouses) => [...currentHouses, { position, cornerIndex, color }]);
  };
  const [cameraView] = useState<CameraView>("orbit");
  const updateCamera = (camera: PerspectiveCamera, view: CameraView) => {
    const positions: Record<CameraView, [number, number, number]> = {
      orbit: [0, -100, 250], // FreeStyle view
      birdseye: [0, 0, 300], // Top-down view
      firstperson: [0, -350, 100], // First person view 
    };

    camera.position.set(...positions[view]);
    camera.lookAt(0, -400, 200); 
  };
  const addHouseWrapper = (position: [number, number, number]) => {
    addHouse(position, -1); 
  };
  const CameraUpdater = ({ view, updater }: CameraUpdaterProps) => {
    const { camera } = useThree();

    useEffect(() => {
      updater(camera as PerspectiveCamera, view);
    }, [camera, view, updater]);

    return null;
  };

  
if (isLoadingGame) {
  return <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>;
}

if (isErrorGame || !game) {
  return <Alert severity="error">Game could not be loaded.</Alert>;
}


  return (
    <>
      <div className={styles.gameBoardContainer}>
        <div className={styles.gameBoardCanvas}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <HexagonGrid
         boardArray={newBoard}
         resourceArray={newResourceBoard} 
         addHouse={addHouseWrapper}
         handleCornerClick={handleCornerClick}
         houses={houses}
         moveRobber={moveRobber}
         onRobberMoved={handleRobberMoved}
         board={game.board}
        />
        <RenderHouses houses={houses} />
        <CameraUpdater view={cameraView} updater={updateCamera} />
        {cameraView === "orbit" && <OrbitControls />}
          {roads.map((road, index) => {

            return (
            <RenderRoad
              key={index}
              cornerIDsWithCoords={cornerIDsWithCoords}
              startCornerId={road.start !== null ? road.start.toString() : ""}
              endCornerId={road.end !== null ? road.end.toString() : ""}
              onInvalidLength={handleInvalidRoadLength}
              onLengthChecked={handleLengthChecked}
              lengthChecked={lengthChecked}
              color={road.color}
            />)
            ;
            })}
           {Object.entries(boats).map(([boatId, boatData]) => {
           return (
            <>
             <RenderBoat
               key={boatId}
               cornerIDsWithCoords={cornerIDsWithCoords}
               startCornerId={boatData.startCornerId}
               endCornerId={boatData.endCornerId}
               boardArray={newBoard}
               boat={boatData.boat}
             />
           </>
           );
        })}
      </Canvas>
      </div>

      <div className={styles.section} style={{
      borderRadius: "2rem",
      height: "100%",
      gridColumnStart: 1,
      gridColumnEnd: 2,
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(128, 128, 128, 0.2)',
      zIndex: 1,
    }}>
      <Gameinformation currentPlayer={game.currentPlayer} players={game.players} gameId={gameId} toggleTradePopup={toggleTradePopup} secondsLeft={game.secondsLeft} secondsInTurn={game.secondsInTurn} gamePhase={game.gamePhase}/>
    </div>

    <div className={styles.section} style={{
      borderRadius: "2rem",
      height: "100%",
      gridColumnStart: 3,
      gridColumnEnd: 4,
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(128, 128, 128, 0.2)',
      zIndex: 1,
    }}>
      <TradeAlert/>
      <GameSupplies gameId={gameId} toggleDevelopmentPopup={toggleDevelopmentPopup} toggleMonopolyPopup={toggleMonopolyPopup} currentPlayer={game.currentPlayer} players={game.players} dice={game.dice} gamePhase={game.gamePhase}/>
    </div>
    {isTradePopupVisible && <GameTradePopup closePopup={closeTradePopup} players={game.players} game={game}/>}
      {isDevelopmentPopupVisible && <GameDevelopmentPopup gameId={gameId}  closePopup={closeDevelopmentPopup} />}
      {isMonopolyPopupVisible && <GameMonopolyCardPopup gameId={gameId}  closePopup={closeMonopolyPopup} />}
    </div>
   {/* Dialog for choosing what to place on the corner */}
   <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{"What do you want to place on this corner?"}</DialogTitle>
        <DialogActions>
          <Button onClick={placeHouse}>House</Button>
          <Button onClick={placeRoad}>Road</Button>
        </DialogActions>
      </Dialog>
   <Dialog
   open={errorDialogOpen}
   onClose={handleDialogClose}
   aria-labelledby="error-dialog-title"
   aria-describedby="error-dialog-description"
 >
   <DialogTitle id="error-dialog-title">{"Error"}</DialogTitle>
   <DialogContent>
     <DialogContentText id="error-dialog-description">
     {addType === 'house' ? "You can't add a house." : "You can't add a road."}
     </DialogContentText>
   </DialogContent>
   <DialogActions>
     <Button onClick={handleDialogClose} color="primary">
       Close
     </Button>
   </DialogActions>
 </Dialog>
  {/* Road valspelen Dialog */}
  <Dialog open={showDirtyPlayDialog} onClose={closeDirtyPlayDialog}>
        <DialogTitle>{"Don't play dirty!!!"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDirtyPlayDialog(false)}>Close</Button>
        </DialogActions>
  </Dialog>
 {/* Robber Dialog */}
  <Dialog
  open={showRobberDialog}
  onClose={() => setShowRobberDialog(false)}
  aria-labelledby="robber-dialog-title"
  aria-describedby="robber-dialog-description"
>
  <DialogTitle id="robber-dialog-title">{"Move Robber"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="robber-dialog-description">
      Klik op een tegel om de robber naar dat tegel te verplaatsen.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => { setShowRobberDialog(false); setMoveRobber(true); }} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
 </>
  );
}
useGLTF.preload("/assets/base.glb");


export default GameBoard;




