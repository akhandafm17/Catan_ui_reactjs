import {Dispatch, ReactElement, SetStateAction} from "react";
import {AccountContext} from "@library/context";
import useLocalStorage from "@library/hooks/useLocalStorage.ts";

type Props = {
    children: ReactElement | ReactElement[];
}

type Player = {
    nickName: string;
    id: number;
    email: string;
};

export const AccountContextProvider = ({children}: Props) => {
    const [storedPlayer, setStoredPlayer] = useLocalStorage('selectedPlayer');
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn');
    const setPlayer: Dispatch<SetStateAction<Player>> = (newPlayer) => {
        setStoredPlayer(newPlayer);
    };

    const toggleLoginStatus = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <AccountContext.Provider value={{
            selectedPlayer: storedPlayer,
            setSelectedPlayer: setPlayer,
            isLoggedIn,
            toggleLoginStatus,
        }}>
            {children}
        </AccountContext.Provider>
    );
};

