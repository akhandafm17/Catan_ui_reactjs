import {Resource} from "@library/types";

export interface Tile{
    beingRobbed: boolean,
    tileDiceNumber: number,
    tileResource: Resource,
    tileRollChance: number,
    x: number,
    y: number,
}