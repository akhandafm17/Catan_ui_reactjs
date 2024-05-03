import axios from "axios";
import {Account} from "@library/types";
import {AccountDto} from "@core/api/dto/AccountDto.ts";

export const getAllAccounts = async () => {
    const response = await axios.get<Account[]>('/api/account/getAllAccounts');
    return response.data;
};

export const getAccount = async () => {
    const response = await axios.get<Account>(`/api/account`);
    return response.data;
}

export const createAccount = async (accessToken: string | undefined) => {
    try {
        const response = await axios.post("/api/account/createAccount", null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Account creatie mislukt");
    }
};

export const updatePlayer = async (data: AccountDto) => {
    try {
        const response = await axios.put('/api/account/updateAccount', data, {
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

export const sendFriendRequest = async (accountInvitedId: number) => {
    try {
        const response = await axios.post(`/api/account/friendRequest/${accountInvitedId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}

export const getInvitableAccounts = async () => {
    const response = await axios.get<Account[]>(`/api/account/getInvitableAccounts`);
    return response.data;
}


export const getTopAccounts = async () => {
    const response = await axios.get<Account[]>('/api/account/getTopAccounts');
    return response.data;
};

export const acceptFriendRequest = async (friendRequestId: number) => {
    try {
        const response = await axios.post(`/api/account/acceptFriendRequest/${friendRequestId}`);
        return response.data;
    } catch (error) {
        console.error('Error accepting friend request', error);
        throw error;
    }
};

export const declineFriendRequest = async (friendRequestId: number) => {
    try {
        const response = await axios.post(`/api/account/declineFriendRequest/${friendRequestId}`);
        return response.data;
    } catch (error) {
        console.error('Error declining friend request', error);
        throw error;
    }
};

