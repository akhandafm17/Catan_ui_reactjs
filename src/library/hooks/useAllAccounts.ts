import {useQuery} from "@tanstack/react-query";
import {getAllAccounts} from "@core/api";

export function useAllAccounts() {
    const {
        isLoading: isLoadingAllAccounts,
        isError: isErrorAllAccounts,
        data: allAccounts,
    } = useQuery(["accounts"], getAllAccounts);

    return {
        isLoadingAllAccounts,
        isErrorAllAccounts,
        allAccounts
    }
}