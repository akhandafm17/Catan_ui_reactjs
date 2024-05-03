import { useMutation, useQueryClient } from "@tanstack/react-query";
import {Trade} from "@library/types";
import {tradeWithBank} from "@core/api";

export function useTradeWithBank(invalidateQueryKey = "tradeWithBank") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingTradeWithBank,
        isError: isErrorTradeWithBank,
        error: errorTradeWithBank,
        isSuccess: isSuccessTradeWithBank,
    } = useMutation((data: Trade) => tradeWithBank(data), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error adding trade with bank:', error);
        },
    });

    return {
        mutateTradeWithBank: mutate,
        isLoadingTradeWithBank,
        isErrorTradeWithBank,
        errorTradeWithBank, // Return the error object
        isSuccessTradeWithBank, // Return the success state
    };
}
