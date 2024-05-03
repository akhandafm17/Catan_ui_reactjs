import {useMutation, useQueryClient} from "@tanstack/react-query";
import {acceptTrade} from "@core/api";

export function useAcceptTrade() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((tradeId: number) => acceptTrade(tradeId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["acceptTrade"]);
        },
    });

    return {
        mutateAcceptTrade: mutate,
    }
}