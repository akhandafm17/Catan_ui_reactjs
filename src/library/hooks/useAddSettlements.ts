import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postAddSettlement} from "@core/api";
import {Settlement} from "@library/types";

export function useAddSettlements() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingAddingSettlement,
        isError: isErrorRemovingAddingSettlement,
    } = useMutation((data: Settlement) => postAddSettlement(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["addSettlement"]);
        },
    });

    return {
        mutateAddingSettlement: mutate,
        isLoadingAddingSettlement,
        isErrorRemovingAddingSettlement
    }
}