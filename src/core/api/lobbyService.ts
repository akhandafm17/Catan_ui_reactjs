import axios from "axios";
import {Lobby} from "@library/types";
import {PlayerStatusDto} from "@core/api/dto";

export const getAllOpenLobbies = async () => {
    const response = await axios.get<Lobby[]>('/api/lobby/getAllOpenLobbies');
    return response.data;
};

export const getCurrentPlayingLobbies = async () => {
    const response = await axios.get<Lobby[]>(`/api/lobby/getCurrentPlayingLobbies`);
    return response.data;
};

export const getLobby = async (lobbyId: number) => {
    const response = await axios.get<Lobby>(`/api/lobby/${lobbyId}`);
    return response.data;
}

export const addPlayerToLobby = async (lobbyId: number) => {
    try {
        const response = await axios.post(`/api/lobby/addPlayerToLobby/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}

export const changePlayerStatus = async (data: PlayerStatusDto) => {
    try {
        const response = await axios.post('/api/lobby/setPlayerStatus', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Return data if needed
    } catch (error) {
        console.error('Error changing the player status:', error);
        throw error;
    }
}

export const removePlayerFromLobby = async (lobbyId: number) => {
    try {
        const response = await axios.post(`/api/lobby/removePlayerFromLobby/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}

export const addAi = async (lobbyId: number) => {
    try {
        const response = await axios.post(`/api/lobby/addAi/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error added A.I.:', error);
        throw error;
    }
}

export const removeAi = async (lobbyId: number) => {
    try {
        const response = await axios.post(`/api/lobby/removeAi/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error added A.I.:', error);
        throw error;
    }
}

export const createLobby = async (lobbyName: string) => {
    try {
        const response = await axios.post(`/api/lobby/createLobby/${lobbyName}`);
        return response.data; // Return data if needed
    } catch (error) {
        console.error('Error creating lobby:', error);
        throw error;
    }
}
