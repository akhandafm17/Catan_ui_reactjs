import {Resource} from "@library/types";
export interface Trade{
    id: number;
    gameId: number;
    requestedCards: Record<Resource, number>;
    providedCards: Record<Resource, number>;
}