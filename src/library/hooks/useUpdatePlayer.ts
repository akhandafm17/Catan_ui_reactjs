import { useMutation, useQueryClient } from "@tanstack/react-query";
import {AccountDto} from "@core/api/dto/AccountDto.ts";
import {updatePlayer} from "@core/api";

export function useUpdatePlayer() {
    const queryClient = useQueryClient();

    const {
        mutate: mutateAccount,
        isLoading: isLoadingAccount,
        isError: isErrorAccount,
    } = useMutation((data: AccountDto) => updatePlayer(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["updateAccount"]);
        },
    });

    return {
        mutateAccount,
        isLoadingAccount,
        isErrorAccount,
    };
}
