import axios from "axios";
import { Road } from "./dto/RoadDto.ts";

export const postAddRoad = async (data: Road) => {
    try {
        const response = await axios.post('/api/game/addRoad', data, {
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