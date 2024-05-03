import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createAccount, getAccount} from "@core/api";

export function useAccount(){
    const {
        isLoading: isLoadingAccount,
        isError: isErrorAccount,
        data: account,
    } = useQuery(["account"], () => getAccount(), {
        refetchInterval: 1000,
    });

    return {
        isLoadingAccount,
        isErrorAccount,
        account,
    }
}

export function useCreateAccount() {
    const queryClient = useQueryClient();
    const {
        mutate,
    } = useMutation((accessToken: string | undefined) => createAccount(accessToken), {
        onSuccess: () => {
            queryClient.invalidateQueries(["openLobbies"]);
        },
    });
    return {
        mutateCreateAccount: mutate,
    }
}