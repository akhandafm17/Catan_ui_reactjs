import axios from "axios";
import {Settlement} from "@library/types";

export const postAddSettlement= async (data: Settlement) => {
    try {
        const response = await axios.post('/api/game/addSettlement', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Return data if needed
    } catch (error) {
        console.error('Error adding settlement to point:', error);
        throw error;
    }
}