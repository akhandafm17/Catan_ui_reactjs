import {useQuery} from "@tanstack/react-query";
import {getGame} from "@core/api";

export function useGame(gameId: number) {
    const {
        isLoading: isLoadingGame,
        isError: isErrorGame,
        data: game,
        refetch
    } = useQuery(["lobby", gameId], () => getGame(gameId), {
        refetchInterval: 1000,
    });

    return {
        isLoadingGame,
        isErrorGame,
        game,
        refetchGame: refetch
    }
}