import {useMutation, useQueryClient} from "@tanstack/react-query";
import {rollDice} from "@core/api";

export function useRollDice() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((gameId: number) => rollDice(gameId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["changestatus"]);
        },
    });

    return {
        mutateRollDice: mutate,
    }
}