import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removePlayerFromLobby} from "@core/api";

export function useRemovePlayer() {
    const queryClient = useQueryClient();

    const {
        mutate
    } = useMutation((lobbyId: number) => removePlayerFromLobby(lobbyId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["removeplayerfromlobby"]);
        },
    });

    return {
        mutateRemovingPlayerFromLobby: mutate
    }
}