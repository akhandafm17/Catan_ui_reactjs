import {
    PerspectiveCamera,
  } from "three";
import { Boat } from "../board/Boat";
import {Board} from "@library/types";
  
  export type House = {
    position: [number, number, number];
    cornerIndex: number;
    color: string;
  };

  export type Location = [number, number, number]; 
  
  export type RenderHousesProps = {
    houses: House[];
  };
  
  export type ModelProps = {
    modelPath: string;
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    color: string;
  };
  export type HexagonGridProps = {
    boardArray: (number | null)[][];
    addHouse: (position: [number, number, number], cornerIndex: number) => void;
    houses: House[];
    handleCornerClick: (x: number, y: number, cornerId: number, onSuccess: () => void) => void;
    moveRobber: boolean;
    onRobberMoved: () => void;
    board: Board;
  };
  
  export type HexagonTileProps = {
    position: [number, number, number];
    cornerPositions: [number, number, number][];
    addHouse: (position: [number, number, number], cornerIndex: number) => void;
    houses: House[];
    handleCornerClick: (x: number, y: number, cornerId: number, onSuccess: () => void) => void;
    moveRobber: boolean;
    onRobberMove: (position: [number, number, number]) => void;
  };
  
  export type UpdaterFunction = (camera: PerspectiveCamera, view: CameraView) => void;
  export type CameraView = "orbit" | "birdseye" | "firstperson";
  
  export interface CameraUpdaterProps {
    view: CameraView;
    updater: UpdaterFunction;
  }

  export type BoardSize = 'small' | 'medium' | 'large';

  export interface ResourceColors {
    ore: string;
    wool: string;
    grain: string;
    brick: string;
    lumber: string;
    desert: string;
    wildcard: string;
  }

  export type lobbyID = {
    lobbyId: string | undefined;
  };

  export type CornerWithIndex = [number, number, number, number]; 

  export type RoadState = {
    start: number | null;
    end: number | null;
    color: string;
  };

  export interface BoatData {
    x: number;
    y: number;
    boat: Boat; 
  }

  export interface BoatLocation {
    boat: Boat;
    x: number;
    y: number;
  }
  
  export interface BoatData {
    startCornerId: string;
    endCornerId: string;
    boat: Boat;
  }
  export type RenderRoadProps = {
    cornerIDsWithCoords: CornerIDsWithCoordsType;
    startCornerId: string;
    endCornerId: string;
    onInvalidLength: () => void;
    onLengthChecked: () => void;
    lengthChecked: boolean;
    color: string;
  };
  export type RenderBoatProps = {
    cornerIDsWithCoords: CornerIDsWithCoordsType;
    startCornerId: string;
    endCornerId: string;
    boardArray: number[][];
    boat: Boat;
  };

  export type CornerIDsWithCoordsType = { [key: number]: CornerWithIndex };

  export interface TileShort {
    tileDiceNumber: number;
    resourceType: string | null;
  }

  export type BuildingData = {
    x: number;
    y: number;
    building: any;
    color: string;
  };