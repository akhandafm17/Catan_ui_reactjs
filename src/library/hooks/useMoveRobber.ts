import { postMoveRobber } from "@core/api/";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Robber} from "@library/types";

export function useMoveRobber() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingMoveRobber,
        isError: isErrorRemovingMoveRobber,
    } = useMutation((data: Robber) => postMoveRobber(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["moveRobber"]);
        },
    });

    return {
        mutateMoveRobber: mutate,
        isLoadingMoveRobber,
        isErrorRemovingMoveRobber
    }
}