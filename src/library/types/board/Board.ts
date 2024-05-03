import {BuildingPlots, Road, Tile} from "@library/types";

export interface Board{
    tileList: Tile[],
    buildingPlots: BuildingPlots[],
    roads: Road[],
}