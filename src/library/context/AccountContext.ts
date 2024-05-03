import {createContext} from "react";
import * as React from "react";

export const AccountContext = createContext<{
    selectedPlayer: {
        nickName: string;
        id: number;
        email: string;
    };
    setSelectedPlayer: React.Dispatch<React.SetStateAction<{
        nickName: string;
        id: number;
        email: string;
    }>>;
    isLoggedIn: boolean;
    toggleLoginStatus: () => void;
}>({
    selectedPlayer: {
        nickName: '',
        id: 0,
        email: '',
    },
    setSelectedPlayer: () => {},
    isLoggedIn: false,
    toggleLoginStatus: () => {},
});

