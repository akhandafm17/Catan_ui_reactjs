import { useMutation, useQueryClient } from "@tanstack/react-query";
import {addTrade} from "@core/api";
import {Trade} from "@library/types";

export function useAddTrade(invalidateQueryKey = "addTrade") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingAddingTrade,
        isError: isErrorAddingTrade,
        error: errorAddingTrade,
        isSuccess: isSuccessAddingTrade,
    } = useMutation((data: Trade) => addTrade(data), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error adding trade:', error);
        },
    });

    return {
        mutateAddingTrade: mutate,
        isLoadingAddingTrade,
        isErrorAddingTrade,
        errorAddingTrade, // Return the error object
        isSuccessAddingTrade, // Return the success state
    };
}
