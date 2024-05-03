import {Board, Player} from "@library/types";

export interface Game {
    gameId: number,
    board: Board,
    currentPlayer: Player,
    players: Player[],
    dice: number[],
    secondsLeft: number,
    secondsInTurn: number
    gamePhase: string
}