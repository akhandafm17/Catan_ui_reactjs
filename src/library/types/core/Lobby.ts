import {Account, LobbyReadyStatus} from "@library/types";

export interface Lobby {
    lobbyId: number
    lobbyName: string;
    ownerId: number;
    lobbyNotClosed: boolean;
    accountDtos: Account[];
    statusList: LobbyReadyStatus[];
    gameId: number;
    aiCount: number;
}