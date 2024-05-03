import {useMutation, useQueryClient} from "@tanstack/react-query";
import { removeAi} from "@core/api";

export function useRemoveAi() {
    const queryClient = useQueryClient();

    const {
        mutate
    } = useMutation((lobbyId: number) => removeAi(lobbyId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["removeAi"]);
        },
    });

    return {
        mutateRemoveAi: mutate
    }
}