import { useMutation, useQueryClient } from "@tanstack/react-query";
import {postAddRoad, Road} from "@core/api";


export function useAddRoad(invalidateQueryKey = "addRoad") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingAddingRoad,
        isError: isErrorAddingRoad,
        error: errorAddingRoad, 
        isSuccess: isSuccessAddingRoad, 
    } = useMutation((data: Road) => postAddRoad(data), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error adding road:', error);
        },
    });

    return {
        mutateAddingRoad: mutate,
        isLoadingAddingRoad,
        isErrorAddingRoad,
        errorAddingRoad, // Return the error object
        isSuccessAddingRoad, // Return the success state
    };
}
