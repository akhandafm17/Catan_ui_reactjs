import axios from "axios";
import {Robber} from "@library/types";

export const postMoveRobber= async (data: Robber) => {
    try {
        const response = await axios.post('/api/game/moveRobber', data, {
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