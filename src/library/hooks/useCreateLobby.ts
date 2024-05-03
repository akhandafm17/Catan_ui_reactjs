import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createLobby} from "@core/api";

export function useCreateLobby() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((lobbyNaam: string) => createLobby(lobbyNaam), {
        onSuccess: () => {
            queryClient.invalidateQueries(["openLobbies"]);
        },
    });

    return {
        mutateCreateLobby: mutate,
    }
}