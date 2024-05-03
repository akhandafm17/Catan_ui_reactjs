import axios from "axios";
import {PlayMonopolyCard, PlayYearOfPlentyCard} from "@library/types";

export const buyDevelopmentCard = async (gameId: number) => {
    try {
        const response = await axios.post(`/api/cards/buyDevelopmentCard/${gameId}`);
        return response.data;
    } catch (error) {
        console.error('Error buying development card:', error);
        throw error;
    }
}


export const playYearOfPlentyCard = async (data: PlayYearOfPlentyCard) => {
    try {
        const response = await axios.post('/api/cards/playDevelopmentCard/yearOfPlenty', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating player', error);
        throw error;
    }
}

export const playMonopolyCard = async (data: PlayMonopolyCard) => {
    try {
        const response = await axios.post('/api/cards/playDevelopmentCard/monopoly', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating player', error);
        throw error;
    }
}

