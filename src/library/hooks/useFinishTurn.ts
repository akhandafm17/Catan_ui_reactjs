import {useMutation, useQueryClient} from "@tanstack/react-query";
import {finishTurn} from "@core/api";


export function useFinishTurn() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((gameId: number) => finishTurn(gameId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["finishturn"]);
        },
    });

    return {
        mutateFinishTurn: mutate,
    }
}