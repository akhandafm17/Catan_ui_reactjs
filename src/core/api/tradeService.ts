import axios from "axios";
import {Trade} from "@library/types";

export const addTrade = async (data: Trade) => {
    try {
        const response = await axios.post('/api/game/addTrade', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding trade', error);
        throw error;
    }
}
export const tradeWithBank = async (data: Trade) => {
    try {
        const response = await axios.post('/api/game/tradeWithBank', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding trade', error);
        throw error;
    }
}



