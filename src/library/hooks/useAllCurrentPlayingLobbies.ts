import {useQuery} from "@tanstack/react-query";
import {getCurrentPlayingLobbies} from "@core/api";

export function useAllCurrentPlayingLobbies() {
    const {
        isLoading: isLoadingCurrentPlayingLobbies,
        isError: isErrorCurrentPlayingLobbies,
        data: currentPlayingLobbies,
    } = useQuery(["accountId"], () => getCurrentPlayingLobbies(), {
        refetchInterval: 2000,
    });

    return {
        isLoadingCurrentPlayingLobbies,
        isErrorCurrentPlayingLobbies,
        currentPlayingLobbies,
    }
}