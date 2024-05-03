import {useQuery} from "@tanstack/react-query";
import {getLobby} from "@core/api";

export function useLobby(lobbyId: number) {
    const {
        isLoading: isLoadingLobby,
        isError: isErrorLobby,
        data: lobby,
    } = useQuery(["lobby", lobbyId], () => getLobby(lobbyId), {
        refetchInterval: 2000,
    });

    return {
        isLoadingLobby,
        isErrorLobby,
        lobby,
    }
}