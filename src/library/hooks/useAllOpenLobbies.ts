import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addPlayerToLobby, getAllOpenLobbies} from "@core/api";

export function useAllOpenLobbies() {
    const queryClient = useQueryClient();

    const {
        isLoading: isLoadingAllOpenLobbies,
        isError: isErrorAllOpenLobbies,
        data: allOpenLobbies,
    } = useQuery(["openLobbies"], getAllOpenLobbies, {
        refetchInterval: 2000,
    });

    const {
        mutate,
    } = useMutation((lobbyId: number) => addPlayerToLobby(lobbyId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["openLobbies"]);
        },
    });

    return {
        isLoadingAllOpenLobbies,
        isErrorAllOpenLobbies,
        allOpenLobbies,
        mutateAddPlayerToLobby: mutate,
    }
}
