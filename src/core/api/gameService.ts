import axios from "axios";
import {Game} from "@library/types";
import {Trade} from "@library/types/core/Trade.ts";

export const getGame = async (gameId: number) => {
    const response = await axios.get<Game>(`/api/game/${gameId}`);
    return response.data;
};

export const finishTurn = async (gameId: number) => {
    try {
        const response = await axios.post(`/api/game/finishTurn/${gameId}`);
        return response.data;
    } catch (error) {
        console.error('Error finishing turn:', error);
        throw error;
    }
}

export const rollDice = async (gameId: number) => {
    try {
        const response = await axios.post(`/api/game/diceRoll/${gameId}`);
        return response.data;
    } catch (error) {
        console.error('Error finishing turn:', error);
        throw error;
    }
}

export const getOpenTradesForPlayer = async () => {
    const response = await axios.get<Trade[]>(`/api/game/getOpenTradesForPlayer`);
    return response.data;
};


export const giveEveryPlayerOneOfEachResource = async (gameId: number) => {
    const response = await axios.get<boolean>(`/api/cards/GiveEveryPlayerOneOfEachResource/${gameId}`);
    return response.data;
};

export const acceptTrade = async (tradeId: number) => {
    try {
        const response = await axios.post(`/api/game/acceptTrade/${tradeId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}