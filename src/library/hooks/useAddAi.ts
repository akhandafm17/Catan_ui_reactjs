import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addAi} from "@core/api";

export function useAddAi() {
    const queryClient = useQueryClient();

    const {
        mutate
    } = useMutation((lobbyId: number) => addAi(lobbyId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["addAi"]);
        },
    });

    return {
        mutateAddAi: mutate
    }
}